# Video source

```javascript
import Playable from 'playable';

const player = Playable.create({
  src: 'https://my-url/video.mp4'
});
```

To set the source of the video stream, use `src` property of config or `setSrc` method of player instance.

The type of stream is automatically detected from the URL. The following extensions are recognized:

- MP4 `.mp4`
- WebM `.webm`
- HLS manifest `.m3u8`
- DASH manifest `.mpd`

```javascript
player.setSrc([
  'https://my-url/video.mp4',
  'https://my-url/video.webm',
  'https://my-url/video.m3u8'
]);
```

You can provide multiple source as an array.

```javascript
import Playable from 'playable';

const player = Playable.create({
  src: 'https://my-url/video'
  type: Playable.MEDIA_STREAM_TYPES.MP4
});
// OR
player.setSrc({
  url: 'https://my-url/video',
  type: Playable.MEDIA_STREAM_TYPES.MP4
})
```
If the URL does not end with the file extension, the type can be specified explicitly.
Use `Playable.MEDIA_STREAM_TYPES` to set video `type`.

**And now, the best part...**

```javascript
player.setSrc([
  'https://my-url/video.mp4',
  {
    url: 'https://my-url/video.webm',
    type: Playable.MEDIA_STREAM_TYPES.WEBM
  },
  {
    url: 'https://my-url/video.m3u8',
    type: Playable.MEDIA_STREAM_TYPES.HLS
  },
]);
```

In combination with multiple sources, you can be flexible as much as you want:

***player*** assumes the URLs point to **different formats** of the **same video**,
and will automatically detect and choose the ideal format for the current browser.

The order of sources in the array doesn't matter.

The logic uses the following prioritization system to pick the most suitable format (*from highest priority to lowest*):

1. **Adaptive sources** that can be played via **native** browser support. *Example: HLS on Safari*
2. **Adaptive sources** that can be played via **MSE**-based libraries. *Example: DASH on Chrome*
3. **Progressive** sources (MP4 and WebM) that can be played via **native** browser support.

The algorithm bases decisions using browser feature detection.

And boi, you can extend 'dis logic with your own custom shit, [trust me](/adapters)!
