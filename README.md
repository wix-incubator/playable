# video-player

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
const player = VideoPlayer.create({
  size: {
    width: 700,
    height: 394
  }
  src: 'http://my-url/video.mp4',
  preload: 'metadata'
});

document.getElementById('content').appendChild(player.node);
```

## API

### VideoPlayer ```config```

#### Video sources

```config.src``` A string or array with source of the video. For more information see [vidi](https://github.com/wix/vidi)

#### Playback attributes

```config.loop``` Loop video playback

```config.autoPlay``` Start video playback as soon as it can do so without stopping to finish loading the data.

```config.preload``` Type of preloading. For more info check ([MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video))

```config.muted``` Status of audio playback. If set, the audio will be initially silenced

```config.volume``` Start value of volume for audio

```config.playInline``` Attribute for playing inline in iOS

#### UI

##### Size ```config.size```

```config.size.width``` Width of video player

```config.size.height``` Height of video player

Create a new instance of video player

```javascript
const player = VideoPlayer.create({
    src: [
      'http://my-url/video.mp4',
      'http://my-url/video.webm',
      'http://my-url/video.m3u8'
    ],
    loop: true
});
```

### Player public methods

```Player.setAutoPlay(flag)``` Set autoPlay flag

```Player.setLoop(flag)``` Set loop flag

```Player.setMute(flag)``` Set mute flag

```Player.setVolume(volume)``` Set volume

```Player.setPreload(type)``` Set preload type

```Player.setPlayInline(playInline)``` Set playInline flag

```Player.on(eventName, listener)``` Method for adding listeners of events inside player. You can check all events inside ```VideoPlayer.UI_EVENTS``` and ```VideoPlayer.VIDEO_EVENTS```

```Player.off(eventName, listener)``` Method for removing listeners of events inside player.

```Player.node``` Getter for DOM node with player UI element

```javascript
const player = VideoPlayer.create({ src: 'http://my-url/video.mp4' });

document.body.appendChild(player.node);
```

```Player.show()/hide()``` Show/Hide whole ui

```Player.setWidth``` Set width of player

```Player.setHeight``` Set height of player

```Player.enterFullScreen``` Manual enter full screen

```Player.exitFullScreen``` Manual exit full screen

```Player.isInFullScreen``` Return `true` if player is in full screen

```Player.getDebugInfo``` Return object with internal debug info
```javascript
  {
    attachedStreamName, // Name of current attached stream (HLS, DASH, MPEG, WEBM)
    width, height, // Current size of view port provided by engine (right now - actual size of video tag)
    src, // Current source
    currentTime, // Current time of playback
    duration, // Duration of current video
    loadingStateTimestamps, // Object with time spend for different initial phases
    bitrates, // List of all available bitrates. Internal structure different for different type of streams
    currentBitrate, // Current bitrate. Internal structure different for different type of streams
    overallBufferLength, // Overall length of buffer
    nearestBufferSegInfo // Object with start and end for current buffer segment
  }
```

```Player.destroy``` Destroy instance of player

