const player = VideoPlayer.create({
  size: {
    width: 800,
    height: 450
  },
  src: 'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
  overlay: false
});

player.attachToElement(document.getElementById('content'));
player.setTitle('Your awesome video title here');
