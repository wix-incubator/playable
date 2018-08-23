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
      hideMainUI: true,
      disableControlWithClickOnPlayer: true,
      disableControlWithKeyboard: true,
      nativeBrowserControls: true,
    };

    setProperty(navigator, 'userAgent', 'iPod');

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if iPhone', () => {
    const params = {};

    const expectedConfig = {
      hideMainUI: true,
      disableControlWithClickOnPlayer: true,
      disableControlWithKeyboard: true,
      nativeBrowserControls: true,
    };
    setProperty(navigator, 'userAgent', 'iPhone');

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if iPad', () => {
    const params = {};

    const expectedConfig = {
      hideMainUI: true,
      disableControlWithClickOnPlayer: true,
      disableControlWithKeyboard: true,
      nativeBrowserControls: true,
    };

    setProperty(navigator, 'userAgent', 'iPad');

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal(
      expectedConfig,
    );
  });

  it('should convert config if Android', () => {
    setProperty(navigator, 'userAgent', 'Android');

    const params = {
      width: 100,
    };

    expect(convertToDeviceRelatedConfig(params)).to.be.deep.equal({
      width: 100,
      disableControlWithClickOnPlayer: true,
      disableControlWithKeyboard: true,
    });
  });
});
