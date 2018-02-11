<!-- Generated automatically. Update this documentation by updating the source code. -->

# Player public methods

## on

```javascript
const Playable = require('playable');
const player = Playable.create();

player.on(Playable.UI_EVENTS.PLAY_TRIGGERED, () => {
  // Will be executed after you will click on play button
});

// To supply a context value for `this` when the callback is invoked,
// pass the optional context argument
player.on(Playable.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
```

Method for adding listeners of events inside player.
You can check all events inside <code>Playable.UI_EVENTS</code> and <code>Playable.VIDEO_EVENTS</code>

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>event</code><span class="type">string</span class="type">
        </td>
        <td>The Event name, such as <code>Playable.UI_EVENTS.PLAY_TRIGGERED</code></td>
      </tr><tr>
        <td class="param">
          <code>fn</code><span class="type">ListenerFn</span class="type">
        </td>
        <td>A function callback to execute when the event is triggered.</td>
      </tr><tr>
        <td class="param">
          <code>context</code>
        </td>
        <td>Value to use as <code>this</code> (i.e the reference Object) when executing callback.</td>
      </tr>
    </tbody>
  </table>
</div>


## off

```javascript
const Playable = require('playable');
const player = Playable.create();

const callback = function() {
  // Code to handle some kind of event
};

// ... Now callback will be called when some one will pause the video ...
player.on(Playable.UI_EVENTS.PAUSE_TRIGGERED, callback);

// ... callback will no longer be called.
player.off(Playable.UI_EVENTS.PAUSE_TRIGGERED, callback);

// ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.
player.off(Playable.UI_EVENTS.PAUSE_TRIGGERED);
```

Method for removing listeners of events inside player.

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>event</code><span class="type">string</span class="type">
        </td>
        <td>The Event name, such as <code>Playable.UI_EVENTS.PLAY_TRIGGERED</code></td>
      </tr><tr>
        <td class="param">
          <code>fn</code><span class="type">ListenerFn</span class="type">
        </td>
        <td>Only remove the listeners that match this function.</td>
      </tr><tr>
        <td class="param">
          <code>context</code>
        </td>
        <td>Only remove the listeners that have this context.</td>
      </tr><tr>
        <td class="param">
          <code>once</code><span class="type">boolean</span class="type">
        </td>
        <td>Only remove one-time listeners.</td>
      </tr>
    </tbody>
  </table>
</div>


## enterFullScreen

```javascript
player.enterFullScreen();
```

Player would try to enter fullscreen mode.
Behavior of fullscreen mode on different platforms may differ.


## exitFullScreen

```javascript
player.exitFullScreen();
```

Player would try to exit fullscreen mode.


## isInFullScreen

```javascript
player.isInFullScreen(); // false
```

Return true if player is in full screen


## getDebugInfo

```javascript
player.getDebugInfo();
```

> The above command returns JSON structured like this:

```javascript
{
  "type": "HLS",
  "viewDimensions": {
    "width": 700,
    "height": 394
  }
  "url": "https://example.com/video.m3u8",
  "currentTime": 22.092514,
  "duration": 60.139683,
  "loadingStateTimestamps": {
    "metadata-loaded": 76,
    "ready-to-play": 67
  },
  "bitrates": [
    // Different for different type of streams
    { ... },
    { ... }
  ],
  "currentBitrate": { ... },
  "overallBufferLength": 60.139683,
  "nearestBufferSegInfo": {
    "start": 0,
    "end": 60.139683
  }
}
```

Return object with internal debug info

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>RETURN VALUE</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>type</code>
        </td>
        <td>Name of current attached stream. Possible values are <code>HLS</code>, <code>DASH</code>, <code>MP4</code>, <code>WEBM</code>.</td>
      </tr><tr>
        <td class="param">
          <code>viewDimensions</code><span class="type">Object</span class="type">
        </td>
        <td>Current size of view port provided by engine (right now - actual size of video tag)</td>
      </tr><tr>
        <td class="param">
          <code>url</code><span class="type">string</span class="type">
        </td>
        <td>Url of current source</td>
      </tr><tr>
        <td class="param">
          <code>currentTime</code><span class="type">number</span class="type">
        </td>
        <td>Current time of playback</td>
      </tr><tr>
        <td class="param">
          <code>duration</code><span class="type">number</span class="type">
        </td>
        <td>Duration of current video</td>
      </tr><tr>
        <td class="param">
          <code>loadingStateTimestamps</code><span class="type">Object</span class="type">
        </td>
        <td>Object with time spend for different initial phases</td>
      </tr><tr>
        <td class="param">
          <code>bitrates</code>
        </td>
        <td>List of all available bitrates. Internal structure different for different type of streams</td>
      </tr><tr>
        <td class="param">
          <code>currentBitrate</code><span class="type">Object</span class="type">
        </td>
        <td>Current bitrate. Internal structure different for different type of streams</td>
      </tr><tr>
        <td class="param">
          <code>overallBufferLength</code><span class="type">number</span class="type">
        </td>
        <td>Overall length of buffer</td>
      </tr><tr>
        <td class="param">
          <code>nearestBufferSegInfo</code><span class="type">Object</span class="type">
        </td>
        <td>Object with start and end for current buffer segment</td>
      </tr>
    </tbody>
  </table>
</div>


## setSrc

```javascript
player.setSrc([
  'https://my-url/video.mp4',
  'https://my-url/video.webm',
  'https://my-url/video.m3u8'
]);
```

> Read more about [video source](/video-source)

Method for setting source of video to player.

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>src</code>
        </td>
        <td>Array with multiple sources</td>
      </tr>
    </tbody>
  </table>
</div>


## getSrc

```javascript
player.getSrc(); // ['https://my-url/video.mp4']
```

Return current source of video


## syncWithLive

```javascript
player.syncWithLive();
```

Method for synchronize current playback with live point. Available only if you playing live source.


## goForward

```javascript
player.goForward(5);
```

Method for going forward in playback by your value

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>sec</code><span class="type">number</span class="type">
        </td>
        <td>Value in seconds</td>
      </tr>
    </tbody>
  </table>
</div>


## goBackward

```javascript
player.goBackward(5);
```

Method for going backward in playback by your value

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>sec</code><span class="type">number</span class="type">
        </td>
        <td>Value in seconds</td>
      </tr>
    </tbody>
  </table>
</div>


## decreaseVolume

```javascript
player.decreaseVolume(30);
```

Method for decreasing current volume by value

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>value</code><span class="type">number</span class="type">
        </td>
        <td>Value from 0 to 100</td>
      </tr>
    </tbody>
  </table>
</div>


## increaseVolume

```javascript
player.increaseVolume(30);
```

Method for increasing current volume by value

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>value</code><span class="type">number</span class="type">
        </td>
        <td>Value from 0 to 100</td>
      </tr>
    </tbody>
  </table>
</div>


## setAutoPlay

```javascript
player.setAutoPlay();
```

Set autoPlay flag

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>isAutoPlay</code><span class="type">boolean</span class="type">
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


## getAutoPlay

```javascript
player.getAutoPlay(); // true
```

Get autoPlay flag


## setLoop

```javascript
player.setLoop(true);
```

Set loop flag

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>isLoop</code><span class="type">boolean</span class="type">
        </td>
        <td>If <code>true</code> video will be played again after it will finish</td>
      </tr>
    </tbody>
  </table>
</div>


## getLoop

```javascript
player.getLoop(); // true
```

Get loop flag


## setMute

```javascript
player.setMute(true);
```

Mute or unmute the video

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>isMuted</code><span class="type">boolean</span class="type">
        </td>
        <td><code>true</code> to mute the video.</td>
      </tr>
    </tbody>
  </table>
</div>


## getMute

```javascript
player.getMute(); // true
```

Get mute flag


## setVolume

```javascript
player.setVolume(50);
```

Set volume

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>volume</code><span class="type">number</span class="type">
        </td>
        <td>Volume value <code>0..100</code></td>
      </tr>
    </tbody>
  </table>
</div>


## getVolume

```javascript
player.getVolume(); // 50
```

Get volume


## setPlaybackRate

Method for setting playback rate

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>rate</code><span class="type">number</span class="type">
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


## getPlaybackRate

Return current playback rate


## setPreload

```javascript
player.setPreload('none');
```

Set preload type

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>preload</code>
        </td>
        <td> Possible values are <code>auto</code>, <code>metadata</code>, <code>none</code>.</td>
      </tr>
    </tbody>
  </table>
</div>


## getPreload

```javascript
player.getPreload(); // none
```

Return preload type


## getCurrentTime

```javascript
player.getCurrentTime(); //  60.139683
```

Return current time of video playback


## goTo

```javascript
player.goTo(34);
```

Method for seeking to time in video

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>time</code><span class="type">number</span class="type">
        </td>
        <td>Time in seconds</td>
      </tr>
    </tbody>
  </table>
</div>


## getDurationTime

```javascript
player.getDurationTime(); // 180.149745
```

Return duration of video


## getVideoRealWidth

```javascript
player.getVideoWidth(); // 400
```

Return real width of video from metadata


## getVideoRealHeight

```javascript
player.getVideoHeight(); // 225
```

Return real height of video from metadata


## setPlayInline

```javascript
player.setPlayInline(true);
```

Set playInline flag

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>isPlayInline</code><span class="type">boolean</span class="type">
        </td>
        <td>If <code>false</code> - video will be played in full screen, <code>true</code> - inline</td>
      </tr>
    </tbody>
  </table>
</div>


## getPlayInline

```javascript
player.getPlayInline(); // true
```

Get playInline flag


## getCurrentPlaybackState

Return current state of playback


## play

```javascript
player.play();
```

Method for starting playback of video


## pause

```javascript
player.pause();
```

Method for pausing playback of video


## togglePlayback

```javascript
player.togglePlayback();
```

Method for toggling(play\pause) playback of video


## node

Getter for DOM node with player UI element
(use it only for debug, if you need attach player to your document use <code>attachToElement</code> method)


## attachToElement

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = { src: 'http://my-url/video.mp4' }
  const player = Playable.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

Method for attaching player node to your container
It's important to call this methods after <code>DOMContentLoaded</code> event!

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>node</code><span class="type">Node</span class="type">
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


## hide

```javascript
player.hide();
```

Hide whole ui


## show

```javascript
player.show();
```

Show whole ui


## setWidth

```javascript
player.setWidth(400);
```

Method for setting width of player

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>width</code><span class="type">number</span class="type">
        </td>
        <td>Desired width of player in pixels</td>
      </tr>
    </tbody>
  </table>
</div>


## setHeight

```javascript
player.setHeight(225);
```

Method for setting width of player

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>height</code><span class="type">number</span class="type">
        </td>
        <td>Desired height of player in pixels</td>
      </tr>
    </tbody>
  </table>
</div>


## getWidth

```javascript
player.getWidth(); // 400
```

Return current width of player in pixels


## getHeight

```javascript
player.getHeight(); // 225
```

Return current height of player in pixels


## setFillAllSpace

```javascript
player.setFillAllSpace(true);
```

Method for allowing player fill all available space

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>flag</code><span class="type">boolean</span class="type">
        </td>
        <td><code>true</code> for allowing</td>
      </tr>
    </tbody>
  </table>
</div>


## setLogoAlwaysShowFlag

```javascript
player.setLogoAlwaysShowFlag(true);
```

Method for allowing logo to be always shown in bottom block

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>flag</code><span class="type">boolean</span class="type">
        </td>
        <td><code>true</code> for showing always</td>
      </tr>
    </tbody>
  </table>
</div>


## hideLogo

```javascript
player.hideLogo();
```

Method for hidding logo. If you use <code>setLogoAlwaysShowFlag</code> or <code>setControlsShouldAlwaysShow</code>, logo would automaticaly appear.


## setLogo

```javascript
player.setLogo('https://example.com/logo.png');
```

Method for setting source of image, that would be used as logo

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>src</code><span class="type">string</span class="type">
        </td>
        <td>Source of logo</td>
      </tr>
    </tbody>
  </table>
</div>


## setLogoClickCallback

```javascript
const callback = () => {
  console.log('Click on title);
}
player.setLogoClickCallback(callback);
```

Method for attaching callback for click on logo

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>callback</code><span class="type">Function</span class="type">
        </td>
        <td>Your function</td>
      </tr>
    </tbody>
  </table>
</div>


## addTimeIndicator

Add time indicator to progress bar

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>time</code><span class="type">number</span class="type">
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


## addTimeIndicators

Add time indicators to progress bar

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>times</code>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


## clearTimeIndicators

Delete all time indicators from progress bar


## updateTheme

```javascript
player.updateTheme({
  progressColor: "#AEAD22"
})
```

> You can check info about theming [here](/themes)

Method for setting theme for player instance

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>themeConfig</code><span class="type">IThemeConfig</span class="type">
        </td>
        <td>Theme config</td>
      </tr>
    </tbody>
  </table>
</div>


## setLoadingCover

```javascript
player.setLoadingCover('https://example.com/cover.png');
```

Method for setting source of image, that would be used as loading cover instead of loader.

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>src</code><span class="type">string</span class="type">
        </td>
        <td>Link to your image</td>
      </tr>
    </tbody>
  </table>
</div>


## setControlsShouldAlwaysShow

```javascript
player.setControlsShouldAlwaysShow(true);
```

Method for allowing bottom block to be always shown.

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>flag</code><span class="type">boolean</span class="type">
        </td>
        <td><code>true</code> for showing always</td>
      </tr>
    </tbody>
  </table>
</div>


## setPoster

```javascript
player.setPoster('https://example.com/poster.png');
```

Method for setting overlay poster

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>src</code><span class="type">string</span class="type">
        </td>
        <td>Source of image</td>
      </tr>
    </tbody>
  </table>
</div>


## setTitle

```javascript
player.setTitle('Your awesome video title here');
```

> [Live Demo](https://jsfiddle.net/bodia/243k6m0u/)

Display title text over the video. If you want to have clickable title, use <code>setTitleClickCallback</code>

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>title</code><span class="type">string</span class="type">
        </td>
        <td>Text for the video title</td>
      </tr>
    </tbody>
  </table>
</div>


## setTitleClickCallback

```javascript
const callback = () => {
  console.log('Click on title);
}
player.setTitleClickCallback(callback);
```

Method for attaching callback for click on title

<div class="method-list">
  <table>
    <thead>
      <tr>
        <th>ARGUMENTS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param">
          <code>callback</code><span class="type">Function</span class="type">
        </td>
        <td>Your function</td>
      </tr>
    </tbody>
  </table>
</div>

