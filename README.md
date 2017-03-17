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
const player = new VideoPlayer.Player({
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

```config.autoplay``` Start video playback as soon as it can do so without stopping to finish loading the data.

```config.preload``` Type of preloading. For more info check ([MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video))

```config.muted``` Status of audio playback. If set, the audio will be initially silenced

```config.volume``` Start value of volume for audio

#### UI

##### Size ```config.size```

```config.size.width``` Width of video player

```config.size.height``` Height of video player

Create a new instance of video player

```javascript
const player = new VideoPlayer.Player({
    src: [
      'http://my-url/video.mp4',
      'http://my-url/video.webm',
      'http://my-url/video.m3u8'
    ],
    loop: true
});
```

### Player public methods

```Player.setAutoplay(flag)``` Set autoplay flag

```Player.setLoop(flag)``` Set loop flag

```Player.setMute(flag)``` Set mute flag

```Player.setVolume(volume)``` Set volume

```Player.setPreload(type)``` Set preload type

```Player.on(eventName, listener)``` Method for adding listeners of events inside player. You can check all events inside ```VideoPlayer.UI_EVENTS``` and ```VideoPlayer.VIDEO_EVENTS```

```Player.off(eventName, listener)``` Method for removing listeners of events inside player.

```Player.node``` Getter for DOM node with player UI element

```javascript
const player = new VideoPlayer.Player({ src: 'http://my-url/video.mp4' });

document.body.appendChild(player.node);
```

```Player.destroy``` Destroy instance of player

### PlayerUI public methods

```Player.ui.show()/hide()``` Show/Hide whole ui

```Player.ui.setWidth``` Set width of player

```Player.ui.setHeight``` Set height of player
