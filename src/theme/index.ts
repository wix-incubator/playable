import { StyleSheet } from './style-sheet';

export const defaultThemeConfig = {
  color: '#FFF',
  liveColor: '#ea492e',
};

export interface IThemeConfig {
  color?: string;
}

export function createStyleSheet(config: IThemeConfig = {}) {
  const styleSheet = new StyleSheet();

  styleSheet.update({
    ...defaultThemeConfig,
    ...config,
  });

  return styleSheet;
}
