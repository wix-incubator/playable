import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import create, {
  registerModule,
  clearAdditionalModules,
} from './player-fabric';

describe('registerModule', () => {
  it('should add additional module', () => {
    const spy = sinon.spy();

    class ClassA {
      constructor() {
        spy();
      }
    }

    registerModule('ClassA', ClassA);

    const player = create();
    expect(spy.called).to.be.true;
    clearAdditionalModules();
  });
});

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = create();
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(player).to.exist;
      expect(player._defaultModules.engine).to.exist;
      expect(player.node).to.exist;
      expect(player._defaultModules.eventEmitter).to.exist;
    });

    it('should create separate instances', () => {
      const player2: any = create();

      expect(player._defaultModules.engine).to.not.be.equal(
        player2._defaultModules.engine,
      );
      expect(player.node).to.not.be.equal(player2.node);
      expect(player._defaultModules.eventEmitter).to.not.be.equal(
        player2._defaultModules.eventEmitter,
      );
    });
  });

  describe('API methods', () => {
    it('should have method for set autoplay flag', () => {
      expect(player.setAutoPlay).to.exist;
      player.setAutoPlay(true);
      expect(player.getAutoPlay()).to.be.true;
      player.setAutoPlay(false);
      expect(player.getAutoPlay()).to.be.false;
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setLoop).to.exist;
      player.setLoop(true);
      expect(player.getLoop()).to.be.true;
      player.setLoop(false);
      expect(player.getLoop()).to.be.false;
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setMute).to.exist;
      player.setMute(true);
      expect(player.getMute()).to.be.true;
      player.setMute(false);
      expect(player.getMute()).to.be.false;
    });

    it('should have method for set volume', () => {
      expect(player.setVolume).to.exist;
      player.setVolume(50);
      expect(player.getVolume()).to.be.equal(50);
    });

    it('should have method for set preload', () => {
      expect(player.setPreload).to.exist;
      player.setPreload('none');
      expect(player.getPreload()).to.be.equal('none');
      player.setPreload(false);
      expect(player.getPreload()).to.be.equal('auto');
    });

    it('should have method for get autoplay flag', () => {
      expect(player.getAutoPlay).to.exist;
      player.setAutoPlay(false);
      expect(player.getAutoPlay()).to.be.false;
    });

    it('should have method for get loop flag', () => {
      expect(player.getLoop).to.exist;
      player.setLoop(false);
      expect(player.getLoop()).to.be.false;
    });

    it('should have method for get mute flag', () => {
      expect(player.getMute).to.exist;
      player.setMute(false);
      expect(player.getMute()).to.be.false;
    });

    it('should have method for get preload', () => {
      const preload = 'metadata';
      expect(player.getPreload).to.exist;
      player.setPreload(preload);
      expect(player.getPreload()).to.be.equal(preload);
    });

    it('should have method for get volume', () => {
      const volume = 30;
      expect(player.getVolume).to.exist;
      player.setVolume(volume);
      expect(player.getVolume()).to.be.equal(volume);
    });

    it('should have method for start playback of video', () => {
      expect(player.play).to.exist;
    });

    it('should have method for stop playback of video', () => {
      expect(player.pause).to.exist;
    });

    it('should have method for destroying player', () => {
      expect(player.destroy).to.exist;

      player.destroy();
      expect(player.node).to.not.exist;
    });

    it('should have method for setting loading cover', () => {
      expect(player.setLoadingCover);
    });

    it('should have method for subscribing on events', () => {
      expect(player.on).to.exist;
    });

    it('should have method for unsubscribing from events', () => {
      expect(player.off).to.exist;
    });
  });
});
