### Video Events

`VIDEO_EVENTS.ERROR` - Error occured. You can check all errors [below](#errors).<br/>

`VIDEO_EVENTS.STATE_CHANGED` - Playback state changed. You can check all states [below](#playback-states).<br/>
`VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED` - Live stream ended. Use `VIDEO_EVENTS.LIVE_STATE_CHANGED` for more live states.<br/>
`VIDEO_EVENTS.LIVE_STATE_CHANGED` - Live video state changed. You can check all states [below](#live-states).<br/>

`VIDEO_EVENTS.CHUNK_LOADED` - Chunk of video loaded.

`VIDEO_EVENTS.CURRENT_TIME_UPDATED` - Updated current time of playback.<br/>
`VIDEO_EVENTS.DURATION_UPDATED` - Duration of video updated.<br/>

`VIDEO_EVENTS.VOLUME_CHANGED` - Volume changed.<br/>
`VIDEO_EVENTS.MUTE_CHANGED` - Video muted or unmuted.<br/>
`VIDEO_EVENTS.SOUND_STATE_CHANGED` - Sound state changed. It will emit on both volume changes or muted\unmute.<br/>

`VIDEO_EVENTS.SEEK_IN_PROGRESS` - Triggers when video tag processing seek.<br/>

`VIDEO_EVENTS.UPLOAD_STALLED` - Upload stalled for some reason.<br/>
`VIDEO_EVENTS.UPLOAD_SUSPEND` - Upload suspended for some reason.<br/>

`VIDEO_EVENTS.PLAY_REQUEST` - Player was requested for play.<br/>
`VIDEO_EVENTS.PLAY_ABORTED` - Player aborted play request.<br/>
`VIDEO_EVENTS.RESET` - Triggers when player reseting playback.<br/>
