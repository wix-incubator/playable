import 'jsdom-global/register';
import { expect } from 'chai';

import engageInteractionTypeObserver from './interaction-type';

describe('engageInteractionTypeObserver', () => {
  const keydownEvent = new Event('keydown');
  const keyupEvent = new Event('keyup');

  const touchstartEvent = new Event('touchstart');
  const pointerdownEvent = new Event('pointerdown');
  const MSPointerDowntEvent = new Event('MSPointerDown');
  const mousedownEvent = new Event('mousedown');

  const touchendEvent = new Event('touchend');
  const touchcancelEvent = new Event('touchcancel');
  const pointerupEvent = new Event('pointerup');
  const MSPointerUpEvent = new Event('MSPointerUp');
  const pointercancelEvent = new Event('pointercancel');
  const MSPointerCancelEvent = new Event('MSPointerCancel');
  const mouseupEvent = new Event('mouseup');

  const blurEvent = new Event('blur');

  let get;

  describe('get function', () => {
    describe('for key', () => {
      it('should return false', () => {
        get = engageInteractionTypeObserver.engage().get;

        expect(get().key).to.be.equal(false);
        engageInteractionTypeObserver.disengage();
      });

      describe('after key down event', () => {
        beforeEach(() => {
          get = engageInteractionTypeObserver.engage().get;
        });

        afterEach(() => {
          delete keydownEvent.keyCode;
          engageInteractionTypeObserver.disengage();
        });

        it('should return true', () => {
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).to.be.equal(true);
        });

        it('should return false if keyCode 16', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).to.be.equal(false);
        });
        it('should return false if keyCode 17', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).to.be.equal(false);
        });
        it('should return false if keyCode 18', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).to.be.equal(false);
        });
        it('should return false if keyCode 91', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).to.be.equal(false);
        });
        it('should return false if keyCode 93', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).to.be.equal(false);
        });
      });

      describe('after key up event', () => {
        beforeEach(() => {
          get = engageInteractionTypeObserver.engage().get;
        });

        afterEach(() => {
          delete keyupEvent.keyCode;
          engageInteractionTypeObserver.disengage();
        });

        it('should return false', done => {
          document.documentElement.dispatchEvent(keydownEvent);
          document.documentElement.dispatchEvent(keyupEvent);

          setTimeout(() => {
            expect(get().key).to.be.equal(false);
            done();
          }, 100);
        });

        it('should return true if keyCode 16', done => {
          keyupEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);
          document.documentElement.dispatchEvent(keyupEvent);

          setTimeout(() => {
            expect(get().key).to.be.equal(true);
            done();
          }, 100);
        });

        it('should return true if keyCode 17', done => {
          keyupEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);
          document.documentElement.dispatchEvent(keyupEvent);

          setTimeout(() => {
            expect(get().key).to.be.equal(true);
            done();
          }, 100);
        });

        it('should return true if keyCode 18', done => {
          keyupEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);
          document.documentElement.dispatchEvent(keyupEvent);

          setTimeout(() => {
            expect(get().key).to.be.equal(true);
            done();
          }, 100);
        });

        it('should return true if keyCode 91', done => {
          keyupEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);
          document.documentElement.dispatchEvent(keyupEvent);

          setTimeout(() => {
            expect(get().key).to.be.equal(true);
            done();
          }, 100);
        });

        it('should return true if keyCode 93', done => {
          keyupEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);
          document.documentElement.dispatchEvent(keyupEvent);

          setTimeout(() => {
            expect(get().key).to.be.equal(true);
            done();
          }, 100);
        });
      });
    });
    describe('for pointer', () => {
      beforeEach(() => {
        get = engageInteractionTypeObserver.engage().get;
      });

      afterEach(() => {
        delete keydownEvent.keyCode;
        engageInteractionTypeObserver.disengage();
      });

      it('should return false', () => {
        expect(get().pointer).to.be.equal(false);
      });

      it('should return true after touchstartEvent', () => {
        document.documentElement.dispatchEvent(touchstartEvent);

        expect(get().pointer).to.be.equal(true);
      });

      it('should return false after touchstartEvent if not isPrimary', () => {
        touchstartEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);

        expect(get().pointer).to.be.equal(false);
        delete touchstartEvent.isPrimary;
      });

      it('should return true after pointerdownEvent', () => {
        document.documentElement.dispatchEvent(pointerdownEvent);

        expect(get().pointer).to.be.equal(true);
      });

      it('should return false after pointerdownEvent if not isPrimary', () => {
        pointerdownEvent.isPrimary = false;
        document.documentElement.dispatchEvent(pointerdownEvent);

        expect(get().pointer).to.be.equal(false);
        delete pointerdownEvent.isPrimary;
      });


      it('should return true after MSPointerDowntEvent', () => {
        document.documentElement.dispatchEvent(MSPointerDowntEvent);

        expect(get().pointer).to.be.equal(true);
      });

      it('should return false after MSPointerDowntEvent if not isPrimary', () => {
        MSPointerDowntEvent.isPrimary = false;
        document.documentElement.dispatchEvent(MSPointerDowntEvent);

        expect(get().pointer).to.be.equal(false);
        delete MSPointerDowntEvent.isPrimary;
      });


      it('should return true after mousedownEvent', () => {
        document.documentElement.dispatchEvent(mousedownEvent);

        expect(get().pointer).to.be.equal(true);
      });

      it('should return false after mousedownEvent if not isPrimary', () => {
        mousedownEvent.isPrimary = false;
        document.documentElement.dispatchEvent(mousedownEvent);

        expect(get().pointer).to.be.equal(false);
        delete mousedownEvent.isPrimary;
      });

      it('should return false after touchend', done => {
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(touchendEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after touchend if there is still touches', done => {
        touchendEvent.touches = [1];
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(touchendEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete touchendEvent.touches;
      });

      it('should return true after touchend if it not isPrimary', done => {
        touchendEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(touchendEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete touchendEvent.isPrimary;
      });

      it('should return false after touchcancel', done => {
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(touchcancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after touchcancel if there is still touches', done => {
        touchcancelEvent.touches = [1];
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(touchcancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete touchcancelEvent.touches;
      });

      it('should return true after touchcancel if it not isPrimary', done => {
        touchcancelEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(touchcancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete touchcancelEvent.isPrimary;
      });

      it('should return false after MSPointerUpEvent', done => {
        document.documentElement.dispatchEvent(MSPointerDowntEvent);
        document.documentElement.dispatchEvent(MSPointerUpEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after MSPointerUpEvent if there is still touches', done => {
        MSPointerUpEvent.touches = [1];
        document.documentElement.dispatchEvent(MSPointerDowntEvent);
        document.documentElement.dispatchEvent(MSPointerUpEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete MSPointerUpEvent.touches;
      });

      it('should return true after MSPointerUpEvent if it not isPrimary', done => {
        MSPointerUpEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(MSPointerUpEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete MSPointerUpEvent.isPrimary;
      });

      it('should return false after MSPointerCancelEvent', done => {
        document.documentElement.dispatchEvent(MSPointerDowntEvent);
        document.documentElement.dispatchEvent(MSPointerCancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after MSPointerCancelEvent if there is still touches', done => {
        MSPointerCancelEvent.touches = [1];
        document.documentElement.dispatchEvent(MSPointerDowntEvent);
        document.documentElement.dispatchEvent(MSPointerCancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete MSPointerCancelEvent.touches;
      });

      it('should return true after MSPointerCancelEvent if it not isPrimary', done => {
        MSPointerCancelEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(MSPointerCancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete MSPointerCancelEvent.isPrimary;
      });

      it('should return false after pointerupEvent', done => {
        document.documentElement.dispatchEvent(pointerdownEvent);
        document.documentElement.dispatchEvent(pointerupEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after pointerupEvent if there is still touches', done => {
        pointerupEvent.touches = [1];
        document.documentElement.dispatchEvent(pointerdownEvent);
        document.documentElement.dispatchEvent(pointerupEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete pointerupEvent.touches;
      });

      it('should return true after pointerupEvent if it not isPrimary', done => {
        pointerupEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(pointerupEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete pointerupEvent.isPrimary;
      });

      it('should return false after pointercancelEvent', done => {
        document.documentElement.dispatchEvent(pointerdownEvent);
        document.documentElement.dispatchEvent(pointercancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after pointercancelEvent if there is still touches', done => {
        pointercancelEvent.touches = [1];
        document.documentElement.dispatchEvent(pointerdownEvent);
        document.documentElement.dispatchEvent(pointercancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete pointercancelEvent.touches;
      });

      it('should return true after pointercancelEvent if it not isPrimary', done => {
        pointercancelEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(pointercancelEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete pointercancelEvent.isPrimary;
      });

      it('should return false after mouseup', done => {
        document.documentElement.dispatchEvent(mousedownEvent);
        document.documentElement.dispatchEvent(mouseupEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(false);
          done();
        }, 10);
      });

      it('should return true after mouseup if there is still touches', done => {
        mouseupEvent.touches = [1];
        document.documentElement.dispatchEvent(mousedownEvent);
        document.documentElement.dispatchEvent(mouseupEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete mouseupEvent.touches;
      });

      it('should return true after mouseupEvent if it not isPrimary', done => {
        mouseupEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);
        document.documentElement.dispatchEvent(mouseupEvent);

        setTimeout(() => {
          expect(get().pointer).to.be.equal(true);
          done();
        }, 10);

        delete mouseupEvent.isPrimary;
      });
    });
    it('should return both key and pointer as false after blur event on window', done => {
      get = engageInteractionTypeObserver.engage().get;

      document.documentElement.dispatchEvent(keydownEvent);
      document.documentElement.dispatchEvent(touchstartEvent);

      window.dispatchEvent(blurEvent);

      setTimeout(() => {
        expect(get()).to.be.deep.equal({
          key: false,
          pointer: false
        });
        done();
      }, 10);

      engageInteractionTypeObserver.disengage();
    });
  });
});
