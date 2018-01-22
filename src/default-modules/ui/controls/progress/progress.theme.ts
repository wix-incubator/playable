import { transperentizeColor } from '../../core/theme';

export default {
  progressPlayed: {
    backgroundColor: data => data.color,
    '&:after': {
      backgroundColor: data => data.color,
    },
  },
  progressSeekTo: {
    backgroundColor: data => transperentizeColor(data.color, 0.5),
  },
  progressBackground: {
    backgroundColor: data => transperentizeColor(data.color, 0.25),
  },
  progressSyncBtn: {
    borderColor: data => data.color,
  },
};
