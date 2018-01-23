import { StyleSheet } from './style-sheet';

import playerAPI from '../../../../utils/player-api-decorator';

import { IStyles } from '../types';
import { ICSSRules, IThemeConfig } from './types';

const DEFAULT_THEME_CONFIG = {
  color: '#FFF',
  liveColor: '#ea492e',
  progressColor: '#FFF',
};

interface IThemeService {
  updateTheme(IThemeConfig): void;
  registerModuleTheme(module: object, rules: ICSSRules): void;
  get(module: object): IStyles;
  destroy(): void;
}

class ThemeService implements IThemeService {
  static dependencies = ['themeConfig'];

  private _styleSheet: StyleSheet;

  constructor({ themeConfig }) {
    this._styleSheet = new StyleSheet();

    this._styleSheet.update({
      ...DEFAULT_THEME_CONFIG,
      ...themeConfig,
    });

    // setTimeout here is for calling `attach` after all modules resolved
    setTimeout(() => {
      this._styleSheet && this._styleSheet.attach();
    }, 0);
  }

  @playerAPI()
  updateTheme(themeConfig: IThemeConfig) {
    this._styleSheet.update(themeConfig);
  }

  registerModuleTheme(module: object, rules: ICSSRules) {
    this._styleSheet.registerModuleTheme(module, rules);
  }

  get(module) {
    return this._styleSheet.getModuleClassNames(module);
  }

  destroy() {
    delete this._styleSheet;
  }
}

export { DEFAULT_THEME_CONFIG, IThemeService };

export default ThemeService;
