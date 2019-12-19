import playerAPI, { PLAYER_API_PROPERTY } from './player-api-decorator';

describe('Decorator playerAPI', () => {
  test('should add method to private property in prototype', () => {
    class A {
      @playerAPI()
      a() {}

      @playerAPI()
      b() {}
    }

    expect((A as any).prototype[PLAYER_API_PROPERTY]).toEqual({
      a: Reflect.getOwnPropertyDescriptor(A.prototype, 'a'),
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'b'),
    });
  });

  test('should add method to private property in prototype with custom key', () => {
    class A {
      @playerAPI('b')
      a() {}
    }

    expect((A as any).prototype[PLAYER_API_PROPERTY]).toEqual({
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'a'),
    });
  });

  test('should add descriptor if setter or getter', () => {
    class A {
      @playerAPI('b')
      get a() {
        return;
      }
    }

    expect((A as any).prototype[PLAYER_API_PROPERTY]).toEqual({
      b: Reflect.getOwnPropertyDescriptor(A.prototype, 'a'),
    });
  });

  test('should add descriptor if setter and getter', () => {
    class A {
      @playerAPI()
      get a() {
        return;
      }

      set a(_) {}
    }

    expect((A as any).prototype[PLAYER_API_PROPERTY]).toEqual({
      a: Reflect.getOwnPropertyDescriptor(A.prototype, 'a'),
    });
  });

  test('should throw error if same keys for public API', () => {
    const getWrongDecoratedClassB = () => {
      class B {
        @playerAPI('b')
        a() {}

        @playerAPI()
        b() {}
      }

      return B;
    };

    expect(getWrongDecoratedClassB).toThrowError(
      'Method "b" for public API in B is already defined',
    );
  });
});
