---
title: video-player.js
---

You can play with demo playground here: [https://wix-private.github.io/video-player-playground/](https://wix-private.github.io/video-player-playground/)

## Get it

```
$ npm install video-player --save
```

## Use it

In modern way

```javascript
import VideoPlayer from 'video-player';
```

Or in old school way, add a `<script>` element for video-player

```html
<script src="path/to/video-player/dist/statics/video-player.bundle.js"></script>
```

And write awesome code:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = {
   size: {
     width: 700,
     height: 394
   },
   src: 'http://my-url/video.mp4',
   preload: 'metadata'
  };
  const player = VideoPlayer.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

## API

### VideoPlayer ```config```

#### Video sources

```config.src``` A string or array with source of the video. For more information see [vidi](https://github.com/wix/vidi)

#### Playback attributes

```config.loop: Boolean``` Loop video playback

```config.autoPlay: Boolean``` Start video playback as soon as it can do so without stopping to finish loading the data.

```config.preload: OneOf('auto', 'metadata', 'none')``` Type of preloading. For more info check ([MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video))

```config.muted: Boolean``` Status of audio playback. If set, the audio will be initially silenced

```config.volume: Number<0..1>``` Start value of volume for audio

```config.playInline: Boolean``` Attribute for playing inline in iOS

#### UI

##### Size ```config.size```

```config.size.width: Number``` Width of video player

```config.size.height: Number``` Height of video player

Create a new instance of video player

```javascript
const config = {
   src: [
     'http://my-url/video.mp4',
     'http://my-url/video.webm',
     'http://my-url/video.m3u8'
   ],
   loop: true
};
const player = VideoPlayer.create(config);
```

### Player public methods

```Player.setAutoPlay(flag: Boolean)``` Set autoPlay flag

```Player.getAutoPlay()``` Get autoPlay flag

```Player.setLoop(flag: Boolean)``` Set loop flag

```Player.getLoop()``` Get loop flag

```Player.setMute(flag: Boolean)``` Set mute flag

```Player.getMute()``` Get mute flag

```Player.setVolume(volume: Number<0..100>)``` Set volume

```Player.getVolume()``` Get volume

```Player.setPreload(type: OneOf('auto', 'metadata', 'none'))``` Set preload type

```Player.getPreload()``` Get preload type

```Player.setPlayInline(playInline: Boolean)``` Set playInline flag

```Player.getPlayInline()``` Get playInline flag

```Player.on(eventName: String, listener: Function)``` Method for adding listeners of events inside player. You can check all events inside ```VideoPlayer.UI_EVENTS``` and ```VideoPlayer.VIDEO_EVENTS```

```Player.off(eventName: String, listener: Function)``` Method for removing listeners of events inside player.

```Player.attachToElement(node: Node)``` Method for attaching player node to your container

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = { src: 'http://my-url/video.mp4' }
  const player = VideoPlayer.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

```Player.node``` Getter for DOM node with player UI element(use it only for debug, if you need attach player to your document use ```attachToElement``` method)

```Player.show()/hide()``` Show/Hide whole ui

```Player.setWidth(width: Number)``` Set width of player

```Player.getWidth()``` Get width of player

```Player.setHeight(height: Number)``` Set height of player

```Player.getHeight()``` Get height of player

```Player.enterFullScreen()``` Manual enter full screen

```Player.exitFullScreen()``` Manual exit full screen

```Player.isInFullScreen()``` Return `true` if player is in full screen

```Player.getCurrentPlaybackState()``` Return current state of playback

```Player.getDebugInfo()``` Return object with internal debug info
```javascript
  {
    type, // Name of current attached stream (HLS, DASH, MP4, WEBM)
    viewDimensions: {
      width,
      height
    }, // Current size of view port provided by engine (right now - actual size of video tag)
    url, // Url of current source
    currentTime, // Current time of playback
    duration, // Duration of current video
    loadingStateTimestamps, // Object with time spend for different initial phases
    bitrates, // List of all available bitrates. Internal structure different for different type of streams
    currentBitrate, // Current bitrate. Internal structure different for different type of streams
    overallBufferLength, // Overall length of buffer
    nearestBufferSegInfo // Object with start and end for current buffer segment
  }
```

```Player.destroy()``` Destroy instance of player

