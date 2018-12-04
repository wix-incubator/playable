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

## getElement()

Getter for DOM element with player UI
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
            <div class="type">HTMLElement</div>
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

player.on(Playable.UI_EVENTS.PLAY_CLICK, () => {
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
            <p>The Event name, such as <code>Playable.UI_EVENTS.PLAY_CLICK</code></p>
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
player.on(Playable.UI_EVENTS.PAUSE, callback);

// ... callback will no longer be called.
player.off(Playable.UI_EVENTS.PAUSE, callback);

// ... remove all handlers for event UI_EVENTS.PAUSE.
player.off(Playable.UI_EVENTS.PAUSE);
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
            <p>The Event name, such as <code>Playable.UI_EVENTS.PLAY_CLICK</code></p>
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

## reset()

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

## resetPlayback()

```javascript
player.play();
console.log(player.isPaused); // false
...
player.resetPlayback();
console.log(player.isPaused); // true;
console.log(player.getCurrentTime()); //0;
```

Method for reseting playback of video

## isPaused

```javascript
player.play();
console.log(player.isPaused);
```

High level state of video playback. Returns true if playback is paused.
For more advance state use `getPlaybackState`

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

## isEnded

```javascript
player.play();
console.log(player.isEnded);
```

High level state of video playback. Returns true if playback is ended. Also note, that `isPaused` will return `true` if playback is ended also.
For more advance state use `getPlaybackState`

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

## seekForward()

```javascript
player.seekForward(5);
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

## seekBackward()

```javascript
player.seekBackward(5);
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

## mute()

```javascript
player.mute();
```

Mute the video

## unmute()

```javascript
player.unmute(true);
```

Unmute the video

## isMuted

```javascript
player.mute();
player.isMuted; // true
player.unmute();
player.isMuted: // false
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

## setAutoplay()

```javascript
player.setAutoplay();
```

Set autoplay flag

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
          <code>isAutoplay</code>
        </td>
        <td>
            <div class="type">boolean</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getAutoplay()

```javascript
player.getAutoplay(); // true
```

Get autoplay flag

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

## seekTo()

```javascript
player.seekTo(34);
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

## getDuration()

```javascript
player.getDuration(); // 180.149745
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

## setPlaysinline()

```javascript
player.setPlaysinline(true);
```

Set playsinline flag

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
          <code>isPlaysinline</code>
        </td>
        <td>
            <div class="type">boolean</div>
            <p>If <code>false</code> - video will be played in full screen, <code>true</code> - inline</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getPlaysinline()

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

## setCrossOrigin()

```javascript
player.setCrossOrigin('anonymous');
```

Set crossorigin attribute for video

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
          <code>crossOrigin</code>
        </td>
        <td>
            Possible values are <code>"anonymous"</code>, <code>"use-credentials"</code>.
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getCrossOrigin()

```javascript
player.getCrossOrigin(); // 'anonymous'
```

Get crossorigin attribute value for video

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
            <div class="type">CrossOriginValue</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## getPlaybackState()

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
          <code>viewDimensions</code>
        </td>
        <td>
            <div class="type">Object</div>
            <p>Current size of view port provided by engine (right now - actual size of video tag)</p>
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
    </tbody>
  </table>
</div>

## enableExitFullScreenOnPause()

```javascript
player.play();
player.enableExitFullScreenOnPause();
player.enterFullScreen();
console.log(player.isInFullScreen) // true
player.pause();
console.log(player.isInFullScreen) // false
```

Allow player try to exit full screen on pause

## disableExitFullScreenOnPause()

```javascript
player.play();
player.disableExitFullScreenOnPause();
player.enterFullScreen();
console.log(player.isInFullScreen) // true
player.pause();
console.log(player.isInFullScreen) // true
```

Disallow player to exit full screen on pause

## enableExitFullScreenOnEnd()

```javascript
player.play();
player.enableExitFullScreenOnEnd();
player.enterFullScreen();
console.log(player.isInFullScreen) // true
console.log(player.isEnded); // true
console.log(player.isInFullScreen) // false
```

Allow player try to exit full screen on end

## disableExitFullScreenOnEnd()

```javascript
player.play();
player.disableExitFullScreenOnEnd();
player.enterFullScreen();
console.log(player.isInFullScreen) // true
console.log(player.isEnded); // true
console.log(player.isInFullScreen) // true
```

Disallow player try to exit full screen on end

## enableEnterFullScreenOnPlay()

```javascript
player.enableEnterFullScreenOnPlay();
console.log(player.isInFullScreen) // false
player.play();
console.log(player.isInFullScreen) // true
```

Allow player try to exit full screen on end

## disableEnterFullScreenOnPlay()

```javascript
player.disableEnterFullScreenOnPlay();
console.log(player.isInFullScreen) // false
player.play();
console.log(player.isInFullScreen) // false
```

Disallow player try to exit full screen on end

## enablePauseVideoOnFullScreenExit()

```javascript
player.play();
player.enablePauseVideoOnFullScreenExit();
player.enterFullScreen();
console.log(player.isInFullScreen) // true
player.pause();
console.log(player.isInFullScreen) // false
```

Allow player try to exit full screen on end

## disablePauseVideoOnFullScreenExit()

```javascript
player.play();
player.enablePauseVideoOnFullScreenExit();
player.enterFullScreen();
console.log(player.isInFullScreen) // true
player.pause();
console.log(player.isInFullScreen) // true
```

Disallow player try to exit full screen on end

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

```javascript
player.setVideoViewMode("BLUR");
```

Method for setting video view mode.

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
            <div class="type">VideoViewMode</div>
            <p>Possible values are "REGULAR", "FILL", "BLUR".
With "REGULAR" video tag would try to be fully shown.
With "FILL" video tag would fill all space, removing black lines on sides.
With "BLUR" black lines would be filled with blured pixels from video.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## hideOverlay()

```javascript
player.showOverlay();
```

Method for completely hiding player overlay. It's not gonna appear on initial state of player and when video is ended.

## showOverlay()

```javascript
player.showOverlay();
```

Method for showing player overlay after it was completely hidden with `player.hideOverlay()`.

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

## setMainUIShouldAlwaysShow()

```javascript
player.setMainUIShouldAlwaysShow(true);
```

Method for allowing main ui to be always shown despite the playback state and the cursor position

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

## showTitle()

## hideTitle()

## showLiveIndicator()

## hideLiveIndicator()

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

## setAlwaysShowLogo()

```javascript
player.setAlwaysShowLogo(true);
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

Method for hiding logo. If you use `setAlwaysShowLogo` or `setControlsShouldAlwaysShow`, logo would automaticaly appear.

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

## showDownloadButton()

```javascript
player.showDownloadButton();
```

Method for showing download button.

## hidePlayControl()

```javascript
player.hidePlayControl();
```

Method for hiding play control.

## hideVolumeControl()

```javascript
player.hideVolumeControl();
```

Method for hiding voluem control.

## hideTimeControl()

```javascript
player.hideTimeControl();
```

Method for hiding time control.

## hideFullScreenControl()

```javascript
player.hideFullScreenControl();
```

Method for hiding full screen control.

## hideProgressControl()

```javascript
player.hideProgressControl();
```

Method for hiding progress control.

## hideDownloadButton()

```javascript
player.hideDownloadButton();
```

Method for hiding download button.

## showPreviewOnProgressDrag()

```javascript
player.showPreviewOnProgressDrag();
```

Player will show full screen preview instead of actual seek on video when user drag the progress control

## seekOnProgressDrag()

```javascript
player.seekOnProgressDrag();
```

Player will seek on video when user drag the progress control

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

## setDownloadClickCallback()

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
        </td>
      </tr>
    </tbody>
  </table>
</div>

## setFramesMap()

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
          <code>map</code>
        </td>
        <td>
            <div class="type">IFramesData</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
