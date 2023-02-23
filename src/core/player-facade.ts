import { Container } from './dependency-container/createContainer';
import convertToDeviceRelatedConfig, { IPlayerConfig } from './config';
import { PLAYER_API_PROPERTY } from './player-api-decorator';
import { IThemeConfig } from '../modules/ui/core/theme';
import { IModule } from './playable-module';

export default class Player {
  protected _config: IPlayerConfig;
  protected _scope: Container;
  protected _defaultModules: { [id: string]: any };
  protected _additionalModules: { [id: string]: any };
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

  private _getWrappedCallToModuleFunction(module: IModule, fn: Function) {
    return (...args: any[]) => {
      if (this._destroyed) {
        throw new Error('Player instance is destroyed');
      }

      return fn.apply(module, args);
    };
  }

  private _getPlayerAPIMethodDescriptor(
    module: IModule,
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

  private _getModuleApi(module: IModule) {
    return module.getAPI ? module.getAPI() : module[PLAYER_API_PROPERTY];
  }

  private _addPlayerAPIFromModule(module: IModule) {
    const moduleApi = this._getModuleApi(module);
    const getDescriptor = module.getAPI
      ? (apiKey: string) => Object.getOwnPropertyDescriptor(moduleApi, apiKey)
      : (apiKey: string) =>
          this._getPlayerAPIMethodDescriptor(module, moduleApi[apiKey]);

    if (moduleApi) {
      Object.keys(moduleApi).forEach(apiKey => {
        if ((this as any)[apiKey]) {
          throw new Error(
            `API method ${apiKey} is already defined in Player facade`,
          );
        }

        Object.defineProperty(this, apiKey, getDescriptor(apiKey));
      });
    }
  }

  private _clearPlayerAPIForModule(module: IModule) {
    const moduleApi = this._getModuleApi(module);

    if (moduleApi) {
      Object.keys(moduleApi).forEach(apiKey => {
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
