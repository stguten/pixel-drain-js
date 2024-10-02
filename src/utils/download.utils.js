
function onProgress(progressEvent) {
  const { loaded, total } = progressEvent;
  const percentCompleted = Math.round((loaded * 100) / total);
  process.stdout.write(`Progresso do download: ${percentCompleted}%\r`);
}

function getFilenameFromContentDisposition(contentDispositionHeader) {
  const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = regex.exec(contentDispositionHeader);
  if (matches != null && matches[1]) {
    return matches[1].replace(/['"]/g, '');
  }
  return null;
}

export { onProgress, getFilenameFromContentDisposition }