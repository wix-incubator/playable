<!-- Generated automatically. Update this documentation by updating the source code. -->

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

-   `event` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**
-   `fn` **ListenerFn**
-   `context`

// ... Now callback will be called when some one will pause the video ...
player.on(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);

// ... callback will no longer be called.
player.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);

// ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.
player.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED);
```

-   `event` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**
-   `fn` **ListenerFn**
-   `context`
-   `once` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

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

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

# getDebugInfo

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

### setSrc

**Parameters**

-   `src`

### getSrc

### goLive

### goForward

**Parameters**

-   `sec`

### goBackward

**Parameters**

-   `sec`

### decreaseVolume

**Parameters**

-   `value`

### increaseVolume

**Parameters**

-   `value`

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

**Parameters**

-   `isAutoPlay` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

### getAutoPlay

Get autoPlay flag

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

# setLoop

Set loop flag

**Parameters**

-   `isLoop` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

### getLoop

Get loop flag

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

# setMute

Set mute flag

**Parameters**

-   `isMuted` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

### getMute

Get mute flag

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

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

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

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

-   `rate`

# getPlaybackRate


# setPreload

-   `preload` **(`"auto"` \| `"metadata"` \| `"none"`)**

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


# getPreload

Get preload type

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

# getCurrentTime


# goTo

-   `time`


# getDurationTime


# setPlayInline

-   `isPlayInline` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

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

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

# getCurrentPlaybackState

Return current state of playback


# play


# pause


Returns **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)**


# node

Getter for DOM node with player UI element
(use it only for debug, if you need attach player to your document use <code>attachToElement</code> method)

-   `node` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)**

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

-   `width` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

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

**Parameters**

-   `height` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### getWidth

Get width of player

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

# getHeight

Get height of player

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### setFillAllSpace

**Parameters**

-   `flag`

### setLogoAlwaysShowFlag

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

-   `isShowAlways`

### removeLogo

### setControlsShouldAlwaysShow

**Parameters**

-   `flag`

### setLogo

**Parameters**

-   `url`

### setLogoClickCallback

**Parameters**

-   `callback`

### setLoadingCover

**Parameters**

-   `url`

### setTitle

**Parameters**

-   `title` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### setTitleClickCallback

> [Live Demo](https://jsfiddle.net/kupriyanenko/ao0rg48s/2/)

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

-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)**
