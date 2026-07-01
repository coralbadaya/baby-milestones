import { FIRST_MOMENT_MAX_FILE_BYTES } from '../constants/firstMoments';

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
  if (file.size > FIRST_MOMENT_MAX_FILE_BYTES) {
    return Promise.reject(new Error('File must be under 2MB. Try a shorter clip or smaller photo.'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/** @param {File} file */
export function isVideoFile(file) {
  return file.type.startsWith('video/');
}

/** @param {File} file */
export function isImageFile(file) {
  return file.type.startsWith('image/');
}
