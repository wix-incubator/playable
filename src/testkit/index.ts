import { container } from '../core/player-factory';
import mapParamsToConfig from '../core/config-mapper';

export default function getContainer(config = {}, adapters = []) {
  const _config = {
    ...mapParamsToConfig({}),
    ...config,
  };

  const scope = container.createScope();

  scope.registerValue('config', _config);
  scope.registerValue('availablePlaybackAdapters', [...adapters]);

  const register = (name: string, fn: Function) => {
    scope.registerClass(name, fn);
  };

  return {
    get: name => {
      return scope.resolve(name);
    },
    register: (name: string, fn: Function) => {
      scope.registerClass(name, fn);
    },
    set config(config: object) {
      scope.registerValue('config', {
        ...config,
      });
    },
    set playbackAdapters(adapters) {
      scope.registerValue('availablePlaybackAdapters', [...adapters]);
    },
  };
}
