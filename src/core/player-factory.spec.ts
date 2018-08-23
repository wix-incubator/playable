import 'jsdom-global/register';

import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import {
  create,
  registerModule,
  clearAdditionalModules,
} from './player-factory';

describe('registerModule', () => {
  it('should add additional module', () => {
    const spy = sinon.spy();

    class ClassA {
      constructor() {
        spy();
      }
    }

    registerModule('ClassA', ClassA);

    /*const player = */ create();
    expect(spy.called).to.be.true;
    clearAdditionalModules();
  });
});

describe('Player', () => {
  let player: any;

  beforeEach(() => {
    player = create();
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(player).to.exist;
      expect(player._defaultModules.engine).to.exist;
      expect(player.getElement()).to.exist;
      expect(player._defaultModules.eventEmitter).to.exist;
    });

    it('should create separate instances', () => {
      const player2: any = create();

      expect(player._defaultModules.engine).to.not.be.equal(
        player2._defaultModules.engine,
      );
      expect(player.getElement()).to.not.be.equal(player2.getElement());
      expect(player._defaultModules.eventEmitter).to.not.be.equal(
        player2._defaultModules.eventEmitter,
      );
    });
  });
});
