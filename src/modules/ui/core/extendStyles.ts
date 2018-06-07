//@ts-ignore
import classnames from 'classnames';

function extendStyles(
  sourceStyles: Playable.IStyles,
  partialStyles: Playable.IStyles,
) {
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
