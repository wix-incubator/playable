---
title: API Reference

toc_footers:
  - <a href='api.html'>API reference</a>

search: true
---

# video-player.js
You can play with demo playground here: [https://wix-private.github.io/video-player-playground/](https://wix-private.github.io/video-player-playground/)

# Installation

To install the stable version use [npm](https://www.npmjs.com/).

`$ npm install video-player --save`

Using ES6 modules:

`import VideoPlayer from 'video-player';`

Using CommonJS modules:

`var VideoPlayer = require('video-player');`

```html
<!-- NOTE: minified version - path/to/video-player/dist/statics/video-player.bundle.min.js -->
<script src="path/to/video-player/dist/statics/video-player.bundle.js"></script>
<!-- Now you can find the library on `window.VideoPlayer -->
```

Or use old school way, add a `<script>` element for video-player:

`<script src="path/to/video-player/dist/statics/video-player.bundle.js"></script>`

# How to use

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

`const player = VideoPlayer.create(config);`

`player.attachToElement(document.getElementById('content'));`
