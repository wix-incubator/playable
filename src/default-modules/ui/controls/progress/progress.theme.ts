import { transperentize } from '../../core/theme/style-sheet';

export default {
  progressPlayed: {
    backgroundColor: data => data.color,
    '&:after': {
      backgroundColor: data => data.color,
    },
  },
  progressSeekTo: {
    backgroundColor: data => transperentize(data.color, 0.5),
  },
  progressBackground: {
    backgroundColor: data => transperentize(data.color, 0.25),
  },
  progressSyncBtn: {
    borderColor: data => data.color,
  },
};
