import 'jsdom-global/register';

import { container } from '../core/player-factory';
import DependencyContainer from '../core/dependency-container';

const { asClass } = DependencyContainer;

function setProperty(target, propertyKey, propertyValue) {
  Reflect.defineProperty(target, propertyKey, {
    ...Reflect.getOwnPropertyDescriptor(
      target.constructor.prototype,
      propertyKey,
    ),
    get: () => propertyValue,
  });
}

function resetProperty(target, propertyKey) {
  Reflect.deleteProperty(target, propertyKey);
}

export { setProperty, resetProperty };

export default function createPlayerTestkit(config = {}, adapters = []) {
  const _config = config;

  const scope = container.createScope();

  scope.registerValue('config', _config);
  scope.registerValue('themeConfig', null);
  scope.registerValue('availablePlaybackAdapters', [...adapters]);

  return {
    getModule(name) {
      return scope.resolve(name);
    },
    registerModule(name: string, fn: Function) {
      scope.register(name, asClass(fn));
    },
    registerModuleAsSingleton(name: string, fn: Function) {
      scope.register(name, asClass(fn).scoped());
    },
    setConfig(config: object) {
      scope.registerValue('config', {
        ...config,
      });
    },
    setPlaybackAdapters(adapters) {
      scope.registerValue('availablePlaybackAdapters', [...adapters]);
    },
  };
}
