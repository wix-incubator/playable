import extendStyles from './extendStyles';

class Stylable<TStyles = Playable.IStyles>
  implements Playable.IStylable<TStyles> {
  private static _moduleTheme: Playable.ICSSRules;
  private static _styles: Playable.IStyles = {};

  private _themeStyles: Playable.IStyles = {};

  constructor(theme?: Playable.IThemeService) {
    const moduleTheme = (<typeof Stylable>this.constructor)._moduleTheme;
    if (theme && moduleTheme) {
      theme.registerModuleTheme(this, moduleTheme);
      this._themeStyles = theme.get(this);
    }
  }

  static setTheme(theme: Playable.ICSSRules) {
    this._moduleTheme = theme;
  }

  static extendStyleNames(styles: Playable.IStyles) {
    this._styles = extendStyles(this._styles, styles);
  }

  static resetStyles() {
    this._styles = {};
  }

  get themeStyles(): Playable.IStyles {
    return this._themeStyles;
  }

  get styleNames(): TStyles {
    // NOTE: TS does not work with instance static fields + generic type
    return (this.constructor as any)._styles || {};
  }
}

export default Stylable;
