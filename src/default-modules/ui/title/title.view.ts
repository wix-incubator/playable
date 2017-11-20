import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './title.scss';


const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_VALUE = 'video-title';

class TitleView extends View {
  private _callbacks;

  $node;
  $title;

  constructor(config) {
    super(config);

    const { callbacks } = config;

    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: this.styleNames.wrapper,
    });

    this.$title = $('<span>', {
      class: this.styleNames.title,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_VALUE,
    });

    this.$node.append(this.$title);

    this._bindEvents();
  }

  _bindEvents() {
    this.$title[0].addEventListener('click', this._callbacks.onClick);
  }

  _unbindEvents() {
    this.$title[0].removeEventListener('click', this._callbacks.onClick);
  }

  setDisplayAsLink(flag) {
    this.$title.toggleClass(this.styleNames.link, flag);
  }

  setTitle(title?) {
    if (title) {
      this.show();
      this.$title.html(title);
    } else {
      this.hide();
    }
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}

TitleView.extendStyleNames(styles);

export default TitleView;
