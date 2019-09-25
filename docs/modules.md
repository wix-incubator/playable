---
title: "Player modules"
---

# Modules

Playable is a highly expandable product. By default, it is shipped with certain included features. Anyway, basic functionality can be extended using a built-in modular system.

## Module connection
```javascript
import Playabale from 'playable';
import Module from 'playable/dist/modules/my-module';

// include module before creating instance of player
Playable.registerModule('myModule', Module);
// ...
const player = Playable.create(config, theme);
// ...
```
Like in the case with  [playback adapters](/adapters) there are two ways to add modules: via bundle or using `import`.
<br /> // TODO: example with bundle;

## API
Module can extend players API, add new methods, events, etc.

# Available modules

## Chromecast
Chomecast module is an extension that connects playable to cast video files to google chromecast, SmartTV or compatible devices using google chrome browser API.
If there is a device suitable device in your network and browser is able to start. Уou should see a corresponding control in a bottom panel of the player.
### Add module
```javascript
import Playabale from 'playable';
import ChromecastManager from 'playable/dist/modules/chromecast-manager';
import ChromecastButton from 'playable/dist/statics/modules/ui/controls/chromecast';

Playable.registerModule('chromecastManager', ChromecastManager);
Playable.registerModule('chromecastButton', ChromecastButton);
// ...
const player = Playable.create(config, theme);
// ...
```
To enable chromecast to a player you should connect 2 modules. `Button` for UI and `Manager` for communications with browser API.

### Methods

### setChromecaststButtonCallback()
```javascript
player.setChromecastButtonCallback(() => doStaff());
```
Set callback on chromecast button click

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

### Chromecast Events
```javascript
import {ChromecastEvents} from 'playable/dist/modules/chromecast-manager';

player.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => doStaff());
```
`Chromecast.CHROMECAST_INITED` - Chromecast module initialized.<br/>
`Chromecast.CHROMECAST_NOT_CONNECTED` - Not connected to device. Fires after initialized if connection was not resumed <br/>
`Chromecast.CHROMECAST_CONNECTING` - Connecting to device<br/>
`Chromecast.CHROMECAST_CONNECTED` - Connected to device<br/>
`Chromecast.CHROMECAST_CASTS_STARTED` – Casting to device started.<br/>
`Chromecast.CHROMECAST_CASTS_RESUMED` – Casting session resumed (for example when the browser tab was reloaded).<br/>
`Chromecast.CHROMECAST_CASTS_STOPED` – Casting to device stopped. <br/>


## Create your own module
Yes, it is coming soon. For now try to build one by example. Check the [repo](https://github.com/wix/playable)
