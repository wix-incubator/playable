import { IThemeConfig } from '../../core/theme/types';

export default {
  downloadSvgFill: {
    fill: (data: IThemeConfig) => data.color,
  },
};
