import { IThemeConfig } from '../../core/theme/types';

export default {
  fullScreenSvgFill: {
    fill: (data: IThemeConfig) => data.color,
  },
};
