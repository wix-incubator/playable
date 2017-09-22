import { expect } from 'chai';

import playerAPI, { PLAYER_API_PROPERTY } from './player-api-decorator';


describe('Decorator playerAPI', () => {
  it('should add method to private property in prototype', () => {
    class A {
      @playerAPI()
      a() {}

      @playerAPI()
      b() {}
    }

    expect(A.prototype[PLAYER_API_PROPERTY]).to.deep.equal({
      a: Reflect.getOwnPropertyDescriptor(A.prototype, 'a'),
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'b')
    });
  });

  it('should add method to private property in prototype with custom key', () => {
    class A {
      @playerAPI('b')
      a() {}
    }

    expect(A.prototype[PLAYER_API_PROPERTY]).to.deep.equal({
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'a')
    });
  });

  it('should add descriptor if setter or getter', () => {
    class A {
      @playerAPI('b')
      get a() {}
    }

    expect(A.prototype[PLAYER_API_PROPERTY]).to.deep.equal({
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'a')
    });
  });

  it('should add descriptor if setter and getter', () => {
    class A {
      @playerAPI()
      get a() {}

      @playerAPI()
      set a(a) {}
    }

    expect(A.prototype[PLAYER_API_PROPERTY]).to.deep.equal({
      a: Reflect.getOwnPropertyDescriptor(A.prototype, 'a')
    });
  });

  it('should throw error if same keys for public API', () => {
    const getWrongDecoratedClassB = () => {
      class B {
        @playerAPI('b')
        a() {}

        @playerAPI()
        b() {}
      }

      return B;
    };

    expect(getWrongDecoratedClassB).to.throw('Method "b" for public API in B is already defined');
  });
});
