import { StyleSheet } from './style-sheet';

import playerAPI from '../../../../core/player-api-decorator';

import { IThemeAPI, IThemeService, ICSSRules, IThemeConfig } from './types';

const DEFAULT_THEME_CONFIG = {
  color: '#FFF',
  liveColor: '#ea492e',
  progressColor: '#FFF',
};

class ThemeService implements IThemeService {
  static moduleName = 'theme';
  static dependencies = ['themeConfig'];

  private _styleSheet: StyleSheet;

  constructor({ themeConfig }: { themeConfig: IThemeConfig }) {
    this._styleSheet = new StyleSheet();

    this._styleSheet.update({
      ...DEFAULT_THEME_CONFIG,
      ...themeConfig,
    });

    // setTimeout here is for calling `attach` after all modules resolved.
    window.setTimeout(() => {
      this._styleSheet && this._styleSheet.attach();
    }, 0);
  }

  /**
   * Method for setting theme for player instance
   *
   * @example
   * player.updateTheme({
   *   progressColor: "#AEAD22"
   * })
   * @note
   *
   * You can check info about theming [here](/themes)
   *
   * @param themeConfig - Theme config
   *
   */
  @playerAPI()
  updateTheme(themeConfig: IThemeConfig) {
    this._styleSheet.update(themeConfig);
  }

  registerModuleTheme(module: object, rules: ICSSRules) {
    this._styleSheet.registerModuleTheme(module, rules);
  }

  get(module: any) {
    return this._styleSheet.getModuleClassNames(module);
  }

  destroy() {
    this._styleSheet = null;
  }
}

export { DEFAULT_THEME_CONFIG, IThemeService, IThemeAPI };

export default ThemeService;
