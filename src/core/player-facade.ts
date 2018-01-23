import convertToDeviceRelatedConfig, { IPlayerConfig } from './config';
import { PLAYER_API_PROPERTY } from '../utils/player-api-decorator';
import { IThemeConfig } from '../default-modules/ui/core/theme';

export default class Player {
  private _config;
  private _defaultModules;
  private _additionalModules;
  private _destroyed: boolean;

  constructor(
    params: IPlayerConfig,
    scope,
    defaultModules,
    additionalModules = {},
    themeConfig?: IThemeConfig,
  ) {
    scope.registerValue({
      config: convertToDeviceRelatedConfig(params),
    });

    scope.registerValue({
      themeConfig,
    });

    this._config = scope.resolve('config');

    this._resolveDefaultModules(scope, defaultModules);
    this._resolveAdditionalModules(scope, additionalModules);
  }

  /*
    Separation for default and additional modules is needed
    for future implementation of public methods of resolved modules and
    could be abolished in future
  */

  _resolveDefaultModules(scope, modules) {
    this._defaultModules = Object.keys(modules).reduce(
      (modules, moduleName) => {
        const resolvedModule = scope.resolve(moduleName);

        this._addPlayerAPIFromModule(resolvedModule, moduleName);

        modules[moduleName] = resolvedModule;
        return modules;
      },
      {},
    );
  }

  _resolveAdditionalModules(scope, modules) {
    this._additionalModules = Object.keys(modules).reduce(
      (modules, moduleName) => {
        const resolvedModule = scope.resolve(moduleName);

        this._addPlayerAPIFromModule(resolvedModule, moduleName);

        modules[moduleName] = resolvedModule;
        return modules;
      },
      {},
    );
  }

  _getWrappedCallToModuleFunction(module, _moduleName, fn) {
    // TODO: do we need `_moduleName` as second parameter?
    return (...args) => {
      if (this._destroyed) {
        throw new Error('Player instance is destroyed');
      }

      return fn.apply(module, args);
    };
  }

  _getPlayerAPIMethodDescriptor(module, moduleName, descriptor) {
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

  _addPlayerAPIFromModule(module, moduleName) {
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

  _clearPlayerAPIForModule(module) {
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

    delete this._defaultModules;
    delete this._additionalModules;
    delete this._config;

    this._destroyed = true;
  }
}
