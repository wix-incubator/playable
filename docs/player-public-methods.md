<!-- Generated automatically. Update this documentation by updating the source code. -->

# Player public methods

## updateTheme()

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
          <code>themeConfig</code>
        </td>
        <td>
            <div class="type">IThemeConfig</div>
            <p>Theme config</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## node

Getter for DOM node with player UI element
(use it only for debug, if you need attach player to your document use `attachToElement` method)

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
        </td>
        <td>
            <div class="type">Element</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## attachToElement()

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = { src: 'http://my-url/video.mp4' }
  const player = Playable.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

Method for attaching player node to your container
It's important to call this methods after `DOMContentLoaded` event!

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
          <code>element</code>
        </td>
        <td>
            <div class="type">Element</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setWidth()

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
          <code>width</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Desired width of player in pixels</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getWidth()

```javascript
player.getWidth(); // 400
```

Return current width of player in pixels

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setHeight()

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
          <code>height</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Desired height of player in pixels</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getHeight()

```javascript
player.getHeight(); // 225
```

Return current height of player in pixels

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setFillAllSpace()

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
          <code>flag</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p><code>true</code> for allowing</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## hide()

```javascript
player.hide();
```

Hide whole ui

## show()

```javascript
player.show();
```

Show whole ui

## on()

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
You can check all events inside `Playable.UI_EVENTS` and `Playable.VIDEO_EVENTS`

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
          <code>event</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>The Event name, such as <code>Playable.UI_EVENTS.PLAY_TRIGGERED</code></p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>fn</code>
        </td>
        <td>
            <div class="type">ListenerFn</div>
            <p>A function callback to execute when the event is triggered.</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>context</code>
        </td>
        <td>
            <div class="type">any</div>
            <p>Value to use as <code>this</code> (i.e the reference Object) when executing callback.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## off()

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
          <code>event</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>The Event name, such as <code>Playable.UI_EVENTS.PLAY_TRIGGERED</code></p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>fn</code>
        </td>
        <td>
            <div class="type">ListenerFn</div>
            <p>Only remove the listeners that match this function.</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>context</code>
        </td>
        <td>
            <div class="type">any</div>
            <p>Only remove the listeners that have this context.</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>once</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p>Only remove one-time listeners.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setSrc()

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
        <td>
            <div class="type">MediaSource</div>
            <p>Array with multiple sources</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getSrc()

```javascript
player.getSrc(); // ['https://my-url/video.mp4']
```

Return current source of video

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
        </td>
        <td>
            <div class="type">MediaSource</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## play()

```javascript
player.play();
```

Method for starting playback of video

## pause()

```javascript
player.pause();
```

Method for pausing playback of video

## togglePlayback()

```javascript
player.togglePlayback();
```

Method for toggling(play\\pause) playback of video

## isVideoPaused

```javascript
player.play();
console.log(player.isVideoPaused);
```

High level status of video playback. Returns true if playback is paused.
For more advance state use `getCurrentPlaybackState`

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## isVideoEnded

```javascript
player.play();
console.log(player.isVideoEnded);
```

High level status of video playback. Returns true if playback is ended. Also note, that `isPaused` will return `true` if playback is ended also.
For more advance state use `getCurrentPlaybackState`

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## syncWithLive()

```javascript
player.syncWithLive();
```

Method for synchronize current playback with live point. Available only if you playing live source.

## goForward()

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
          <code>sec</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Value in seconds</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## goBackward()

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
          <code>sec</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Value in seconds</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setVolume()

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
          <code>volume</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Volume value <code>0..100</code></p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getVolume()

```javascript
player.getVolume(); // 50
```

Get volume

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## increaseVolume()

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
          <code>value</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Value from 0 to 100</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## decreaseVolume()

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
          <code>value</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Value from 0 to 100</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setMute()

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
          <code>isMuted</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p><code>true</code> to mute the video.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getMute()

```javascript
player.getMute(); // true
```

Get mute flag

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setAutoPlay()

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
          <code>isAutoPlay</code>
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getAutoPlay()

```javascript
player.getAutoPlay(); // true
```

Get autoPlay flag

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setLoop()

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
          <code>isLoop</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p>If <code>true</code> video will be played again after it will finish</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getLoop()

```javascript
player.getLoop(); // true
```

Get loop flag

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setPlaybackRate()

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
          <code>rate</code>
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getPlaybackRate()

Return current playback rate

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setPreload()

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
        <td>
            Possible values are <code>"auto"</code>, <code>"metadata"</code>, <code>"none"</code>.
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getPreload()

```javascript
player.getPreload(); // none
```

Return preload type

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
        </td>
        <td>
            <div class="type">string</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getCurrentTime()

```javascript
player.getCurrentTime(); //  60.139683
```

Return current time of video playback

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## goTo()

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
          <code>time</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Time in seconds</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getDurationTime()

```javascript
player.getDurationTime(); // 180.149745
```

Return duration of video

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getVideoRealWidth()

```javascript
player.getVideoWidth(); // 400
```

Return real width of video from metadata

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getVideoRealHeight()

```javascript
player.getVideoHeight(); // 225
```

Return real height of video from metadata

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
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setPlayInline()

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
          <code>isPlayInline</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p>If <code>false</code> - video will be played in full screen, <code>true</code> - inline</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getPlayInline()

```javascript
player.getPlayInline(); // true
```

Get playInline flag

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getCurrentPlaybackState()

Return current state of playback

## getDebugInfo()

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
    // Available bitrates
    "100000",
    "200000",
    ...
  ],
  // One of available bitrates, that used right now
  "currentBitrate": "100000",
  // Raw estimation of bandwidth, that could be used without playback stall
  "bwEstimate": "120000"
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
        <td>
            <p>Name of current attached stream.</p>
            Possible values are <code>"HLS"</code>, <code>"DASH"</code>, <code>"MP4"</code>, <code>"WEBM"</code>.
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>viewDimensions</code>
        </td>
        <td>
            <div class="type">Object</div>
            <p>Current size of view port provided by engine (right now - actual size of video tag)</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>url</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>Url of current source</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>currentTime</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Current time of playback</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>duration</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Duration of current video</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>loadingStateTimestamps</code>
        </td>
        <td>
            <div class="type">Object</div>
            <p>Object with time spend for different initial phases</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>bitrates</code>
        </td>
        <td>
            <div class="type">Array&#x3C;string></div>
            <p>List of all available bitrates. Internal structure different for different type of streams</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>currentBitrate</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>Current bitrate. Internal structure different for different type of streams</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>bwEstimate</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Estimation of bandwidth</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>overallBufferLength</code>
        </td>
        <td>
            <div class="type">number</div>
            <p>Overall length of buffer</p>
        </td>
      </tr>
      <tr>
        <td class="param">
          <code>nearestBufferSegInfo</code>
        </td>
        <td>
            <div class="type">Object</div>
            <p>Object with start and end for current buffer segment</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## enterFullScreen()

```javascript
player.enterFullScreen();
```

Player would try to enter fullscreen mode.
Behavior of fullscreen mode on different platforms may differ.

## exitFullScreen()

```javascript
player.exitFullScreen();
```

Player would try to exit fullscreen mode.

## isInFullScreen

```javascript
console.log(player.isInFullScreen); // false
```

Return true if player is in full screen

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
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setVideoViewMode()

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
          <code>viewMode</code>
        </td>
        <td>
            <div class="type">ViewMode</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setPoster()

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
          <code>src</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>Source of image</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setControlsShouldAlwaysShow()

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
          <code>flag</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p><code>true</code> for showing always</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setTitle()

```javascript
player.setTitle('Your awesome video title here');
```

> [Live Demo](https://jsfiddle.net/bodia/243k6m0u/)

Display title text over the video. If you want to have clickable title, use `setTitleClickCallback`

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
          <code>title</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>Text for the video title</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setTitleClickCallback()

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
          <code>callback</code>
        </td>
        <td>
            <div class="type">Function</div>
            <p>Your function</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setLogoAlwaysShowFlag()

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
          <code>flag</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p><code>true</code> for showing always</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## hideLogo()

```javascript
player.hideLogo();
```

Method for hidding logo. If you use `setLogoAlwaysShowFlag` or `setControlsShouldAlwaysShow`, logo would automaticaly appear.

## showLogo()

```javascript
player.showLogo();
```

Method for showing logo.

## showPlayControl()

```javascript
player.showPlayControl();
```

Method for showing play control.

## showVolumeControl()

```javascript
player.showVolumeControl();
```

Method for showing volume control.

## showTimeControl()

```javascript
player.showTimeControl();
```

Method for showing time control.

## showFullScreenControl()

```javascript
player.showFullScreenControl();
```

Method for showing full screen control.

## showProgressControl()

```javascript
player.showProgressControl();
```

Method for showing progress control.

## hidePlayControl()

```javascript
player.hidePlayControl();
```

Method for hidding play control.

## hideVolumeControl()

```javascript
player.hideVolumeControl();
```

Method for hidding voluem control.

## hideTimeControl()

```javascript
player.hideTimeControl();
```

Method for hidding time control.

## hideFullScreenControl()

```javascript
player.hideFullScreenControl();
```

Method for hidding full screen control.

## hideProgressControl()

```javascript
player.hideProgressControl();
```

Method for hidding progress control.

## addTimeIndicator()

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
          <code>time</code>
        </td>
        <td>
            <div class="type">number</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## addTimeIndicators()

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
        <td>
            <div class="type">Array&#x3C;number></div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## clearTimeIndicators()

Delete all time indicators from progress bar

## setLogo()

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
          <code>src</code>
        </td>
        <td>
            <div class="type">string</div>
            <p>Source of logo</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setLogoClickCallback()

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
          <code>callback</code>
        </td>
        <td>
            <div class="type">Function</div>
            <p>Your function</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>
