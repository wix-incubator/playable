# Configuration

```javascript
const config = {
  src: [
    'http://my-url/video.mp4',
    'http://my-url/video.webm',
    'http://my-url/video.m3u8'
  ],
  loop: true,
  autoPlay: false,
  preload: 'auto',
  muted: false,
  volume: 50,
  size: {
    width: 160,
    height: 90
  },
  showInteractionIndicator: false,
  screen: {
    disableClickProcessing: false,
    nativeControls: false
  },
  title: {
    callback: () => console.log('click on title'),
    text: 'Awesome video'
  },
  controls: {
    shouldAlwaysShow: true
  },
  overlay: {
    poster: 'https://example.com/overlay.png'
  },
  fullScreen: {
    exitFullScreenOnEnd: false,
    enterFullScreenOnPlay: true,
    exitFullScreenOnPause: false,
    pauseVideoOnFullScreenExit: true
  },
  logo: {
    callback: () => console.log('click on logo'),
    src: 'https://example.com/logo.png',
    showAlways: true
  },
  playInline: true,
  loader: true,
  disableControlWithKeyboard: false,
  fillAllSpace: true
};

const player = VideoPlayer.create(config);
```

### Video sources

`config.src: MediaSource` A string or array with source of the video. For more information see [this page](/video-source)

### Playback attributes

`config.loop: Boolean` Loop video playback

`config.autoPlay: Boolean` Start video playback as soon as it can do so without stopping to finish loading the data

`config.preload: OneOf('auto', 'metadata', 'none')` Type of preloading. For more info check ([MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video))

`config.muted: Boolean` Status of audio playback. If set, the audio will be initially silenced

`config.volume: Number<0..100>` Start value of volume for audio


### Size

`config.size.width: Number` Width of video player

`config.size.height: Number` Height of video player

### Screen

`config.screen.disableClickProcessing: Boolean` Pass `true` to disable control of player through click on screen

`config.screen.nativeControls: Boolean` Pass `true` to show native browser controls

### Title

`config.title: Boolean | ITitleConfig` Pass `false` to hide title

`config.title.callback: Function` Function that would be called when user clicks on title

`config.title.text: String` String that would be shown as title of video.

### Controls

`config.controls: Boolean | IControlsConfig` Pass `false` to hide controls

`config.controls.shouldAlwaysShow: Boolean` Pass `true` for alowing controls to be visible no matter of what

### Overlay

`config.overlay: Boolean | IOverlayConfig` Pass `false` to hide overlay

`config.overlay.poster: String` URL to image that would be used as poster on overlay

### FullScreen

`config.fullScreen: Boolean | IFullScreenConfig` Pass `false` to disable full screen functionality

`config.fullScreen.exitFullScreenOnEnd: Boolean` Pass `true` to alow player exit full screen after video ends.

`config.fullScreen.enterFullScreenOnPlay: Boolean` Pass `true` to alow player enter full screen after video starts playing.

`config.fullScreen.exitFullScreenOnPause: Boolean` Pass `true` to alow player exit full screen after video pauses.

`config.fullScreen.pauseVideoOnFullScreenExit: Boolean` Pass `true` to alow player pause video after exit from full screen.

### Logo

`config.logo: Boolean | ILogoConfig` Pass `false` to hide logo

`config.logo.callback: Function` Function that would be called when user clicks on logo

`config.logo.src: String` URL to image that would be used as logo

`config.logo.showAlways: Boolean` Pass `true` to alow logo be visible no matter or what

### Other

`config.showInteractionIndicator: Boolean` Pass `false` to disable indication of user interaction with player

`config.playInline: Boolean` Attribute for playing inline in iOS

`config.loader: Boolean` Pass `false` to hide loader

`config.texts: ITextMapConfig` Gives you ability to override texts, that are used in player

`config.disableControlWithKeyboard: Boolean` Pass `false` to disable ability to control player through keyboard

`config.fillAllSpace: Boolean` Pass `true` to alow player fill all space of it container
