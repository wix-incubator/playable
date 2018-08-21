import { IThemeConfig } from '../core/theme/types';

export default {
  overlayPlaySvgFill: {
    fill: (data: IThemeConfig) => data.color,
  },
  overlayPlaySvgStroke: {
    stroke: (data: IThemeConfig) => data.color,
  },
};
