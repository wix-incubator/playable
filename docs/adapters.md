---
title: "Playback adapters"
---

# Playback adapters

## Basic concept

There are lot of varios formats and concept of delivering video to end user.
You could be satisfied with [progressive download](https://en.wikipedia.org/wiki/Progressive_download) of your mp4 video, which has cross-browser support and almost no specific requirements for your backend.
But if the user experience is really important for you, you should consider using [adaptive streaming](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming).
Pros - better user experience.
Cons - there is no cross-browser support of main formats (HLS and MPEG-DASH) of adaptive streaming.
There are various libraries that add this support to the browser.
We did not add them to our default bundle because they are heavyweight, but we give you the ability to use them.

In Playable we have a concept of adapters. To use some library that is responsible for playing video of some format, create ES6 class that implements proper interface and add it to Playable as playback adapter. We have couple adapters written by ourselfs. Use them or check code for inspiration.


## How to use

There are 2 ways of adding them.

### Import to your project

```javascript
import Playabale from 'playable';
import HLSAdapter from 'playable/dist/adapters/hls';
import DASHAdapter from 'playable/dist/adapters/dash';

Playable.registerPlaybackAdapter(HLSAdapter);
Playable.registerPlaybackAdapter(DASHAdapter);
```

### Add script with proper bundle

You can just take our bundle with hls or dash, where we already connected our adapter with Playable:

With HLS - [https://unpkg.com/playable/dist/statics/playable-hls.bundle.min.js](https://unpkg.com/playable@1.3.3/dist/statics/playable-hls.bundle.min.js)

With MPEG-DASH - [https://unpkg.com/playable/dist/statics/playable-dash.bundle.min.js](https://unpkg.com/playable@1.3.3/dist/statics/playable-dash.bundle.min.js)

```html
<script src="https://unpkg.com/playable/dist/statics/playable-hls.bundle.min.js"/>
<script>
  const player = Playable.create();
  player.setSrc("URL_TO_YOUR_HLS_FILE");
</script>
```

## Create your own adapter

In near future we gonna update this page with required interface for adapters, so you could create one by yourself. For now - check our [repository](https://github.com/wix/playable)
