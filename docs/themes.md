---
title: "Themes"
layout: simple
---

# Themes

We added ability to customize some UI elements. You pass object with theme configuration as second parameret to `Playable.create`
or you can call method `player.updateTheme` on instance of Playable player.

```javascript
  const config = {
    size: {
      width: 160,
      height: 90
    }
  }

  const theme1 = {
    progressColor: "#AAA"
  }

  const player = Playable.create(config, theme1);

  ...

  const theme2 = {
    progressColor: "#FAA"
  }

  player.updateTheme(theme2);
```

Right now we support such parameters:

```javascript
theme: {
  liveColor: '#ea492e', // color of progress bar in live mode
  progressColor: '#FFF' // color of progress bar in default mode
}
```

You can play with demo [here](https://jsfiddle.net/OleksiiMakodzeba/kuobtb0o/5/)
