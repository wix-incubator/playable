import { transperentizeColor } from '../../core/theme';

export default {
  progressPlayed: {
    backgroundColor: data => data.progressColor,
    '&:after': {
      backgroundColor: data => data.progressColor,
    },
  },
  progressSeekTo: {
    backgroundColor: data => transperentizeColor(data.progressColor, 0.5),
  },
  progressBackground: {
    backgroundColor: data => transperentizeColor(data.progressColor, 0.25),
  },
  progressSyncBtn: {
    borderColor: data => data.progressColor,
  },
};
