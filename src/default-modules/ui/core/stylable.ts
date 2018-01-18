import extendStyles from './extendStyles';
import { IStyles, IStylable } from './types';

class Stylable<TStyles = IStyles> implements IStylable<TStyles> {
  private static _moduleTheme;
  private static _styles: IStyles = {};

  private _themeStyles: IStyles = {};

  constructor(theme?) {
    const moduleTheme = (<typeof Stylable>this.constructor)._moduleTheme;
    if (theme && moduleTheme) {
      theme.registerModuleTheme(this, moduleTheme);
      this._themeStyles = theme.classes.get(this);
    }
  }

  static setTheme(theme) {
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
