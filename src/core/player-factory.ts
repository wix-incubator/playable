import DependencyContainer from './dependency-container';
import PlayerFacade from './player-facade';

import defaultModules from '../default-modules';
import defaultPlaybackAdapters from '../default-modules/playback-engine/adapters/default-set';

let additionalModules = {};
let playbackAdapters = [...defaultPlaybackAdapters];

export const container = DependencyContainer.createContainer();
container.register(defaultModules);

export function registerModule(id, config) {
  additionalModules[id] = config;
}

export function registerPlaybackAdapter(adapter) {
  playbackAdapters.push(adapter);
}

export function clearAdditionalModules() {
  additionalModules = {};
}

export function clearPlaybackAdapters() {
  playbackAdapters = [...defaultPlaybackAdapters];
}

export default function create(params = {}) {
  const scope = container.createScope();

  const additionalModuleNames = Object.keys(additionalModules);

  if (additionalModuleNames.length) {
    additionalModuleNames.forEach(moduleName =>
      scope.registerClass(moduleName, additionalModules[moduleName]),
    );
  }

  scope.registerValue('availablePlaybackAdapters', playbackAdapters);

  return new PlayerFacade(params, scope, defaultModules, additionalModules);
}