---
title: "Player events"
include:
  - ./events/video-events.md
  - ./events/ui-events.md
  - ./events/errors.md
  - ./events/playback-states.md
---

# Player events

```javascript
// Use it from VideoPlayer object
import VideoPlayer from 'video-player';

console.log(VideoPlayer.VIDEO_EVENTS);

// Use destruction
import { VIDEO_EVENTS } from 'video-player';

console.log(VIDEO_EVENTS);
```

> Add new event listeners

```javascript
player.on(VideoPlayer.UI_EVENTS.PLAY_TRIGGERED, () => {
  // Will be executed after you will click on play button
});

// To supply a context value for `this` when the callback is invoked,
// pass the optional context argument
player.on(VideoPlayer.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
```

> And remove them

```javascript
const callback = function() {
  // Code to handle some kind of event
};

// ... Now callback will be called when some one will pause the video ...
player.on(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);

// ... callback will no longer be called.
player.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);

// ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.
player.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED);
```

You can create listeners for events triggered by the video player, using [on](/docs/api#on) method. To remove a listener, use [off](/docs/api#off).

Below you can see the events that can be passed as eventName.
