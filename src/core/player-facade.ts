import { Container } from './dependency-container/createContainer';
import convertToDeviceRelatedConfig, { IPlayerConfig } from './config';
import { PLAYER_API_PROPERTY } from '../core/player-api-decorator';
import { IThemeConfig } from '../modules/ui/core/theme';

export default class Player {
  //@ts-ignore
  private _config: IPlayerConfig;
  private _scope: Container;
  private _defaultModules: { [id: string]: any };
  private _additionalModules: { [id: string]: any };
  private _destroyed: boolean;

  constructor(
    params: IPlayerConfig,
    scope: Container,
    defaultModulesNames: string[] = [],
    additionalModuleNames: string[] = [],
    themeConfig?: IThemeConfig,
  ) {
    this._scope = scope;
    this._scope.registerValue({
      config: convertToDeviceRelatedConfig(params),
    });

    this._scope.registerValue({
      themeConfig,
    });

    this._config = this._scope.resolve('config');

    this._resolveAdditionalModules(additionalModuleNames);
    this._resolveDefaultModules(defaultModulesNames);
  }

  /*
    Separation for default and additional modules is needed
    for future implementation of public methods of resolved modules and
    could be abolished in future
  */

  private _resolveDefaultModules(modulesNames: string[]) {
    this._defaultModules = modulesNames.reduce(
      (modules: { [id: string]: any }, moduleName: string) => {
        if (this._additionalModules[moduleName]) {
          return modules;
        }

        const resolvedModule = this._scope.resolve(moduleName);

        this._addPlayerAPIFromModule(resolvedModule);

        modules[moduleName] = resolvedModule;
        return modules;
      },
      {},
    );
  }

  private _resolveAdditionalModules(modulesNames: string[]) {
    this._additionalModules = modulesNames.reduce(
      (modules: { [id: string]: any }, moduleName: string) => {
        const resolvedModule = this._scope.resolve(moduleName);

        this._addPlayerAPIFromModule(resolvedModule);

        modules[moduleName] = resolvedModule;
        return modules;
      },
      {},
    );
  }

  private _getWrappedCallToModuleFunction(module: any, fn: Function) {
    return (...args: any[]) => {
      if (this._destroyed) {
        throw new Error('Player instance is destroyed');
      }

      return fn.apply(module, args);
    };
  }

  private _getPlayerAPIMethodDescriptor(
    module: any,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const playerMethodDescriptor: PropertyDescriptor = {
      enumerable: true,
      configurable: true,
    };

    const { get, set, value } = descriptor;

    if (get) {
      playerMethodDescriptor.get = this._getWrappedCallToModuleFunction(
        module,
        get,
      );
    }

    if (set) {
      playerMethodDescriptor.set = this._getWrappedCallToModuleFunction(
        module,
        set,
      );
    }

    if (value) {
      playerMethodDescriptor.value = this._getWrappedCallToModuleFunction(
        module,
        value,
      );
      playerMethodDescriptor.writable = true;
    }

    return playerMethodDescriptor;
  }

  private _addPlayerAPIFromModule(module: any) {
    if (module[PLAYER_API_PROPERTY]) {
      Object.keys(module[PLAYER_API_PROPERTY]).forEach(apiKey => {
        if ((this as any)[apiKey]) {
          throw new Error(
            `API method ${apiKey} is already defined in Player facade`,
          );
        }

        Object.defineProperty(
          this,
          apiKey,
          this._getPlayerAPIMethodDescriptor(
            module,
            module[PLAYER_API_PROPERTY][apiKey],
          ),
        );
      });
    }
  }

  private _clearPlayerAPIForModule(module: any) {
    if (module[PLAYER_API_PROPERTY]) {
      Object.keys(module[PLAYER_API_PROPERTY]).forEach(apiKey => {
        delete (this as any)[apiKey];
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
    this._scope = null;

    this._destroyed = true;
  }
}
