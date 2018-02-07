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
   size: {
     width: 700,
     height: 394
   },
   src: 'http://my-url/video.mp4',
   preload: 'metadata'
  };
  const player = Playable.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

You can find documentation here: [https://wix.github.io/playable/](https://wix.github.io/playable/)
