import { asClass, asFunction, asValue } from './registrations';
import ResolutionError from './errors/ResolutionError';
import nameValueToObject from './utils/nameValueToObject';
import Lifetime from './constants/Lifetime';
import last from 'lodash/last';


const FAMILY_TREE = Symbol('familyTree');

export default function createContainer(options, __parentContainer) {
  options = Object.assign({}, options);

  // The resolution stack is used to keep track
  // of what modules are being resolved, so when
  // an error occurs, we have something to present
  // to the poor developer who fucked up.
  let resolutionStack = [];

  // For performance reasons, we store
  // the rolled-up registrations when starting a resolve.
  let __tempRegistrations = null;

  // Internal registration store.
  const registrations = {};

  // The container being exposed.
  const container = {
    options,
    get registrations() {
      return Object.assign(
        {},
        __parentContainer && __parentContainer.registrations,
        registrations
      );
    }
  };

  // Track the family tree.
  const familyTree = __parentContainer ?
    [container].concat(__parentContainer[FAMILY_TREE]) :
    [container];

  container[FAMILY_TREE] = familyTree;
  container.cache = {};
  container.createScope = () => createContainer(options, container);
  container.register = (name, registration) => {
    const obj = nameValueToObject(name, registration);
    Object.keys(obj).forEach(key => {
      registrations[key] = obj[key];
    });

    return container;
  };

  const makeRegister = (fn, verbatimValue) => function (name, value, opts) {
    // This ensures that we can support name+value style and object style.
    const obj = nameValueToObject(name, value);

    Object.keys(obj).forEach(key => {
      let valueToRegister = obj[key];

      // If we have options, copy them over.
      opts = Object.assign({}, opts);

      if (!verbatimValue && Array.isArray(valueToRegister)) {
        // The ('name', [value, opts]) style
        opts = Object.assign({}, opts, valueToRegister[1]);
        valueToRegister = valueToRegister[0];
      }

      container.register(key, fn(valueToRegister, opts));
    });

    // Chaining
    return container;
  };

  container.registerFunction = makeRegister(asFunction);
  container.registerClass = makeRegister(asClass);
  container.registerValue = makeRegister(asValue, /* verbatimValue: */ true);
  container.resolve = name => {
    if (!__tempRegistrations) {
      __tempRegistrations = container.registrations;
    }

    // We need a reference to the root container,
    // so we can retrieve and store singletons.
    const root = last(familyTree);

    try {
      // Grab the registration by name.
      const registration = __tempRegistrations[name];
      if (resolutionStack.indexOf(name) > -1) {
        throw new ResolutionError(name, resolutionStack, 'Cyclic dependencies detected.');
      }

      if (!registration) {
        throw new ResolutionError(name, resolutionStack);
      }

      // Pushes the currently-resolving module name onto the stack
      resolutionStack.push(name);

      // Do the thing
      let cached;
      let resolved;

      switch (registration.lifetime) {
        case Lifetime.TRANSIENT:
          // Transient lifetime means resolve every time.
          resolved = registration.resolve(container);
          break;
        case Lifetime.SINGLETON:
          // Singleton lifetime means cache at all times, regardless of scope.
          cached = root.cache[name];
          if (cached === undefined) {
            resolved = registration.resolve(container);
            root.cache[name] = resolved;
          } else {
            resolved = cached;
          }
          break;
        case Lifetime.SCOPED:
          // Scoped lifetime means that the container
          // that resolves the registration also caches it.
          // When a registration is not found, we travel up
          // the family tree until we find one that is cached.

          // Note: The first element in the family tree is this container.
          for (const c of familyTree) {
            cached = c.cache[name];
            if (cached !== undefined) {
            // We found one!
              resolved = cached;
              break;
            }
          }

          // If we still have not found one, we need to resolve and cache it.
          if (cached === undefined) {
            resolved = registration.resolve(container);
            container.cache[name] = resolved;
          }
          break;
        default:
          throw new ResolutionError(name, resolutionStack, `Unknown lifetime "${registration.lifetime}"`);
      }
      // Pop it from the stack again, ready for the next resolution
      resolutionStack.pop();
      return resolved;
    } catch (err) {
      // When we get an error we need to reset the stack.
      resolutionStack = [];
      throw err;
    } finally {
      // Clear the temporary registrations
      // so we get a fresh one next time.
      if (!resolutionStack.length) {
        __tempRegistrations = null;
      }
    }
  };

  // Finally return the container
  return container;
}
