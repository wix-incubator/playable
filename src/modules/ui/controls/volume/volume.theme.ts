import { IThemeConfig } from '../../core/theme/types';

import { transperentizeColor } from '../../core/theme';

export default {
  volumeSvgFill: {
    fill: (data: IThemeConfig) => data.color,
  },
  volumeSvgStroke: {
    stroke: (data: IThemeConfig) => data.color,
  },
  volumeProgress: {
    backgroundColor: (data: IThemeConfig) => data.color,
    '&:after': {
      backgroundColor: (data: IThemeConfig) => data.color,
    },
  },
  volumeProgressBackground: {
    backgroundColor: (data: IThemeConfig) =>
      transperentizeColor(data.color, 0.25),
  },
};
