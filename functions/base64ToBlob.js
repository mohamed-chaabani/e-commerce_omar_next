export const base64ToBlob = (base64String) => {
  const mimeType = base64String.match(/^data:(.*);base64,/)[1];

  const base64Data = base64String.split(",")[1];

  const byteCharacters = atob(base64Data);

  const byteArrays = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([byteArrays], { type: mimeType });
};
