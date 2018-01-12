import Stylable from './stylable';
import { IView, IStyles } from './types';

class View<TStyles = IStyles> extends Stylable<TStyles>
  implements IView<TStyles> {
  protected static _moduleTheme;
  protected _theme;
  protected _themeClasses;

  constructor(theme?) {
    super();
    //had to use `as any` because TS can't work with child static fields
    const moduleTheme = (this.constructor as any)._moduleTheme;
    if (theme && moduleTheme) {
      theme.registerModuleTheme(this, moduleTheme);
      this._themeClasses = theme.classes.get(this);
    }
  }
}

export default View;
