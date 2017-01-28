# video-player

## Get it

```
$ npm install video-player --save
```

## Use it

Add a `<script>` element for video-player

In modern way

```javascript
import VideoPlayer from 'video-player';
```

Or in old school way

```html
<script src="path/to/video-player/dist/statics/video-player.bundle.js"></script>
```

And write awesome code:

```javascript
const player = new VideoPlayer({
    width: 700,
    height: 394,
    src: 'http://my-url/video.mp4',
    poster: 'http://my-url/image.jpg',
    preload: 'metadata'
});

document.getElementById('content').appendChild(player.node);
```

## API

### VideoPlayer({ src, ...attributes})

```src``` A string or array with source of the video. For more information see [vidi](https://github.com/wix/vidi)

```attributes``` Set of attributes for native `<video>` tag. [MDN](https://developer.mozilla.org/en/docs/Web/HTML/Element/video)

Create a new instance of video player

```javascript
const player = new VideoPlayer({
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
const player = new VideoPlayer({ src: 'http://my-url/video.mp4' });

document.body.appendChild(player.node);
```
