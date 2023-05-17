<p align="center">
  <a href="https://wix-incubator.github.io/playable/" target="_blank" rel="noopener noreferrer">
    <img width="100" height="108" src="https://github.com/wix-incubator/playable/raw/master/docs/logo.png?raw=true" alt="Playable logo">
  </a>
</p>

<h1 align="center">
  <a href="https://wix-incubator.github.io/playable/" target="_blank" rel="noopener noreferrer">
    Playable
  </a>
</h1>

<p align="center">
  <a href="https://travis-ci.org/wix/playable" rel="nofollow">
    <img src="https://travis-ci.org/wix/playable.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://npmjs.org/package/playable" rel="nofollow">
    <img src="https://img.shields.io/npm/v/playable.svg?style=flat" alt="npm">
  </a>
</p>

**IMPORTANT!** Migration guide from 1.0.0 to 2.0.0 you can find [here](/docs/2.0.0-migration.md).

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
    preload: 'metadata',
  };
  const player = Playable.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

You can find documentation here: [https://wix-incubator.github.io/playable/](https://wix.github.io/playable/)

## Big thanks!

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][sauselabs-homepage]

[sauselabs-homepage]: https://saucelabs.com
[documentation]: https://wix.github.io/playable/
