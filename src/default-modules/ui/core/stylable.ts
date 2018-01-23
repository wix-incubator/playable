import extendStyles from './extendStyles';
import { IThemeService, ICSSRules } from './theme';
import { IStyles, IStylable } from './types';

class Stylable<TStyles = IStyles> implements IStylable<TStyles> {
  private static _moduleTheme: ICSSRules;
  private static _styles: IStyles = {};

  private _themeStyles: IStyles = {};

  constructor(theme?: IThemeService) {
    const moduleTheme = (<typeof Stylable>this.constructor)._moduleTheme;
    if (theme && moduleTheme) {
      theme.registerModuleTheme(this, moduleTheme);
      this._themeStyles = theme.get(this);
    }
  }

  static setTheme(theme: ICSSRules) {
    this._moduleTheme = theme;
  }

  static extendStyleNames(styles: IStyles) {
    this._styles = extendStyles(this._styles, styles);
  }

  static resetStyles() {
    this._styles = {};
  }

  get themeStyles(): IStyles {
    return this._themeStyles;
  }

  get styleNames(): TStyles {
    // NOTE: TS does not work with instance static fields + generic type
    return (this.constructor as any)._styles || {};
  }
}

export default Stylable;
