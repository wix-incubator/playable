import { transperentizeColor } from '../../core/theme';

export default {
  volumeSvgFill: {
    fill: (data: any) => data.color,
  },
  volumeSvgStroke: {
    stroke: (data: any) => data.color,
  },
  volumeProgress: {
    backgroundColor: (data: any) => data.color,
    '&:after': {
      backgroundColor: (data: any) => data.color,
    },
  },
  volumeProgressBackground: {
    backgroundColor: (data: any) => transperentizeColor(data.color, 0.25),
  },
};
