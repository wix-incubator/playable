import { StyleSheet, CSSRules } from './style-sheet';

import playerAPI from '../../../../utils/player-api-decorator';


export const defaultThemeConfig = {
  color: '#FFF',
  liveColor: '#ea492e',
};

export interface IThemeConfig {
  color?: string;
}

export default class ThemeService {
  static dependencies = ['themeConfig'];

  private _styleSheet: StyleSheet;

  constructor({ themeConfig }) {
    this._styleSheet = new StyleSheet();

    this._styleSheet.update({
      ...defaultThemeConfig,
      ...themeConfig,
    });

    // setTimeout here is for calling `attach` after all modules resolved
    setTimeout(() => {
      this._styleSheet && this._styleSheet.attach();
    }, 0);
  }

  @playerAPI()
  public updateTheme(themeConfig: IThemeConfig) {
    this._styleSheet.update(themeConfig);
  }

  public registerModuleTheme(module: object, rules: CSSRules) {
    this._styleSheet.registerModuleTheme(module, rules);
  }

  public get(module) {
    return this._styleSheet.classes.get(module);
  }

  destroy() {
    delete this._styleSheet;
  }
}
