import $ from 'jbone';

import ControlsWrapperView from './wrapper/wrapper.view';

import styles from './controls.scss';


export default class ControlsView {
  constructor({ callbacks, controlsWrapperView, ui }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['controls-block'],
      tabIndex: 0
    });

    this._ui = ui;

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
    const node = this._ui.node;

    node.addEventListener('mousemove', this._callbacks.onWrapperMouseMove);
    node.addEventListener('mouseleave', this._callbacks.onWrapperMouseOut);

    if (this.controlsWrapperView instanceof ControlsWrapperView) {
      this.controlsWrapperView.$controlsContainer.on('click', this._callbacks.onControlsBlockMouseClick);
      this.controlsWrapperView.$controlsContainer.on('mousemove', this._callbacks.onControlsBlockMouseMove);
      this.controlsWrapperView.$controlsContainer.on('mouseleave', this._callbacks.onControlsBlockMouseOut);
    } else {
      this.$controlsWrapperViewNode.on('click', this._callbacks.onControlsBlockMouseClick);
      this.$controlsWrapperViewNode.on('mousemove', this._callbacks.onControlsBlockMouseMove);
      this.$controlsWrapperViewNode.on('mouseleave', this._callbacks.onControlsBlockMouseOut);
    }
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
    const node = this._ui.node;

    node.removeEventListener('mousemove', this._callbacks.onWrapperMouseMove);
    node.removeEventListener('mouseleave', this._callbacks.onWrapperMouseOut);

    if (this.controlsWrapperView instanceof ControlsWrapperView) {
      this.controlsWrapperView.$controlsContainer.off('click', this._callbacks.onControlsBlockMouseClick);
      this.controlsWrapperView.$controlsContainer.off('mousemove', this._callbacks.onControlsBlockMouseMove);
      this.controlsWrapperView.$controlsContainer.off('mouseleave', this._callbacks.onControlsBlockMouseOut);
    } else {
      this.$controlsWrapperViewNode.off('click', this._callbacks.onControlsBlockMouseClick);
      this.$controlsWrapperViewNode.off('mousemove', this._callbacks.onControlsBlockMouseMove);
      this.$controlsWrapperViewNode.off('mouseleave', this._callbacks.onControlsBlockMouseOut);
    }
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this._ui;

    this.controlsWrapperView.destroy();
    delete this.controlsWrapperView;

    delete this.$controlsContainer;

    delete this.$node;
  }
}
