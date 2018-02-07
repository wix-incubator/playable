import Lifetime from './constants/Lifetime';
import NotAFunctionError from './errors/NotAFunctionError';
import assign from './utils/assign';

export const PROPERTY_FOR_DEPENDENCIES = 'dependencies';
const makeOptions = (defaults, input) => assign({}, defaults, input);

export const makeFluidInterface = obj => {
  const setLifetime = value => {
    obj.lifetime = value;
    return obj;
  };

  return {
    setLifetime,
    transient: () => setLifetime(Lifetime.TRANSIENT),
    scoped: () => setLifetime(Lifetime.SCOPED),
    singleton: () => setLifetime(Lifetime.SINGLETON),
  };
};

export const asValue = value => {
  const resolve = () => value;

  return {
    resolve,
    lifetime: Lifetime.TRANSIENT,
  };
};

export const asFunction: any = (fn, opts?) => {
  if (typeof fn !== 'function') {
    throw new NotAFunctionError('asFunction', 'function', typeof fn);
  }

  const defaults = {
    lifetime: Lifetime.TRANSIENT,
  };

  opts = makeOptions(defaults, opts);

  const resolve = generateResolve(fn);
  const result = {
    resolve,
    lifetime: opts.lifetime,
  };
  result.resolve = resolve.bind(result);
  assign(result, makeFluidInterface(result));
  return result;
};

export const asClass: any = (Type: FunctionConstructor, opts?) => {
  if (typeof Type !== 'function') {
    throw new NotAFunctionError('asClass', 'class', typeof Type);
  }

  const defaults = {
    lifetime: Lifetime.TRANSIENT,
  };

  opts = makeOptions(defaults, opts);

  // A function to handle object construction for us, as to make the generateResolve more reusable
  const newClass = (...args) => new Type(...args);

  const resolve = generateResolve(newClass, Type);
  const result = {
    resolve,
    lifetime: opts.lifetime,
  };
  result.resolve = resolve.bind(result);
  assign(result, makeFluidInterface(result));

  return result;
};

function generateResolve(fn, dependencyParseTarget?) {
  // If the function used for dependency parsing is falsy, use the supplied function
  if (!dependencyParseTarget) {
    dependencyParseTarget = fn;
  }
  // Try to resolve the dependencies
  const dependencies = dependencyParseTarget[PROPERTY_FOR_DEPENDENCIES] || [];

  // Use a regular function instead of an arrow function to facilitate binding to the registration.
  return function resolve(container) {
    if (dependencies.length > 0) {
      const wrapper = dependencies.reduce((wrapper, d) => {
        wrapper[d] = container.resolve(d);
        return wrapper;
      }, {});

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