enum SessionState {
  NO_SESSION = 'NO_SESSION',
  SESSION_STARTING = 'SESSION_STARTING',
  SESSION_STARTED = 'SESSION_STARTED',
  SESSION_START_FAILED = 'SESSION_START_FAILED',
  SESSION_ENDING = 'SESSION_ENDING',
  SESSION_ENDED = 'SESSION_ENDED',
  SESSION_RESUMED = 'SESSION_RESUMED',
}

enum eventType {
  CAST_STATE_CHANGED = 'caststatechanged',
  SESSION_STATE_CHANGED = 'sessionstatechanged',
}

enum RemotePlayerEventType {
  ANY_CHANGE = 'anyChanged',
  IS_PAUSED_CHANGED = 'isPausedChanged',
}

type PatchedWindow = Window & {
  __onGCastApiAvailable: Function;
};

class Publisher {
  protected _listeners: {
    [key: string]: Function[];
  } = {};

  addEventListener(type: eventType, func: Function) {
    if (!Array.isArray(this._listeners[type])) {
      this._listeners[type] = [];
    }

    this._listeners[type].push(func);
  }

  trigger(type: eventType, event: any) {
    const listeners = this._listeners[type];

    if (listeners) {
      listeners.forEach(l => l(event));
    }
  }
}

class CastContext extends Publisher {
  _estimatedTime: number = 0;

  get list() {
    return this._listeners;
  }

  getCurrentSession() {
    return {
      getMediaSession: () => ({
        getEstimatedTime: () => this._estimatedTime,
      }),
    };
  }

  setOptions() {
    return;
  }
}

class RemotePlayer {
  currentTime: number = 0;
}

class RemotePlayerController extends Publisher {
  player: RemotePlayer;

  constructor(player: RemotePlayer) {
    super();
    this.player = player;
  }

  setVolumeLevel() {
    return;
  }

  seek() {
    return;
  }
}

class CastTestFramework {
  private _context = new CastContext();
  RemotePlayerController = RemotePlayerController;
  RemotePlayer = RemotePlayer;

  trigger(type: eventType, event: any) {
    this._context.trigger(type, event);
  }

  get CastContext() {
    return {
      getInstance: () => this._context,
    };
  }

  get CastContextEventType() {
    return eventType;
  }

  get SessionState() {
    return SessionState;
  }

  get RemotePlayerEventType() {
    return RemotePlayerEventType;
  }

  get context() {
    return this._context;
  }
}

class WindowCastAPIMock {
  framework: CastTestFramework;

  constructor() {
    this.framework = new CastTestFramework();
  }

  static init() {
    const w = window as PatchedWindow;
    if (w && typeof w.__onGCastApiAvailable === 'function') {
      w.__onGCastApiAvailable(true);
    }
  }

  static reset() {
    const w = window as PatchedWindow;
    delete w.__onGCastApiAvailable;
  }
}

class WindowChromeAPIMock {
  get cast() {
    return {
      media: {
        DEFAULT_MEDIA_RECEIVER_APP_ID: 'mock',
      },
      AutoJoinPolicy: {
        ORIGIN_SCOPED: true,
      },
    };
  }
}

export {
  CastTestFramework,
  WindowCastAPIMock,
  WindowChromeAPIMock,
  SessionState,
  eventType,
};
