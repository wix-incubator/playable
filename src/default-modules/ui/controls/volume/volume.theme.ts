import { transperentize } from '../../../../theme/style-sheet';

export default {
  svgFill: {
    fill: data => data.color,
  },
  svgStroke: {
    stroke: data => data.color,
  },
  volumeProgress: {
    backgroundColor: data => data.color,
    '&:after': {
      backgroundColor: data => data.color,
    },
  },
  volumeProgressBackground: {
    backgroundColor: data => transperentize(data.color, 0.25),
  },
};
