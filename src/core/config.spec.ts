import 'jsdom-global/register';
import { expect } from 'chai';

import convertToDeviceRelatedConfig from './config';

declare const navigator: any;

describe('getUIConfig function', () => {
  beforeEach(() => {
    Reflect.defineProperty(navigator, 'userAgent', {
      ...Reflect.getOwnPropertyDescriptor(
        navigator.constructor.prototype,
        'userAgent',
      ),
      get() {
        return this.____navigator;
      },
      set(v) {
        this.____navigator = v;
      },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'userAgent');
  });

  it('should convert config if iPod', () => {
    const params = {};

    const expectedConfig = {
      loader: false,
      controls: false,
      title: false,
      screen: {
        indicateScreenClick: false,
        disableClickProcessing: true,
        nativeControls: true,
      },
    };

    navigator.userAgent = 'iPod';

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if iPhone', () => {
    const params = {};

    const expectedConfig = {
      loader: false,
      controls: false,
      title: false,
      screen: {
        indicateScreenClick: false,
        disableClickProcessing: true,
        nativeControls: true,
      },
    };
    navigator.userAgent = 'iPhone';

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if iPad', () => {
    const params = {};

    const expectedConfig = {
      loader: false,
      controls: false,
      title: false,
      screen: {
        indicateScreenClick: false,
        disableClickProcessing: true,
        nativeControls: true,
      },
    };
    navigator.userAgent = 'iPad';

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if Android', () => {
    navigator.userAgent = 'Android';

    const params = {
      title: 'test',
      controls: {},
      loader: {},
    };

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal({
      title: 'test',
      controls: {},
      loader: {},
      screen: {
        disableClickProcessing: true,
      },
    });
  });
});
