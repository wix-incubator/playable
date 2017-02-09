import 'jsdom-global/register';

import { expect } from 'chai';

import $ from 'jbone';
import Vidi from 'vidi';

import PlayerUI from './ui.controler';


describe('PlayerUI', () => {
  let ui = {};
  let $video = {};
  let vidi = {};

  beforeEach(() => {
    $video = new $('<video>', {
      controls: 'true',
      poster: 'kek'
    });
    vidi = new Vidi($video[0]);
  });

  describe('constructor', () => {
    beforeEach(() => {
      ui = new PlayerUI({
        vidi
      });
    });

    it('should create instance ', () => {
      expect(ui).to.exists;
      expect(ui.view).to.exists;
    });
  });

  describe('instance created with default config', () => {
    beforeEach(() => {
      ui = new PlayerUI({
        vidi
      });
    });
    it('should have controls', () => {
      expect(ui.controls).to.exist;
    });
    it('should remove controls attribute from video tag if have controls', () => {
      expect(ui.$video.attr('controls')).to.not.exist;
    });
    it('should have overlay', () =>{
      expect(ui.overlay).to.exist;
    });
    it('should set overlay as visible', () => {
      expect(ui.overlay.isHidden).to.be.false;
    })
    it('should remove poster attribute from video tag if have overlay', () => {
      expect(ui.$video.attr('poster')).to.not.exist;
    });
  });

  describe('instance created with extended config', () => {
    it('should create instance without controls', () => {
      const uiConfig = {
        controls: false
      };

      ui = new PlayerUI({
        vidi,
        ...uiConfig
      });

      expect(ui.controls).to.not.exist;
    });

    it('should create instance without overlay', () => {
      const uiConfig = {
        overlay: false
      };

      ui = new PlayerUI({
        vidi,
        ...uiConfig
      });

      expect(ui.overlay).to.not.exist;
    });
  });
});
