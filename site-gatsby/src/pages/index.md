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

You can find all public methods here:
[docs/player-public-methods](docs/player-public-methods)
