import extendStyles from './extendStyles';
import { IStyles, IStylable } from './types';

class Stylable<TStyles = IStyles> implements IStylable<TStyles> {
  private static _styles: IStyles;

  static extendStyleNames(styles: IStyles) {
    this._styles = extendStyles(this._styles || {}, styles);
  }

  static resetStyles() {
    this._styles = {};
  }

  get styleNames(): TStyles {
    return (this.constructor as any)._styles || {};
  }
}

export default Stylable;
