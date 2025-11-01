export function uploadToObjectURL(file: File) {
  // simple browser-side 'upload' placeholder
  return Promise.resolve(URL.createObjectURL(file));
}
