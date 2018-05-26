import { Container } from './dependency-container/createContainer';
import convertToDeviceRelatedConfig, { IPlayerConfig } from './config';
import { PLAYER_API_PROPERTY } from '../core/player-api-decorator';
import { IThemeConfig } from '../modules/ui/core/theme';

export default class Player {
  //@ts-ignore
  private _config: IPlayerConfig;
  private _defaultModules: {};
  private _additionalModules: {};
  private _destroyed: boolean;

  constructor(
    params: IPlayerConfig,
    scope: Container,
    defaultModulesNames: string[] = [],
    additionalModuleNames: string[] = [],
    themeConfig?: IThemeConfig,
  ) {
    scope.registerValue({
      config: convertToDeviceRelatedConfig(params),
    });

    scope.registerValue({
      themeConfig,
    });

    this._config = scope.resolve('config');

    this._resolveDefaultModules(scope, defaultModulesNames);
    this._resolveAdditionalModules(scope, additionalModuleNames);
  }

  /*
    Separation for default and additional modules is needed
    for future implementation of public methods of resolved modules and
    could be abolished in future
  */

  private _resolveDefaultModules(scope: Container, modulesNames: string[]) {
    this._defaultModules = modulesNames.reduce((modules, moduleName) => {
      const resolvedModule = scope.resolve(moduleName);

      this._addPlayerAPIFromModule(resolvedModule, moduleName);

      modules[moduleName] = resolvedModule;
      return modules;
    }, {});
  }

  private _resolveAdditionalModules(scope: Container, modulesNames: string[]) {
    this._additionalModules = modulesNames.reduce((modules, moduleName) => {
      const resolvedModule = scope.resolve(moduleName);

      this._addPlayerAPIFromModule(resolvedModule, moduleName);

      modules[moduleName] = resolvedModule;
      return modules;
    }, {});
  }

  private _getWrappedCallToModuleFunction(module, _moduleName, fn) {
    // TODO: do we need `_moduleName` as second parameter?
    return (...args) => {
      if (this._destroyed) {
        throw new Error('Player instance is destroyed');
      }

      return fn.apply(module, args);
    };
  }

  private _getPlayerAPIMethodDescriptor(module, moduleName, descriptor) {
    const playerMethodDescriptor: any = {
      enumerable: true,
      configurable: true,
    };

    const { get, set, value } = descriptor;

    if (get) {
      playerMethodDescriptor.get = this._getWrappedCallToModuleFunction(
        module,
        moduleName,
        get,
      );
    }

    if (set) {
      playerMethodDescriptor.set = this._getWrappedCallToModuleFunction(
        module,
        moduleName,
        set,
      );
    }

    if (value) {
      playerMethodDescriptor.value = this._getWrappedCallToModuleFunction(
        module,
        moduleName,
        value,
      );
    }

    return playerMethodDescriptor;
  }

  private _addPlayerAPIFromModule(module, moduleName) {
    if (module[PLAYER_API_PROPERTY]) {
      Object.keys(module[PLAYER_API_PROPERTY]).forEach(apiKey => {
        if (this[apiKey]) {
          throw new Error(
            `API method ${apiKey} is already defined in Player facade`,
          );
        }

        Object.defineProperty(
          this,
          apiKey,
          this._getPlayerAPIMethodDescriptor(
            module,
            moduleName,
            module[PLAYER_API_PROPERTY][apiKey],
          ),
        );
      });
    }
  }

  private _clearPlayerAPIForModule(module) {
    if (module[PLAYER_API_PROPERTY]) {
      Object.keys(module[PLAYER_API_PROPERTY]).forEach(apiKey => {
        delete this[apiKey];
      });
    }
  }

  destroy() {
    Object.keys(this._defaultModules).forEach(moduleName => {
      const module = this._defaultModules[moduleName];
      this._clearPlayerAPIForModule(module);
      module.destroy();
    });

    Object.keys(this._additionalModules).forEach(moduleName => {
      const module = this._additionalModules[moduleName];
      this._clearPlayerAPIForModule(module);
      if (module.destroy) {
        module.destroy();
      }
    });

    this._defaultModules = null;
    this._additionalModules = null;
    this._config = null;

    this._destroyed = true;
  }
}
