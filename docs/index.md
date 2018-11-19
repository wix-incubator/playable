---
title: playable
layout: simple
---

# playable

<aside class="notice">
Integrate a video player into the product you’re working on – no hassle, no fuss, just nice and easy code for you to incorporate in your project.
</aside>

**IMPORTANT!** We released 2.0.0 version! Find migration guide [here](/migration).


<playable-demo></playable-demo>

To install the stable version use [npm](https://www.npmjs.com/package/playable).<br/>

```javascript
$ npm install playable --save

import Playable from 'playable';
```

Or add a `<script>` element

```html
<script src="https://unpkg.com/playable@2.4.0/dist/statics/playable.bundle.min.js"></script>

<script>
  var Playable = window.Playable;
</script>
```

Or you can play with demo [here](https://jsfiddle.net/bodia/to0r65f4/)

The video player supports the following video formats: `MP4`, `WebM`, `HLS`, `DASH` manifest. Read more about [Video Source](/video-source).

## How to use

```jsx
<div id="content"></div>

// javascript
import Playable from 'playable';

document.addEventListener('DOMContentLoaded', function() {
  // Define config object
  const config = {
    width: 700,
    height: 394,
    src: 'http://my-url/video.mp4'
  };

  // Create player instance
  const player = Playable.create(config);

  // Attach it to your DOM structure
  player.attachToElement(document.getElementById('content'));
});
```

## Next step

* Structure of [config object](/player-config). <br/>
* Simple customization via [themes](/themes)
* Player's instanse [public methods](/api).<br/>

## Big thanks!

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][homepage]

[homepage]: https://saucelabs.com
