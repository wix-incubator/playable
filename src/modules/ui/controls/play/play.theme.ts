import { IThemeConfig } from '../../core/theme/types';

export default {
  playSvgFill: {
    fill: (data: IThemeConfig) => data.color,
  },
};
