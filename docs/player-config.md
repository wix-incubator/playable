# Configuration

```javascript
const config = {
  src: [
    'http://my-url/video.mp4',
    'http://my-url/video.webm',
    'http://my-url/video.m3u8',
  ],
  poster: 'http://my-poster.jpg',
  title: 'Awesome video',

  width: 160,
  height: 90,
  fillAllSpace: false,
  rtl: false,

  videoElement: document.queryElement('video'),

  preload: 'auto',
  autoplay: false,
  loop: true,
  muted: false,
  volume: 50,
  playsinline: true,
  crossOrigin: 'anonymous',
  nativeBrowserControls: false,
  preventContextMenu: false,

  disableControlWithClickOnPlayer: false,
  disableControlWithKeyboard: false,

  hideMainUI: false,
  hideOverlay: false,

  disableFullScreen: false,

  texts: {
    TEXT_KEY: 'TEXT_VALUE',
  },
};

const theme = {
  progressColor: '#aaa',
};

const player = Playable.create(config, theme);
```

### Video source config

`config.src: PlayableMediaSource` A string or array with source of the video. For more information see [this page](/video-source) <br/>
`config.videoElement: HTMLVideoElement` Video Element that will be respected by playable. Can be used for example to share the same video element cross players, or setting custom video source (WebRTC for example).

### UI related config

`config.width: Number` Width of video player <br/>
`config.height: Number` Height of video player <br/>
`config.fillAllSpace: Boolean` Pass `true` to allow player fill all space of it container <br/>
`config.rtl: Boolean` Pass `true` to allow player [rtl](https://developer.mozilla.org/en-US/docs/Glossary/rtl)
direction. The property only configures playable behaviour, not modules inside<br/>
`config.title: String` String that would be shown as title of video <br/>
`config.poster: String` URL to image that would be used as poster on overlay <br/>
`config.texts: ITextMapConfig` Gives you ability to override texts, that are used in player. Read more [here](/player-texts).

`config.hideMainUI: Boolean` Pass `true` to completly hide all our UI of player, except overlay <br/>
`config.hideOverlay: Boolean` Pass `true` to completly hide overlay <br/>
`config.disableControlWithKeyboard: Boolean` Pass `false` to disable ability to control player through keyboard <br/>
`config.disableControlWithClickOnPlayer: Boolean` Pass `false` to disable ability to control player through click on player(not related to controls of player) <br/>
`config.disableFullScreen: Boolean` Pass `true` to disable functionality related to full screen mode <br/>
`config.nativeBrowserControls: Boolean` Pass `true` to show native browser controls. You also should pass `hideMainUI: true` for better look<br/>
`config.preventContextMenu: Boolean` Pass `true` to prevent context menu on video element.

### Playback related config

`config.loop: Boolean` Loop video playback <br/>
`config.autoPlay: Boolean` Start video playback as soon as it can do so without stopping to finish loading the data <br/>
`config.preload: OneOf('auto', 'metadata', 'none')` Type of preloading. For more info check ([MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video)) <br/>
`config.muted: Boolean` Status of audio playback. If set, the audio will be initially silenced <br/>
`config.volume: Number<0..100>` Start value of volume for audio <br/>
`config.playsinline: Boolean` Attribute for playing inline in iOS <br/>
`config.crossOrigin: 'anonymous' | 'use-credentials'` Attribute setting video [crossOrigin](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) property <br/>
