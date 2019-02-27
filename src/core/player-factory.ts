import DependencyContainer from './dependency-container';
import PlayerFacade from './player-facade';

import defaultModules, { IPlayer } from './default-modules';
import defaultPlaybackAdapters from '../modules/playback-engine/adapters/default-set';

import { IThemeConfig } from '../modules/ui/core/theme';

import { IPlayerConfig } from './config';
import { IPlaybackAdapterClass } from '../modules/playback-engine/adapters/types';

let additionalModules: { [id: string]: any } = {};
let playbackAdapters: IPlaybackAdapterClass[] = [...defaultPlaybackAdapters];

export const container = DependencyContainer.createContainer();
container.register(defaultModules);
const defaultModulesNames = Object.keys(defaultModules);

export function registerModule(id: string, module: any) {
  additionalModules[id] = module;
}

export function registerPlaybackAdapter(adapter: any) {
  playbackAdapters.push(adapter);
}

export function clearAdditionalModules() {
  additionalModules = {};
}

export function clearPlaybackAdapters() {
  playbackAdapters = [...defaultPlaybackAdapters];
}

export interface IPlayerInstance extends IPlayer {
  destroy(): void;
}

export function create(
  params: IPlayerConfig = {},
  themeConfig?: IThemeConfig,
): IPlayerInstance {
  const scope = container.createScope();

  const additionalModuleNames = Object.keys(additionalModules);

  if (additionalModuleNames.length) {
    additionalModuleNames.forEach(moduleName =>
      scope.registerClass(moduleName, additionalModules[moduleName], {
        lifetime: DependencyContainer.Lifetime.SCOPED,
      }),
    );
  }

  scope.registerValue('availablePlaybackAdapters', playbackAdapters);

  return new PlayerFacade(
    params,
    scope,
    defaultModulesNames,
    additionalModuleNames,
    themeConfig,
  );
}
