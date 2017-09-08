import $ from 'jbone';

import View from '../ui/core/view';

import styles from './debug-panel.scss';


function syntaxHighlight(json, styleNames) {
  json = json.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    match => {
      let cls = styleNames.number;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = styleNames.key;
        } else {
          cls = styleNames.string;
        }
      } else if (/true|false/.test(match)) {
        cls = styleNames.boolean;
      } else if (/null/.test(match)) {
        cls = styleNames.null;
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

class DebugPanelView extends View {
  constructor(config) {
    super(config);
    this.config = config;

    this.$node = $('<div>', {
      class: this.styleNames['video-player-debug-panel']
    });

    this.$infoContainer = $('<pre>', {
      class: this.styleNames['info-container']
    });

    this.$close = $('<div>', {
      class: this.styleNames['close-button']
    });
    this.$close.html('x');

    this.$node
      .append(this.$close)
      .append(this.$infoContainer);

    this._bindCallbacks();
    this._bindEvents();
  }

  _onCloseClick(e) {
    e.stopPropagation();
    this.config.callbacks.onCloseButtonClick();
  }

  _bindCallbacks() {
    this._onCloseClick = this._onCloseClick.bind(this);
  }

  _bindEvents() {
    this.$close[0].addEventListener('click', this.config.callbacks.onCloseButtonClick);
  }

  _unbindEvents() {
    this.$close[0].removeEventListener('click', this.config.callbacks.onCloseButtonClick);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  setInfo(info) {
    this.$infoContainer.html(syntaxHighlight(JSON.stringify(info, undefined, 4), this.styleNames));
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

DebugPanelView.extendStyleNames(styles);

export default DebugPanelView;
