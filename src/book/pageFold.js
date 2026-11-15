/**
 * Names the album and its tests already import.
 * The math lives in src/book/engine. foldPlayerScript projects that math
 * into the standalone album, which has to open with no module loader.
 */

export {
  BOOK_MODES,
  CURL_STRIPS,
  FOLD_MS,
  FOLD_POSES,
} from './engine/constants.js';
export { curlAngles, curlLift, curlPose } from './engine/curl.js';
export { poseAt } from './engine/reelMotion.js';
export { foldPlayerScript } from './engine/playerScript.js';
export { poseTransform } from './renderers/web/webTransform.js';
