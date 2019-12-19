import * as sinon from 'sinon';

import createContainer from './createContainer';

import { asClass, asValue, asFunction } from './registrations';

describe('container created by createContainer', () => {
  let container: any;
  beforeEach(() => {
    container = createContainer();
  });

  test('should have method for registering and resolving modules', () => {
    const valueRegistration = asValue(10);
    container.register('value', valueRegistration);
    sinon.spy(valueRegistration, 'resolve');
    container.resolve('value');
    expect((valueRegistration.resolve as any).called).toBe(true);

    const classARegistration = asClass(class A {});
    container.register('classA', classARegistration);
    sinon.spy(classARegistration, 'resolve');
    container.resolve('classA');
    expect((classARegistration.resolve as any).called).toBe(true);

    const funcRegistration = asFunction(() => {});
    container.register('func', funcRegistration);
    sinon.spy(funcRegistration, 'resolve');
    container.resolve('func');
    expect((funcRegistration.resolve as any).called).toBe(true);
  });

  test('resolve should react on transient lifetime', () => {
    const obj = {};
    const transientFuncRegistration = asFunction(() => obj).transient();
    sinon.spy(transientFuncRegistration, 'resolve');
    container.register('func', transientFuncRegistration);
    container.resolve('func');
    container.resolve('func');
    expect(transientFuncRegistration.resolve.calledTwice).toBe(true);

    const singletonFuncRegistration = asFunction(() => obj).singleton();
    sinon.spy(singletonFuncRegistration, 'resolve');
    container.register('func2', singletonFuncRegistration);
    container.resolve('func2');
    container.resolve('func2');
    expect(singletonFuncRegistration.resolve.calledOnce).toBe(true);

    const scopedFuncRegistration = asFunction(() => obj).scoped();
    sinon.spy(scopedFuncRegistration, 'resolve');
    container.register('func3', scopedFuncRegistration);
    container.resolve('func3');
    container.resolve('func3');
    expect(scopedFuncRegistration.resolve.calledOnce).toBe(true);

    const scope = container.createScope();
    scope.register('func4', scopedFuncRegistration);
    expect(scope.resolve('func3')).toBe(obj);
    expect(scopedFuncRegistration.resolve.calledOnce).toBe(true);
    expect(() => container.resolve('func4')).toThrowError();

    const unknownFuncRegistration = asFunction(() => obj).setLifetime(
      'testtest',
    );
    container.register('func5', unknownFuncRegistration);
    expect(() => container.resolve('func5')).toThrowError();
  });

  test('resolve should react on singleton lifetime', () => {
    const obj = {};
    const singletonFuncRegistration = asFunction(() => obj).singleton();
    sinon.spy(singletonFuncRegistration, 'resolve');
    container.register('func2', singletonFuncRegistration);
    container.resolve('func2');
    container.resolve('func2');
    expect(singletonFuncRegistration.resolve.calledOnce).toBe(true);
  });

  test('resolve should react on scoped lifetime', () => {
    const obj = {};
    const scopedFuncRegistration = asFunction(() => obj).scoped();
    sinon.spy(scopedFuncRegistration, 'resolve');
    container.register('func3', scopedFuncRegistration);
    container.resolve('func3');
    container.resolve('func3');
    expect(scopedFuncRegistration.resolve.calledOnce).toBe(true);

    const scope = container.createScope();
    scope.register('func4', scopedFuncRegistration);
    expect(scope.resolve('func3')).toBe(obj);
    expect(scopedFuncRegistration.resolve.calledOnce).toBe(true);
    expect(() => container.resolve('func4')).toThrowError();
  });

  test('resolve should react on unknown lifetime', () => {
    const obj = {};

    const unknownFuncRegistration = asFunction(() => obj).setLifetime(
      'testtest',
    );
    container.register('func5', unknownFuncRegistration);
    expect(() => container.resolve('func5')).toThrowError();
  });

  test('should throw error on duplication of id', () => {
    container.registerClass(
      'name',
      class A {
        static dependencies = ['name2'];
      },
    );
    container.registerClass(
      'name2',
      class B {
        static dependencies = ['name'];
      },
    );
    expect(() => container.resolve('name')).toThrowError();
  });

  test('should throw error if trying to resolve not registered module', () => {
    expect(() => container.resolve('name')).toThrowError();
  });
});
