import { IThemeConfig } from '../../core/theme/types';

import { transperentizeColor } from '../../core/theme';

export default {
  progressPlayed: {
    backgroundColor: (data: IThemeConfig) => data.progressColor,
  },
  progressSeekTo: {
    backgroundColor: (data: IThemeConfig) =>
      transperentizeColor(data.progressColor, 0.5),
  },
  progressSeekBtn: {
    backgroundColor: (data: IThemeConfig) => data.progressColor,
  },
};
