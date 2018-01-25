---
title: video-player.js
---

# video-player.js

```javascript
$ npm install video-player --save

var VideoPlayer = require('video-player');
```

> Or add a `<script>` element

```html
<script src="https://unpkg.parastorage.com/video-player@2.0.5/dist/statics/video-player.bundle.min.js"></script>

<script>
  var VideoPlayer = window.VideoPlayer;
</script>
```

<aside class="notice">
Integrate a video player into the product you’re working on – no hassle, no fuss, just nice and easy code for you to incorporate in your project.
</aside>

The video player supports the following video formats: `MP4`, `WebM`, `HLS`, `DASH` manifest. Read more about [Video Source](/docs/video-source).

To install the stable version use [npm](https://www.npmjs.com/).

## How to use

```jsx
<div id="content"></div>

// javascript

import VideoPlayer from 'video-player';

document.addEventListener('DOMContentLoaded', function() {
  const player = VideoPlayer.create({
    size: {
      width: 700,
      height: 394
    },
    src: 'http://my-url/video.mp4',
    preload: 'metadata'
  });

  player.attachToElement(document.getElementById('content'));
});
```

Check page with info about [config object](/docs/player-config)

After that just choose what you want to configure, create object with proper fields and pass it to `VideoPlayer.create`.

It will return instance of player. You can later modify the instance (for example, as a reaction to user input) with the  [public methods](/docs/player-public-methods).

To place it somewhere in your structure, just call [`attachToElement`](/docs/player-public-methods#attachtoelement)

It's really important to call `attachToElement` after `DOMContentLoaded` event due to [css-element-query](https://github.com/marcj/css-element-queries)
