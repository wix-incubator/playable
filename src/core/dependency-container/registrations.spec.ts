import Lifetime from './constants/Lifetime';
import NotAFunctionError from './errors/NotAFunctionError';

import {
  asClass,
  asValue,
  asFunction,
  PROPERTY_FOR_DEPENDENCIES,
} from './registrations';

interface ModuleSpy extends jest.SpyInstance {
  [PROPERTY_FOR_DEPENDENCIES]?: string[];
}

describe('registration method', () => {
  const container = {
    resolve: jest.fn((name: string) => name),
  };

  beforeEach(() => {
    container.resolve = jest.fn((name: string) => name);
  });

  afterEach(() => {
    container.resolve.mockReset();
  });

  describe('asValue', () => {
    test('should return object in proper format', () => {
      const value = 10;
      const registeredValue = asValue(value);

      expect(registeredValue.lifetime).toBe(Lifetime.TRANSIENT);
      expect(registeredValue.resolve()).toBe(value);
    });
  });

  describe('asFunction', () => {
    test('should return error if not function passed', () => {
      const func = 10;
      const errorThrown = () => asFunction(func);
      expect(errorThrown).toThrowError(
        new NotAFunctionError('asFunction', 'function', typeof func).message,
      );
    });

    test('should return object in proper format', () => {
      const func = () => {};
      const registeredFunction = asFunction(func);

      expect(registeredFunction.lifetime).toBe(Lifetime.TRANSIENT);
      expect(registeredFunction.resolve).toBeDefined();
    });

    test('should except options', () => {
      const func = () => {};
      const registeredFunction = asFunction(func, {
        lifetime: Lifetime.SCOPED,
      });
      expect(registeredFunction.lifetime).toBe(Lifetime.SCOPED);
    });

    describe("returned object's resolve method", () => {
      test('should call initial method only with container passed', () => {
        const func = jest.fn();
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(func).toHaveBeenCalledWith(container);
      });

      test('should combine wrapper object with resolved dependencies from container', () => {
        const func: ModuleSpy = jest.fn();
        const moduleName = 'moduleName';
        func[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(container.resolve).toHaveBeenCalledWith(moduleName);
        expect(func).toHaveBeenCalledWith(
          {
            moduleName,
          },
          container,
        );
      });
    });

    describe('returned object should have fluid interface', () => {
      const func = () => {};
      const registeredFunction = asFunction(func);
      registeredFunction.transient();
      expect(registeredFunction.lifetime).toBe(Lifetime.TRANSIENT);
      registeredFunction.scoped();
      expect(registeredFunction.lifetime).toBe(Lifetime.SCOPED);
      registeredFunction.singleton();
      expect(registeredFunction.lifetime).toBe(Lifetime.SINGLETON);
      registeredFunction.setLifetime(Lifetime.SCOPED);
      expect(registeredFunction.lifetime).toBe(Lifetime.SCOPED);
    });
  });

  describe('asClass', () => {
    test('should return error if not function passed', () => {
      const classDeclare = 10;
      const errorThrown = () => asClass(classDeclare);

      expect(errorThrown).toThrowError(
        new NotAFunctionError('asClass', 'class', typeof classDeclare).message,
      );
    });

    test('should return object in proper format', () => {
      class Class {}
      const registeredClass = asClass(Class);

      expect(registeredClass.lifetime).toBe(Lifetime.TRANSIENT);
      expect(registeredClass.resolve).toBeDefined();
    });

    test('should except options', () => {
      class Class {}
      const registeredClass = asClass(Class, {
        lifetime: Lifetime.SCOPED,
      });

      expect(registeredClass.lifetime).toBe(Lifetime.SCOPED);
    });

    describe("returned object's resolve method", () => {
      test('should call initial method only with container passed', () => {
        const constructor = jest.fn();
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.mock.instances.length).toBe(1);
        expect(constructor).toHaveBeenCalledWith(container);
      });

      test('should combine wrapper object with resolved dependencies from container', () => {
        const constructor: ModuleSpy = jest.fn(() => ({}));
        const moduleName = 'moduleName';
        constructor[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.mock.instances.length).toBe(1);
        expect(container.resolve).toHaveBeenCalledWith(moduleName);
        expect(constructor).toHaveBeenCalledWith(
          {
            moduleName,
          },
          container,
        );
      });
    });

    describe('returned object should have fluid interface', () => {
      const constructor = jest.fn();
      const registeredClass = asClass(constructor);

      registeredClass.transient();
      expect(registeredClass.lifetime).toBe(Lifetime.TRANSIENT);
      registeredClass.scoped();
      expect(registeredClass.lifetime).toBe(Lifetime.SCOPED);
      registeredClass.singleton();
      expect(registeredClass.lifetime).toBe(Lifetime.SINGLETON);
      registeredClass.setLifetime(Lifetime.SCOPED);
      expect(registeredClass.lifetime).toBe(Lifetime.SCOPED);
    });
  });
});
