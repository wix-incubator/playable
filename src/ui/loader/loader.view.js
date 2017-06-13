import $ from 'jbone';

import styles from './loader.scss';


export default class LoaderView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor() {
    this.$node = $('<div>', {
      class: this.styleNames.loader
    });
  }

  get styleNames() {
    return this.constructor._styles;
  }

  getNode() {
    return this.$node[0];
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}
