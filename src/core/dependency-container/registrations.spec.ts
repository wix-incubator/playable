import * as sinon from 'sinon';

import Lifetime from './constants/Lifetime';
import NotAFunctionError from './errors/NotAFunctionError';

import {
  asClass,
  asValue,
  asFunction,
  PROPERTY_FOR_DEPENDENCIES,
} from './registrations';

interface ModuleSpy extends sinon.SinonSpy {
  [PROPERTY_FOR_DEPENDENCIES]?: string[];
}

describe('registration method', () => {
  const container = {
    resolve: sinon.spy((name: any) => name),
  };

  afterEach(() => {
    container.resolve.resetHistory();
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
        const func = sinon.spy();
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(func.calledWith(container)).toBe(true);
      });

      test('should combine wrapper object with resolved dependencies from container', () => {
        const func: ModuleSpy = sinon.spy();
        const moduleName = 'moduleName';
        func[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(container.resolve.calledWithExactly(moduleName)).toBe(true);
        expect(
          func.calledWithExactly(
            {
              moduleName,
            },
            container,
          ),
        ).toBe(true);
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
        const constructor = sinon.spy();
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.calledWithNew()).toBe(true);
        expect(constructor.calledWith(container)).toBe(true);
      });

      test('should combine wrapper object with resolved dependencies from container', () => {
        const constructor: ModuleSpy = sinon.spy();
        const moduleName = 'moduleName';
        constructor[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.calledWithNew()).toBe(true);
        expect(container.resolve.calledWithExactly(moduleName)).toBe(true);
        expect(
          constructor.calledWithExactly(
            {
              moduleName,
            },
            container,
          ),
        ).toBe(true);
      });
    });

    describe('returned object should have fluid interface', () => {
      const constructor = sinon.spy();
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
