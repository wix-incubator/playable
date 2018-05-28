import 'jsdom-global/register';
import { expect } from 'chai';

import convertToDeviceRelatedConfig from './config';

import { setProperty, resetProperty } from '../testkit';

declare const navigator: any;
describe('getUIConfig function', () => {
  afterEach(() => {
    resetProperty(navigator, 'userAgent');
  });

  it('should convert config if iPod', () => {
    const params = {};

    const expectedConfig = {
      loader: false,
      controls: false,
      title: false,
      showInteractionIndicator: false,
      screen: {
        disableClickProcessing: true,
        nativeControls: true,
      },
    };

    setProperty(navigator, 'userAgent', 'iPod');

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
      showInteractionIndicator: false,
      screen: {
        disableClickProcessing: true,
        nativeControls: true,
      },
    };
    setProperty(navigator, 'userAgent', 'iPhone');

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
      showInteractionIndicator: false,
      screen: {
        disableClickProcessing: true,
        nativeControls: true,
      },
    };

    setProperty(navigator, 'userAgent', 'iPad');

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if Android', () => {
    setProperty(navigator, 'userAgent', 'Android');

    const params = {
      title: { text: 'test' },
      controls: {},
      loader: true,
    };

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal({
      title: { text: 'test' },
      controls: {},
      loader: true,
      screen: {
        disableClickProcessing: true,
      },
    });
  });
});
