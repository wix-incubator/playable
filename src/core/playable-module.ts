import { PLAYER_API_PROPERTY } from './player-api-decorator';

type ModuleAPI = Record<string, any> | void;

// For internal use. Combines 2 possible module API definitions:
// 1) @playerAPI() decorator
// 2) getAPI() method

export type IModule<T extends ModuleAPI> = {
  [PLAYER_API_PROPERTY]?: Record<string, any>;
  getAPI?(): T;
};

// For public use. Omit PLAYER_API_PROPERTY to force consumers to use 'getAPI()';

type ModuleWithoutAPI = {};

type ModuleWithAPI<T> = ModuleWithoutAPI &
  Required<Omit<IModule<T>, typeof PLAYER_API_PROPERTY>>;

export type IPlayableModule<T extends ModuleAPI = void> = T extends void
  ? ModuleWithoutAPI
  : ModuleWithAPI<T>;
