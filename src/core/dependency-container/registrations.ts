import { __assign } from 'tslib';

import NotAFunctionError from './errors/NotAFunctionError';

import Lifetime from './constants/Lifetime';
import { IOptions } from './types';

import { Container } from './createContainer';

export const PROPERTY_FOR_DEPENDENCIES = 'dependencies';

export const makeFluidInterface = (obj: IOptions) => {
  const setLifetime = (value: Lifetime) => {
    obj.lifetime = value;
    return obj;
  };

  return {
    setLifetime,
    transient: () => setLifetime(Lifetime.Transient),
    scoped: () => setLifetime(Lifetime.Scoped),
    singleton: () => setLifetime(Lifetime.Singelton),
  };
};

export const asValue = (value: any): any => {
  const resolve = () => value;

  return {
    resolve,
    lifetime: Lifetime.Transient,
  };
};

export const asFunction: any = (fn: Function, options?: IOptions): any => {
  if (typeof fn !== 'function') {
    throw new NotAFunctionError('asFunction', 'function', typeof fn);
  }

  const defaults = {
    lifetime: Lifetime.Transient,
  };

  options = __assign({}, defaults, options);

  const resolve = generateResolve(fn);
  const result = {
    resolve,
    lifetime: options.lifetime,
  };
  result.resolve = resolve.bind(result);
  __assign(result, makeFluidInterface(result));

  return result;
};

export const asClass: any = (
  Type: FunctionConstructor,
  options?: IOptions,
): any => {
  if (typeof Type !== 'function') {
    throw new NotAFunctionError('asClass', 'class', typeof Type);
  }

  const defaults = {
    lifetime: Lifetime.Transient,
  };

  options = __assign({}, defaults, options);

  // A function to handle object construction for us, as to make the generateResolve more reusable
  const newClass = (...args: any[]) => new Type(...args);

  const resolve = generateResolve(newClass, Type);
  const result = {
    resolve,
    lifetime: options.lifetime,
  };
  result.resolve = resolve.bind(result);
  __assign(result, makeFluidInterface(result));

  return result;
};

function generateResolve(fn: Function, dependencyParseTarget?: any): any {
  // If the function used for dependency parsing is falsy, use the supplied function
  if (!dependencyParseTarget) {
    dependencyParseTarget = fn;
  }
  // Try to resolve the dependencies
  const dependencies = dependencyParseTarget[PROPERTY_FOR_DEPENDENCIES] || [];

  // Use a regular function instead of an arrow function to facilitate binding to the registration.
  return function resolve(container: Container) {
    if (dependencies.length > 0) {
      const wrapper: {} = dependencies.reduce(
        (wrapper: any, dependency: string) => {
          wrapper[dependency] = container.resolve(dependency);
          return wrapper;
        },
        {},
      );

      return fn(wrapper, container);
    }
    return fn(container);
  };
}

export default {
  asValue,
  asFunction,
  asClass,
};
