# on

```javascript
player.on(VideoPlayer.UI_EVENTS.PLAY_TRIGGERED, () => {
  // Will be executed after you will click on play button
});

// To supply a context value for `this` when the callback is invoked,
// pass the optional context argument
player.on(VideoPlayer.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
```

Method for adding listeners of events inside player.
You can check all events inside <code>VideoPlayer.UI_EVENTS</code> and <code>VideoPlayer.VIDEO_EVENTS</code>

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
        <td>The Event name, such as <code>VideoPlayer.UI_EVENTS.PLAY_TRIGGERED</code></td>
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


# off

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
        <td>The Event name, such as <code>VideoPlayer.UI_EVENTS.PLAY_TRIGGERED</code></td>
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


# enterFullScreen

Manual enter full screen


# exitFullScreen

Manual exit full screen


# isInFullScreen

Return true if player is in full screen


# getDebugInfo

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
          <code>type</code><span class="type">string</span class="type">
        </td>
        <td>Name of current attached stream (HLS, DASH, MP4, WEBM)</td>
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


# setSrc

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getSrc


# goLive


# goForward

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# goBackward

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# decreaseVolume

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# increaseVolume

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setAutoPlay

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


# getAutoPlay

Get autoPlay flag


# setLoop

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getLoop

Get loop flag


# setMute

Set mute flag

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getMute

Get mute flag


# setVolume

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


# getVolume

Get volume


# setPlaybackRate

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getPlaybackRate


# setPreload

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
        <td>Possible values are <code>auto</code>, <code>metadata</code>, <code>none</code>.</td>
      </tr>
    </tbody>
  </table>
</div>


# getPreload

Get preload type


# getCurrentTime


# goTo

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getDurationTime


# setPlayInline

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getPlayInline

Get playInline flag


# getCurrentPlaybackState

Return current state of playback


# play


# pause


# togglePlayback


# node

Getter for DOM node with player UI element
(use it only for debug, if you need attach player to your document use <code>attachToElement</code> method)


# attachToElement

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = { src: 'http://my-url/video.mp4' }
  const player = VideoPlayer.create(config);

  player.attachToElement(document.getElementById('content'));
});
```

Method for attaching player node to your container

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


# hide

Hide whole ui


# show

Show whole ui


# setWidth

Set width of player

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setHeight

Set height of player

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# getWidth

Get width of player


# getHeight

Get height of player


# setFillAllSpace

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setLogo

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
          <code>logo</code>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setLogoAlwaysShowFlag

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
          <code>isShowAlways</code>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setLogoClickCallback

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# removeLogo


# setControlsShouldAlwaysShow

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setLoadingCover

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
          <code>url</code>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setTitle

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>


# setTitleClickCallback

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
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

