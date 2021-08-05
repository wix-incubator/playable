import Playable from '../index';
import { NativeEnvironmentSupport } from '../utils/environment-detection';

/* ignore coverage */
describe('Playback e2e test', function() {
  this.timeout(10000);
  const container = document.createElement('div');
  const formatsToTest = [
    {
      type: 'MP4',
      url:
        'https://storage.googleapis.com/video-player-media-server-static/sample.mp4',
      supportedByEnv: NativeEnvironmentSupport.MP4,
    },
    {
      type: 'WEBM',
      url:
        'https://storage.googleapis.com/video-player-media-server-static/sample.webm',
      supportedByEnv: NativeEnvironmentSupport.WEBM,
    },
  ];

  formatsToTest.forEach(formatToTest => {
    if (formatToTest.supportedByEnv) {
      it(`allows playback of ${formatToTest.type}`, function(done) {
        // TODO: describe `@playerApi` methods in `Player` with TS
        const player: any = Playable.create();
        player.attachToElement(container);
        player.on(Playable.ENGINE_STATES.PLAYING, () => {
          player.destroy();

          done();
        });
        player.setSrc(formatToTest.url);
        player.play();
      });

      it(`allows playback of ${formatToTest.type} when preload = none`, function(done) {
        const player: any = Playable.create({
          preload: Playable.PRELOAD_TYPES.NONE,
        });
        player.attachToElement(container);
        player.on(Playable.ENGINE_STATES.PLAYING, () => {
          player.destroy();

          done();
        });
        player.setSrc(formatToTest.url);
        player.play();
      });
    }
  });
});
