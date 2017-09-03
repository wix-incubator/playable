import mapParamsToConfig from './config-mapper';
import { PUBLIC_API_PROPERTY } from '../utils/public-api-decorator';


export default class Player {
  constructor(rootNode, params, scope, defaultModules, additionalModules = []) {
    scope.registerValue({
      config: mapParamsToConfig(params),
      rootNode
    });

    this._config = scope.resolve('config');

    this._resolveDefaultModules(scope, defaultModules);
    this._resolveAdditionalModules(scope, additionalModules);
  }

  _resolveDefaultModules(scope, modules) {
    this._defaultModules = Object.keys(modules).reduce((modules, moduleName) => {
      const resolvedModule = scope.resolve(moduleName);

      this._addPublicAPIFromModule(resolvedModule, moduleName);

      modules[moduleName] = resolvedModule;
      return modules;
    }, {});
  }

  _resolveAdditionalModules(scope, modules) {
    this._additionalModules = modules.reduce((modules, moduleName) => {
      modules[moduleName] = scope.resolve(moduleName);
      return modules;
    }, {});
  }

  _getWrappedCallToModuleFunction(module, moduleName, fn) {
    return (...args) => {
      if (!this._defaultModules || !this._defaultModules[moduleName]) {
        return;
      }

      return fn.apply(module, args);
    };
  }

  _getPublicAPIMethodDescriptor(module, moduleName, descriptor) {
    const publicMethodDescriptor = {
      enumerable: true,
      configurable: true
    };

    const { get, set, value } = descriptor;

    if (get) {
      publicMethodDescriptor.get = this._getWrappedCallToModuleFunction(module, moduleName, get);
    }

    if (set) {
      publicMethodDescriptor.set = this._getWrappedCallToModuleFunction(module, moduleName, set);
    }

    if (value) {
      publicMethodDescriptor.value = this._getWrappedCallToModuleFunction(module, moduleName, value);
    }

    return publicMethodDescriptor;
  }

  _addPublicAPIFromModule(module, moduleName) {
    if (module[PUBLIC_API_PROPERTY]) {
      Object.keys(module[PUBLIC_API_PROPERTY]).forEach(apiKey => {
        if (this[apiKey]) {
          throw new Error(`API method ${apiKey} is already defined in Player facade`);
        }

        Object.defineProperty(
          this,
          apiKey,
          this._getPublicAPIMethodDescriptor(module, moduleName, module[PUBLIC_API_PROPERTY][apiKey])
        );
      });
    }
  }

  _clearPublicAPIForModule(module) {
    if (module[PUBLIC_API_PROPERTY]) {
      Object.keys(module[PUBLIC_API_PROPERTY]).forEach(apiKey => {
        delete this[apiKey];
      });
    }
  }

  destroy() {
    Object.keys(this._defaultModules).forEach(moduleName => {
      const module = this._defaultModules[moduleName];
      this._clearPublicAPIForModule(module);

      module.destroy();
    });

    Object.keys(this._additionalModules).forEach(moduleName => {
      const module = this._additionalModules[moduleName];

      if (module.destroy) {
        module.destroy();
      }
    });

    delete this._defaultModules;
    delete this._additionalModules;
    delete this._config;
  }
}
