import * as classnames from 'classnames';
import { IStyles } from './types';

function extendStyles(sourceStyles: IStyles, partialStyles: IStyles) {
  const styles = {
    ...sourceStyles,
  };

  Object.keys(partialStyles).forEach(styleName => {
    styles[styleName] = styles[styleName]
      ? classnames(styles[styleName], partialStyles[styleName])
      : partialStyles[styleName];
  });

  return styles;
}

export default extendStyles;
