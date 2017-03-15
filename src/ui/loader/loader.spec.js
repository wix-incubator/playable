import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';
import EventEmitter from 'eventemitter3';

import Loader from './loader.controler';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';


describe('Loader', () => {
  let loader = {};
  let $video = {};
  let vidi = {};
  let eventEmitter = {};

  beforeEach(() => {
    $video = new $('<video>');
    vidi = new Vidi($video[0]);
    eventEmitter = new EventEmitter();
    loader = new Loader({
      vidi,
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
