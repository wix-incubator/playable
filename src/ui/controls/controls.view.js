import $ from 'jbone';

import ControlsWrapperView from './wrapper/wrapper.view';

import styles from './controls.scss';


export default class ControlsView {
  constructor({ callbacks, controlsWrapperView }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['controls-block'],
      tabIndex: 0
    });

    this._generateControlsWrapper(controlsWrapperView);

    this._bindEvents();
  }

  _generateControlsWrapper(view) {
    if (view) {
      this.controlsWrapperView = new view();
    } else {
      this.controlsWrapperView = new ControlsWrapperView();
    }
    this.$controlsWrapperViewNode = $(this.controlsWrapperView.getNode());
    this.$node.append(this.$controlsWrapperViewNode);
  }

  _bindEvents() {
    this.$node.on('click', this._callbacks.onWrapperMouseClick);
    this.$node.on('keypress', this._callbacks.onWrapperKeyPress);
    this.$node.on('mousemove', this._callbacks.onWrapperMouseMove);
    this.$node.on('mouseleave', this._callbacks.onWrapperMouseOut);

    this.$controlsWrapperViewNode.on('click', this._callbacks.onControlsBlockMouseClick);
    this.$controlsWrapperViewNode.on('mousemove', this._callbacks.onControlsBlockMouseMove);
    this.$controlsWrapperViewNode.on('mouseleave', this._callbacks.onControlsBlockMouseOut);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  appendControlNode(node) {
    this.controlsWrapperView.appendControlNode(node);
  }

  showControlsBlock() {
    this.controlsWrapperView.show();
  }

  hideControlsBlock() {
    this.controlsWrapperView.hide();
  }

  _unbindEvents() {
    this.$node.off('click', this._callbacks.onWrapperMouseClick);
    this.$node.off('keypress', this._callbacks.onWrapperKeyPress);
    this.$node.off('mousemove', this._callbacks.onWrapperMouseMove);
    this.$node.off('mouseleave', this._callbacks.onWrapperMouseOut);

    this.$controlsWrapperViewNode.off('click', this._callbacks.onControlsBlockMouseClick);
    this.$controlsWrapperViewNode.off('mousemove', this._callbacks.onControlsBlockMouseMove);
    this.$controlsWrapperViewNode.off('mouseleave', this._callbacks.onControlsBlockMouseOut);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    this.controlsWrapperView.destroy();
    delete this.controlsWrapperView;

    delete this.$controlsContainer;

    delete this.$node;
  }
}
