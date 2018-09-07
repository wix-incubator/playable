[![Build Status](https://travis-ci.org/wix/playable.svg?branch=master)](https://travis-ci.org/wix/playable)
[![npm](https://img.shields.io/npm/v/playable.svg?style=flat)](https://npmjs.org/package/playable)

**IMPORTANT!** We released 2.0.0 version! Find migration guide [here](/docs/2.0.0-migration.md).

# playable

You can play with demo here: [https://jsfiddle.net/bodia/to0r65f4/](https://jsfiddle.net/bodia/to0r65f4/)

## Get it

```
$ npm install playable --save
```

## Use it

In modern way

```javascript
import Playable from 'playable';
```

Or in old school way, add a `<script>` element for video-player

```html
<script src="path/to/playable/dist/statics/playable.bundle.js"></script>
```

And write awesome code:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = {
    width: 700,
    height: 394,
    src: 'http://my-url/video.mp4',
    preload: 'metadata'
  };
  const player = Playable.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

You can find documentation here: [https://wix.github.io/playable/](https://wix.github.io/playable/)


## Big thanks!

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][homepage]

[homepage]: https://saucelabs.com
