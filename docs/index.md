---
title: playable
layout: simple
---

# playable

<aside class="notice">
Embed a video player into your web application. No hassle, no fuss, just nice and easy code for your project.
</aside>

**IMPORTANT** As we did the clean-up and consistency improvements, some changes in 2.0.0 version are incompatible with the earlier versions! Find the detailed changes and the information that helps you migrate your code from version 1.x.x to 2.0.0 [here](/migration).

<playable-demo></playable-demo>

Quick links: [Installation](/#installation) | [Upgrade](/#upgrade) | [Configuration](/player-config) | [How to use](/#how-to-use) | [Customization](/#customization)

## What's playable?

Playable is a JavaScript component for video playback:

- **Easy-to-use** --- Quick bootstrap and super-flexible customization.
- **Accessibility** --- You may rely on the keyboard shortcuts to control the playback for the best accessibility in the open source.
- **Reliable** --- Uses [HTML5 video](https://www.w3schools.com/html/html5_video.asp) and [Media Source Extensions](https://www.w3.org/TR/media-source/).
- **Modern browsers support** -- We support compatibility with the latest Safari, Chrom, Firefox, Edge, and IE11.
- **Customizable** -- Make simple changes like modify UI texts and progress bar colors or go mad and customize player core and modules behaviour.
- **Flexible** **and efficient** --- Supports both [**adaptive streaming**](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming) and [**progressive download**](https://en.wikipedia.org/wiki/Progressive_download). When you provide the content in **multiple formats** as an array of source video URLs, playable considers the environment and identifies the most efficient source to play in the given circumstances. Read more in [Video Sources](/video-source)
  **Note:** Adaptive streaming sources have higher priority than those with progressive download. Native browser support has higher priority than MSE-enabled playback.
- **Extensible** --- Supported formats: MP4, WebM, HLS, DASH. New formats support may be added via adapters, along with the new behaviour and UI/UX.

### Installation

To install the stable version, use one of the following methods:

- via [npm](https://www.npmjs.com/package/playable)

```javascript
$ npm install playable --save

import Playable from 'playable';
```

- add a `<script>` element

```html
<script src="https://unpkg.com/playable@2.8.1/dist/statics/playable.bundle.min.js"></script>

<script>
  var Playable = window.Playable;
</script>
```

- you can play with the demo [here](https://jsfiddle.net/bodia/to0r65f4/)

### Configuration

For the reference of the configuration options, please, see the [Configuration](/player-config).

## How to use

To use playable in your project, import it, configure the necessary parameters (e.g. width, height, UI texts), initialize the player and attach it to the parent element.

Sample:

```jsx
<div id="content" />;

// javascript
import Playable from 'playable';

document.addEventListener('DOMContentLoaded', function() {
  // Define config object
  const config = {
    width: 700,
    height: 394,
    src: 'http://my-url/video.mp4',
  };

  // Create player instance
  const player = Playable.create(config);

  // Attach it to your DOM structure
  player.attachToElement(document.getElementById('content'));
});
```

In the _src_ parameter, provide a video URL or an array of alternative format URLs to play. The video player supports the following video formats: `MP4`, `WebM`, `HLS`, `DASH` manifest. Read more about [Video Source](/video-source).

### Integration

Call [public methods](/api) of the player instanse to control its behaviour, look and feel, and the playback process.

Process the [events](/events) triggered by video player.

### Customization

Out-of-the-box, you can configure your player UI with:

- [Progress bar color](/themes) via [theme](/themes) configuration object
- [UI texts](/player-texts) via texts configuration object

## Big thanks!

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][homepage]

[homepage]: https://saucelabs.com
