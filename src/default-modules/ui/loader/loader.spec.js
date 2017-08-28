import 'jsdom-global/register';

import { expect } from 'chai';

import EventEmitter from 'eventemitter3';

import Engine from '../../playback-engine/playback-engine';
import Loader from './loader.controler';


describe('Loader', () => {
  let loader = {};
  let engine = {};
  let eventEmitter = {};
  let config = {};

  beforeEach(() => {
    config = {
      ui: {}
    };
    eventEmitter = new EventEmitter
    engine = new Engine({
      eventEmitter,
      config
    });

    loader = new Loader({
      engine,
      config,
      eventEmitter
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(loader).to.exists;
      expect(loader.view).to.exists;
    });
  });
});
