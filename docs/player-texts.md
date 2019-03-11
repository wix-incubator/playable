---
title: "Player texts"
layout: simple
---

# Player texts

To configure certain words and phrases in the `Playable` interface,
use [texts](/player-config#other) option in [config](/player-config) object together with constant `TEXT_LABELS`.

```javascript
import Playable, { TEXT_LABELS } from 'playable';

const texts = {
  [TEXT_LABELS.PLAY_CONTROL_LABEL]: 'Lire',
  [TEXT_LABELS.PAUSE_CONTROL_LABEL]: 'Pause',
  ...
};

const player = Playable.create({
  src: 'http://my-url/video.mp4',
  texts: texts
});

player.attachToElement(document.getElementById('content'));
```

> Text value could be string or function with some args that returns a string.

The available options are below:

```javascript
const texts = {
  [TEXT_LABELS.LOGO_LABEL]: 'Watch On Site',
  [TEXT_LABELS.LOGO_TOOLTIP]: 'Watch On Site',
  [TEXT_LABELS.LIVE_INDICATOR_TEXT]: ({ isEnded }) =>
    !isEnded ? 'Live' : 'Live Ended',
  [TEXT_LABELS.LIVE_SYNC_LABEL]: 'Sync to Live',
  [TEXT_LABELS.LIVE_SYNC_TOOLTIP]: 'Sync to Live',
  [TEXT_LABELS.PAUSE_CONTROL_LABEL]: 'Pause',
  [TEXT_LABELS.PLAY_CONTROL_LABEL]: 'Play',
  [TEXT_LABELS.PROGRESS_CONTROL_LABEL]: 'Progress control',
  [TEXT_LABELS.PROGRESS_CONTROL_VALUE]: ({ percent }) =>
    `Already played ${percent}%`,
  [TEXT_LABELS.MUTE_CONTROL_LABEL]: 'Mute',
  [TEXT_LABELS.MUTE_CONTROL_TOOLTIP]: 'Mute',
  [TEXT_LABELS.UNMUTE_CONTROL_LABEL]: 'Unmute',
  [TEXT_LABELS.UNMUTE_CONTROL_TOOLTIP]: 'Unmute',
  [TEXT_LABELS.VOLUME_CONTROL_LABEL]: 'Volume control',
  [TEXT_LABELS.VOLUME_CONTROL_VALUE]: ({ volume }) => `Volume is ${volume}%`,
  [TEXT_LABELS.ENTER_FULL_SCREEN_LABEL]: 'Enter full screen mode',
  [TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP]: 'Enter full screen mode',
  [TEXT_LABELS.EXIT_FULL_SCREEN_LABEL]: 'Exit full screen mode',
  [TEXT_LABELS.EXIT_FULL_SCREEN_TOOLTIP]: 'Exit full screen mode',
  [TEXT_LABELS.DOWNLOAD_BUTTON_LABEL]: 'Download',
  [TEXT_LABELS.DOWNLOAD_BUTTON_TOOLTIP]: 'Download',
  [TEXT_LABELS.START_CHROMECAST_BUTTON_LABEL]: 'Cast',
  [TEXT_LABELS.START_CHROMECAST_BUTTON_TOOLTIP]: 'Cast',
  [TEXT_LABELS.STOP_CHROMECAST_BUTTON_LABEL]: 'Cast',
  [TEXT_LABELS.STOP_CHROMECAST_BUTTON_TOOLTIP]: 'Cast',
};
```

Text key shows how this text is used:

| Example                              | Type      | Description                                                                                                                                        |
| ------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TEXT_LABELS.PROGRESS_CONTROL_LABEL` | `LABEL`   | element [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) value         |
| `TEXT_LABELS.PROGRESS_CONTROL_VALUE` | `VALUE`   | element [aria-valuetext](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-valuetext_attribute) value |
| `TEXT_LABELS.LIVE_SYNC_TOOLTIP`      | `TOOLTIP` | element tooltip text                                                                                                                               |
| `TEXT_LABELS.LIVE_INDICATOR_TEXT`    | `TEXT`    | element text                                                                                                                                       |

For localization you could use something like:

```javascript
cosnt texts = {
  [TEXT_LABELS.PAUSE_CONTROL_LABEL]: i18n.t('player.pause-control-label'),
  ...
}
```

or

```javascript
// ./player-texts/texts_fr-fr.js
import { TEXT_LABELS } from 'playable';

export default {
  [TEXT_LABELS.PLAY_CONTROL_LABEL]: 'Lire',
  ...
}

// ./player.js
import Playable from 'playable';
import texts from './player-texts/texts_fr-fr.js'

const player = Playable.create({
  src: 'http://my-url/video.mp4',
  texts: texts
});
```
