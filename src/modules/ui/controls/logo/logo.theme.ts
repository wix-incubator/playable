import { IThemeConfig } from '../../core/theme/types';

export default {
  logoButtonSvgFill: {
    fill: (data: IThemeConfig) => data.color,
  },
};
