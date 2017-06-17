import 'jsdom-global/register';

import { expect } from 'chai';

import EventEmitter from 'eventemitter3';

import Engine from '../../playback-engine/playback-engine';
import Loader from './loader.controler';


describe('Loader', () => {
  let loader = {};
  let engine = {};
  let eventEmitter = {};

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter
    });

    loader = new Loader({
      engine,
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
