# video-player

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
const player = new VideoPlayer.Player({
    width: 700,
    height: 394,
    src: 'http://my-url/video.mp4',
    preload: 'metadata'
});

document.getElementById('content').appendChild(player.node);
```

## API

### VideoPlayer(config)

#### Video sources

```config.src``` A string or array with source of the video. For more information see [vidi](https://github.com/wix/vidi)

#### Native attributes

You can use ```config.loop```, ```config.autoplay```, ```config.preload```, ```config.poster``` and ```config.muted``` ([MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video))

#### UI

```config.width``` Width of video player

```config.height``` Height of video player

```config.overlay``` Toggle overlay

```config.controls``` Toggle all controls

```config.timeIndicator``` Toggle block with current time of video

```config.progressControl``` Toggle progress control

```config.volumeControl``` Toggle volume control

```config.volume``` Initial volume

```config.fullscreenControl```  Toggle fullscreen control


Create a new instance of video player

```javascript
const player = new VideoPlayer.Player({
    src: [
      'http://my-url/video.mp4',
      'http://my-url/video.webm',
      'http://my-url/video.m3u8'
    ],
    loop: true
});
```

### .node

Getter for DOM node with player Element

```javascript
const player = new VideoPlayer.Player({ src: 'http://my-url/video.mp4' });

document.body.appendChild(player.node);
```
