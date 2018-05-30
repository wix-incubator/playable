import { transperentizeColor } from '../../core/theme';

export default {
  progressPlayed: {
    backgroundColor: (data: any) => data.progressColor,
  },
  progressSeekTo: {
    backgroundColor: (data: any) =>
      transperentizeColor(data.progressColor, 0.5),
  },
  progressBackground: {
    backgroundColor: (data: any) =>
      transperentizeColor(data.progressColor, 0.25),
  },
  progressSeekBtn: {
    backgroundColor: (data: any) => data.progressColor,
  },
  progressSyncBtn: {
    borderColor: (data: any) => data.progressColor,
  },
};
