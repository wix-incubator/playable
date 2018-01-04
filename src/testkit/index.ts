import * as merge from 'lodash/merge';
import { container } from '../core/player-factory';
import DependencyContainer from '../core/dependency-container';

const { asClass } = DependencyContainer;

export default function createPlayerTestkit(config = {}, adapters = []) {
  const _config = merge(config);

  const scope = container.createScope();

  scope.registerValue('config', _config);
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
        ...merge(config),
      });
    },
    setPlaybackAdapters(adapters) {
      scope.registerValue('availablePlaybackAdapters', [...adapters]);
    },
  };
}
