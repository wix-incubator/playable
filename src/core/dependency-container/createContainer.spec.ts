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
    jest.spyOn(valueRegistration, 'resolve');
    container.resolve('value');
    expect(valueRegistration.resolve as any).toHaveBeenCalled();

    const classARegistration = asClass(class A {});
    container.register('classA', classARegistration);
    jest.spyOn(classARegistration, 'resolve');
    container.resolve('classA');
    expect(classARegistration.resolve as any).toHaveBeenCalled();

    const funcRegistration = asFunction(() => {});
    container.register('func', funcRegistration);
    jest.spyOn(funcRegistration, 'resolve');
    container.resolve('func');
    expect(funcRegistration.resolve as any).toHaveBeenCalled();
  });

  test('resolve should react on transient lifetime', () => {
    const obj = {};
    const transientFuncRegistration = asFunction(() => obj).transient();
    jest.spyOn(transientFuncRegistration, 'resolve');
    container.register('func', transientFuncRegistration);
    container.resolve('func');
    container.resolve('func');
    expect(transientFuncRegistration.resolve).toHaveBeenCalledTimes(2);

    const singletonFuncRegistration = asFunction(() => obj).singleton();
    jest.spyOn(singletonFuncRegistration, 'resolve');
    container.register('func2', singletonFuncRegistration);
    container.resolve('func2');
    container.resolve('func2');
    expect(singletonFuncRegistration.resolve).toHaveBeenCalledTimes(1);

    const scopedFuncRegistration = asFunction(() => obj).scoped();
    jest.spyOn(scopedFuncRegistration, 'resolve');
    container.register('func3', scopedFuncRegistration);
    container.resolve('func3');
    container.resolve('func3');
    expect(scopedFuncRegistration.resolve).toHaveBeenCalledTimes(1);

    const scope = container.createScope();
    scope.register('func4', scopedFuncRegistration);
    expect(scope.resolve('func3')).toBe(obj);
    expect(scopedFuncRegistration.resolve).toHaveBeenCalledTimes(1);
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
    jest.spyOn(singletonFuncRegistration, 'resolve');
    container.register('func2', singletonFuncRegistration);
    container.resolve('func2');
    container.resolve('func2');
    expect(singletonFuncRegistration.resolve).toHaveBeenCalledTimes(1);
  });

  test('resolve should react on scoped lifetime', () => {
    const obj = {};
    const scopedFuncRegistration = asFunction(() => obj).scoped();
    jest.spyOn(scopedFuncRegistration, 'resolve');
    container.register('func3', scopedFuncRegistration);
    container.resolve('func3');
    container.resolve('func3');
    expect(scopedFuncRegistration.resolve).toHaveBeenCalledTimes(1);

    const scope = container.createScope();
    scope.register('func4', scopedFuncRegistration);
    expect(scope.resolve('func3')).toBe(obj);
    expect(scopedFuncRegistration.resolve).toHaveBeenCalledTimes(1);
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
