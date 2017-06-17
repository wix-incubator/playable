export function getOverallBufferedPercent(buffered, currentTime = 0, duration = 0) {
  if (!buffered || !buffered.length || !duration) {
    return 0;
  }

  let i = 0;
  while (i < buffered.length - 1 && !(buffered.start(i) <= currentTime && currentTime <= buffered.end(i))) {
    i += 1;
  }

  return (buffered.end(i) / duration * 100).toFixed(1);
}

export function getOverallPlayedPercent(currentTime = 0, duration = 0) {
  if (!duration) {
    return 0;
  }

  return (currentTime / duration * 100).toFixed(1);
}
