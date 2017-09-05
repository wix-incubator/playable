import 'jsdom-global/register';
import { expect } from 'chai';

import {
  getAnomalyBloodhoundConfig,
  getEngineConfig,
  getFullScreenManagerConfig,
  getTextMapConfig,
  getUIConfig,
  getKeyboardInterceptorConfig,
  convertUIConfigForIOS,
  convertUIConfigForAndroid
} from './config-mapper';

describe('getKeyboardInterceptorConfig function', () => {
  beforeEach(() => {
    Reflect.defineProperty(navigator, 'userAgent', {
      ...Reflect.getOwnPropertyDescriptor(navigator.constructor.prototype, 'userAgent'),
      get: function() { return this.____navigator },
      set: function(v) { this.____navigator = v; }
    });
  });
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'userAgent');
  });

  it('should return config in proper format', () => {
    const params = {
      disableControlWithKeyboard: false
    };

    expect(getKeyboardInterceptorConfig(params)).to.be.deep.equal({
      disabled: params.disableControlWithKeyboard
    });

    navigator.userAgent = 'iPod';

    expect(getKeyboardInterceptorConfig(params)).to.be.deep.equal({
      disabled: true
    });

    navigator.userAgent = 'iPad';

    expect(getKeyboardInterceptorConfig(params)).to.be.deep.equal({
      disabled: true
    });

    navigator.userAgent = 'iPhone';

    expect(getKeyboardInterceptorConfig(params)).to.be.deep.equal({
      disabled: true
    });

    navigator.userAgent = 'Android';

    expect(getKeyboardInterceptorConfig(params)).to.be.deep.equal({
      disabled: true
    });

    navigator.userAgent = 'Computer';

    expect(getKeyboardInterceptorConfig(params)).to.be.deep.equal({
      disabled: params.disableControlWithKeyboard
    });
  });
});

describe('getAnomalyBloodhoundConfig function', () => {
  it('should return config in proper format', () => {
    const params = {
      logger: () => {}
    };

    expect(getAnomalyBloodhoundConfig(params)).to.be.equal(params.logger);
  });
});

describe('getTextMapConfig function', () => {
  it('should return config in proper format', () => {
    const params = {
      texts: {
        text: "TEXT"
      }
    };

    expect(getTextMapConfig(params)).to.be.equal(params.texts);
  });

  it('should return empty object if nothing pass passed', () => {
    const params = {};
    expect(getTextMapConfig(params)).to.be.deep.equal({});
  });
});

describe('getEngineConfig function', () => {
  it('should return config in proper format', () => {
    const params = {
      preload: 'auto',
      autoPlay: false,
      loop: true,
      muted: true,
      volume: 40,
      src: 'kek',
      playInline: false,
      additionalParameter: 'WOW'
    };

    expect(getEngineConfig(params)).to.be.deep.equal({
      preload: 'auto',
      autoPlay: false,
      loop: true,
      muted: true,
      volume: 40,
      src: 'kek',
      playInline: false
    });
  })
});

describe('getFullScreenManagerConfig function', () => {
  it('should return config in proper format', () => {
    const params = {
      disableFullScreen: false,
      exitFullScreenOnEnd: true,
      enterFullScreenOnPlay: null,
      exitFullScreenOnPause: {},
      pauseVideoOnFullScreenExit: 0
    };

    expect(getFullScreenManagerConfig(params)).to.be.deep.equal({
      disabled: false,
      exitOnEnd: true,
      enterOnPlay: false,
      exitOnPause: true,
      pauseOnExit: false
    });
  })
});


describe('convertUIConfigForIOS function', () => {
  it('should return converted config', () => {
    const config = {
      additionalParameter: 'additionalParameter',
      loader: true,
      controls: true,
      screen: {
        someParameter: 'someParameter'
      }
    };

    expect(convertUIConfigForIOS(config)).to.be.deep.equal({
      additionalParameter: 'additionalParameter',
      loader: false,
      controls: false,
      screen: {
        someParameter: 'someParameter',
        indicateScreenClick: false,
        disableClickProcessing: true,
        nativeControls: true
      }
    });
  })
});

describe('convertUIConfigForAndroid function', () => {
  it('should return converted config', () => {
    const config = {
      additionalParameter: 'additionalParameter',
      loader: true,
      controls: true,
      screen: {
        someParameter: 'someParameter'
      }
    };

    expect(convertUIConfigForAndroid(config)).to.be.deep.equal({
      additionalParameter: 'additionalParameter',
      loader: true,
      controls: true,
      screen: {
        someParameter: 'someParameter',
        disableClickProcessing: true
      }
    });
  })
});


describe('getUIConfig function', () => {
  beforeEach(() => {
    Reflect.defineProperty(navigator, 'userAgent', {
        ...Reflect.getOwnPropertyDescriptor(navigator.constructor.prototype, 'userAgent'),
        get: function() { return this.____navigator },
        set: function(v) { this.____navigator = v; }
      });
  });
  afterEach(() => {
     Reflect.deleteProperty(navigator, 'userAgent');
  });

  it('should return config in proper format', () => {
    navigator.userAgent = 'Computer';
    const params = {
      size: {
        width: 10,
        height: 20
      },
      controls: false,
      additionalParameter: 'WOW'
    };

    expect(getUIConfig(params)).to.be.deep.equal({
      width: 10,
      height: 20,
      controls: false
    });
  });

  it('should convert config if iOS', () => {
    navigator.userAgent = 'iPhone';

    const params = {
      size: {
        width: 10,
        height: 20
      }
    };

    const expectedConfig = {
      width: 10,
      height: 20,
      loader: false,
      controls: false,
      screen: {
        indicateScreenClick: false,
        disableClickProcessing: true,
        nativeControls: true
      }
    };

    expect(getUIConfig(params)).to.be.deep.equal(expectedConfig);

    navigator.userAgent = 'iPod';

    expect(getUIConfig(params)).to.be.deep.equal(expectedConfig);

    navigator.userAgent = 'iPad';

    expect(getUIConfig(params)).to.be.deep.equal(expectedConfig);
  });

  it('should convert config if Android', () => {
    navigator.userAgent = 'Android';

    const params = {
      size: {
        width: 10,
        height: 20
      }
    };

    expect(getUIConfig(params)).to.be.deep.equal({
      width: 10,
      height: 20,
      screen: {
        disableClickProcessing: true
      }
    });
  })
});

