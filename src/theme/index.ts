import * as merge from 'lodash/merge';
import { StyleSheet } from './style-sheet';

export const defaultThemeConfig = {
  color: '#F00',
};

export interface ThemeConfig {
  color?: string;
}

export function createStyleSheet(config: ThemeConfig = {}) {
  const styleSheet = new StyleSheet({
    svgStyle: {
      fill: data => data.color,
      stroke: data => data.color,
    },
  });

  styleSheet.update(merge(defaultThemeConfig, config));

  return styleSheet;
}
