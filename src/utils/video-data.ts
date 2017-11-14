export function getOverallBufferedPercent(buffered, currentTime = 0, duration = 0) {
  if (!buffered || !buffered.length || !duration) {
    return 0;
  }

  const info = getNearestBufferSegmentInfo(buffered, currentTime);

  return (info.end / duration * 100).toFixed(1);
}

export function getOverallPlayedPercent(currentTime = 0, duration = 0) {
  if (!duration) {
    return 0;
  }

  return (currentTime / duration * 100).toFixed(1);
}

export function geOverallBufferLength(buffered) {
  let size = 0;

  if (!buffered || !buffered.length) {
    return size;
  }

  for (let i = 0; i < buffered.length; i += 1) {
    size += buffered.end(i) - buffered.start(i);

  }

  return size;
}

export function getNearestBufferSegmentInfo(buffered, currentTime?) {
  let i = 0;

  if (!buffered || !buffered.length) {
    return null;
  }

  while (i < buffered.length - 1 && !(buffered.start(i) <= currentTime && currentTime <= buffered.end(i))) {
    i += 1;
  }

  return {
    start: buffered.start(i),
    end: buffered.end(i)
  };
}
