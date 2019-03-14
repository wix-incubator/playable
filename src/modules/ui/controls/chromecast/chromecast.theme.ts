import { IThemeConfig } from '../../core/theme/types';

export default {
  chromecastButtonFill: {
    '--disconnected-color': (data: IThemeConfig) => data.color,
  },
};
