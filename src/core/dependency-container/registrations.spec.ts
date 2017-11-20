import { expect } from 'chai';
import * as sinon from 'sinon';

import Lifetime from './constants/Lifetime';
import NotAFunctionError from './errors/NotAFunctionError';

import {
  asClass,
  asValue,
  asFunction,
  PROPERTY_FOR_DEPENDENCIES,
} from './registrations';

describe('registration method', () => {
  const container = {
    resolve: sinon.spy(name => name),
  };

  afterEach(() => {
    container.resolve.reset();
  });

  describe('asValue', () => {
    it('should return object in proper format', () => {
      const value = 10;
      const registeredValue = asValue(value);

      expect(registeredValue.lifetime).to.be.equal(Lifetime.TRANSIENT);
      expect(registeredValue.resolve()).to.be.equal(value);
    });
  });

  describe('asFunction', () => {
    it('should return error if not function passed', () => {
      const func = 10;
      const errorThrown = () => asFunction(func);
      expect(errorThrown).to.throw(
        new NotAFunctionError('asFunction', 'function', typeof func).message,
      );
    });

    it('should return object in proper format', () => {
      const func = () => {};
      const registeredFunction = asFunction(func);

      expect(registeredFunction.lifetime).to.be.equal(Lifetime.TRANSIENT);
      expect(registeredFunction.resolve).to.exist;
    });

    it('should except options', () => {
      const func = () => {};
      const registeredFunction = asFunction(func, {
        lifetime: Lifetime.SCOPED,
      });
      expect(registeredFunction.lifetime).to.be.equal(Lifetime.SCOPED);
    });

    describe("returned object's resolve method", () => {
      it('should call initial method only with container passed', () => {
        const func = sinon.spy();
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(func.calledWith(container)).to.be.true;
      });

      it('should combine wrapper object with resolved dependencies from container', () => {
        const func = sinon.spy();
        const moduleName = 'moduleName';
        func[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredFunction = asFunction(func);

        registeredFunction.resolve(container);
        expect(container.resolve.calledWithExactly(moduleName)).to.be.true;
        expect(
          func.calledWithExactly(
            {
              moduleName,
            },
            container,
          ),
        ).to.be.true;
      });
    });

    describe('returned object should have fluid interface', () => {
      const func = () => {};
      const registeredFunction = asFunction(func);
      registeredFunction.transient();
      expect(registeredFunction.lifetime).to.be.equal(Lifetime.TRANSIENT);
      registeredFunction.scoped();
      expect(registeredFunction.lifetime).to.be.equal(Lifetime.SCOPED);
      registeredFunction.singleton();
      expect(registeredFunction.lifetime).to.be.equal(Lifetime.SINGLETON);
      registeredFunction.setLifetime(Lifetime.SCOPED);
      expect(registeredFunction.lifetime).to.be.equal(Lifetime.SCOPED);
    });
  });

  describe('asClass', () => {
    it('should return error if not function passed', () => {
      const classDeclare = 10;
      const errorThrown = () => asClass(classDeclare);

      expect(errorThrown).to.throw(
        new NotAFunctionError('asClass', 'class', typeof classDeclare).message,
      );
    });

    it('should return object in proper format', () => {
      class Class {}
      const registeredClass = asClass(Class);

      expect(registeredClass.lifetime).to.be.equal(Lifetime.TRANSIENT);
      expect(registeredClass.resolve).to.exist;
    });

    it('should except options', () => {
      class Class {}
      const registeredClass = asClass(Class, {
        lifetime: Lifetime.SCOPED,
      });

      expect(registeredClass.lifetime).to.be.equal(Lifetime.SCOPED);
    });

    describe("returned object's resolve method", () => {
      it('should call initial method only with container passed', () => {
        const constructor = sinon.spy();
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.calledWithNew()).to.be.true;
        expect(constructor.calledWith(container)).to.be.true;
      });

      it('should combine wrapper object with resolved dependencies from container', () => {
        const constructor = sinon.spy();
        const moduleName = 'moduleName';
        constructor[PROPERTY_FOR_DEPENDENCIES] = [moduleName];
        const registeredClass = asClass(constructor);

        registeredClass.resolve(container);

        expect(constructor.calledWithNew()).to.be.true;
        expect(container.resolve.calledWithExactly(moduleName)).to.be.true;
        expect(
          constructor.calledWithExactly(
            {
              moduleName,
            },
            container,
          ),
        ).to.be.true;
      });
    });

    describe('returned object should have fluid interface', () => {
      const constructor = sinon.spy();
      const registeredClass = asClass(constructor);

      registeredClass.transient();
      expect(registeredClass.lifetime).to.be.equal(Lifetime.TRANSIENT);
      registeredClass.scoped();
      expect(registeredClass.lifetime).to.be.equal(Lifetime.SCOPED);
      registeredClass.singleton();
      expect(registeredClass.lifetime).to.be.equal(Lifetime.SINGLETON);
      registeredClass.setLifetime(Lifetime.SCOPED);
      expect(registeredClass.lifetime).to.be.equal(Lifetime.SCOPED);
    });
  });
});
