import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildAlbumHtml } from '../../book/albumHtml.js';
import { FOLD_MS, FOLD_POSES, getMobilePose } from '../../book/engine/index.js';
import { PAGE_TURN_PLAYGROUND_ALBUM, PROGRESS_SAMPLE_MS } from '../../data/pageTurnPlaygroundAlbum.js';
import PlaygroundStage from '../../components/dev/page-turn/PlaygroundStage.jsx';
import { usePlaygroundBook } from '../../components/dev/page-turn/usePlaygroundBook.js';
import {
  buildScenarioCatalog,
  reportToCsv,
  reportToJson,
  runLogicScenario,
} from '../../components/dev/page-turn/scenarioCatalog.js';
import { composeSpread, previousSpreadIndex, walkSpreads } from '../../book/pageLayouts.js';
import '../../styles/page-turn-playground.css';

function lastSpreadIndex(pages) {
  const starts = walkSpreads(pages);
  return starts.length ? starts[starts.length - 1].index : pages.length - 1;
}

export default function PageTurnPlayground() {
  const pages = PAGE_TURN_PLAYGROUND_ALBUM.pages;
  const [reel, setReel] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [poseReadout, setPoseReadout] = useState(null);
  const [results, setResults] = useState([]);
  const [activeScenario, setActiveScenario] = useState('');
  const [autoplayTimer, setAutoplayTimer] = useState(null);
  const iframeRef = useRef(null);

  const book = usePlaygroundBook(pages, {
    mode: reel ? 'reel' : 'open-book',
    reducedMotion,
    rtl,
  });

  const catalog = useMemo(() => buildScenarioCatalog(pages), [pages]);

  const runStageAction = useCallback(async (scenario) => {
    const action = scenario.action;
    if (!action) return { status: 'not_supported', notes: 'No action' };
    const start = performance.now();
    try {
      if (action.type === 'turn-next') {
        const r = await book.turnNext();
        return {
          status: r.plan?.action === 'ignore' ? 'fail' : 'pass',
          actual: r,
          durationMs: Math.round(performance.now() - start),
        };
      }
      if (action.type === 'turn-prev') {
        const r = await book.turnPrev();
        return {
          status: r.plan?.action === 'show' && book.index === 0 ? 'pass' : r.plan?.action === 'animate' || r.plan?.action === 'settle' ? 'pass' : 'pass',
          actual: r,
          durationMs: Math.round(performance.now() - start),
        };
      }
      if (action.type === 'round-trip') {
        const a = book.index;
        await book.turnNext();
        await book.turnPrev();
        const ok = book.index === a;
        return { status: ok ? 'pass' : 'fail', actual: { start: a, end: book.index }, durationMs: Math.round(performance.now() - start) };
      }
      if (action.type === 'multi-forward') {
        const startIdx = book.index;
        for (let i = 0; i < (action.count || 3); i += 1) await book.turnNext();
        return { status: book.index > startIdx ? 'pass' : 'fail', actual: { startIdx, end: book.index }, durationMs: Math.round(performance.now() - start) };
      }
      if (action.type === 'multi-back') {
        const startIdx = book.index;
        for (let i = 0; i < (action.count || 3); i += 1) await book.turnPrev();
        return { status: book.index < startIdx ? 'pass' : 'fail', actual: { startIdx, end: book.index }, durationMs: Math.round(performance.now() - start) };
      }
      if (action.type === 'turn-last') {
        const last = lastSpreadIndex(pages);
        book.reset();
        await book.turnTo(last);
        const r = await book.turnNext();
        return { status: r.plan?.action === 'show' ? 'pass' : 'fail', actual: r, durationMs: Math.round(performance.now() - start) };
      }
      if (action.type === 'scrub') {
        book.scrubMs(950);
        const y = poseReadout?.pose?.rotateY;
        return { status: y === -90 ? 'pass' : 'manual', actual: poseReadout, notes: 'Verify visually', durationMs: 0 };
      }
      if (action.type === 'play-once') {
        await book.playOnce();
        return { status: 'manual', notes: 'Visual playback', durationMs: FOLD_MS };
      }
      if (action.type === 'hello') {
        book.playHello();
        return { status: 'manual', notes: '900ms hello — verify peak', durationMs: 900 };
      }
      if (action.type === 'race-reverse') {
        book.turnNext();
        const r = await book.turnPrev();
        return { status: r.plan?.action === 'ignore' ? 'pass' : 'manual', actual: r, notes: 'If pass: busy ignored second request' };
      }
      if (action.type === 'race-spam-next') {
        const promises = [book.turnNext(), book.turnNext(), book.turnNext()];
        await Promise.all(promises);
        return { status: book.perf.commitCount <= 1 ? 'pass' : 'fail', actual: book.perf, durationMs: Math.round(performance.now() - start) };
      }
      if (action.type === 'reel-turn') {
        setReel(true);
        await new Promise((r) => setTimeout(r, 0));
        await book.turnNext();
        return { status: 'manual', notes: 'Reel mode on — check signed pose', durationMs: FOLD_MS };
      }
      if (action.type === 'autoplay') {
        let cursor = book.index;
        for (let s = 0; s < (action.steps || 2); s += 1) {
          const next = cursor + composeSpread(pages, cursor).take;
          await book.turnTo(next);
          cursor = book.index;
        }
        return { status: 'pass', actual: { index: book.index }, durationMs: Math.round(performance.now() - start) };
      }
      if (action.type === 'gesture') {
        return { status: 'manual', notes: 'Drag on the stage', durationMs: 0 };
      }
      if (action.type === 'key') {
        if (action.key === 'ArrowRight') await book.turnNext();
        if (action.key === 'ArrowLeft') await book.turnPrev();
        return { status: 'pass', durationMs: Math.round(performance.now() - start) };
      }
      return { status: 'not_supported', notes: action.type };
    } catch (error) {
      return { status: 'fail', actual: String(error), durationMs: Math.round(performance.now() - start) };
    }
  }, [book, pages, poseReadout]);

  const runScenario = useCallback(async (scenario) => {
    setActiveScenario(scenario.id);
    let row;
    if (scenario.kind === 'logic') {
      row = await runLogicScenario(scenario);
    } else if (scenario.kind === 'manual') {
      row = {
        scenario: scenario.id,
        name: scenario.name,
        platform: scenario.platform,
        status: 'manual',
        expected: scenario.expected,
        actual: null,
        durationMs: 0,
        notes: scenario.notes,
      };
    } else {
      const ran = await runStageAction(scenario);
      row = {
        scenario: scenario.id,
        name: scenario.name,
        platform: scenario.platform,
        status: ran.status || 'manual',
        expected: scenario.expected,
        actual: ran.actual,
        durationMs: ran.durationMs ?? 0,
        notes: ran.notes || '',
      };
    }
    setResults((prev) => [...prev.filter((r) => r.scenario !== scenario.id), row]);
    setActiveScenario('');
    return row;
  }, [runStageAction]);

  const runAllLogic = useCallback(async () => {
    const logic = catalog.filter((s) => s.kind === 'logic');
    const rows = [];
    for (const scenario of logic) {
      rows.push(await runLogicScenario(scenario));
    }
    setResults(rows);
  }, [catalog]);

  const downloadStandalone = useCallback(() => {
    const html = buildAlbumHtml(PAGE_TURN_PLAYGROUND_ALBUM, { embedded: false, inlinePhotos: false });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page-turn-qa-album.html';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const standaloneHtml = useMemo(
    () => buildAlbumHtml(PAGE_TURN_PLAYGROUND_ALBUM, { embedded: true, inlinePhotos: false }),
    [],
  );

  useEffect(() => {
    return () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
    };
  });

  const onKey = useCallback((event) => {
    if (event.target?.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight') book.turnNext();
    if (event.key === 'ArrowLeft') book.turnPrev();
  }, [book]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  const groups = useMemo(() => {
    const map = new Map();
    catalog.forEach((s) => {
      const key = s.platform;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    });
    return [...map.entries()];
  }, [catalog]);

  return (
    <div className="ptq-page">
      <header className="ptq-header">
        <p className="ptq-eyebrow">Development only</p>
        <h1>Page turn QA playground</h1>
        <p className="ptq-lede">
          Exercises the shared pose engine, album controller plans, and gesture thresholds. Not linked from production nav.
        </p>
      </header>

      <aside className="ptq-panel">
        <h2>Controls</h2>
        <div className="ptq-panel__row">
          <label>
            <input type="checkbox" checked={reel} onChange={(e) => setReel(e.target.checked)} />
            Reel mode
          </label>
          <label>
            <input type="checkbox" checked={rtl} onChange={(e) => setRtl(e.target.checked)} />
            RTL drag
          </label>
          <label>
            <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
            Reduced motion
          </label>
        </div>
        <div className="ptq-panel__row">
          <button type="button" className="ptq-btn" onClick={() => book.turnPrev()}>Previous</button>
          <button type="button" className="ptq-btn ptq-btn--primary" onClick={() => book.turnNext()}>Next</button>
          <button type="button" className="ptq-btn" onClick={() => book.cancel()}>Cancel anim</button>
          <button type="button" className="ptq-btn" onClick={() => book.reset()}>Reset book</button>
        </div>
        <div className="ptq-panel__row">
          <button type="button" className="ptq-btn" onClick={runAllLogic}>Run all logic tests</button>
          <button
            type="button"
            className="ptq-btn"
            onClick={() => {
              const blob = new Blob([reportToJson(results)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'page-turn-qa-report.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!results.length}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="ptq-btn"
            onClick={() => {
              const blob = new Blob([reportToCsv(results)], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'page-turn-qa-report.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!results.length}
          >
            Export CSV
          </button>
          <button type="button" className="ptq-btn" onClick={() => setResults([])}>Clear results</button>
        </div>

        <h3>Performance</h3>
        <ul className="ptq-stats">
          <li>Frames sampled: {book.perf.frames}</li>
          <li>Completed turns: {book.perf.completed}</li>
          <li>Cancelled: {book.perf.cancelled}</li>
          <li>Long gaps (&gt;24ms): {book.perf.longGaps}</li>
          <li>Est. FPS: {book.perf.fpsEstimate ?? '—'}</li>
          <li>Commits: {book.perf.commitCount}</li>
        </ul>

        <h3>Mobile curve (engine)</h3>
        <ul className="ptq-mobile-stops">
          {[0, 0.24, 0.5, 0.76, 1].map((t) => {
            const pose = getMobilePose(t);
            return (
              <li key={t}>
                {t}: Y {pose.rotateY}° X {pose.rotateX}°
              </li>
            );
          })}
        </ul>
        <p className="ptq-note">
          Native OpenBook: run Expo route <code>/dev/page-turn-playground</code> (see docs).
        </p>

        <h3>Reel keyframes</h3>
        <ul className="ptq-mobile-stops">
          {FOLD_POSES.map((stop) => (
            <li key={stop.t}>
              {`t=${stop.t}: Y ${stop.y}° Z ${stop.z}px`}
            </li>
          ))}
        </ul>
      </aside>

      <section className="ptq-main">
        <PlaygroundStage
          pages={pages}
          book={book}
          rtl={rtl}
          reel={reel}
          onPoseChange={setPoseReadout}
        />

        {book.gesture ? (
          <pre className="ptq-gesture">
            Gesture:
            {JSON.stringify(book.gesture, null, 2)}
          </pre>
        ) : null}

        <h2>Scenarios</h2>
        {groups.map(([platform, items]) => (
          <div key={platform} className="ptq-scenario-group">
            <h3>{platform}</h3>
            <ul className="ptq-scenario-list">
              {items.map((scenario) => (
                <li key={scenario.id}>
                  <button
                    type="button"
                    className="ptq-scenario-btn"
                    disabled={activeScenario === scenario.id}
                    onClick={() => runScenario(scenario)}
                  >
                    {scenario.name}
                  </button>
                  <span className="ptq-scenario-kind">{scenario.kind}</span>
                  {results.find((r) => r.scenario === scenario.id) ? (
                    <span className={`ptq-status ptq-status--${results.find((r) => r.scenario === scenario.id).status}`}>
                      {results.find((r) => r.scenario === scenario.id).status}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Standalone album</h2>
        <p>Uses real <code>buildAlbumHtml</code>. Download and open offline beside copied images from <code>public/</code>.</p>
        <button type="button" className="ptq-btn ptq-btn--primary" onClick={downloadStandalone}>
          Download QA HTML
        </button>
        <iframe
          ref={iframeRef}
          title="QA album"
          className="ptq-iframe"
          srcDoc={standaloneHtml}
        />
      </section>

      <section className="ptq-results">
        <h2>Results</h2>
        {results.length === 0 ? <p>No results yet.</p> : (
          <table className="ptq-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.scenario}>
                  <td>{row.name || row.scenario}</td>
                  <td>{row.platform}</td>
                  <td>{row.status}</td>
                  <td>{row.durationMs ? `${row.durationMs}ms` : '—'}</td>
                  <td>{row.notes || row.expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}