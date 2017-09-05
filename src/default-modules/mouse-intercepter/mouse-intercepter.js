import { UI_EVENTS } from '../../constants/index';


export default class MouseInterceptor {
  static dependencies = ['engine', 'eventEmitter', 'rootContainer'];

  constructor({ eventEmitter, rootContainer, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._rootNode = rootContainer.node;

    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._broadcastMouseEnter = this._broadcastMouseEnter.bind(this);
    this._broadcastMouseMove = this._broadcastMouseMove.bind(this);
    this._broadcastMouseLeave = this._broadcastMouseLeave.bind(this);
  }

  _bindEvents() {
    this._rootNode.addEventListener('mouseenter', this._broadcastMouseEnter);
    this._rootNode.addEventListener('mousemove', this._broadcastMouseMove);
    this._rootNode.addEventListener('mouseleave', this._broadcastMouseLeave);
  }

  _unbindEvents() {
    this._rootNode.removeEventListener('mouseenter', this._broadcastMouseEnter);
    this._rootNode.removeEventListener('mousemove', this._broadcastMouseMove);
    this._rootNode.removeEventListener('mouseleave', this._broadcastMouseLeave);
  }

  _broadcastMouseEnter() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_ENTER_ON_PLAYER_TRIGGERED);
  }

  _broadcastMouseMove() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED);
  }

  _broadcastMouseLeave() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED);
  }

  destroy() {
    this._unbindEvents();

    delete this.config;

    delete this._rootNode;
    delete this._eventEmitter;
    delete this._engine;
  }
}
