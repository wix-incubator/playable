---
title: "Player modules"
layout: simple

---

# Core modules
**Playback Engine** - `engine`: Your main entry point for interaction with video playback. If you want to play\pause video, change volume or anything that relatet to interaction with HTML5Video API - it's your candidate to start from.

**Event Emitter** - `eventEmitter`: Our main pipeline for events and way of decoupling modules. If you want to subscribe or fire some events - use this one. List of all events you can find [here](/events).

**Full Screen Manager** - `fullScreenManager`: Abstraction for letting you enter full screen mode in different browsers and systems(iOS including).

**Root Container** - `rootContainer`: Entry point of all UI. This module is responsible for our core UI features. Use it if you want to add something into DOM structure of player.

**Text Map** - `textMap`: Map of all texts, that are used and could be customized in player. Labels, tooltips and all such stuff we store here and you can use it to for i18.

**Keyboard Control** - `keyboardControl`: Module for handling keyboard as source of interaction with player. You can use it if you want to add some hotkeys for player.


# UI modules
## Main UI with controls

**Main UI Block** - `mainUIBlock`: Container for main ui(controls, title, live indicator etc). It wraps `topBlock` and `bottomBlock` and contains logic of showing\hidding them.

**Top Block** - `topBlock`: Container for controls, placed on top of `mainUIBlock`. It wraps `title` and `liveIndicator`.

**Bottom Block** - `bottomBlock`: Container for controls, placed on bottom of `mainUIBlock`. It wraps `playControl`, `progressControl`, `timeControl`, `volumeControl`, `fullScreenControl`, `logo` and `downloadButton`.

**Title** - `title`: Module for showing title of video, if passed.

**Live Indicator** - `liveIndicator`: Indicator of ongoing live stream, if any passed as source.

**Progress Control** - `progressControl`: Control for changing with progress of video.

**Play Control** - `playControl`: Control for toggling playback of video.

**Time Control** - `timeControl`: Indicator of current time of video and total duration of it.

**Volume Control** - `volumeControl`: Control for changing volume level and mute status.

**Full Screen Control** - `fullScreenControl`: Control for toggling full screen mode.

**Logo** - `logo`: Module for showing your logo as part of bottom block.

**Download Button** - `downloadButton`: Add button for download of video source (doesn't start real download, just triggers callback you passed via API).

## Other UI elements
**Overlay** - `overlay`: Overlay on top of player. It has control for starting video playback and it automaticaly hides when video is playing.

**Screen** - `screen`: Container, where video tag(or, in theory, other source of content like canvas) is placed.

**Loader** - `loader`: Indicator that something (video) is loading right now.

**Interaction Indicator** - `interactionIndicator`: Indicator of user interaction with player, when it's done not thourgh controls like toggling playback on player click.

**Preview Thumbnail** - `previewThumbnail`: Shown on top of progress bar when hoverd, contains preview frame from `previewService`.

**Preview in Full Size** - `previewFullSize`: Shown size of player preview when progress bar is in **showPreviewOnProgressDrag** mode.
