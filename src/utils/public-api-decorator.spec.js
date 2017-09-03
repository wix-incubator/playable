import { expect } from 'chai';

import publicAPI, { PUBLIC_API_PROPERTY } from './public-api-decorator';


describe('Decorator publicAPI', () => {
  it('should add method to private property in prototype', () => {
    class A {
      @publicAPI()
      a() {}

      @publicAPI()
      b() {}
    }

    expect(A.prototype[PUBLIC_API_PROPERTY]).to.deep.equal({
      a: Reflect.getOwnPropertyDescriptor(A.prototype, 'a'),
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'b')
    });
  });

  it('should add method to private property in prototype with custom key', () => {
    class A {
      @publicAPI('b')
      a() {}
    }

    expect(A.prototype[PUBLIC_API_PROPERTY]).to.deep.equal({
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'a')
    });
  });

  it('should add descriptor if setter or getter', () => {
    class A {
      @publicAPI('b')
      get a() {}
    }

    expect(A.prototype[PUBLIC_API_PROPERTY]).to.deep.equal({
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'a')
    });
  });

  it('should add descriptor if setter and getter', () => {
    class A {
      @publicAPI()
      get a() {}

      @publicAPI()
      set a(a) {}
    }

    expect(A.prototype[PUBLIC_API_PROPERTY]).to.deep.equal({
      a: Reflect.getOwnPropertyDescriptor(A.prototype, 'a')
    });
  });

  it('should throw error if same keys for public API', () => {
    const getWrongDecoratedClassB = () => {
      class B {
        @publicAPI('b')
        a() {}

        @publicAPI()
        b() {}
      }

      return B;
    };

    expect(getWrongDecoratedClassB).to.throw('Method "b" for public API in B is already defined');
  });
});
