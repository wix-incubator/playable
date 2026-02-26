import Lifetime from './constants/Lifetime';
import NotAFunctionError from './errors/NotAFunctionError';

import {
  asClass,
  asValue,
  asFunction,
  PROPERTY_FOR_DEPENDENCIES,
} from './registrations';

interface ModuleSpy extends ReturnType<typeof vi.fn> {
  [PROPERTY_FOR_DEPENDENCIES]?: string[];
}

describe('registration method', () => {
  const container = {
    resolve: vi.fn((name: any) => name),
  };

  afterEach(() => {
    container.resolve.mockClear();
  });

  describe('asValue', () => {
    it('should return object in proper format', () => {
      const value = 10;
      const registeredValue = asValue(value);

      expect(registeredValue.lifetime).toBe(Lifetime.TRANSIENT);
      expect(registeredValue.resolve()).toBe(value);
    });
  });

  describe('asFunction', () => {
    it('should return error if not function passed', () => {
      const func = 10;
      const errorThrown = () => asFunction(func);
      expect(errorThrown).toThrow(
        new NotAFunctionError('asFunction', 'function', typeof func).message,
      );
    });

    it('should return object in proper format', () => {
      const func = () => {};
      const registeredFunction = asFunction(func);

      expect(registeredFunction.lifetime).toBe(Lifetime.TRANSIENT);
      expect(registeredFunction.resolve).toBeDefined();
    });

    it('should except options', () => {
      const func = () => {};
      const registeredFunction = asFunction(func, {
        lifetime: Lifetime.SCOPED,
      });
      expect(registeredFunction.lifetime).toBe(Lifetime.SCOPED);
    });

    describe("returned object's resolve method", () => {
      it('should call initial method only with container passed', () => {
        const func = vi.fn();
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(func).toHaveBeenCalledWith(container);
      });

      it('should combine wrapper object with resolved dependencies from container', () => {
        const func: ModuleSpy = vi.fn();
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
      it('should support fluid interface', () => {
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
  });

  describe('asClass', () => {
    it('should return error if not function passed', () => {
      const classDeclare = 10;
      const errorThrown = () => asClass(classDeclare);

      expect(errorThrown).toThrow(
        new NotAFunctionError('asClass', 'class', typeof classDeclare).message,
      );
    });

    it('should return object in proper format', () => {
      class Class {}
      const registeredClass = asClass(Class);

      expect(registeredClass.lifetime).toBe(Lifetime.TRANSIENT);
      expect(registeredClass.resolve).toBeDefined();
    });

    it('should except options', () => {
      class Class {}
      const registeredClass = asClass(Class, {
        lifetime: Lifetime.SCOPED,
      });

      expect(registeredClass.lifetime).toBe(Lifetime.SCOPED);
    });

    describe("returned object's resolve method", () => {
      it('should call initial method only with container passed', () => {
        const constructor = vi.fn();
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.mock.instances.length).toBeGreaterThan(0);
        expect(constructor).toHaveBeenCalledWith(container);
      });

      it('should combine wrapper object with resolved dependencies from container', () => {
        const constructor: ModuleSpy = vi.fn();
        const moduleName = 'moduleName';
        constructor[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.mock.instances.length).toBeGreaterThan(0);
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
      it('should support fluid interface', () => {
        const constructor = vi.fn();
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
});
