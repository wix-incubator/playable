---
title: playable
layout: simple
---

# playable

<aside class="notice">
Integrate a video player into the product you’re working on – no hassle, no fuss, just nice and easy code for you to incorporate in your project.
</aside>

To install the stable version use [npm](https://www.npmjs.com/package/playable).

```javascript
$ npm install playable --save

import Playable from 'playable';
```

Or add a `<script>` element

```html
<script src="https://unpkg.com/playable@1.7.4/dist/statics/playable.bundle.min.js"></script>

<script>
  var Playable = window.Playable;
</script>
```

Or you can play with demo here: [https://jsfiddle.net/bodia/to0r65f4/](https://jsfiddle.net/bodia/to0r65f4/)

The video player supports the following video formats: `MP4`, `WebM`, `HLS`, `DASH` manifest. Read more about [Video Source](/video-source).

## How to use

```jsx
<div id="content"></div>

// javascript

import Playable from 'playable';

document.addEventListener('DOMContentLoaded', function() {
  const config = {
    size: {
      width: 700,
      height: 394
    },
    src: 'http://my-url/video.mp4'
  };

  const player = Playable.create(config);

  playable.attachToElement(document.getElementById('content'));
});
```

Check page with info about [config object](/player-config)

You can customize player's UI elements via [themes](/themes)

After that just choose what you want to configure, create object with proper fields and pass it to `Playable.create`.

It will return instance of player. You can later modify the instance (for example, as a reaction to user input) with the  [public methods](/api).

To place it somewhere in your structure, just call [`attachToElement`](/api#attachtoelement)

It's really important to call `attachToElement` after `DOMContentLoaded` event due to [css-element-query](https://github.com/marcj/css-element-queries)
