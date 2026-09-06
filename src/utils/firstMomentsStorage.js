import { FIRST_MOMENT_MAX_FILE_BYTES } from '../constants/firstMoments';

/**
 * @param {File} file
 * @param {number} [maxBytes]
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file, maxBytes = FIRST_MOMENT_MAX_FILE_BYTES) {
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    return Promise.reject(new Error(`File must be under ${mb}MB. Try a shorter clip or smaller photo.`));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/** @param {string} dataUrl */
export async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

/** @param {File} file */
export function isVideoFile(file) {
  return file.type.startsWith('video/');
}

/** @param {File} file */
export function isImageFile(file) {
  return file.type.startsWith('image/');
}
