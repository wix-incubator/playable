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
  progressBackground: {
    backgroundColor: (data: IThemeConfig) =>
      transperentizeColor(data.progressColor, 0.25),
  },
  progressSeekBtn: {
    backgroundColor: (data: IThemeConfig) => data.progressColor,
  },
  progressSyncBtn: {
    borderColor: (data: IThemeConfig) => data.progressColor,
  },
};
