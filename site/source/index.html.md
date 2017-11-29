---
title: API Reference

toc_footers:
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

includes:
  - API

search: true
---

# video-player.js
You can play with demo playground here: [https://wix-private.github.io/video-player-playground/](https://wix-private.github.io/video-player-playground/)

## Installation

```
$ npm install video-player --save
```

To install the stable version use [npm](https://www.npmjs.com/).

```js
// using ES6 modules
import VideoPlayer from 'video-player';
```
```js
// using CommonJS modules
var VideoPlayer = require('video-player');
```

Or use old school way, add a `<script>` element for video-player

```html
<!-- NOTE: minified version - path/to/video-player/dist/statics/video-player.bundle.min.js -->
<script src="path/to/video-player/dist/statics/video-player.bundle.js"></script>
<!-- Now you can find the library on `window.VideoPlayer -->
```

## How to use

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
