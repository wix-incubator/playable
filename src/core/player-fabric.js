import DependencyContainer from './dependency-container';
import PlayerFacade from './player-facade';

import defaultModules from '../default-modules';


let additionalModules = {};

export const container = DependencyContainer.createContainer();
container.register(defaultModules);

export function registerModule(id, config) {
  additionalModules[id] = config;
}

export function clearAdditionalModules() {
  additionalModules = {};
}

export default function create(params = {}) {
  const scope = container.createScope();

  const additionalModuleNames = Object.keys(additionalModules);

  if (additionalModuleNames.length) {
    additionalModuleNames.forEach(moduleName => scope.registerClass(moduleName, additionalModules[moduleName]));
  }

  //const rootNode = document.createElement('div');
  //rootNode.setAttribute('tabindex', 0);

  return new PlayerFacade(params, scope, defaultModules, additionalModuleNames);
}
