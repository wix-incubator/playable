/* eslint-disable no-console */
import eventEmitter from './event-emitter';
import VIDEO_EVENTS from './constants/events/video';

function getBufferedPercentage(video) {
  const buffer = video.buffered;
  let buffered = 0;

  for (let i = 0; i < buffer.length; i += 1) {
    buffered += buffer.end(i) - buffer.start(i);
  }

  return buffered;
}

export default function initLogger(vidi) {
  const video = vidi.getVideoElement();
  eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, () => {
    const duration = video.duration;

    console.log(`BUFFERED PERCENTAGE: ${(getBufferedPercentage(video) / duration * 100)}%`);
  });
}
