import VideoPlayer from '../index';
import { NativeEnvironmentSupport } from '../utils/environment-detection';

/* ignore coverage */
describe('Playback e2e test', function () {
  this.timeout(10000);
  const node = document.createElement('div');
  const formatsToTest = [
    { type: 'MP4', url: 'https://storage.googleapis.com/video-player-media-server-static/sample.mp4', supportedByEnv: NativeEnvironmentSupport.MP4 },
    { type: 'WEBM', url: 'https://storage.googleapis.com/video-player-media-server-static/sample.webm', supportedByEnv: NativeEnvironmentSupport.WEBM },
    { type: 'HLS', url: 'https://storage.googleapis.com/video-player-media-server-static/sample.m3u8', supportedByEnv: NativeEnvironmentSupport.HLS || NativeEnvironmentSupport.MSE },
    { type: 'DASH', url: 'https://storage.googleapis.com/video-player-media-server-static/sample.mpd', supportedByEnv: NativeEnvironmentSupport.DASH || NativeEnvironmentSupport.MSE },
    { type: 'DASH or HLS', url: ['https://storage.googleapis.com/video-player-media-server-static/sample.m3u8', 'https://storage.googleapis.com/video-player-media-server-static/sample.mpd'], supportedByEnv: NativeEnvironmentSupport.HLS || NativeEnvironmentSupport.DASH || NativeEnvironmentSupport.MSE }
  ];

  formatsToTest.forEach(formatToTest => {
    if (formatToTest.supportedByEnv) {
      it(`allows playback of ${formatToTest.type}`, function (done) {
        const player = VideoPlayer.create();
        player.attachToElement(node);
        player.on(VideoPlayer.VIDEO_EVENTS.STATE_CHANGED, ({ nextState }) => {
          if (nextState === VideoPlayer.ENGINE_STATES.PLAYING) {
            player.off(VideoPlayer.VIDEO_EVENTS.STATE_CHANGED);
            player.destroy();
            done();
          }
        });
        player.setSrc(formatToTest.url);
        player.play();
      });

      it(`allows playback of ${formatToTest.type} when preload = none`, function (done) {
        const player = VideoPlayer.create({
          preload: "none"
        });
        player.attachToElement(node);
        player.on(VideoPlayer.VIDEO_EVENTS.STATE_CHANGED, ({ nextState }) => {
          if (nextState === VideoPlayer.ENGINE_STATES.PLAYING) {
            player.off(VideoPlayer.VIDEO_EVENTS.STATE_CHANGED);
            player.destroy();
            done();
          }
        });
        player.setSrc(formatToTest.url);
        player.play();
      });
    }
  });
});
