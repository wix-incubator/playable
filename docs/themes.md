---
title: "Themes"
layout: simple
---

# Themes

We added ability to customize some UI elements. You pass object with theme configuration as second parameret to [Playable.create](/player-config) or you can call method [player.updateTheme](/api#updatetheme) on instance of Playable player.

```javascript
const config = {
  width: 160,
  height: 90
}

const theme = {
  progressColor: "#aaa"
}

const player = Playable.create(config, theme);

// ...

player.updateTheme({
  progressColor: "#faa"
});
```

Right now we support such parameters:

```javascript
theme: {
  liveColor: '#ea492e', // color of progress bar in live mode
  progressColor: '#fff' // color of progress bar in default mode
}
```

You can play with demo [here](https://jsfiddle.net/OleksiiMakodzeba/xxy5eveb/)
