import { IThemeConfig } from '../core/theme/types';

export default {
  titleText: {
    color: (data: IThemeConfig) => data.color,
  },
};
