import { describe, expect, it } from 'vitest';
import { FOLD_MS, createAnimationDriver, createTurnController } from './index';

function manualClock() {
  let time = 0;
  let queued = null;
  let nextId = 1;
  return {
    now() {
      return time;
    },
    requestFrame(fn) {
      const id = nextId;
      nextId += 1;
      queued = { id, fn };
      return id;
    },
    cancelFrame(id) {
      if (queued && queued.id === id) queued = null;
    },
    pending() {
      return Boolean(queued);
    },
    fire() {
      const job = queued;
      queued = null;
      if (job) job.fn(time);
    },
    advance(ms) {
      time += ms;
      this.fire();
    },
  };
}

function host(overrides = {}) {
  const clock = manualClock();
  const commits = [];
  const prepares = [];
  const samples = [];
  const shows = [];
  let pageCount = overrides.pageCount == null ? 4 : overrides.pageCount;
  let reduced = Boolean(overrides.reducedMotion);
  let mode = overrides.mode || 'open-book';
  const driver = createAnimationDriver(clock);
  const turns = createTurnController({
    index: overrides.index || 0,
    pageCount: () => pageCount,
    reducedMotion: () => reduced,
    mode: () => mode,
    duration: FOLD_MS,
    driver,
    stepForward: (index) => Math.min(pageCount - 1, index + (overrides.take || 1)),
    stepBack: (index) => Math.max(0, index - (overrides.take || 1)),
    prepare: (turn) => prepares.push(turn),
    onProgress: (value) => samples.push(value),
    commit: (next) => commits.push(next),
    showCurrent: () => shows.push('show'),
  });
  return { clock, commits, prepares, samples, shows, turns, setMode: (value) => { mode = value; }, setReduced: (value) => { reduced = value; } };
}

async function finish(clock) {
  let guard = 0;
  while (clock.pending() && guard < 80) {
    clock.advance(50);
    guard += 1;
  }
}

describe('turn controller', () => {
  it('commits the next page once the turn finishes, including a two-page step', async () => {
    const book = host({ take: 2 });
    const pending = book.turns.next();
    expect(book.prepares[0]).toMatchObject({ index: 0, next: 2, direction: 'forward', mode: 'open-book' });
    expect(book.turns.getState().phase).toBe('turning');
    await finish(book.clock);
    await pending;
    expect(book.commits).toEqual([2]);
    expect(book.turns.getState()).toMatchObject({ index: 2, progress: 0, phase: 'idle' });
  });

  it('plays a backward open-book turn from folded to flat', async () => {
    const book = host({ index: 2 });
    const pending = book.turns.previous();
    expect(book.samples).toEqual([]);
    book.clock.fire();
    expect(book.samples[0]).toBe(1);
    await finish(book.clock);
    await pending;
    expect(book.commits).toEqual([1]);
    expect(book.samples[book.samples.length - 1]).toBe(0);
  });

  it('ignores the ends, an invalid index, and a second turn while one is running', async () => {
    const book = host();
    await book.turns.previous();
    await book.turns.goTo(-1);
    await book.turns.goTo(9);
    await book.turns.goTo(Number.NaN);
    expect(book.commits).toEqual([]);
    expect(book.shows).toHaveLength(4);

    const first = book.turns.goTo(1);
    const second = book.turns.next();
    await second;
    await finish(book.clock);
    await first;
    expect(book.commits).toEqual([1]);
  });

  it('does not commit a cancelled turn, then accepts the next one', async () => {
    const book = host();
    const first = book.turns.goTo(1);
    book.clock.advance(450);
    book.turns.cancel();
    await first;
    expect(book.commits).toEqual([]);
    book.clock.advance(FOLD_MS);
    expect(book.commits).toEqual([]);

    const second = book.turns.goTo(1);
    await finish(book.clock);
    await second;
    expect(book.commits).toEqual([1]);
  });

  it('settles reduced motion without scheduling a frame', async () => {
    const book = host({ reducedMotion: true });
    await book.turns.goTo(1);
    expect(book.commits).toEqual([1]);
    expect(book.clock.pending()).toBe(false);
    expect(book.turns.getState().phase).toBe('idle');
  });

  it('plays the reel forward and backward from progress 0', async () => {
    const book = host({ index: 2, mode: 'reel' });
    const pending = book.turns.previous();
    book.clock.fire();
    expect(book.samples[0]).toBe(0);
    expect(book.prepares[0].direction).toBe('backward');
    await finish(book.clock);
    await pending;
    expect(book.commits).toEqual([1]);
  });

  it('rejects a new drag while a page is turning', () => {
    const book = host();
    book.turns.goTo(1);
    expect(book.turns.beginDrag()).toBe(false);
    book.turns.cancel();
    expect(book.turns.beginDrag()).toBe(true);
    book.turns.updateDrag(0.4);
    expect(book.turns.getState().progress).toBe(0.4);
    book.turns.endDrag();
    expect(book.turns.getState().phase).toBe('idle');
  });
});
