---
title: "Player events"
include:
  - ./events/video-events.md
  - ./events/ui-events.md
  - ./events/errors.md
  - ./events/playback-states.md
  - ./events/live-states.md
---

# Player events

```javascript
// Use it from Playable object
import Playable from 'playable';

console.log(Playable.VIDEO_EVENTS);

// Use destruction
import { VIDEO_EVENTS } from 'playable';

console.log(VIDEO_EVENTS);
```

> Add new event listeners

```javascript
player.on(Playable.UI_EVENTS.PLAY_CLICK, () => {
  // Will be executed after you will click on play button
});

// To supply a context value for `this` when the callback is invoked,
// pass the optional context argument
player.on(Playable.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
```

> And remove them

```javascript
const callback = function() {
  // Code to handle some kind of event
};

// ... Now callback will be called when some one will pause the video ...
player.on(Playable.UI_EVENTS.PAUSE_CLICK, callback);

// ... callback will no longer be called.
player.off(Playable.UI_EVENTS.PAUSE_CLICK, callback);

// ... remove all handlers for event UI_EVENTS.PAUSE_CLICK.
player.off(Playable.UI_EVENTS.PAUSE_CLICK);
```

You can create listeners for events triggered by the video player, using [on](/api#on) method. To remove a listener, use [off](/api#off).

Below you can see the events that can be passed as eventName.
