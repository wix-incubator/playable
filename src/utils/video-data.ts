export function getTimePercent(time: number, durationTime: number): number {
  if (!durationTime) {
    return 0;
  }

  return parseFloat((time / durationTime * 100).toFixed(1));
}

export function getOverallBufferedPercent(
  buffered: TimeRanges,
  currentTime: number = 0,
  duration: number = 0,
) {
  if (!buffered || !buffered.length || !duration) {
    return 0;
  }

  const info = getNearestBufferSegmentInfo(buffered, currentTime);

  return getTimePercent(info.end, duration);
}

export function getOverallPlayedPercent(currentTime = 0, duration = 0) {
  return getTimePercent(currentTime, duration);
}

export function geOverallBufferLength(buffered: TimeRanges) {
  let size = 0;

  if (!buffered || !buffered.length) {
    return size;
  }

  for (let i = 0; i < buffered.length; i += 1) {
    size += buffered.end(i) - buffered.start(i);
  }

  return size;
}

export function getNearestBufferSegmentInfo(
  buffered: TimeRanges,
  currentTime?: number,
) {
  let i = 0;

  if (!buffered || !buffered.length) {
    return null;
  }

  while (
    i < buffered.length - 1 &&
    !(buffered.start(i) <= currentTime && currentTime <= buffered.end(i))
  ) {
    i += 1;
  }

  return {
    start: buffered.start(i),
    end: buffered.end(i),
  };
}
