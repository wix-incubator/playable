import { __assign } from 'tslib';

import { asClass, asFunction, asValue } from './registrations';
import ResolutionError from './errors/ResolutionError';
import nameValueToObject from './utils/nameValueToObject';
import Lifetime from './constants/Lifetime';
import { IOptions } from './types';

const FAMILY_TREE = '__familyTree__';

export class Container {
  private _registrations: {} = {};
  private _resolutionStack: string[] = [];
  private _parentContainer: Container;

  options: IOptions;
  cache: {};
  [FAMILY_TREE]: Array<Container>;

  constructor(options?: IOptions, _parentContainer?: Container) {
    this.options = __assign({}, options);
    this._parentContainer = _parentContainer || null;
    this[FAMILY_TREE] = this._parentContainer
      ? [this].concat(this._parentContainer[FAMILY_TREE] as any)
      : [this];
    this.cache = {};
  }

  get registrations(): {} {
    return __assign(
      {},
      this._parentContainer && this._parentContainer.registrations,
      this._registrations,
    );
  }

  private _registerAs(
    fn: Function,
    verbatimValue: boolean,
    name: Object | string,
    value?: any,
    options?: IOptions,
  ) {
    const registrations: {} = nameValueToObject(name, value);

    Object.keys(registrations).forEach(key => {
      let valueToRegister = registrations[key];

      // If we have options, copy them over.
      options = __assign({}, options);

      /* ignore coverage */
      if (!verbatimValue && Array.isArray(valueToRegister)) {
        // The ('name', [value, options]) style
        options = __assign({}, options, valueToRegister[1]);
        valueToRegister = valueToRegister[0];
      }

      this.register(key, fn(valueToRegister, options));
    });

    // Chaining
    return this;
  }

  createScope() {
    return new Container(this.options, this);
  }

  register(name: Object | string, registration?: any): Container {
    const obj: {} = nameValueToObject(name, registration);
    Object.keys(obj).forEach(key => {
      this._registrations[key] = obj[key];
    });

    return this;
  }

  registerClass(
    name: Object | string,
    value?: any,
    options?: IOptions,
  ): Container {
    return this._registerAs(asClass, false, name, value, options);
  }

  registerFunction(
    name: Object | string,
    value?: any,
    options?: IOptions,
  ): Container {
    return this._registerAs(asFunction, false, name, value, options);
  }

  registerValue(
    name: Object | string,
    value?: any,
    options?: IOptions,
  ): Container {
    return this._registerAs(asValue, true, name, value, options);
  }

  resolve(name: string) {
    // We need a reference to the root container,
    // so we can retrieve and store singletons.
    const root: Container = this[FAMILY_TREE][this[FAMILY_TREE].length - 1];

    try {
      // Grab the registration by name.
      const registration = this.registrations[name];

      if (this._resolutionStack.indexOf(name) > -1) {
        throw new ResolutionError(
          name,
          this._resolutionStack,
          'Cyclic dependencies detected.',
        );
      }

      if (!registration) {
        throw new ResolutionError(name, this._resolutionStack);
      }

      // Pushes the currently-resolving module name onto the stack
      this._resolutionStack.push(name);

      // Do the thing
      let cached;
      let resolved;

      switch (registration.lifetime) {
        case Lifetime.TRANSIENT:
          // Transient lifetime means resolve every time.
          resolved = registration.resolve(this);
          break;
        case Lifetime.SINGLETON:
          // Singleton lifetime means cache at all times, regardless of scope.
          cached = root.cache[name];
          if (cached === undefined) {
            resolved = registration.resolve(this);
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
          for (const _containerFromFamiltyTree of this[FAMILY_TREE]) {
            cached = _containerFromFamiltyTree.cache[name];
            if (cached !== undefined) {
              // We found one!
              resolved = cached;
              break;
            }
          }

          // If we still have not found one, we need to resolve and cache it.
          if (cached === undefined) {
            resolved = registration.resolve(this);
            this.cache[name] = resolved;
          }
          break;
        default:
          throw new ResolutionError(
            name,
            this._resolutionStack,
            `Unknown lifetime "${registration.lifetime}"`,
          );
      }
      // Pop it from the stack again, ready for the next resolution
      this._resolutionStack.pop();
      return resolved;
    } catch (err) {
      // When we get an error we need to reset the stack.
      this._resolutionStack = [];
      throw err;
    }
  }
}

export default function createContainer(
  options?: IOptions,
  __parentContainer?: Container,
): Container {
  return new Container(options, __parentContainer);
}
