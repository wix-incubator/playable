import engageInteractionTypeObserver from './interaction-type';

describe('engageInteractionTypeObserver', () => {
  const keydownEvent: any = new Event('keydown');
  const keyupEvent: any = new Event('keyup');

  const touchstartEvent: any = new Event('touchstart');
  const pointerdownEvent: any = new Event('pointerdown');
  const MSPointerDowntEvent: any = new Event('MSPointerDown');
  const mousedownEvent: any = new Event('mousedown');

  const touchendEvent: any = new Event('touchend');
  const touchcancelEvent: any = new Event('touchcancel');
  const pointerupEvent: any = new Event('pointerup');
  const MSPointerUpEvent: any = new Event('MSPointerUp');
  const pointercancelEvent: any = new Event('pointercancel');
  const MSPointerCancelEvent: any = new Event('MSPointerCancel');
  const mouseupEvent: any = new Event('mouseup');

  const blurEvent = new Event('blur');

  let get: any;

  describe('get function', () => {
    describe('for key', () => {
      it('should return false', () => {
        get = engageInteractionTypeObserver.engage().get;

        expect(get().key).toBe(false);
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

          expect(get().key).toBe(true);
        });

        it('should return false if keyCode 16', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).toBe(false);
        });
        it('should return false if keyCode 17', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).toBe(false);
        });
        it('should return false if keyCode 18', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).toBe(false);
        });
        it('should return false if keyCode 91', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).toBe(false);
        });
        it('should return false if keyCode 93', () => {
          keydownEvent.keyCode = 16;
          document.documentElement.dispatchEvent(keydownEvent);

          expect(get().key).toBe(false);
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

        it('should return false', () => {
          return new Promise<void>(resolve => {
            document.documentElement.dispatchEvent(keydownEvent);
            document.documentElement.dispatchEvent(keyupEvent);

            setTimeout(() => {
              expect(get().key).toBe(false);
              resolve();
            }, 20);
          });
        });

        it('should return true if keyCode 16', () => {
          return new Promise<void>(resolve => {
            keydownEvent.keyCode = 65;
            keyupEvent.keyCode = 16;
            document.documentElement.dispatchEvent(keydownEvent);
            document.documentElement.dispatchEvent(keyupEvent);

            setTimeout(() => {
              expect(get().key).toBe(true);
              resolve();
            }, 20);
          });
        });

        it('should return true if keyCode 17', () => {
          return new Promise<void>(resolve => {
            keydownEvent.keyCode = 65;
            keyupEvent.keyCode = 17;
            document.documentElement.dispatchEvent(keydownEvent);
            document.documentElement.dispatchEvent(keyupEvent);

            setTimeout(() => {
              expect(get().key).toBe(true);
              resolve();
            }, 20);
          });
        });

        it('should return true if keyCode 18', () => {
          return new Promise<void>(resolve => {
            keydownEvent.keyCode = 65;
            keyupEvent.keyCode = 18;
            document.documentElement.dispatchEvent(keydownEvent);
            document.documentElement.dispatchEvent(keyupEvent);

            setTimeout(() => {
              expect(get().key).toBe(true);
              resolve();
            }, 20);
          });
        });

        it('should return true if keyCode 91', () => {
          return new Promise<void>(resolve => {
            keydownEvent.keyCode = 65;
            keyupEvent.keyCode = 91;
            document.documentElement.dispatchEvent(keydownEvent);
            document.documentElement.dispatchEvent(keyupEvent);

            setTimeout(() => {
              expect(get().key).toBe(true);
              resolve();
            }, 20);
          });
        });

        it('should return true if keyCode 93', () => {
          return new Promise<void>(resolve => {
            keydownEvent.keyCode = 65;
            keyupEvent.keyCode = 93;
            document.documentElement.dispatchEvent(keydownEvent);
            document.documentElement.dispatchEvent(keyupEvent);

            setTimeout(() => {
              expect(get().key).toBe(true);
              resolve();
            }, 20);
          });
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
        expect(get().pointer).toBe(false);
      });

      it('should return true after touchstartEvent', () => {
        document.documentElement.dispatchEvent(touchstartEvent);

        expect(get().pointer).toBe(true);
      });

      it('should return false after touchstartEvent if not isPrimary', () => {
        touchstartEvent.isPrimary = false;
        document.documentElement.dispatchEvent(touchstartEvent);

        expect(get().pointer).toBe(false);
        delete touchstartEvent.isPrimary;
      });

      it('should return true after pointerdownEvent', () => {
        document.documentElement.dispatchEvent(pointerdownEvent);

        expect(get().pointer).toBe(true);
      });

      it('should return false after pointerdownEvent if not isPrimary', () => {
        pointerdownEvent.isPrimary = false;
        document.documentElement.dispatchEvent(pointerdownEvent);

        expect(get().pointer).toBe(false);
        delete pointerdownEvent.isPrimary;
      });

      it('should return true after MSPointerDowntEvent', () => {
        document.documentElement.dispatchEvent(MSPointerDowntEvent);

        expect(get().pointer).toBe(true);
      });

      it('should return false after MSPointerDowntEvent if not isPrimary', () => {
        MSPointerDowntEvent.isPrimary = false;
        document.documentElement.dispatchEvent(MSPointerDowntEvent);

        expect(get().pointer).toBe(false);
        delete MSPointerDowntEvent.isPrimary;
      });

      it('should return true after mousedownEvent', () => {
        document.documentElement.dispatchEvent(mousedownEvent);

        expect(get().pointer).toBe(true);
      });

      it('should return false after mousedownEvent if not isPrimary', () => {
        mousedownEvent.isPrimary = false;
        document.documentElement.dispatchEvent(mousedownEvent);

        expect(get().pointer).toBe(false);
        delete mousedownEvent.isPrimary;
      });

      it('should return false after touchend', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(touchendEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after touchend if there is still touches', () => {
        return new Promise<void>(resolve => {
          touchendEvent.touches = [1];
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(touchendEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete touchendEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after touchend if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          touchendEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(touchendEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete touchendEvent.isPrimary;
            resolve();
          }, 20);
        });
      });

      it('should return false after touchcancel', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(touchcancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after touchcancel if there is still touches', () => {
        return new Promise<void>(resolve => {
          touchcancelEvent.touches = [1];
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(touchcancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete touchcancelEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after touchcancel if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          touchcancelEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(touchcancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete touchcancelEvent.isPrimary;
            resolve();
          }, 20);
        });
      });

      it('should return false after MSPointerUpEvent', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(MSPointerDowntEvent);
          document.documentElement.dispatchEvent(MSPointerUpEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after MSPointerUpEvent if there is still touches', () => {
        return new Promise<void>(resolve => {
          MSPointerUpEvent.touches = [1];
          document.documentElement.dispatchEvent(MSPointerDowntEvent);
          document.documentElement.dispatchEvent(MSPointerUpEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete MSPointerUpEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after MSPointerUpEvent if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          MSPointerUpEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(MSPointerUpEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete MSPointerUpEvent.isPrimary;
            resolve();
          }, 20);
        });
      });

      it('should return false after MSPointerCancelEvent', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(MSPointerDowntEvent);
          document.documentElement.dispatchEvent(MSPointerCancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after MSPointerCancelEvent if there is still touches', () => {
        return new Promise<void>(resolve => {
          MSPointerCancelEvent.touches = [1];
          document.documentElement.dispatchEvent(MSPointerDowntEvent);
          document.documentElement.dispatchEvent(MSPointerCancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete MSPointerCancelEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after MSPointerCancelEvent if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          MSPointerCancelEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(MSPointerCancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete MSPointerCancelEvent.isPrimary;
            resolve();
          }, 20);
        });
      });

      it('should return false after pointerupEvent', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(pointerdownEvent);
          document.documentElement.dispatchEvent(pointerupEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after pointerupEvent if there is still touches', () => {
        return new Promise<void>(resolve => {
          pointerupEvent.touches = [1];
          document.documentElement.dispatchEvent(pointerdownEvent);
          document.documentElement.dispatchEvent(pointerupEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete pointerupEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after pointerupEvent if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          pointerupEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(pointerupEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete pointerupEvent.isPrimary;
            resolve();
          }, 20);
        });
      });

      it('should return false after pointercancelEvent', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(pointerdownEvent);
          document.documentElement.dispatchEvent(pointercancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after pointercancelEvent if there is still touches', () => {
        return new Promise<void>(resolve => {
          pointercancelEvent.touches = [1];
          document.documentElement.dispatchEvent(pointerdownEvent);
          document.documentElement.dispatchEvent(pointercancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete pointercancelEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after pointercancelEvent if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          pointercancelEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(pointercancelEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete pointercancelEvent.isPrimary;
            resolve();
          }, 20);
        });
      });

      it('should return false after mouseup', () => {
        return new Promise<void>(resolve => {
          document.documentElement.dispatchEvent(mousedownEvent);
          document.documentElement.dispatchEvent(mouseupEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(false);
            resolve();
          }, 20);
        });
      });

      it('should return true after mouseup if there is still touches', () => {
        return new Promise<void>(resolve => {
          mouseupEvent.touches = [1];
          document.documentElement.dispatchEvent(mousedownEvent);
          document.documentElement.dispatchEvent(mouseupEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete mouseupEvent.touches;
            resolve();
          }, 20);
        });
      });

      it('should return true after mouseupEvent if it not isPrimary', () => {
        return new Promise<void>(resolve => {
          mouseupEvent.isPrimary = false;
          document.documentElement.dispatchEvent(touchstartEvent);
          document.documentElement.dispatchEvent(mouseupEvent);

          setTimeout(() => {
            expect(get().pointer).toBe(true);
            delete mouseupEvent.isPrimary;
            resolve();
          }, 20);
        });
      });
    });
    it('should return both key and pointer as false after blur event on window', () => {
      return new Promise<void>(resolve => {
        get = engageInteractionTypeObserver.engage().get;

        document.documentElement.dispatchEvent(keydownEvent);
        document.documentElement.dispatchEvent(touchstartEvent);

        window.dispatchEvent(blurEvent);

        setTimeout(() => {
          expect(get()).toEqual({
            key: false,
            pointer: false,
          });
          engageInteractionTypeObserver.disengage();
          resolve();
        }, 20);
      });
    });
  });
});
