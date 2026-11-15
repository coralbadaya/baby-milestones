import { useCallback, useEffect, useRef } from 'react';
import {
  FOLD_MS,
  armDirection,
  dragSample,
  getReelPose,
  getSheetPose,
  pointerAngle,
  releaseAction,
} from '../../../book/engine/index.js';
import { sheetCss, reelCss } from '../../../book/renderers/web/webTransform.js';
import { composeSpread, previousSpreadIndex } from '../../../book/pageLayouts.js';
import PlaygroundFace from './PlaygroundFace.jsx';
import { PROGRESS_SAMPLE_MS } from '../../../data/pageTurnPlaygroundAlbum.js';

export default function PlaygroundStage({
  pages,
  book,
  rtl,
  reel,
  onPoseChange,
}) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const { index, spread, destSpread, landing, progress, phase, flapRef, applyProgress, setGesture } = book;

  const currentPose = reel
    ? getReelPose(progress, true)
    : getSheetPose(progress);

  useEffect(() => {
    onPoseChange?.({
      progress,
      ms: Math.round(progress * FOLD_MS),
      pose: currentPose,
      css: reel ? reelCss(currentPose) : sheetCss(currentPose),
      phase,
      index,
      landing,
    });
  }, [progress, phase, index, landing, currentPose, onPoseChange, reel]);

  const forwardPrep = useCallback((angle) => {
    const nextAt = reel ? index + 1 : index + spread.take;
    const dest = composeSpread(pages, Math.min(pages.length - 1, nextAt));
    book.setLanding?.(nextAt);
    return { dest, nextAt };
  }, [book, index, pages, reel, spread.take]);

  const backPrep = useCallback(() => {
    const prevAt = reel ? index - 1 : previousSpreadIndex(pages, index);
    const dest = composeSpread(pages, Math.max(0, prevAt));
    book.setLanding?.(prevAt);
    return { dest, prevAt };
  }, [book, index, pages, reel]);

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      prepared: '',
      angle: 0,
    };
    setGesture({ state: 'down', x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    const width = stageRef.current?.getBoundingClientRect().width || 320;
    drag.angle = pointerAngle(dx, width, rtl);
    const armed = armDirection(drag.angle);
    if (armed === 'next' && drag.prepared !== 'next') {
      drag.prepared = 'next';
      forwardPrep(drag.angle);
    }
    if (armed === 'prev' && drag.prepared !== 'prev') {
      drag.prepared = 'prev';
      backPrep();
    }
    const sample = dragSample(drag.angle, drag.prepared, reel ? 'reel' : 'open-book');
    applyProgress(sample.progress, sample.forward);
    setGesture({
      state: 'move',
      x: event.clientX,
      y: event.clientY,
      angle: drag.angle,
      armed: drag.prepared || armed,
      sample,
    });
  };

  const onPointerUp = (event) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const action = releaseAction(drag.angle, drag.prepared);
    setGesture({
      state: 'up',
      angle: drag.angle,
      armed: drag.prepared,
      release: action,
    });
    if (action === 'next') {
      const nextAt = reel ? index + 1 : index + spread.take;
      book.turnTo(nextAt);
    } else if (action === 'back') {
      const prevAt = reel ? index - 1 : previousSpreadIndex(pages, index);
      book.turnTo(prevAt);
    } else {
      book.flatten();
      book.setLanding?.(null);
    }
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const showDest = landing != null && (phase === 'turning' || phase === 'preparing');
  const leafFront = spread.right;
  const leafBack = showDest ? destSpread.left : spread.left;
  const leftPage = showDest ? destSpread.left : spread.left;
  const rightUnder = showDest ? destSpread.right : spread.right;

  return (
    <div className="ptq-stage-wrap" dir={rtl ? 'rtl' : 'ltr'}>
      <div
        className="ptq-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="ptq-book">
          <div className="ptq-board ptq-board--left">
            <PlaygroundFace slot={leftPage} face="LEFT rest" pageIndex={index} />
          </div>
          <div className="ptq-board ptq-board--right">
            <PlaygroundFace slot={rightUnder} face="RIGHT rest" pageIndex={landing ?? index} />
          </div>
          <div className="ptq-leaf" ref={flapRef}>
            <div className="ptq-leaf__face ptq-leaf__face--front">
              <PlaygroundFace slot={leafFront} face="FRONT leaf" pageIndex={index} />
            </div>
            <div className="ptq-leaf__face ptq-leaf__face--back">
              <PlaygroundFace slot={leafBack} face="BACK leaf" pageIndex={landing ?? index} />
            </div>
          </div>
          <div className="ptq-gutter" aria-hidden />
        </div>
      </div>
      <div className="ptq-readout">
        <p>
          Index <strong>{index}</strong>
          {' · '}
          spread <strong>{spread.id}</strong>
          {' · '}
          take <strong>{spread.take}</strong>
          {' · '}
          progress <strong>{(progress * 100).toFixed(1)}%</strong>
          {' · '}
          <strong>{Math.round(progress * FOLD_MS)}</strong>
          ms · phase <strong>{phase}</strong>
        </p>
        <pre className="ptq-readout__pose">
          {JSON.stringify(currentPose, null, 0)}
        </pre>
        <p className="ptq-readout__hint">
          Samples:
          {' '}
          {PROGRESS_SAMPLE_MS.map((ms) => (
            <button
              key={ms}
              type="button"
              className="ptq-chip"
              onClick={() => book.scrubMs(ms)}
            >
              {ms}
              ms
            </button>
          ))}
        </p>
      </div>
    </div>
  );
}