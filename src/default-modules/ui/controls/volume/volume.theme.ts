import { transperentizeColor } from '../../core/theme';

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
    backgroundColor: data => transperentizeColor(data.color, 0.25),
  },
};
