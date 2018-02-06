---
title: playable
layout: simple
---

# playable

```html
<script src="https://unpkg.com/playable@1/dist/statics/video-player.bundle.min.js"></script>

<script>
  var Playable = window.Playable;
</script>
```

<aside class="notice">
Integrate a video player into the product you’re working on – no hassle, no fuss, just nice and easy code for you to incorporate in your project.
</aside>

The video player supports the following video formats: `MP4`, `WebM`, `HLS`, `DASH` manifest. Read more about [Video Source](/video-source).

To install the stable version use [npm](https://www.npmjs.com/).

## How to use

```jsx
<div id="content"></div>

// javascript

import Playable from 'playable';

document.addEventListener('DOMContentLoaded', function() {
  const player = Playable.create({
    size: {
      width: 700,
      height: 394
    },
    src: 'http://my-url/video.mp4',
    preload: 'metadata'
  });

  playable.attachToElement(document.getElementById('content'));
});
```

Check page with info about [config object](/player-config)

After that just choose what you want to configure, create object with proper fields and pass it to `Playable.create`.

It will return instance of player. You can later modify the instance (for example, as a reaction to user input) with the  [public methods](/player-public-methods).

To place it somewhere in your structure, just call [`attachToElement`](/player-public-methods#attachtoelement)

It's really important to call `attachToElement` after `DOMContentLoaded` event due to [css-element-query](https://github.com/marcj/css-element-queries)
