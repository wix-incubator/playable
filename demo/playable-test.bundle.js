(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Playable = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    var ExtendableError = /** @class */ (function (_super) {
        __extends(ExtendableError, _super);
        function ExtendableError(message) {
            var _this = _super.call(this, message) || this;
            Object.defineProperty(_this, 'message', {
                enumerable: false,
                value: message,
            });
            Object.defineProperty(_this, 'name', {
                enumerable: false,
                value: _this.constructor.name,
            });
            Error.captureStackTrace(_this, _this.constructor);
            return _this;
        }
        return ExtendableError;
    }(Error));

    var NotAFunctionError = /** @class */ (function (_super) {
        __extends(NotAFunctionError, _super);
        function NotAFunctionError(functionName, expectedType, givenType) {
            return _super.call(this, "The function " + functionName + " expected a " + expectedType + ", " + givenType + " given.") || this;
        }
        return NotAFunctionError;
    }(ExtendableError));

    var Lifetime;
    (function (Lifetime) {
        Lifetime["Singelton"] = "Singelton";
        Lifetime["Transient"] = "Transient";
        Lifetime["Scoped"] = "Scoped";
    })(Lifetime || (Lifetime = {}));
    var Lifetime$1 = Lifetime;

    var PROPERTY_FOR_DEPENDENCIES = 'dependencies';
    var makeFluidInterface = function (obj) {
        var setLifetime = function (value) {
            obj.lifetime = value;
            return obj;
        };
        return {
            setLifetime: setLifetime,
            transient: function () { return setLifetime(Lifetime$1.Transient); },
            scoped: function () { return setLifetime(Lifetime$1.Scoped); },
            singleton: function () { return setLifetime(Lifetime$1.Singelton); },
        };
    };
    var asValue = function (value) {
        var resolve = function () { return value; };
        return {
            resolve: resolve,
            lifetime: Lifetime$1.Transient,
        };
    };
    var asFunction = function (fn, options) {
        if (typeof fn !== 'function') {
            throw new NotAFunctionError('asFunction', 'function', typeof fn);
        }
        var defaults = {
            lifetime: Lifetime$1.Transient,
        };
        options = __assign({}, defaults, options);
        var resolve = generateResolve(fn);
        var result = {
            resolve: resolve,
            lifetime: options.lifetime,
        };
        result.resolve = resolve.bind(result);
        __assign(result, makeFluidInterface(result));
        return result;
    };
    var asClass = function (Type, options) {
        if (typeof Type !== 'function') {
            throw new NotAFunctionError('asClass', 'class', typeof Type);
        }
        var defaults = {
            lifetime: Lifetime$1.Transient,
        };
        options = __assign({}, defaults, options);
        // A function to handle object construction for us, as to make the generateResolve more reusable
        var newClass = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new (Type.bind.apply(Type, [void 0].concat(args)))();
        };
        var resolve = generateResolve(newClass, Type);
        var result = {
            resolve: resolve,
            lifetime: options.lifetime,
        };
        result.resolve = resolve.bind(result);
        __assign(result, makeFluidInterface(result));
        return result;
    };
    function generateResolve(fn, dependencyParseTarget) {
        // If the function used for dependency parsing is falsy, use the supplied function
        if (!dependencyParseTarget) {
            dependencyParseTarget = fn;
        }
        // Try to resolve the dependencies
        var dependencies = dependencyParseTarget[PROPERTY_FOR_DEPENDENCIES] || [];
        // Use a regular function instead of an arrow function to facilitate binding to the registration.
        return function resolve(container) {
            if (dependencies.length > 0) {
                var wrapper = dependencies.reduce(function (wrapper, dependency) {
                    wrapper[dependency] = container.resolve(dependency);
                    return wrapper;
                }, {});
                return fn(wrapper, container);
            }
            return fn(container);
        };
    }
    var registrations = {
        asValue: asValue,
        asFunction: asFunction,
        asClass: asClass,
    };

    var createErrorMessage = function (name, resolutionStack, message) {
        resolutionStack = resolutionStack.slice();
        resolutionStack.push(name);
        var resolutionPathString = resolutionStack.join(' -> ');
        var msg = "Could not resolve '" + name + "'.";
        if (message) {
            msg += " " + message + " \n\n Resolution path: " + resolutionPathString;
        }
        return msg;
    };
    var ResolutionError = /** @class */ (function (_super) {
        __extends(ResolutionError, _super);
        function ResolutionError(name, resolutionStack, message) {
            return _super.call(this, createErrorMessage(name, resolutionStack, message)) || this;
        }
        return ResolutionError;
    }(ExtendableError));

    function nameValueToObject (name, value) {
        if (typeof name !== 'object') {
            return __assign((_a = {}, _a[name] = value, _a));
        }
        return name;
        var _a;
    }

    var FAMILY_TREE = '__familyTree__';
    var Container = /** @class */ (function () {
        function Container(options, _parentContainer) {
            this._registrations = {};
            this._resolutionStack = [];
            this.options = __assign({}, options);
            this._parentContainer = _parentContainer || null;
            this[FAMILY_TREE] = this._parentContainer
                ? [this].concat(this._parentContainer[FAMILY_TREE])
                : [this];
            this.cache = {};
        }
        Object.defineProperty(Container.prototype, "registrations", {
            get: function () {
                return __assign({}, this._parentContainer && this._parentContainer.registrations, this._registrations);
            },
            enumerable: true,
            configurable: true
        });
        Container.prototype._registerAs = function (fn, verbatimValue, name, value, options) {
            var _this = this;
            var registrations$$1 = nameValueToObject(name, value);
            Object.keys(registrations$$1).forEach(function (key) {
                var valueToRegister = registrations$$1[key];
                // If we have options, copy them over.
                options = __assign({}, options);
                /* ignore coverage */
                if (!verbatimValue && Array.isArray(valueToRegister)) {
                    // The ('name', [value, options]) style
                    options = __assign({}, options, valueToRegister[1]);
                    valueToRegister = valueToRegister[0];
                }
                _this.register(key, fn(valueToRegister, options));
            });
            // Chaining
            return this;
        };
        Container.prototype.createScope = function () {
            return new Container(this.options, this);
        };
        Container.prototype.register = function (name, registration) {
            var _this = this;
            var obj = nameValueToObject(name, registration);
            Object.keys(obj).forEach(function (key) {
                _this._registrations[key] = obj[key];
            });
            return this;
        };
        Container.prototype.registerClass = function (name, value, options) {
            return this._registerAs(asClass, false, name, value, options);
        };
        Container.prototype.registerFunction = function (name, value, options) {
            return this._registerAs(asFunction, false, name, value, options);
        };
        Container.prototype.registerValue = function (name, value, options) {
            return this._registerAs(asValue, true, name, value, options);
        };
        Container.prototype.resolve = function (name) {
            // We need a reference to the root container,
            // so we can retrieve and store singletons.
            var root = this[FAMILY_TREE][this[FAMILY_TREE].length - 1];
            try {
                // Grab the registration by name.
                var registration = this.registrations[name];
                if (this._resolutionStack.indexOf(name) > -1) {
                    throw new ResolutionError(name, this._resolutionStack, 'Cyclic dependencies detected.');
                }
                if (!registration) {
                    throw new ResolutionError(name, this._resolutionStack);
                }
                // Pushes the currently-resolving module name onto the stack
                this._resolutionStack.push(name);
                // Do the thing
                var cached = void 0;
                var resolved = void 0;
                switch (registration.lifetime) {
                    case Lifetime$1.Transient:
                        // Transient lifetime means resolve every time.
                        resolved = registration.resolve(this);
                        break;
                    case Lifetime$1.Singelton:
                        // Singleton lifetime means cache at all times, regardless of scope.
                        cached = root.cache[name];
                        if (cached === undefined) {
                            resolved = registration.resolve(this);
                            root.cache[name] = resolved;
                        }
                        else {
                            resolved = cached;
                        }
                        break;
                    case Lifetime$1.Scoped:
                        // Scoped lifetime means that the container
                        // that resolves the registration also caches it.
                        // When a registration is not found, we travel up
                        // the family tree until we find one that is cached.
                        // Note: The first element in the family tree is this container.
                        for (var _i = 0, _a = this[FAMILY_TREE]; _i < _a.length; _i++) {
                            var _containerFromFamiltyTree = _a[_i];
                            cached = _containerFromFamiltyTree.cache[name];
                            if (cached !== undefined) {
                                // We found one!
                                resolved = cached;
                                break;
                            }
                        }
                        // If we still have not found one, we need to resolve and cache it.
                        if (cached === undefined) {
                            resolved = registration.resolve(this);
                            this.cache[name] = resolved;
                        }
                        break;
                    default:
                        throw new ResolutionError(name, this._resolutionStack, "Unknown lifetime \"" + registration.lifetime + "\"");
                }
                // Pop it from the stack again, ready for the next resolution
                this._resolutionStack.pop();
                return resolved;
            }
            catch (err) {
                // When we get an error we need to reset the stack.
                this._resolutionStack = [];
                throw err;
            }
        };
        return Container;
    }());
    function createContainer(options, __parentContainer) {
        return new Container(options, __parentContainer);
    }

    var DependencyContainer = __assign({ createContainer: createContainer,
        Lifetime: Lifetime$1 }, registrations);

    var IPHONE_PATTERN = /iphone/i;
    var IPOD_PATTERN = /ipod/i;
    var IPAD_PATTERN = /ipad/i;
    var ANDROID_PATTERN = /(android)/i;
    var SAFARI_PATTERN = /^((?!chrome|android).)*safari/i;
    // There is some iPhone/iPad/iPod in Windows Phone...
    // https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
    var isIE = function () { return !!window.MSStream; };
    var getUserAgent = function () { return window.navigator && window.navigator.userAgent; };
    var isIPhone = function () { return !isIE() && IPHONE_PATTERN.test(getUserAgent()); };
    var isIPod = function () { return !isIE() && IPOD_PATTERN.test(getUserAgent()); };
    var isIPad = function () { return !isIE() && IPAD_PATTERN.test(getUserAgent()); };
    var isIOS = function () { return isIPhone() || isIPod() || isIPad(); };
    var isAndroid = function () { return ANDROID_PATTERN.test(getUserAgent()); };
    var isSafari = function () { return SAFARI_PATTERN.test(getUserAgent()); };

    var convertUIConfigForIOS = function (params) { return (__assign({}, params, { showInteractionIndicator: false, screen: __assign({}, params.screen, { disableClickProcessing: true, nativeControls: true }), title: false, loader: false, controls: false })); };
    var convertUIConfigForAndroid = function (params) { return (__assign({}, params, { screen: __assign({}, params.screen, { disableClickProcessing: true }) })); };
    var convertToDeviceRelatedConfig = function (params) {
        if (isIOS()) {
            return convertUIConfigForIOS(params);
        }
        if (isAndroid()) {
            return convertUIConfigForAndroid(params);
        }
        return params;
    };

    var PLAYER_API_PROPERTY = '___playerAPI';
    var checkDescriptorsOnEquality = function (desc1, desc2) {
        return desc1.value === desc2.value &&
            desc1.get === desc2.get &&
            desc1.set === desc2.set;
    };
    var playerAPI = function (name) { return function (target, property, descriptor) {
        var methodName = name || property;
        if (!target[PLAYER_API_PROPERTY]) {
            target[PLAYER_API_PROPERTY] = {};
        }
        if (target[PLAYER_API_PROPERTY][methodName]) {
            if (!checkDescriptorsOnEquality(target[PLAYER_API_PROPERTY][methodName], descriptor)) {
                throw new Error("Method \"" + methodName + "\" for public API in " + target.constructor.name + " is already defined");
            }
        }
        target[PLAYER_API_PROPERTY][methodName] = descriptor;
    }; };

    var Player = /** @class */ (function () {
        function Player(params, scope, defaultModulesNames, additionalModuleNames, themeConfig) {
            if (defaultModulesNames === void 0) { defaultModulesNames = []; }
            if (additionalModuleNames === void 0) { additionalModuleNames = []; }
            scope.registerValue({
                config: convertToDeviceRelatedConfig(params),
            });
            scope.registerValue({
                themeConfig: themeConfig,
            });
            this._config = scope.resolve('config');
            this._resolveAdditionalModules(scope, additionalModuleNames);
            this._resolveDefaultModules(scope, defaultModulesNames);
        }
        /*
          Separation for default and additional modules is needed
          for future implementation of public methods of resolved modules and
          could be abolished in future
        */
        Player.prototype._resolveDefaultModules = function (scope, modulesNames) {
            var _this = this;
            this._defaultModules = modulesNames.reduce(function (modules, moduleName) {
                if (_this._additionalModules[moduleName]) {
                    return modules;
                }
                var resolvedModule = scope.resolve(moduleName);
                _this._addPlayerAPIFromModule(resolvedModule);
                modules[moduleName] = resolvedModule;
                return modules;
            }, {});
        };
        Player.prototype._resolveAdditionalModules = function (scope, modulesNames) {
            var _this = this;
            this._additionalModules = modulesNames.reduce(function (modules, moduleName) {
                var resolvedModule = scope.resolve(moduleName);
                _this._addPlayerAPIFromModule(resolvedModule);
                modules[moduleName] = resolvedModule;
                return modules;
            }, {});
        };
        Player.prototype._getWrappedCallToModuleFunction = function (module, fn) {
            var _this = this;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (_this._destroyed) {
                    throw new Error('Player instance is destroyed');
                }
                return fn.apply(module, args);
            };
        };
        Player.prototype._getPlayerAPIMethodDescriptor = function (module, descriptor) {
            var playerMethodDescriptor = {
                enumerable: true,
                configurable: true,
            };
            var get = descriptor.get, set = descriptor.set, value = descriptor.value;
            if (get) {
                playerMethodDescriptor.get = this._getWrappedCallToModuleFunction(module, get);
            }
            if (set) {
                playerMethodDescriptor.set = this._getWrappedCallToModuleFunction(module, set);
            }
            if (value) {
                playerMethodDescriptor.value = this._getWrappedCallToModuleFunction(module, value);
            }
            return playerMethodDescriptor;
        };
        Player.prototype._addPlayerAPIFromModule = function (module) {
            var _this = this;
            if (module[PLAYER_API_PROPERTY]) {
                Object.keys(module[PLAYER_API_PROPERTY]).forEach(function (apiKey) {
                    if (_this[apiKey]) {
                        throw new Error("API method " + apiKey + " is already defined in Player facade");
                    }
                    Object.defineProperty(_this, apiKey, _this._getPlayerAPIMethodDescriptor(module, module[PLAYER_API_PROPERTY][apiKey]));
                });
            }
        };
        Player.prototype._clearPlayerAPIForModule = function (module) {
            var _this = this;
            if (module[PLAYER_API_PROPERTY]) {
                Object.keys(module[PLAYER_API_PROPERTY]).forEach(function (apiKey) {
                    delete _this[apiKey];
                });
            }
        };
        Player.prototype.destroy = function () {
            var _this = this;
            Object.keys(this._defaultModules).forEach(function (moduleName) {
                var module = _this._defaultModules[moduleName];
                _this._clearPlayerAPIForModule(module);
                module.destroy();
            });
            Object.keys(this._additionalModules).forEach(function (moduleName) {
                var module = _this._additionalModules[moduleName];
                _this._clearPlayerAPIForModule(module);
                if (module.destroy) {
                    module.destroy();
                }
            });
            this._defaultModules = null;
            this._additionalModules = null;
            this._config = null;
            this._destroyed = true;
        };
        return Player;
    }());

    /**
     * A collection of shims that provide minimal functionality of the ES6 collections.
     *
     * These implementations are not meant to be used outside of the ResizeObserver
     * modules as they cover only a limited range of use cases.
     */
    /* eslint-disable require-jsdoc, valid-jsdoc */
    var MapShim = (function () {
        if (typeof Map !== 'undefined') {
            return Map;
        }

        /**
         * Returns index in provided array that matches the specified key.
         *
         * @param {Array<Array>} arr
         * @param {*} key
         * @returns {number}
         */
        function getIndex(arr, key) {
            var result = -1;

            arr.some(function (entry, index) {
                if (entry[0] === key) {
                    result = index;

                    return true;
                }

                return false;
            });

            return result;
        }

        return (function () {
            function anonymous() {
                this.__entries__ = [];
            }

            var prototypeAccessors = { size: { configurable: true } };

            /**
             * @returns {boolean}
             */
            prototypeAccessors.size.get = function () {
                return this.__entries__.length;
            };

            /**
             * @param {*} key
             * @returns {*}
             */
            anonymous.prototype.get = function (key) {
                var index = getIndex(this.__entries__, key);
                var entry = this.__entries__[index];

                return entry && entry[1];
            };

            /**
             * @param {*} key
             * @param {*} value
             * @returns {void}
             */
            anonymous.prototype.set = function (key, value) {
                var index = getIndex(this.__entries__, key);

                if (~index) {
                    this.__entries__[index][1] = value;
                } else {
                    this.__entries__.push([key, value]);
                }
            };

            /**
             * @param {*} key
             * @returns {void}
             */
            anonymous.prototype.delete = function (key) {
                var entries = this.__entries__;
                var index = getIndex(entries, key);

                if (~index) {
                    entries.splice(index, 1);
                }
            };

            /**
             * @param {*} key
             * @returns {void}
             */
            anonymous.prototype.has = function (key) {
                return !!~getIndex(this.__entries__, key);
            };

            /**
             * @returns {void}
             */
            anonymous.prototype.clear = function () {
                this.__entries__.splice(0);
            };

            /**
             * @param {Function} callback
             * @param {*} [ctx=null]
             * @returns {void}
             */
            anonymous.prototype.forEach = function (callback, ctx) {
                var this$1 = this;
                if ( ctx === void 0 ) ctx = null;

                for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
                    var entry = list[i];

                    callback.call(ctx, entry[1], entry[0]);
                }
            };

            Object.defineProperties( anonymous.prototype, prototypeAccessors );

            return anonymous;
        }());
    })();

    /**
     * Detects whether window and document objects are available in current environment.
     */
    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

    // Returns global object of a current environment.
    var global$1 = (function () {
        if (typeof global !== 'undefined' && global.Math === Math) {
            return global;
        }

        if (typeof self !== 'undefined' && self.Math === Math) {
            return self;
        }

        if (typeof window !== 'undefined' && window.Math === Math) {
            return window;
        }

        // eslint-disable-next-line no-new-func
        return Function('return this')();
    })();

    /**
     * A shim for the requestAnimationFrame which falls back to the setTimeout if
     * first one is not supported.
     *
     * @returns {number} Requests' identifier.
     */
    var requestAnimationFrame$1 = (function () {
        if (typeof requestAnimationFrame === 'function') {
            // It's required to use a bounded function because IE sometimes throws
            // an "Invalid calling object" error if rAF is invoked without the global
            // object on the left hand side.
            return requestAnimationFrame.bind(global$1);
        }

        return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
    })();

    // Defines minimum timeout before adding a trailing call.
    var trailingTimeout = 2;

    /**
     * Creates a wrapper function which ensures that provided callback will be
     * invoked only once during the specified delay period.
     *
     * @param {Function} callback - Function to be invoked after the delay period.
     * @param {number} delay - Delay after which to invoke callback.
     * @returns {Function}
     */
    var throttle = function (callback, delay) {
        var leadingCall = false,
            trailingCall = false,
            lastCallTime = 0;

        /**
         * Invokes the original callback function and schedules new invocation if
         * the "proxy" was called during current request.
         *
         * @returns {void}
         */
        function resolvePending() {
            if (leadingCall) {
                leadingCall = false;

                callback();
            }

            if (trailingCall) {
                proxy();
            }
        }

        /**
         * Callback invoked after the specified delay. It will further postpone
         * invocation of the original function delegating it to the
         * requestAnimationFrame.
         *
         * @returns {void}
         */
        function timeoutCallback() {
            requestAnimationFrame$1(resolvePending);
        }

        /**
         * Schedules invocation of the original function.
         *
         * @returns {void}
         */
        function proxy() {
            var timeStamp = Date.now();

            if (leadingCall) {
                // Reject immediately following calls.
                if (timeStamp - lastCallTime < trailingTimeout) {
                    return;
                }

                // Schedule new call to be in invoked when the pending one is resolved.
                // This is important for "transitions" which never actually start
                // immediately so there is a chance that we might miss one if change
                // happens amids the pending invocation.
                trailingCall = true;
            } else {
                leadingCall = true;
                trailingCall = false;

                setTimeout(timeoutCallback, delay);
            }

            lastCallTime = timeStamp;
        }

        return proxy;
    };

    // Minimum delay before invoking the update of observers.
    var REFRESH_DELAY = 20;

    // A list of substrings of CSS properties used to find transition events that
    // might affect dimensions of observed elements.
    var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];

    // Check if MutationObserver is available.
    var mutationObserverSupported = typeof MutationObserver !== 'undefined';

    /**
     * Singleton controller class which handles updates of ResizeObserver instances.
     */
    var ResizeObserverController = function() {
        this.connected_ = false;
        this.mutationEventsAdded_ = false;
        this.mutationsObserver_ = null;
        this.observers_ = [];

        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    };

    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */


    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */


    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */

    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }

        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };

    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);

        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }

        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };

    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();

        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };

    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *  dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });

        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });

        return activeObservers.length > 0;
    };

    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }

        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);

        window.addEventListener('resize', this.refresh);

        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);

            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        } else {
            document.addEventListener('DOMSubtreeModified', this.refresh);

            this.mutationEventsAdded_ = true;
        }

        this.connected_ = true;
    };

    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }

        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);

        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }

        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }

        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };

    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (ref) {
            var propertyName = ref.propertyName; if ( propertyName === void 0 ) propertyName = '';

        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });

        if (isReflowProperty) {
            this.refresh();
        }
    };

    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }

        return this.instance_;
    };

    ResizeObserverController.instance_ = null;

    /**
     * Defines non-writable/enumerable properties of the provided target object.
     *
     * @param {Object} target - Object for which to define properties.
     * @param {Object} props - Properties to be defined.
     * @returns {Object} Target object.
     */
    var defineConfigurable = (function (target, props) {
        for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
            var key = list[i];

            Object.defineProperty(target, key, {
                value: props[key],
                enumerable: false,
                writable: false,
                configurable: true
            });
        }

        return target;
    });

    /**
     * Returns the global object associated with provided element.
     *
     * @param {Object} target
     * @returns {Object}
     */
    var getWindowOf = (function (target) {
        // Assume that the element is an instance of Node, which means that it
        // has the "ownerDocument" property from which we can retrieve a
        // corresponding global object.
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;

        // Return the local global object if it's not possible extract one from
        // provided element.
        return ownerGlobal || global$1;
    });

    // Placeholder of an empty content rectangle.
    var emptyRect = createRectInit(0, 0, 0, 0);

    /**
     * Converts provided string to a number.
     *
     * @param {number|string} value
     * @returns {number}
     */
    function toFloat(value) {
        return parseFloat(value) || 0;
    }

    /**
     * Extracts borders size from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @param {...string} positions - Borders positions (top, right, ...)
     * @returns {number}
     */
    function getBordersSize(styles) {
        var positions = [], len = arguments.length - 1;
        while ( len-- > 0 ) positions[ len ] = arguments[ len + 1 ];

        return positions.reduce(function (size, position) {
            var value = styles['border-' + position + '-width'];

            return size + toFloat(value);
        }, 0);
    }

    /**
     * Extracts paddings sizes from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @returns {Object} Paddings box.
     */
    function getPaddings(styles) {
        var positions = ['top', 'right', 'bottom', 'left'];
        var paddings = {};

        for (var i = 0, list = positions; i < list.length; i += 1) {
            var position = list[i];

            var value = styles['padding-' + position];

            paddings[position] = toFloat(value);
        }

        return paddings;
    }

    /**
     * Calculates content rectangle of provided SVG element.
     *
     * @param {SVGGraphicsElement} target - Element content rectangle of which needs
     *      to be calculated.
     * @returns {DOMRectInit}
     */
    function getSVGContentRect(target) {
        var bbox = target.getBBox();

        return createRectInit(0, 0, bbox.width, bbox.height);
    }

    /**
     * Calculates content rectangle of provided HTMLElement.
     *
     * @param {HTMLElement} target - Element for which to calculate the content rectangle.
     * @returns {DOMRectInit}
     */
    function getHTMLElementContentRect(target) {
        // Client width & height properties can't be
        // used exclusively as they provide rounded values.
        var clientWidth = target.clientWidth;
        var clientHeight = target.clientHeight;

        // By this condition we can catch all non-replaced inline, hidden and
        // detached elements. Though elements with width & height properties less
        // than 0.5 will be discarded as well.
        //
        // Without it we would need to implement separate methods for each of
        // those cases and it's not possible to perform a precise and performance
        // effective test for hidden elements. E.g. even jQuery's ':visible' filter
        // gives wrong results for elements with width & height less than 0.5.
        if (!clientWidth && !clientHeight) {
            return emptyRect;
        }

        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;

        // Computed styles of width & height are being used because they are the
        // only dimensions available to JS that contain non-rounded values. It could
        // be possible to utilize the getBoundingClientRect if only it's data wasn't
        // affected by CSS transformations let alone paddings, borders and scroll bars.
        var width = toFloat(styles.width),
            height = toFloat(styles.height);

        // Width & height include paddings and borders when the 'border-box' box
        // model is applied (except for IE).
        if (styles.boxSizing === 'border-box') {
            // Following conditions are required to handle Internet Explorer which
            // doesn't include paddings and borders to computed CSS dimensions.
            //
            // We can say that if CSS dimensions + paddings are equal to the "client"
            // properties then it's either IE, and thus we don't need to subtract
            // anything, or an element merely doesn't have paddings/borders styles.
            if (Math.round(width + horizPad) !== clientWidth) {
                width -= getBordersSize(styles, 'left', 'right') + horizPad;
            }

            if (Math.round(height + vertPad) !== clientHeight) {
                height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
            }
        }

        // Following steps can't be applied to the document's root element as its
        // client[Width/Height] properties represent viewport area of the window.
        // Besides, it's as well not necessary as the <html> itself neither has
        // rendered scroll bars nor it can be clipped.
        if (!isDocumentElement(target)) {
            // In some browsers (only in Firefox, actually) CSS width & height
            // include scroll bars size which can be removed at this step as scroll
            // bars are the only difference between rounded dimensions + paddings
            // and "client" properties, though that is not always true in Chrome.
            var vertScrollbar = Math.round(width + horizPad) - clientWidth;
            var horizScrollbar = Math.round(height + vertPad) - clientHeight;

            // Chrome has a rather weird rounding of "client" properties.
            // E.g. for an element with content width of 314.2px it sometimes gives
            // the client width of 315px and for the width of 314.7px it may give
            // 314px. And it doesn't happen all the time. So just ignore this delta
            // as a non-relevant.
            if (Math.abs(vertScrollbar) !== 1) {
                width -= vertScrollbar;
            }

            if (Math.abs(horizScrollbar) !== 1) {
                height -= horizScrollbar;
            }
        }

        return createRectInit(paddings.left, paddings.top, width, height);
    }

    /**
     * Checks whether provided element is an instance of the SVGGraphicsElement.
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    var isSVGGraphicsElement = (function () {
        // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
        // interface.
        if (typeof SVGGraphicsElement !== 'undefined') {
            return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
        }

        // If it's so, then check that element is at least an instance of the
        // SVGElement and that it has the "getBBox" method.
        // eslint-disable-next-line no-extra-parens
        return function (target) { return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function'; };
    })();

    /**
     * Checks whether provided element is a document element (<html>).
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
    }

    /**
     * Calculates an appropriate content rectangle for provided html or svg element.
     *
     * @param {Element} target - Element content rectangle of which needs to be calculated.
     * @returns {DOMRectInit}
     */
    function getContentRect(target) {
        if (!isBrowser) {
            return emptyRect;
        }

        if (isSVGGraphicsElement(target)) {
            return getSVGContentRect(target);
        }

        return getHTMLElementContentRect(target);
    }

    /**
     * Creates rectangle with an interface of the DOMRectReadOnly.
     * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
     *
     * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
     * @returns {DOMRectReadOnly}
     */
    function createReadOnlyRect(ref) {
        var x = ref.x;
        var y = ref.y;
        var width = ref.width;
        var height = ref.height;

        // If DOMRectReadOnly is available use it as a prototype for the rectangle.
        var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);

        // Rectangle's properties are not writable and non-enumerable.
        defineConfigurable(rect, {
            x: x, y: y, width: width, height: height,
            top: y,
            right: x + width,
            bottom: height + y,
            left: x
        });

        return rect;
    }

    /**
     * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
     * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
     *
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} width - Rectangle's width.
     * @param {number} height - Rectangle's height.
     * @returns {DOMRectInit}
     */
    function createRectInit(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
    }

    /**
     * Class that is responsible for computations of the content rectangle of
     * provided DOM element and for keeping track of it's changes.
     */
    var ResizeObservation = function(target) {
        this.broadcastWidth = 0;
        this.broadcastHeight = 0;
        this.contentRect_ = createRectInit(0, 0, 0, 0);

        this.target = target;
    };

    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */


    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */


    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);

        this.contentRect_ = rect;

        return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
    };

    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;

        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;

        return rect;
    };

    var ResizeObserverEntry = function(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);

        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    };

    var ResizeObserverSPI = function(callback, controller, callbackCtx) {
        this.activeObservations_ = [];
        this.observations_ = new MapShim();

        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }

        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    };

    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */


    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */


    /**
     * Public ResizeObserver instance which will be passed to the callback
     * function and used as a value of it's "this" binding.
     *
     * @private {ResizeObserver}
     */

    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }

        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        var observations = this.observations_;

        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }

        observations.set(target, new ResizeObservation(target));

        this.controller_.addObserver(this);

        // Force the update of observations.
        this.controller_.refresh();
    };

    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }

        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        var observations = this.observations_;

        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }

        observations.delete(target);

        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };

    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };

    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
            var this$1 = this;

        this.clearActive();

        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                this$1.activeObservations_.push(observation);
            }
        });
    };

    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }

        var ctx = this.callbackCtx_;

        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });

        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };

    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };

    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };

    // Registry of internal observers. If WeakMap is not available use current shim
    // for the Map collection as it has all required methods and because WeakMap
    // can't be fully polyfilled anyway.
    var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();

    /**
     * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
     * exposing only those methods and properties that are defined in the spec.
     */
    var ResizeObserver = function(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);

        observers.set(this, observer);
    };

    // Expose public methods of ResizeObserver.
    ['observe', 'unobserve', 'disconnect'].forEach(function (method) {
        ResizeObserver.prototype[method] = function () {
            return (ref = observers.get(this))[method].apply(ref, arguments);
            var ref;
        };
    });

    var index = (function () {
        // Export existing implementation if available.
        if (typeof global$1.ResizeObserver !== 'undefined') {
            return global$1.ResizeObserver;
        }

        return ResizeObserver;
    })();

    // Code from ally.js
    /*
      Observe keyboard-, pointer-, mouse- and touch-events so that a query for
      the current interaction type can be made at any time. For pointer interaction
      this observer is limited to pointer button down/up - move is not observed!

      USAGE:
        var listener = engage();
        listener.get() === {pointer: Boolean, key: Boolean}
    */
    // counters to track primary input
    var _activePointers = 0;
    var _activeKeys = 0;
    var pointerStartEvents = [
        'touchstart',
        'pointerdown',
        'MSPointerDown',
        'mousedown',
    ];
    var pointerEndEvents = [
        'touchend',
        'touchcancel',
        'pointerup',
        'MSPointerUp',
        'pointercancel',
        'MSPointerCancel',
        'mouseup',
    ];
    function handleWindowBlurEvent() {
        // reset internal counters when window loses focus
        _activePointers = 0;
        _activeKeys = 0;
    }
    function handlePointerStartEvent(event) {
        if (event.isPrimary === false) {
            // ignore non-primary pointer events
            // https://w3c.github.io/pointerevents/#widl-PointerEvent-isPrimary
            return;
        }
        // mousedown without following mouseup
        // (likely not possible in Chrome)
        _activePointers += 1;
    }
    function handlePointerEndEvent(event) {
        if (event.isPrimary === false) {
            // ignore non-primary pointer events
            // https://w3c.github.io/pointerevents/#widl-PointerEvent-isPrimary
            return;
        }
        else if (event.touches) {
            _activePointers = event.touches.length;
            return;
        }
        // delay reset to when the current handlers are executed
        (window.setImmediate || window.setTimeout)(function () {
            // mouseup without prior mousedown
            // (drag something out of the window)
            _activePointers = Math.max(_activePointers - 1, 0);
        });
    }
    function handleKeyStartEvent(event) {
        // ignore modifier keys
        switch (event.keyCode || event.which) {
            case 16: // space
            case 17: // control
            case 18: // alt
            case 91: // command left
            case 93: // command right
                return;
            default:
                break;
        }
        // keydown without a following keyup
        // (may happen on CMD+TAB)
        _activeKeys += 1;
    }
    function handleKeyEndEvent(event) {
        // ignore modifier keys
        switch (event.keyCode || event.which) {
            case 16: // space
            case 17: // control
            case 18: // alt
            case 91: // command left
            case 93: // command right
                return;
            default:
                break;
        }
        // delay reset to when the current handlers are executed
        (window.setImmediate || window.setTimeout)(function () {
            // keyup without prior keydown
            // (may happen on CMD+R)
            _activeKeys = Math.max(_activeKeys - 1, 0);
        });
    }
    function getInteractionType() {
        return {
            pointer: Boolean(_activePointers),
            key: Boolean(_activeKeys),
        };
    }
    function disengage() {
        _activePointers = _activeKeys = 0;
        window.removeEventListener('blur', handleWindowBlurEvent, false);
        document.documentElement.removeEventListener('keydown', handleKeyStartEvent, true);
        document.documentElement.removeEventListener('keyup', handleKeyEndEvent, true);
        pointerStartEvents.forEach(function (event) {
            document.documentElement.removeEventListener(event, handlePointerStartEvent, true);
        });
        pointerEndEvents.forEach(function (event) {
            document.documentElement.removeEventListener(event, handlePointerEndEvent, true);
        });
    }
    function engage() {
        // window blur must be in bubble phase so it won't capture regular blurs
        window.addEventListener('blur', handleWindowBlurEvent, false);
        // handlers to identify the method of focus change
        document.documentElement.addEventListener('keydown', handleKeyStartEvent, true);
        document.documentElement.addEventListener('keyup', handleKeyEndEvent, true);
        pointerStartEvents.forEach(function (event) {
            document.documentElement.addEventListener(event, handlePointerStartEvent, true);
        });
        pointerEndEvents.forEach(function (event) {
            document.documentElement.addEventListener(event, handlePointerEndEvent, true);
        });
        return {
            get: getInteractionType,
        };
    }
    var engageInteractionTypeObserver = { engage: engage, disengage: disengage };

    // Code from ally.js
    // preferring focusin/out because they are synchronous in IE10+11
    var supportsFocusIn = typeof document !== 'undefined' && 'onfocusin' in document;
    var focusEventName = supportsFocusIn ? 'focusin' : 'focus';
    var blurEventName = supportsFocusIn ? 'focusout' : 'blur';
    // interface to read interaction-type-listener state
    var interactionTypeHandler;
    // keep track of last focus source
    var current = null;
    // overwrite focus source for use with the every upcoming focus event
    var lock = null;
    // keep track of ever having used a particular input method to change focus
    var used = {
        pointer: false,
        key: false,
        script: false,
        initial: false,
    };
    function handleFocusEvent(event) {
        var source = '';
        if (event.type === focusEventName) {
            var interactionType = interactionTypeHandler.get();
            source =
                lock ||
                    (interactionType.pointer && 'pointer') ||
                    (interactionType.key && 'key') ||
                    'script';
        }
        else if (event.type === 'initial') {
            source = 'initial';
        }
        document.documentElement.setAttribute('data-focus-source', source);
        if (event.type !== blurEventName) {
            used[source] = true;
            current = source;
        }
    }
    function getCurrentFocusSource() {
        return current;
    }
    function getUsedFocusSource(source) {
        return used[source];
    }
    function lockFocusSource(source) {
        lock = source;
    }
    function unlockFocusSource() {
        lock = false;
    }
    function disengage$1() {
        // clear dom state
        handleFocusEvent({ type: blurEventName });
        current = lock = null;
        Object.keys(used).forEach(function (key) {
            used[key] = false;
        });
        // kill interaction type identification listener
        engageInteractionTypeObserver.disengage();
        document.documentElement.removeEventListener(focusEventName, handleFocusEvent, true);
        document.documentElement.removeEventListener(blurEventName, handleFocusEvent, true);
        document.documentElement.removeAttribute('data-focus-source');
    }
    function engage$1() {
        document.documentElement.addEventListener(focusEventName, handleFocusEvent, true);
        document.documentElement.addEventListener(blurEventName, handleFocusEvent, true);
        // enable the interaction type identification observer
        interactionTypeHandler = engageInteractionTypeObserver.engage();
        // set up initial dom state
        handleFocusEvent({ type: 'initial' });
        return {
            used: getUsedFocusSource,
            current: getCurrentFocusSource,
            lock: lockFocusSource,
            unlock: unlockFocusSource,
        };
    }
    var focusSource = { engage: engage$1, disengage: disengage$1 };

    // inspired by https://gist.github.com/aFarkas/a7e0d85450f323d5e164
    var focusWithin = function () {
        var slice = [].slice;
        var removeClass = function (elem) {
            elem.classList.remove('focus-within');
        };
        var update = (function () {
            var running;
            var last;
            var action = function () {
                var element = document.activeElement;
                running = false;
                if (last !== element) {
                    last = element;
                    slice
                        .call(document.getElementsByClassName('focus-within'))
                        .forEach(removeClass);
                    while (element && element.classList) {
                        element.classList.add('focus-within');
                        element = element.parentNode;
                    }
                }
            };
            return function () {
                if (!running) {
                    requestAnimationFrame(action);
                    running = true;
                }
            };
        })();
        document.addEventListener('focus', update, true);
        document.addEventListener('blur', update, true);
        update();
        return function () {
            document.removeEventListener('focus', update, true);
            document.removeEventListener('blur', update, true);
        };
    };

    var MediaStreamTypes;
    (function (MediaStreamTypes) {
        MediaStreamTypes["MP4"] = "MP4";
        MediaStreamTypes["WEBM"] = "WEBM";
        MediaStreamTypes["HLS"] = "HLS";
        MediaStreamTypes["DASH"] = "DASH";
        MediaStreamTypes["OGG"] = "OGG";
        MediaStreamTypes["MOV"] = "MOV";
        MediaStreamTypes["MKV"] = "MKV";
    })(MediaStreamTypes || (MediaStreamTypes = {}));
    var MediaStreamDeliveryPriority;
    (function (MediaStreamDeliveryPriority) {
        MediaStreamDeliveryPriority[MediaStreamDeliveryPriority["NATIVE_PROGRESSIVE"] = 0] = "NATIVE_PROGRESSIVE";
        MediaStreamDeliveryPriority[MediaStreamDeliveryPriority["ADAPTIVE_VIA_MSE"] = 1] = "ADAPTIVE_VIA_MSE";
        MediaStreamDeliveryPriority[MediaStreamDeliveryPriority["NATIVE_ADAPTIVE"] = 2] = "NATIVE_ADAPTIVE";
        MediaStreamDeliveryPriority[MediaStreamDeliveryPriority["FORCED"] = 3] = "FORCED";
    })(MediaStreamDeliveryPriority || (MediaStreamDeliveryPriority = {}));

    var UI_EVENTS = {
        PLAY_TRIGGERED: 'ui-events/play-triggered',
        PLAY_OVERLAY_TRIGGERED: 'ui-events/play-overlay-triggered',
        PAUSE_TRIGGERED: 'ui-events/pause-triggered',
        PROGRESS_CHANGE_TRIGGERED: 'ui-events/progress-change-triggered',
        VOLUME_CHANGE_TRIGGERED: 'ui-events/volume-change-triggered',
        MUTE_STATUS_TRIGGERED: 'ui-events/mute-status-triggered',
        FULLSCREEN_STATUS_CHANGED: 'ui-events/fullscreen-status-changed',
        // TODO: follow ENTITY_EVENT_TRIGGERED or ENTITY_EVENT format
        MOUSE_ENTER_ON_PLAYER_TRIGGERED: 'ui-events/mouse-enter-on-player-triggered',
        MOUSE_MOVE_ON_PLAYER_TRIGGERED: 'ui-events/mouse-move-on-player-triggered',
        MOUSE_LEAVE_ON_PLAYER_TRIGGERED: 'ui-events/mouse-leave-on-player-triggered',
        CONTROL_BLOCK_HIDE_TRIGGERED: 'ui-events/control-block-hide-triggered',
        CONTROL_BLOCK_SHOW_TRIGGERED: 'ui-events/control-block-show-triggered',
        PROGRESS_MANIPULATION_STARTED: 'ui-events/progress-manipulation-started',
        PROGRESS_MANIPULATION_ENDED: 'ui-events/progress-manipulation-ended',
        KEYBOARD_KEYDOWN_INTERCEPTED: 'ui-events/keyboard-keydown-intercepted',
        LOADER_SHOW_TRIGGERED: 'ui-events/loader-show-triggered',
        LOADER_HIDE_TRIGGERED: 'ui-events/loader-hide-triggered',
        LOADING_COVER_SHOW_TRIGGERED: 'ui-events/loading-cover-show-triggered',
        LOADING_COVER_HIDE_TRIGGERED: 'ui-events/loading-cover-hide-triggered',
        TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED: 'ui-events/toggle-playback-with-keyboard-triggered',
        GO_BACKWARD_WITH_KEYBOARD_TRIGGERED: 'ui-events/go-backward-with-keyboard-triggered',
        GO_FORWARD_WITH_KEYBOARD_TRIGGERED: 'ui-events/go-forward-with-keyboard-triggered',
        INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED: 'ui-events/increase-volume-with-keyboard-triggered',
        DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED: 'ui-events/decrease-volume-with-keyboard-triggered',
        MUTE_SOUND_WITH_KEYBOARD_TRIGGERED: 'ui-events/mute-sound-with-keyboard-triggered',
        UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED: 'ui-events/unmute-sound-with-keyboard-triggered',
        HIDE_INTERACTION_INDICATOR_TRIGGERED: 'ui-events/hide-interaction-indicator-triggered',
        // TODO: get rid of WIDTH/HEIGHT change events in favour of RESIZE
        PLAYER_WIDTH_CHANGE_TRIGGERED: 'ui-events/player-width-change-triggered',
        PLAYER_HEIGHT_CHANGE_TRIGGERED: 'ui-events/player-height-change-triggered',
        PLAY_WITH_SCREEN_CLICK_TRIGGERED: 'ui-events/play-with-screen-click-triggered',
        PAUSE_WITH_SCREEN_CLICK_TRIGGERED: 'ui-events/pause-with-screen-click-triggered',
        // TODO: review CONTROL_DRAG_START vs CONTROL_DRAG_START_TRIGGERED format
        CONTROL_DRAG_START: 'ui-events/control-drag-start',
        CONTROL_DRAG_END: 'ui-events/control-drag-end',
        MAIN_BLOCK_HIDE_TRIGGERED: 'ui-events/main-block-hide-triggered',
        MAIN_BLOCK_SHOW_TRIGGERED: 'ui-events/main-block-show-triggered',
        PROGRESS_SYNC_BUTTON_MOUSE_ENTER_TRIGGERED: 'ui-events/progress-sync-button-mouse-enter-triggered',
        PROGRESS_SYNC_BUTTON_MOUSE_LEAVE_TRIGGERED: 'ui-events/progress-sync-button-mouse-leave-triggered',
        RESIZE: 'ui-events/resize',
    };

    var VIDEO_EVENTS = {
        ERROR: 'video-events/error',
        STATE_CHANGED: 'video-events/state-changed',
        LIVE_STATE_CHANGED: 'video-events/live-state-changed',
        DYNAMIC_CONTENT_ENDED: 'video-events/dynamic-content-ended',
        CHUNK_LOADED: 'video-events/chunk-loaded',
        CURRENT_TIME_UPDATED: 'video-events/current-time-updated',
        DURATION_UPDATED: 'video-events/duration-updated',
        VOLUME_STATUS_CHANGED: 'video-events/volume-status-changed',
        VOLUME_CHANGED: 'video-events/volume-changed',
        MUTE_CHANGED: 'video-events/mute-changed',
        SEEK_IN_PROGRESS: 'video-events/seek-in-progress',
        UPLOAD_STALLED: 'video-events/upload-stalled',
        UPLOAD_SUSPEND: 'video-events/upload-suspend',
        PLAY_REQUEST_TRIGGERED: 'video-events/play-request-triggered',
        PLAY_ABORTED: 'video-events/play-aborted',
        RESET: 'video-events/reset-playback',
    };

    var Errors = {
        SRC_PARSE: 'error-src-parse',
        MANIFEST_LOAD: 'error-manifest-load',
        MANIFEST_PARSE: 'error-manifest-parse',
        MANIFEST_INCOMPATIBLE: 'error-manifest-incompatible',
        LEVEL_LOAD: 'error-level-load',
        CONTENT_LOAD: 'error-content-load',
        CONTENT_PARSE: 'error-content-parse',
        MEDIA: 'error-media',
        UNKNOWN: 'error-unknown',
    };

    var TEXT_LABELS = {
        LOGO_LABEL: 'logo-label',
        LOGO_TOOLTIP: 'logo-tooltip',
        LIVE_INDICATOR_TEXT: 'live-indicator-text',
        LIVE_SYNC_LABEL: 'live-sync-button-label',
        LIVE_SYNC_TOOLTIP: 'live-sync-button-tooltip',
        ENTER_FULL_SCREEN_LABEL: 'enter-full-screen-label',
        ENTER_FULL_SCREEN_TOOLTIP: 'enter-full-screen-tooltip',
        EXIT_FULL_SCREEN_LABEL: 'exit-full-screen-label',
        EXIT_FULL_SCREEN_TOOLTIP: 'exit-full-screen-tooltip',
        PLAY_CONTROL_LABEL: 'play-control-label',
        PAUSE_CONTROL_LABEL: 'pause-control-label',
        PROGRESS_CONTROL_LABEL: 'progress-control-label',
        PROGRESS_CONTROL_VALUE: 'progress-control-value',
        UNMUTE_CONTROL_LABEL: 'unmute-control-label',
        UNMUTE_CONTROL_TOOLTIP: 'unmute-control-label',
        MUTE_CONTROL_LABEL: 'mute-control-label',
        MUTE_CONTROL_TOOLTIP: 'mute-control-tooltip',
        VOLUME_CONTROL_LABEL: 'volume-control-label',
        VOLUME_CONTROL_VALUE: 'volume-control-value',
    };

    var EngineState;
    (function (EngineState) {
        EngineState["SRC_SET"] = "engine-state/src-set";
        EngineState["LOAD_STARTED"] = "engine-state/load-started";
        EngineState["METADATA_LOADED"] = "engine-state/metadata-loaded";
        EngineState["READY_TO_PLAY"] = "engine-state/ready-to-play";
        EngineState["SEEK_IN_PROGRESS"] = "engine-state/seek-in-progress";
        EngineState["PLAY_REQUESTED"] = "engine-state/play-requested";
        EngineState["WAITING"] = "engine-state/waiting";
        EngineState["PLAYING"] = "engine-state/playing";
        EngineState["PAUSED"] = "engine-state/paused";
        EngineState["ENDED"] = "engine-state/ended";
    })(EngineState || (EngineState = {}));
    var EngineState$1 = EngineState;

    var LiveState;
    (function (LiveState) {
        LiveState["NONE"] = "live-state/none";
        LiveState["INITIAL"] = "live-state/initial";
        LiveState["NOT_SYNC"] = "live-state/not-sync";
        LiveState["SYNC"] = "live-state/sync";
        LiveState["ENDED"] = "live-state/ended";
    })(LiveState || (LiveState = {}));
    var LiveState$1 = LiveState;

    function htmlToElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    function anonymous(props
    /*``*/) {
    var out='<div data-hook="player-container" tabindex="0" class="'+(props.styles.videoWrapper)+'"></div>';return out;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var classnames = createCommonjsModule(function (module) {
    /*!
      Copyright (c) 2016 Jed Watson.
      Licensed under the MIT License (MIT), see
      http://jedwatson.github.io/classnames
    */
    /* global define */

    (function () {

    	var hasOwn = {}.hasOwnProperty;

    	function classNames () {
    		var classes = [];

    		for (var i = 0; i < arguments.length; i++) {
    			var arg = arguments[i];
    			if (!arg) continue;

    			var argType = typeof arg;

    			if (argType === 'string' || argType === 'number') {
    				classes.push(arg);
    			} else if (Array.isArray(arg)) {
    				classes.push(classNames.apply(null, arg));
    			} else if (argType === 'object') {
    				for (var key in arg) {
    					if (hasOwn.call(arg, key) && arg[key]) {
    						classes.push(key);
    					}
    				}
    			}
    		}

    		return classes.join(' ');
    	}

    	if ('object' !== 'undefined' && module.exports) {
    		module.exports = classNames;
    	} else if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
    		// register as 'classnames', consistent with npm package name
    		undefined('classnames', [], function () {
    			return classNames;
    		});
    	} else {
    		window.classNames = classNames;
    	}
    }());
    });

    function extendStyles(sourceStyles, partialStyles) {
        var styles = __assign({}, sourceStyles);
        Object.keys(partialStyles).forEach(function (styleName) {
            styles[styleName] = styles[styleName]
                ? classnames(styles[styleName], partialStyles[styleName])
                : partialStyles[styleName];
        });
        return styles;
    }

    var Stylable = /** @class */ (function () {
        function Stylable(theme) {
            this._themeStyles = {};
            var moduleTheme = this.constructor._moduleTheme;
            if (theme && moduleTheme) {
                theme.registerModuleTheme(this, moduleTheme);
                this._themeStyles = theme.get(this);
            }
        }
        Stylable.setTheme = function (theme) {
            this._moduleTheme = theme;
        };
        Stylable.extendStyleNames = function (styles) {
            this._styles = extendStyles(this._styles, styles);
        };
        Stylable.resetStyles = function () {
            this._styles = {};
        };
        Object.defineProperty(Stylable.prototype, "themeStyles", {
            get: function () {
                return this._themeStyles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stylable.prototype, "styleNames", {
            get: function () {
                // NOTE: TS does not work with instance static fields + generic type
                return this.constructor._styles || {};
            },
            enumerable: true,
            configurable: true
        });
        Stylable._styles = {};
        return Stylable;
    }());

    var View = /** @class */ (function (_super) {
        __extends(View, _super);
        function View() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return View;
    }(Stylable));

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css = ".root-container__controlButton___3nLjS {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .root-container__controlButton___3nLjS:hover {\n    opacity: .7; }\n  .root-container__hidden___10ZXK {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .root-container__videoWrapper___2o1Iz {\n  font-family: HelveticaNeueW01-45Ligh,HelveticaNeueW02-45Ligh,HelveticaNeueW10-45Ligh,Helvetica Neue,Helvetica,Arial,\\\\30E1\\30A4\\30EA\\30AA,meiryo,\\\\30D2\\30E9\\30AE\\30CE\\89D2\\30B4 pro w3,hiragino kaku gothic pro;\n  line-height: 0;\n  position: relative;\n  z-index: 0;\n  display: block;\n  overflow: hidden;\n  height: inherit;\n  outline: none;\n  /**\n * 1. Change the font styles in all browsers.\n * 2. Show the overflow in IE.\n * 3. Remove the margin in Firefox and Safari.\n * 4. Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 5. Correct the inability to style clickable types in iOS and Safari.\n */\n  /**\n * Remove the inner border and padding in Firefox.\n */\n  /**\n * Restore the focus styles unset by the previous rule.\n */ }\n  .root-container__videoWrapper___2o1Iz *,\n  .root-container__videoWrapper___2o1Iz *:before,\n  .root-container__videoWrapper___2o1Iz *:after {\n    -webkit-box-sizing: content-box;\n            box-sizing: content-box;\n    outline: none; }\n  .root-container__videoWrapper___2o1Iz button {\n    font-family: inherit;\n    /* 1 */\n    font-size: 100%;\n    /* 1 */\n    line-height: 1.15;\n    /* 1 */\n    overflow: visible;\n    /* 2 */\n    margin: 0;\n    /* 3 */\n    text-transform: none;\n    /* 4 */\n    -webkit-appearance: button;\n    /* 5 */ }\n  .root-container__videoWrapper___2o1Iz button::-moz-focus-inner {\n    padding: 0;\n    border-style: none; }\n  .root-container__videoWrapper___2o1Iz button:-moz-focusring {\n    outline: 1px dotted ButtonText; }\n  .root-container__fillAllSpace___33wu6,\n.root-container__fullScreen___3oMwD {\n  width: 100% !important;\n  height: 100% !important; }\n  [data-focus-source='key'] [data-hook='player-container'] button.focus-within,\n[data-focus-source='key'] [data-hook='player-container'] input.focus-within,\n[data-focus-source='key'] [data-hook='player-container'] img.focus-within,\n[data-focus-source='script'] [data-hook='player-container'] button.focus-within,\n[data-focus-source='script'] [data-hook='player-container'] input.focus-within,\n[data-focus-source='script'] [data-hook='player-container'] img.focus-within {\n  -webkit-box-shadow: 0 0 0 2px rgba(56, 153, 236, 0.8);\n          box-shadow: 0 0 0 2px rgba(56, 153, 236, 0.8); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvb3QtY29udGFpbmVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixxQ0FBNkI7RUFBN0IsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLDhCQUE4QjtFQUM5QixvQkFBb0I7RUFDcEIsd0JBQXdCO0VBQ3hCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixzQkFBc0IsRUFBRTtFQUUxQjtFQUNFLGlOQUFpTjtFQUNqTixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLGdCQUFnQjtFQUNoQixjQUFjO0VBQ2Q7Ozs7OztHQU1DO0VBQ0Q7O0dBRUM7RUFDRDs7R0FFQyxFQUFFO0VBQ0g7OztJQUdFLGdDQUF3QjtZQUF4Qix3QkFBd0I7SUFDeEIsY0FBYyxFQUFFO0VBQ2xCO0lBQ0UscUJBQXFCO0lBQ3JCLE9BQU87SUFDUCxnQkFBZ0I7SUFDaEIsT0FBTztJQUNQLGtCQUFrQjtJQUNsQixPQUFPO0lBQ1Asa0JBQWtCO0lBQ2xCLE9BQU87SUFDUCxVQUFVO0lBQ1YsT0FBTztJQUNQLHFCQUFxQjtJQUNyQixPQUFPO0lBQ1AsMkJBQTJCO0lBQzNCLE9BQU8sRUFBRTtFQUNYO0lBQ0UsV0FBVztJQUNYLG1CQUFtQixFQUFFO0VBQ3ZCO0lBQ0UsK0JBQStCLEVBQUU7RUFFckM7O0VBRUUsdUJBQXVCO0VBQ3ZCLHdCQUF3QixFQUFFO0VBRTVCOzs7Ozs7RUFNRSxzREFBOEM7VUFBOUMsOENBQThDLEVBQUUiLCJmaWxlIjoicm9vdC1jb250YWluZXIuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250cm9sQnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAuMnM7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG4gIG9wYWNpdHk6IDE7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4gIC5jb250cm9sQnV0dG9uOmhvdmVyIHtcbiAgICBvcGFjaXR5OiAuNzsgfVxuXG4uaGlkZGVuIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuICFpbXBvcnRhbnQ7XG4gIHdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWluLWhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICBvcGFjaXR5OiAwICFpbXBvcnRhbnQ7IH1cblxuLnZpZGVvV3JhcHBlciB7XG4gIGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2FOZXVlVzAxLTQ1TGlnaCxIZWx2ZXRpY2FOZXVlVzAyLTQ1TGlnaCxIZWx2ZXRpY2FOZXVlVzEwLTQ1TGlnaCxIZWx2ZXRpY2EgTmV1ZSxIZWx2ZXRpY2EsQXJpYWwsXFxcXDMwRTFcXDMwQTRcXDMwRUFcXDMwQUEsbWVpcnlvLFxcXFwzMEQyXFwzMEU5XFwzMEFFXFwzMENFXFw4OUQyXFwzMEI0IHBybyB3MyxoaXJhZ2lubyBrYWt1IGdvdGhpYyBwcm87XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBoZWlnaHQ6IGluaGVyaXQ7XG4gIG91dGxpbmU6IG5vbmU7XG4gIC8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDMuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqIDQuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogNS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuICAvKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cbiAgLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi8gfVxuICAudmlkZW9XcmFwcGVyICosXG4gIC52aWRlb1dyYXBwZXIgKjpiZWZvcmUsXG4gIC52aWRlb1dyYXBwZXIgKjphZnRlciB7XG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XG4gICAgb3V0bGluZTogbm9uZTsgfVxuICAudmlkZW9XcmFwcGVyIGJ1dHRvbiB7XG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgLyogMSAqL1xuICAgIGZvbnQtc2l6ZTogMTAwJTtcbiAgICAvKiAxICovXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgLyogMSAqL1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgIC8qIDIgKi9cbiAgICBtYXJnaW46IDA7XG4gICAgLyogMyAqL1xuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xuICAgIC8qIDQgKi9cbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbiAgICAvKiA1ICovIH1cbiAgLnZpZGVvV3JhcHBlciBidXR0b246Oi1tb3otZm9jdXMtaW5uZXIge1xuICAgIHBhZGRpbmc6IDA7XG4gICAgYm9yZGVyLXN0eWxlOiBub25lOyB9XG4gIC52aWRlb1dyYXBwZXIgYnV0dG9uOi1tb3otZm9jdXNyaW5nIHtcbiAgICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7IH1cblxuLmZpbGxBbGxTcGFjZSxcbi5mdWxsU2NyZWVuIHtcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7IH1cblxuOmdsb2JhbCBbZGF0YS1mb2N1cy1zb3VyY2U9J2tleSddIFtkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXSBidXR0b24uZm9jdXMtd2l0aGluLFxuOmdsb2JhbCBbZGF0YS1mb2N1cy1zb3VyY2U9J2tleSddIFtkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXSBpbnB1dC5mb2N1cy13aXRoaW4sXG46Z2xvYmFsIFtkYXRhLWZvY3VzLXNvdXJjZT0na2V5J10gW2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddIGltZy5mb2N1cy13aXRoaW4sXG46Z2xvYmFsIFtkYXRhLWZvY3VzLXNvdXJjZT0nc2NyaXB0J10gW2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddIGJ1dHRvbi5mb2N1cy13aXRoaW4sXG46Z2xvYmFsIFtkYXRhLWZvY3VzLXNvdXJjZT0nc2NyaXB0J10gW2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddIGlucHV0LmZvY3VzLXdpdGhpbixcbjpnbG9iYWwgW2RhdGEtZm9jdXMtc291cmNlPSdzY3JpcHQnXSBbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ10gaW1nLmZvY3VzLXdpdGhpbiB7XG4gIGJveC1zaGFkb3c6IDAgMCAwIDJweCByZ2JhKDU2LCAxNTMsIDIzNiwgMC44KTsgfVxuIl19 */";
    var styles = {"controlButton":"root-container__controlButton___3nLjS","hidden":"root-container__hidden___10ZXK","videoWrapper":"root-container__videoWrapper___2o1Iz","fillAllSpace":"root-container__fillAllSpace___33wu6","fullScreen":"root-container__fullScreen___3oMwD"};
    styleInject(css);

    var RootContainerView = /** @class */ (function (_super) {
        __extends(RootContainerView, _super);
        function RootContainerView(config) {
            var _this = _super.call(this) || this;
            var width = config.width, height = config.height, fillAllSpace = config.fillAllSpace, callbacks = config.callbacks;
            _this._callbacks = callbacks;
            _this._$node = htmlToElement(anonymous({ styles: _this.styleNames }));
            _this.setFillAllSpaceFlag(fillAllSpace);
            _this.setWidth(width);
            _this.setHeight(height);
            _this._bindEvents();
            return _this;
        }
        RootContainerView.prototype._bindEvents = function () {
            this._$node.addEventListener('mouseenter', this._callbacks.onMouseEnter);
            this._$node.addEventListener('mousemove', this._callbacks.onMouseMove);
            this._$node.addEventListener('mouseleave', this._callbacks.onMouseLeave);
        };
        RootContainerView.prototype._unbindEvents = function () {
            this._$node.removeEventListener('mouseenter', this._callbacks.onMouseEnter);
            this._$node.removeEventListener('mousemove', this._callbacks.onMouseMove);
            this._$node.removeEventListener('mouseleave', this._callbacks.onMouseLeave);
        };
        RootContainerView.prototype.setWidth = function (width) {
            if (!width) {
                return;
            }
            this._$node.style.width = width + "px";
        };
        RootContainerView.prototype.setHeight = function (height) {
            if (!height) {
                return;
            }
            this._$node.style.height = height + "px";
        };
        RootContainerView.prototype.getWidth = function () {
            return this._$node.offsetWidth;
        };
        RootContainerView.prototype.getHeight = function () {
            return this._$node.offsetHeight;
        };
        RootContainerView.prototype.show = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        RootContainerView.prototype.hide = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        RootContainerView.prototype.appendComponentNode = function (node) {
            this._$node.appendChild(node);
        };
        RootContainerView.prototype.getNode = function () {
            return this._$node;
        };
        RootContainerView.prototype.setFullScreenStatus = function (isFullScreen) {
            if (isFullScreen) {
                this._$node.setAttribute('data-in-full-screen', 'true');
                this._$node.classList.add(this.styleNames.fullScreen);
            }
            else {
                this._$node.setAttribute('data-in-full-screen', 'false');
                this._$node.classList.remove(this.styleNames.fullScreen);
            }
        };
        RootContainerView.prototype.setFillAllSpaceFlag = function (isFillAllSpace) {
            if (isFillAllSpace === void 0) { isFillAllSpace = false; }
            if (isFillAllSpace) {
                this._$node.classList.add(this.styleNames.fillAllSpace);
            }
            else {
                this._$node.classList.remove(this.styleNames.fillAllSpace);
            }
        };
        RootContainerView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
        };
        return RootContainerView;
    }(View));
    RootContainerView.extendStyleNames(styles);

    function reduce(arrayLike, callback, initialValue) {
        return Array.prototype.reduce.call(arrayLike, callback, initialValue);
    }
    function forEachMatch(string, pattern, callback) {
        var match = pattern.exec(string);
        while (match !== null) {
            callback(match);
            match = pattern.exec(string);
        }
    }

    var ALIASES = [
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
    ];
    var matchesSelectorFn;
    if (typeof HTMLElement !== 'undefined') {
        for (var i = 0; i < ALIASES.length; i++) {
            matchesSelectorFn = Element.prototype[ALIASES[i]];
            if (matchesSelectorFn) {
                break;
            }
        }
    }
    var isElementMatchesSelector = matchesSelectorFn
        ? function (element, selector) {
            return matchesSelectorFn.call(element, selector);
        }
        : function (element, selector) {
            return Array.prototype.indexOf.call(document.querySelectorAll(selector), element) !== -1;
        };

    // NOTE: "inspired" by https://github.com/marcj/css-element-queries/blob/1.0.2/src/ElementQueries.js#L340-L393
    var CSS_SELECTOR_PATTERN = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:[a-z-]+-)?(?:min|max)-width[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/gim;
    var QUERY_ATTR_PATTERN = /\[[\s\t]*?(?:([a-z-]+)-)?(min|max)-width[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/gim;
    function getQueriesFromCssSelector(cssSelector) {
        var results = [];
        if (cssSelector.indexOf('min-width') === -1 &&
            cssSelector.indexOf('max-width') === -1) {
            return [];
        }
        cssSelector = cssSelector.replace(/'/g, '"');
        forEachMatch(cssSelector, CSS_SELECTOR_PATTERN, function (match) {
            var _a = match.slice(1), selectorPart1 = _a[0], attribute = _a[1], selectorPart2 = _a[2];
            var selector = selectorPart1 + selectorPart2;
            forEachMatch(attribute, QUERY_ATTR_PATTERN, function (match) {
                var _a = match.slice(1), _b = _a[0], prefix = _b === void 0 ? '' : _b, mode = _a[1], width = _a[2];
                results.push({
                    selector: selector,
                    prefix: prefix,
                    mode: mode,
                    width: parseInt(width, 10),
                });
            });
        });
        return results;
    }
    function getQueriesFromRules(rules) {
        return reduce(rules, function (results, rule) {
            // https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
            // CSSRule.STYLE_RULE
            if (rule.type === 1) {
                var selector = rule.selectorText || rule.cssText;
                return results.concat(getQueriesFromCssSelector(selector));
            }
            // NOTE: add other `CSSRule` types if required.
            // Example - https://github.com/marcj/css-element-queries/blob/1.0.2/src/ElementQueries.js#L384-L390
            return results;
        }, []);
    }
    function getQueries() {
        return reduce(document.styleSheets, function (results, styleSheet) {
            // NOTE: browser may not able to read rules for cross-domain stylesheets
            try {
                var rules = styleSheet.cssRules || styleSheet.rules;
                if (rules) {
                    return results.concat(getQueriesFromRules(rules));
                }
                if (styleSheet.cssText) {
                    return results.concat(getQueriesFromCssSelector(styleSheet.cssText));
                }
            }
            catch (e) { }
            return results;
        }, []);
    }
    function getQueriesForElement(element, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var matchedSelectors = new Map();
        var queries = [];
        getQueries().forEach(function (query) {
            if (!matchedSelectors.has(query.selector)) {
                matchedSelectors.set(query.selector, isElementMatchesSelector(element, query.selector));
            }
            if (!matchedSelectors.get(query.selector)) {
                return;
            }
            if (query.prefix === prefix &&
                !queries.some(function (_query) { return _query.mode === query.mode && _query.width === query.width; })) {
                queries.push({
                    mode: query.mode,
                    width: query.width,
                });
            }
        });
        return queries.sort(function (a, b) { return a.width - b.width; });
    }

    var DEFAULT_QUERY_PREFIX = 'data';
    var ElementQueries = /** @class */ (function () {
        function ElementQueries(element, _a) {
            var _b = (_a === void 0 ? {} : _a).prefix, prefix = _b === void 0 ? DEFAULT_QUERY_PREFIX : _b;
            this._element = element;
            this._queryPrefix = prefix;
            this._queries = getQueriesForElement(element, prefix);
        }
        ElementQueries.prototype._getQueryAttributeValue = function (mode, elementWidth) {
            return this._queries
                .filter(function (query) {
                return query.mode === mode &&
                    ((mode === 'max' && query.width >= elementWidth) ||
                        (mode === 'min' && query.width <= elementWidth));
            })
                .map(function (query) { return query.width + "px"; })
                .join(' ');
        };
        ElementQueries.prototype._setQueryAttribute = function (mode, elementWidth) {
            var attributeName = this._queryPrefix
                ? this._queryPrefix + "-" + mode + "-width"
                : mode + "-width";
            var attributeValue = this._getQueryAttributeValue(mode, elementWidth);
            if (attributeValue) {
                this._element.setAttribute(attributeName, attributeValue);
            }
            else {
                this._element.removeAttribute(attributeName);
            }
        };
        ElementQueries.prototype.setWidth = function (width) {
            this._setQueryAttribute('min', width);
            this._setQueryAttribute('max', width);
        };
        ElementQueries.prototype.destroy = function () {
            this._element = null;
        };
        return ElementQueries;
    }());

    var DEFAULT_CONFIG = {
        fillAllSpace: false,
    };
    var RootContainer = /** @class */ (function () {
        function RootContainer(_a) {
            var eventEmitter = _a.eventEmitter, config = _a.config;
            this._eventEmitter = eventEmitter;
            this.isHidden = false;
            this._bindCallbacks();
            this._initUI(config);
            this._bindEvents();
        }
        Object.defineProperty(RootContainer.prototype, "node", {
            /**
             * Getter for DOM node with player UI element
             * (use it only for debug, if you need attach player to your document use `attachToElement` method)
             */
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        RootContainer.prototype._bindCallbacks = function () {
            this._onResized = this._onResized.bind(this);
            this._broadcastMouseEnter = this._broadcastMouseEnter.bind(this);
            this._broadcastMouseMove = this._broadcastMouseMove.bind(this);
            this._broadcastMouseLeave = this._broadcastMouseLeave.bind(this);
        };
        RootContainer.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [
                    UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
                    this.view.setFullScreenStatus,
                    this.view,
                ],
            ], this);
        };
        RootContainer.prototype._initUI = function (config) {
            var sizeConfig = __assign({}, config.size);
            this.view = new RootContainerView({
                callbacks: {
                    onMouseEnter: this._broadcastMouseEnter,
                    onMouseLeave: this._broadcastMouseLeave,
                    onMouseMove: this._broadcastMouseMove,
                },
                width: sizeConfig.width || null,
                height: sizeConfig.height || null,
                fillAllSpace: config.fillAllSpace || DEFAULT_CONFIG.fillAllSpace,
            });
            this._elementQueries = new ElementQueries(this.node, {
                prefix: '',
            });
        };
        RootContainer.prototype.appendComponentNode = function (node) {
            this.view.appendComponentNode(node);
        };
        RootContainer.prototype._broadcastMouseEnter = function () {
            this._eventEmitter.emit(UI_EVENTS.MOUSE_ENTER_ON_PLAYER_TRIGGERED);
        };
        RootContainer.prototype._broadcastMouseMove = function () {
            this._eventEmitter.emit(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED);
        };
        RootContainer.prototype._broadcastMouseLeave = function () {
            this._eventEmitter.emit(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED);
        };
        RootContainer.prototype._enableFocusInterceptors = function () {
            if (!this._disengageFocusWithin) {
                this._disengageFocusWithin = focusWithin();
            }
            if (!this._disengageFocusSource) {
                focusSource.engage();
                this._disengageFocusSource = focusSource.disengage;
            }
        };
        RootContainer.prototype._disableFocusInterceptors = function () {
            if (this._disengageFocusSource) {
                this._disengageFocusSource();
                this._disengageFocusSource = null;
            }
            if (this._disengageFocusWithin) {
                this._disengageFocusWithin();
                this._disengageFocusWithin = null;
            }
        };
        RootContainer.prototype._onResized = function () {
            var width = this.view.getWidth();
            var height = this.view.getHeight();
            this._elementQueries.setWidth(width);
            this._eventEmitter.emit(UI_EVENTS.RESIZE, { width: width, height: height });
        };
        /**
         * Method for attaching player node to your container
         * It's important to call this methods after `DOMContentLoaded` event!
         *
         * @example
         * document.addEventListener('DOMContentLoaded', function() {
         *   const config = { src: 'http://my-url/video.mp4' }
         *   const player = Playable.create(config);
         *
         *   player.attachToElement(document.getElementById('content'));
         * });
         */
        RootContainer.prototype.attachToElement = function (element) {
            this._enableFocusInterceptors();
            element.appendChild(this.node);
            if (!this._resizeObserver) {
                // NOTE: required for valid work of player "media queries"
                this._resizeObserver = new index(this._onResized);
                this._resizeObserver.observe(this.node);
            }
        };
        /**
         * Method for setting width of player
         * @param width - Desired width of player in pixels
         * @example
         * player.setWidth(400);
         */
        RootContainer.prototype.setWidth = function (width) {
            this.view.setWidth(width);
            this._eventEmitter.emit(UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED, width);
        };
        /**
         * Return current width of player in pixels
         * @example
         * player.getWidth(); // 400
         */
        RootContainer.prototype.getWidth = function () {
            return this.view.getWidth();
        };
        /**
         * Method for setting width of player
         * @param height - Desired height of player in pixels
         * @example
         * player.setHeight(225);
         */
        RootContainer.prototype.setHeight = function (height) {
            this.view.setHeight(height);
            this._eventEmitter.emit(UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED, height);
        };
        /**
         * Return current height of player in pixels
         * @example
         * player.getHeight(); // 225
         */
        RootContainer.prototype.getHeight = function () {
            return this.view.getHeight();
        };
        /**
         * Method for allowing player fill all available space
         * @param flag - `true` for allowing
         * @example
         * player.setFillAllSpace(true);
         */
        RootContainer.prototype.setFillAllSpace = function (flag) {
            this.view.setFillAllSpaceFlag(flag);
        };
        /**
         * Hide whole ui
         * @example
         * player.hide();
         */
        RootContainer.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        /**
         * Show whole ui
         * @example
         * player.show();
         */
        RootContainer.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        RootContainer.prototype.destroy = function () {
            this._unbindEvents();
            this._disableFocusInterceptors();
            if (this._resizeObserver) {
                this._resizeObserver.unobserve(this.node);
                this._resizeObserver = null;
            }
            this._elementQueries.destroy();
            this._elementQueries = null;
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
        };
        RootContainer.moduleName = 'rootContainer';
        RootContainer.dependencies = ['eventEmitter', 'config'];
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "node", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "attachToElement", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "setWidth", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "getWidth", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "setHeight", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "getHeight", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "setFillAllSpace", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "hide", null);
        __decorate([
            playerAPI()
        ], RootContainer.prototype, "show", null);
        return RootContainer;
    }());

    var eventemitter3 = createCommonjsModule(function (module) {

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once)
        , evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event
        , handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event
        , listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
          listeners.fn === fn &&
          (!once || listeners.once) &&
          (!context || listeners.context === context)
        ) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn ||
            (once && !listeners[i].once) ||
            (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    {
      module.exports = EventEmitter;
    }
    });
    var eventemitter3_1 = eventemitter3.EventEmitter;

    var EventEmitterModule = /** @class */ (function (_super) {
        __extends(EventEmitterModule, _super);
        function EventEmitterModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Method for adding listeners of events inside player.
         * You can check all events inside `Playable.UI_EVENTS` and `Playable.VIDEO_EVENTS`
         *
         * @param event - The Event name, such as `Playable.UI_EVENTS.PLAY_TRIGGERED`
         * @param fn - A function callback to execute when the event is triggered.
         * @param context - Value to use as `this` (i.e the reference Object) when executing callback.
         *
         * @example
         * const Playable = require('playable');
         * const player = Playable.create();
         *
         * player.on(Playable.UI_EVENTS.PLAY_TRIGGERED, () => {
         *   // Will be executed after you will click on play button
         * });
         *
         * // To supply a context value for `this` when the callback is invoked,
         * // pass the optional context argument
         * player.on(Playable.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
         */
        EventEmitterModule.prototype.on = function (event, fn, context) {
            return _super.prototype.on.call(this, event, fn, context);
        };
        /**
         * Method for removing listeners of events inside player.
         *
         * @param event - The Event name, such as `Playable.UI_EVENTS.PLAY_TRIGGERED`
         * @param fn - Only remove the listeners that match this function.
         * @param context - Only remove the listeners that have this context.
         * @param once - Only remove one-time listeners.
         *
         * @example
         * const Playable = require('playable');
         * const player = Playable.create();
         *
         * const callback = function() {
         *   // Code to handle some kind of event
         * };
         *
         * // ... Now callback will be called when some one will pause the video ...
         * player.on(Playable.UI_EVENTS.PAUSE_TRIGGERED, callback);
         *
         * // ... callback will no longer be called.
         * player.off(Playable.UI_EVENTS.PAUSE_TRIGGERED, callback);
         *
         * // ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.
         * player.off(Playable.UI_EVENTS.PAUSE_TRIGGERED);
         */
        EventEmitterModule.prototype.off = function (event, fn, context, once) {
            return _super.prototype.off.call(this, event, fn, context, once);
        };
        /**
         * Method for binding array of listeners with events inside player.
         *
         * @example
         *
         * this._unbindEvents = this._eventEmitter.bindEvents([
         *     [VIDEO_EVENTS.STATE_CHANGED, this._processStateChange],
         *     [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processLiveStateChange],
         *     [VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator],
         *     [VIDEO_EVENTS.DURATION_UPDATED, this._updateAllIndicators],
         *   ],
         *   this,
         * );
         *
         * //...
         *
         * this._unbindEvents()
         *
         * @param eventsMap
         * @param defaultFnContext
         * @returns unbindEvents
         */
        EventEmitterModule.prototype.bindEvents = function (eventsMap, defaultFnContext) {
            var _this = this;
            var events = [];
            eventsMap.forEach(function (_a) {
                var eventName = _a[0], fn = _a[1], _b = _a[2], fnContext = _b === void 0 ? defaultFnContext : _b;
                _this.on(eventName, fn, fnContext);
                events.push(function () {
                    _this.off(eventName, fn, fnContext);
                });
            });
            return function unbindEvents() {
                events.forEach(function (unbindEvent) {
                    unbindEvent();
                });
            };
        };
        EventEmitterModule.prototype.destroy = function () {
            this.removeAllListeners();
        };
        EventEmitterModule.moduleName = 'eventEmitter';
        __decorate([
            playerAPI()
        ], EventEmitterModule.prototype, "on", null);
        __decorate([
            playerAPI()
        ], EventEmitterModule.prototype, "off", null);
        return EventEmitterModule;
    }(eventemitter3_1));

    var NATIVE_VIDEO_EVENTS_TO_STATE = [
        'loadstart',
        'loadedmetadata',
        'canplay',
        'play',
        'playing',
        'pause',
        'ended',
        'waiting',
        'seeking',
        'seeked',
    ];
    var StateEngine = /** @class */ (function () {
        function StateEngine(eventEmitter, video) {
            this._eventEmitter = eventEmitter;
            this._video = video;
            this._currentState = null;
            this._isMetadataLoaded = false;
            this._statesTimestamps = {};
            this._bindCallbacks();
            this._bindEvents();
        }
        StateEngine.prototype._bindCallbacks = function () {
            this._processEventFromVideo = this._processEventFromVideo.bind(this);
        };
        StateEngine.prototype._bindEvents = function () {
            var _this = this;
            NATIVE_VIDEO_EVENTS_TO_STATE.forEach(function (event) {
                return _this._video.addEventListener(event, _this._processEventFromVideo);
            });
        };
        StateEngine.prototype._unbindEvents = function () {
            var _this = this;
            NATIVE_VIDEO_EVENTS_TO_STATE.forEach(function (event) {
                return _this._video.removeEventListener(event, _this._processEventFromVideo);
            });
        };
        StateEngine.prototype.clearTimestamps = function () {
            this._statesTimestamps = {};
        };
        StateEngine.prototype._setInitialTimeStamp = function () {
            this._initialTimeStamp = Date.now();
        };
        StateEngine.prototype._setStateTimestamp = function (state) {
            if (!this._statesTimestamps[state]) {
                this._statesTimestamps[state] = Date.now() - this._initialTimeStamp;
                this._setInitialTimeStamp();
            }
        };
        Object.defineProperty(StateEngine.prototype, "stateTimestamps", {
            get: function () {
                return this._statesTimestamps;
            },
            enumerable: true,
            configurable: true
        });
        StateEngine.prototype._processEventFromVideo = function (event) {
            if (event === void 0) { event = {}; }
            var videoEl = this._video;
            switch (event.type) {
                case 'loadstart': {
                    this._setInitialTimeStamp();
                    this.setState(EngineState$1.LOAD_STARTED);
                    break;
                }
                case 'loadedmetadata': {
                    this._setStateTimestamp(EngineState$1.METADATA_LOADED);
                    this.setState(EngineState$1.METADATA_LOADED);
                    this._isMetadataLoaded = true;
                    break;
                }
                case 'canplay': {
                    this._setStateTimestamp(EngineState$1.READY_TO_PLAY);
                    this.setState(EngineState$1.READY_TO_PLAY);
                    break;
                }
                case 'play': {
                    this.setState(EngineState$1.PLAY_REQUESTED);
                    break;
                }
                case 'playing': {
                    // Safari triggers event 'playing' even when play request aborted by browser. So we need to check if video is actualy playing
                    if (isSafari()) {
                        if (!videoEl.paused) {
                            this.setState(EngineState$1.PLAYING);
                        }
                    }
                    else {
                        this.setState(EngineState$1.PLAYING);
                    }
                    break;
                }
                case 'waiting': {
                    this.setState(EngineState$1.WAITING);
                    break;
                }
                case 'pause': {
                    // Safari triggers event 'pause' even when playing was aborted buy autoplay policies, emit pause event even if there wasn't any real playback
                    if (isSafari()) {
                        if (videoEl.played.length) {
                            this.setState(EngineState$1.PAUSED);
                        }
                    }
                    else {
                        this.setState(EngineState$1.PAUSED);
                    }
                    break;
                }
                case 'ended': {
                    this.setState(EngineState$1.ENDED);
                    break;
                }
                case 'seeking': {
                    this.setState(EngineState$1.SEEK_IN_PROGRESS);
                    break;
                }
                case 'seeked': {
                    this.setState(videoEl.paused ? EngineState$1.PAUSED : EngineState$1.PLAYING);
                    break;
                }
                default:
                    break;
            }
        };
        StateEngine.prototype.setState = function (state) {
            if (state === this._currentState) {
                return;
            }
            //This case is happens only with dash.js sometimes when manifest got some problems
            if (this._currentState === EngineState$1.METADATA_LOADED) {
                if (state === EngineState$1.SEEK_IN_PROGRESS ||
                    state === EngineState$1.PAUSED) {
                    return;
                }
            }
            this._eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
                prevState: this._currentState,
                nextState: state,
            });
            this._eventEmitter.emit(state);
            this._currentState = state;
        };
        Object.defineProperty(StateEngine.prototype, "isMetadataLoaded", {
            get: function () {
                return this._isMetadataLoaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateEngine.prototype, "state", {
            get: function () {
                return this._currentState;
            },
            enumerable: true,
            configurable: true
        });
        StateEngine.prototype.destroy = function () {
            this._unbindEvents();
            this._eventEmitter = null;
            this._video = null;
        };
        return StateEngine;
    }());

    var NATIVE_VIDEO_TO_BROADCAST = [
        'progress',
        'error',
        'stalled',
        'suspend',
        'durationchange',
        'timeupdate',
        'volumechange',
        'seeking',
    ];
    var NativeEventsBroadcaster = /** @class */ (function () {
        function NativeEventsBroadcaster(eventEmitter, video) {
            this._eventEmitter = eventEmitter;
            this._video = video;
            this._currentMute = this._video.muted;
            this._currentVolume = this._video.volume;
            this._bindCallbacks();
            this._bindEvents();
        }
        NativeEventsBroadcaster.prototype._bindCallbacks = function () {
            this._processEventFromVideo = this._processEventFromVideo.bind(this);
        };
        NativeEventsBroadcaster.prototype._bindEvents = function () {
            var _this = this;
            NATIVE_VIDEO_TO_BROADCAST.forEach(function (event) {
                return _this._video.addEventListener(event, _this._processEventFromVideo);
            });
        };
        NativeEventsBroadcaster.prototype._unbindEvents = function () {
            var _this = this;
            NATIVE_VIDEO_TO_BROADCAST.forEach(function (event) {
                return _this._video.removeEventListener(event, _this._processEventFromVideo);
            });
        };
        NativeEventsBroadcaster.prototype._processEventFromVideo = function (event) {
            if (event === void 0) { event = {}; }
            var videoEl = this._video;
            switch (event.type) {
                case 'progress': {
                    this._eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
                    break;
                }
                case 'stalled': {
                    this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_STALLED);
                    break;
                }
                case 'suspend': {
                    this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
                    break;
                }
                case 'seeking': {
                    this._eventEmitter.emit(VIDEO_EVENTS.SEEK_IN_PROGRESS, videoEl.currentTime);
                    break;
                }
                case 'durationchange': {
                    this._eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED, videoEl.duration);
                    break;
                }
                case 'timeupdate': {
                    this._eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED, videoEl.currentTime);
                    break;
                }
                case 'volumechange': {
                    if (this._currentVolume !== videoEl.volume) {
                        this._currentVolume = videoEl.volume * 100;
                        this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_CHANGED, this._currentVolume);
                    }
                    if (this._currentMute !== videoEl.muted) {
                        this._currentMute = videoEl.muted;
                        this._eventEmitter.emit(VIDEO_EVENTS.MUTE_CHANGED, this._currentMute);
                    }
                    this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
                        volume: videoEl.volume,
                        muted: videoEl.muted,
                    });
                    break;
                }
                default:
                    break;
            }
        };
        NativeEventsBroadcaster.prototype.destroy = function () {
            this._unbindEvents();
            this._video = null;
            this._eventEmitter = null;
        };
        return NativeEventsBroadcaster;
    }());

    function resolveAdapters(mediaStreams, availableAdapters) {
        var playableAdapters = [];
        var groupedStreams = groupStreamsByMediaType(mediaStreams);
        var groupedStreamKeys = Object.keys(groupedStreams);
        availableAdapters.forEach(function (adapter) {
            for (var i = 0; i < groupedStreamKeys.length; i += 1) {
                var mediaType = groupedStreamKeys[i];
                var mediaStreams_1 = groupedStreams[mediaType];
                if (adapter.canPlay(mediaType)) {
                    adapter.setMediaStreams(mediaStreams_1);
                    playableAdapters.push(adapter);
                    break;
                }
            }
        });
        playableAdapters.sort(function (firstAdapter, secondAdapter) {
            return secondAdapter.mediaStreamDeliveryPriority -
                firstAdapter.mediaStreamDeliveryPriority;
        });
        return playableAdapters;
    }
    function groupStreamsByMediaType(mediaStreams) {
        var typeMap = {};
        mediaStreams.forEach(function (mediaStream) {
            if (!mediaStream.type) {
                return;
            }
            if (!Array.isArray(typeMap[mediaStream.type])) {
                typeMap[mediaStream.type] = [];
            }
            typeMap[mediaStream.type].push(mediaStream);
        });
        return typeMap;
    }

    var extensionsMap = Object.create(null);
    extensionsMap.mp4 = MediaStreamTypes.MP4;
    extensionsMap.webm = MediaStreamTypes.WEBM;
    extensionsMap.m3u8 = MediaStreamTypes.HLS;
    extensionsMap.mpd = MediaStreamTypes.DASH;
    extensionsMap.ogg = MediaStreamTypes.OGG;
    extensionsMap.mkv = MediaStreamTypes.MKV;
    extensionsMap.mov = MediaStreamTypes.MOV;
    function getStreamType(url) {
        var anchorElement = document.createElement('a');
        anchorElement.href = url;
        var streamType = extensionsMap[getExtFromPath(anchorElement.pathname)];
        return streamType || false;
    }
    function getExtFromPath(path) {
        return path
            .split('.')
            .pop()
            .toLowerCase();
    }

    var AdaptersStrategy = /** @class */ (function () {
        function AdaptersStrategy(eventEmitter, video, playbackAdapters) {
            if (playbackAdapters === void 0) { playbackAdapters = []; }
            var _this = this;
            this._video = video;
            this._eventEmitter = eventEmitter;
            this._playableAdapters = [];
            this._availableAdapters = [];
            this._attachedAdapter = null;
            playbackAdapters.forEach(function (adapter) {
                return adapter.isSupported() &&
                    _this._availableAdapters.push(new adapter(eventEmitter));
            });
        }
        AdaptersStrategy.prototype._autoDetectSourceTypes = function (mediaSources) {
            var _this = this;
            return mediaSources.map(function (mediaSource) {
                if (typeof mediaSource === 'string') {
                    var type = getStreamType(mediaSource);
                    if (!type) {
                        _this._eventEmitter.emit(VIDEO_EVENTS.ERROR, {
                            errorType: Errors.SRC_PARSE,
                            streamSrc: mediaSource,
                        });
                    }
                    return { url: mediaSource, type: type };
                }
                return mediaSource;
            });
        };
        AdaptersStrategy.prototype._resolvePlayableAdapters = function (src) {
            if (!src) {
                this._playableAdapters = [];
                return;
            }
            var mediaSources = [].concat(src);
            var mediaStreams = this._autoDetectSourceTypes(mediaSources);
            this._playableAdapters = resolveAdapters(mediaStreams, this._availableAdapters);
        };
        AdaptersStrategy.prototype._connectAdapterToVideo = function () {
            if (this._playableAdapters.length > 0) {
                // Use the first PlayableStream for now
                // Later, we can use the others as fallback
                this._attachedAdapter = this._playableAdapters[0];
                this._attachedAdapter.attach(this._video);
            }
        };
        AdaptersStrategy.prototype._detachCurrentAdapter = function () {
            if (this._attachedAdapter) {
                this._attachedAdapter.detach();
                this._attachedAdapter = null;
            }
        };
        Object.defineProperty(AdaptersStrategy.prototype, "attachedAdapter", {
            get: function () {
                return this._attachedAdapter;
            },
            enumerable: true,
            configurable: true
        });
        AdaptersStrategy.prototype.connectAdapter = function (src) {
            this._detachCurrentAdapter();
            this._resolvePlayableAdapters(src);
            this._connectAdapterToVideo();
        };
        AdaptersStrategy.prototype.destroy = function () {
            this._detachCurrentAdapter();
            this._attachedAdapter = null;
            this._availableAdapters = null;
            this._playableAdapters = null;
            this._video = null;
        };
        return AdaptersStrategy;
    }());

    //TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed
    var Engine = /** @class */ (function () {
        function Engine(_a) {
            var eventEmitter = _a.eventEmitter, config = _a.config, _b = _a.availablePlaybackAdapters, availablePlaybackAdapters = _b === void 0 ? [] : _b;
            this._eventEmitter = eventEmitter;
            this._currentSrc = null;
            this._createVideoTag(config.videoElement);
            this._stateEngine = new StateEngine(eventEmitter, this._video);
            this._nativeEventsBroadcaster = new NativeEventsBroadcaster(eventEmitter, this._video);
            this._adapterStrategy = new AdaptersStrategy(this._eventEmitter, this._video, availablePlaybackAdapters);
            this._applyConfig(config);
        }
        Engine.prototype._createVideoTag = function (videoElement) {
            if (videoElement && videoElement.tagName === 'VIDEO') {
                this._video = videoElement;
            }
            else {
                this._video = document.createElement('video');
            }
        };
        Engine.prototype._applyConfig = function (config) {
            if (config === void 0) { config = {}; }
            var preload = config.preload, autoPlay = config.autoPlay, loop = config.loop, muted = config.muted, volume = config.volume, playInline = config.playInline, crossOrigin = config.crossOrigin, src = config.src;
            this.setPreload(preload);
            this.setAutoPlay(autoPlay);
            this.setLoop(loop);
            this.setMute(muted);
            this.setVolume(volume);
            this.setPlayInline(playInline);
            this.setCrossOrigin(crossOrigin);
            this.setSrc(src);
        };
        Engine.prototype.getNode = function () {
            return this._video;
        };
        Engine.prototype._getViewDimensions = function () {
            return {
                width: this._video.offsetWidth,
                height: this._video.offsetHeight,
            };
        };
        Object.defineProperty(Engine.prototype, "isDynamicContent", {
            get: function () {
                if (!this.attachedAdapter) {
                    return false;
                }
                return this.attachedAdapter.isDynamicContent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isDynamicContentEnded", {
            get: function () {
                if (!this.attachedAdapter) {
                    return false;
                }
                return this.attachedAdapter.isDynamicContentEnded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isSeekAvailable", {
            get: function () {
                if (!this.attachedAdapter) {
                    return false;
                }
                return this.attachedAdapter.isSeekAvailable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isMetadataLoaded", {
            get: function () {
                return this._stateEngine.isMetadataLoaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isPreloadAvailable", {
            get: function () {
                if (isIPad() || isIPhone() || isIPod() || isAndroid()) {
                    return false;
                }
                return this.getPreload() !== 'none';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isAutoPlayAvailable", {
            get: function () {
                if (isIPad() || isIPhone() || isIPod() || isAndroid()) {
                    return false;
                }
                return this.getAutoPlay();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isSyncWithLive", {
            get: function () {
                if (!this.attachedAdapter) {
                    return false;
                }
                return this.attachedAdapter.isSyncWithLive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "attachedAdapter", {
            get: function () {
                return this._adapterStrategy.attachedAdapter;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Method for setting source of video to player.
         * @param src Array with multiple sources
         * @example
         * player.setSrc([
         *   'https://my-url/video.mp4',
         *   'https://my-url/video.webm',
         *   'https://my-url/video.m3u8'
         * ]);
         * @note
         * Read more about [video source](/video-source)
         */
        Engine.prototype.setSrc = function (src) {
            if (src === this._currentSrc) {
                return;
            }
            this._stateEngine.clearTimestamps();
            this._currentSrc = src;
            this._adapterStrategy.connectAdapter(this._currentSrc);
            this._stateEngine.setState(EngineState$1.SRC_SET);
        };
        /**
         * Return current source of video
         * @example
         * player.getSrc(); // ['https://my-url/video.mp4']
         */
        Engine.prototype.getSrc = function () {
            return this._currentSrc;
        };
        Engine.prototype.reset = function () {
            this.pause();
            this.setCurrentTime(0);
            this._eventEmitter.emit(VIDEO_EVENTS.RESET);
        };
        /**
         * Method for starting playback of video
         * @example
         * player.play();
         */
        Engine.prototype.play = function () {
            var _this = this;
            //Workaround for triggering functionality that requires user event pipe
            this._eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED);
            this._pauseRequested = false;
            if (!this._playPromise) {
                this._playPromise = this._video.play();
                if (this._playPromise !== undefined) {
                    this._playPromise
                        .then(function () {
                        _this._playPromise = null;
                        if (_this._pauseRequested) {
                            _this.pause();
                        }
                    })
                        .catch(function (event) {
                        _this._eventEmitter.emit(VIDEO_EVENTS.PLAY_ABORTED, event);
                        _this._playPromise = null;
                    });
                }
            }
        };
        /**
         * Method for pausing playback of video
         * @example
         * player.pause();
         */
        Engine.prototype.pause = function () {
            if (this._playPromise) {
                this._pauseRequested = true;
            }
            else {
                this._video.pause();
                this._pauseRequested = false;
            }
        };
        /**
         * Method for toggling(play\pause) playback of video
         * @example
         * player.togglePlayback();
         */
        Engine.prototype.togglePlayback = function () {
            if (this.isVideoPaused) {
                this.play();
            }
            else {
                this.pause();
            }
        };
        /**
         * Method for reseting playback of video
         * @example
         * player.play();
         * console.log(player.isVideoPaused); // false
         * ...
         * player.resetPlayback();
         * console.log(player.isVideoPaused); // true;
         * console.log(player.getCurrentTime()); //0;
         */
        Engine.prototype.resetPlayback = function () {
            this.pause();
            this.setCurrentTime(0);
            this._eventEmitter.emit(VIDEO_EVENTS.RESET);
        };
        Object.defineProperty(Engine.prototype, "isVideoPaused", {
            /**
             * High level status of video playback. Returns true if playback is paused.
             * For more advance state use `getCurrentPlaybackState`
             * @example
             * player.play();
             * console.log(player.isVideoPaused);
             */
            get: function () {
                return this._video.paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isVideoEnded", {
            /**
             * High level status of video playback. Returns true if playback is ended. Also note, that `isPaused` will return `true` if playback is ended also.
             * For more advance state use `getCurrentPlaybackState`
             * @example
             * player.play();
             * console.log(player.isVideoEnded);
             */
            get: function () {
                return this._video.ended;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Method for synchronize current playback with live point. Available only if you playing live source.
         * @example
         * player.syncWithLive();
         */
        Engine.prototype.syncWithLive = function () {
            if (this.attachedAdapter &&
                this.attachedAdapter.isDynamicContent &&
                !this.attachedAdapter.isDynamicContentEnded &&
                !this.isSyncWithLive) {
                this.setCurrentTime(this.attachedAdapter.syncWithLiveTime);
                this.play();
            }
        };
        /**
         * Method for going forward in playback by your value
         * @param sec - Value in seconds
         * @example
         * player.goForward(5);
         */
        Engine.prototype.goForward = function (sec) {
            var duration = this.getDurationTime();
            if (duration) {
                var current = this.getCurrentTime();
                this.setCurrentTime(Math.min(current + sec, duration));
            }
        };
        /**
         * Method for going backward in playback by your value
         * @param sec - Value in seconds
         * @example
         * player.goBackward(5);
         */
        Engine.prototype.goBackward = function (sec) {
            var duration = this.getDurationTime();
            if (duration) {
                var current = this.getCurrentTime();
                this.setCurrentTime(Math.max(current - sec, 0));
            }
        };
        /**
         * Set volume
         * @param volume - Volume value `0..100`
         * @example
         * player.setVolume(50);
         */
        Engine.prototype.setVolume = function (volume) {
            var parsedVolume = Number(volume);
            this._video.volume = isNaN(parsedVolume)
                ? 1
                : Math.max(0, Math.min(Number(volume) / 100, 1));
        };
        /**
         * Get volume
         * @example
         * player.getVolume(); // 50
         */
        Engine.prototype.getVolume = function () {
            return this._video.volume * 100;
        };
        /**
         * Method for increasing current volume by value
         * @param value - Value from 0 to 100
         * @example
         * player.increaseVolume(30);
         */
        Engine.prototype.increaseVolume = function (value) {
            this.setVolume(this.getVolume() + value);
        };
        /**
         * Method for decreasing current volume by value
         * @param value - Value from 0 to 100
         * @example
         * player.decreaseVolume(30);
         */
        Engine.prototype.decreaseVolume = function (value) {
            this.setVolume(this.getVolume() - value);
        };
        /**
         * Mute or unmute the video
         * @param isMuted - `true` to mute the video.
         * @example
         * player.setMute(true);
         */
        Engine.prototype.setMute = function (isMuted) {
            this._video.muted = Boolean(isMuted);
        };
        /**
         * Get mute flag
         * @example
         * player.getMute(); // true
         */
        Engine.prototype.getMute = function () {
            return this._video.muted;
        };
        /**
         * Set autoPlay flag
         * @example
         * player.setAutoPlay();
         */
        Engine.prototype.setAutoPlay = function (isAutoPlay) {
            this._video.autoplay = Boolean(isAutoPlay);
        };
        /**
         * Get autoPlay flag
         * @example
         * player.getAutoPlay(); // true
         */
        Engine.prototype.getAutoPlay = function () {
            return this._video.autoplay;
        };
        /**
         * Set loop flag
         * @param isLoop - If `true` video will be played again after it will finish
         * @example
         * player.setLoop(true);
         */
        Engine.prototype.setLoop = function (isLoop) {
            this._video.loop = Boolean(isLoop);
        };
        /**
         * Get loop flag
         * @example
         * player.getLoop(); // true
         */
        Engine.prototype.getLoop = function () {
            return this._video.loop;
        };
        /**
         * Method for setting playback rate
         */
        Engine.prototype.setPlaybackRate = function (rate) {
            this._video.playbackRate = rate;
        };
        /**
         * Return current playback rate
         */
        Engine.prototype.getPlaybackRate = function () {
            return this._video.playbackRate;
        };
        /**
         * Set preload type
         * @example
         * player.setPreload('none');
         */
        Engine.prototype.setPreload = function (preload) {
            this._video.preload = preload || 'auto';
        };
        /**
         * Return preload type
         * @example
         * player.getPreload(); // none
         */
        Engine.prototype.getPreload = function () {
            return this._video.preload;
        };
        /**
         * Return current time of video playback
         * @example
         * player.getCurrentTime(); //  60.139683
         */
        Engine.prototype.getCurrentTime = function () {
            return this._video.currentTime;
        };
        /**
         * Method for seeking to time in video
         * @param time - Time in seconds
         * @example
         * player.goTo(34);
         */
        Engine.prototype.setCurrentTime = function (time) {
            this._video.currentTime = time;
        };
        /**
         * Return duration of video
         * @example
         * player.getDurationTime(); // 180.149745
         */
        Engine.prototype.getDurationTime = function () {
            return this._video.duration || 0;
        };
        /**
         * Return real width of video from metadata
         * @example
         * player.getVideoWidth(); // 400
         */
        Engine.prototype.getVideoWidth = function () {
            return this._video.videoWidth;
        };
        /**
         * Return real height of video from metadata
         * @example
         * player.getVideoHeight(); // 225
         */
        Engine.prototype.getVideoHeight = function () {
            return this._video.videoHeight;
        };
        Engine.prototype.getBuffered = function () {
            return this._video.buffered;
        };
        /**
         * Set playInline flag
         * @param isPlayInline - If `false` - video will be played in full screen, `true` - inline
         * @example
         * player.setPlayInline(true);
         */
        Engine.prototype.setPlayInline = function (isPlayInline) {
            if (isPlayInline) {
                this._video.setAttribute('playsInline', 'true');
            }
            else {
                this._video.removeAttribute('playsInline');
            }
        };
        /**
         * Get playInline flag
         * @example
         * player.getPlayInline(); // true
         */
        Engine.prototype.getPlayInline = function () {
            return this._video.getAttribute('playsInline') === 'true';
        };
        /**
         * Set crossorigin attribute for video
         * @example
         * player.setCrossOrigin('anonymous');
         */
        Engine.prototype.setCrossOrigin = function (crossOrigin) {
            if (crossOrigin) {
                this._video.setAttribute('crossorigin', crossOrigin);
            }
            else {
                this._video.removeAttribute('crossorigin');
            }
        };
        /**
         * Get crossorigin attribute value for video
         * @example
         * player.getCrossOrigin(); // 'anonymous'
         */
        Engine.prototype.getCrossOrigin = function () {
            return this._video.getAttribute('crossorigin');
        };
        /**
         * Return current state of playback
         */
        Engine.prototype.getCurrentState = function () {
            return this._stateEngine.state;
        };
        /**
         * Return object with internal debug info
         *
         * @example
         * player.getDebugInfo();
         *
         * @note
         * The above command returns JSON structured like this:
         *
         * @example
         * {
         *   "type": "HLS",
         *   "viewDimensions": {
         *     "width": 700,
         *     "height": 394
         *   }
         *   "url": "https://example.com/video.m3u8",
         *   "currentTime": 22.092514,
         *   "duration": 60.139683,
         *   "loadingStateTimestamps": {
         *     "metadata-loaded": 76,
         *     "ready-to-play": 67
         *   },
         *   "bitrates": [
         *     // Available bitrates
         *     "100000",
         *     "200000",
         *     ...
         *   ],
         *   // One of available bitrates, that used right now
         *   "currentBitrate": "100000",
         *   // Raw estimation of bandwidth, that could be used without playback stall
         *   "bwEstimate": "120000"
         *   "overallBufferLength": 60.139683,
         *   "nearestBufferSegInfo": {
         *     "start": 0,
         *     "end": 60.139683
         *   }
         * }
         */
        Engine.prototype.getDebugInfo = function () {
            var _a = this._video, duration = _a.duration, currentTime = _a.currentTime;
            var data;
            if (this._adapterStrategy.attachedAdapter) {
                data = this._adapterStrategy.attachedAdapter.debugInfo;
            }
            return __assign({}, data, { viewDimensions: this._getViewDimensions(), currentTime: currentTime,
                duration: duration, loadingStateTimestamps: this._stateEngine.stateTimestamps });
        };
        Engine.prototype.destroy = function () {
            this._stateEngine.destroy();
            this._nativeEventsBroadcaster.destroy();
            this._adapterStrategy.destroy();
            this._video.parentNode && this._video.parentNode.removeChild(this._video);
            this._stateEngine = null;
            this._nativeEventsBroadcaster = null;
            this._adapterStrategy = null;
            this._eventEmitter = null;
            this._video = null;
        };
        Engine.moduleName = 'engine';
        Engine.dependencies = ['eventEmitter', 'config', 'availablePlaybackAdapters'];
        __decorate([
            playerAPI()
        ], Engine.prototype, "setSrc", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getSrc", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "reset", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "play", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "pause", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "togglePlayback", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "resetPlayback", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "isVideoPaused", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "isVideoEnded", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "syncWithLive", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "goForward", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "goBackward", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setVolume", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getVolume", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "increaseVolume", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "decreaseVolume", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setMute", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getMute", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setAutoPlay", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getAutoPlay", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setLoop", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getLoop", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setPlaybackRate", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getPlaybackRate", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setPreload", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getPreload", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getCurrentTime", null);
        __decorate([
            playerAPI('goTo')
        ], Engine.prototype, "setCurrentTime", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getDurationTime", null);
        __decorate([
            playerAPI('getVideoRealWidth')
        ], Engine.prototype, "getVideoWidth", null);
        __decorate([
            playerAPI('getVideoRealHeight')
        ], Engine.prototype, "getVideoHeight", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setPlayInline", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getPlayInline", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "setCrossOrigin", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getCrossOrigin", null);
        __decorate([
            playerAPI('getCurrentPlaybackState')
        ], Engine.prototype, "getCurrentState", null);
        __decorate([
            playerAPI()
        ], Engine.prototype, "getDebugInfo", null);
        return Engine;
    }());

    var SHORTHAND_HEX_COLOR_PATTERN = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var HEX_COLOR_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    function hexToRgb(hex) {
        hex = hex.replace(SHORTHAND_HEX_COLOR_PATTERN, function (_, r, g, b) { return r + r + g + g + b + b; });
        var result = hex.match(HEX_COLOR_PATTERN);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    }

    function transperentizeColor(color, alpha) {
        var _a = hexToRgb(color), r = _a.r, g = _a.g, b = _a.b;
        return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    }

    function camelToKebab(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    var generatedIds = new Map();
    function getUniquePostfix(className) {
        if (generatedIds.has(className)) {
            var newID = generatedIds.get(className) + 1;
            generatedIds.set(className, newID);
            return "" + newID;
        }
        generatedIds.set(className, 0);
        return '';
    }
    function getUniqueId(classImportName) {
        var kebabName = camelToKebab(classImportName);
        return "" + kebabName + getUniquePostfix(kebabName);
    }

    function getUniqueClassName(classImportName) {
        return "wix-playable--" + getUniqueId(classImportName);
    }
    function generateClassNames(rules) {
        return Object.keys(rules).reduce(function (acc, classImportName) {
            return (__assign({}, acc, (_a = {}, _a[classImportName] = getUniqueClassName(classImportName), _a)));
            var _a;
        }, {});
    }

    var StyleSheet = /** @class */ (function () {
        function StyleSheet() {
            this._rulesByModule = new Map();
            this._classNamesByModule = new Map();
            this._data = {};
        }
        StyleSheet.prototype.attach = function () {
            var _this = this;
            this._styleNode = this._styleNode || document.createElement('style');
            var discoveredStyles = [];
            this._rulesByModule.forEach(function (_, module) {
                discoveredStyles.push(_this._getModuleCSS(module));
            });
            this._styleNode.innerHTML = discoveredStyles.join(' ');
            document.getElementsByTagName('head')[0].appendChild(this._styleNode);
        };
        StyleSheet.prototype.update = function (data) {
            this._data = __assign({}, this._data, data);
            if (this._styleNode) {
                this.attach();
            }
        };
        StyleSheet.prototype.registerModuleTheme = function (module, rules) {
            //todo maybe we would like to update overrides for module? Or at least show warning instead of Error
            if (this._rulesByModule.get(module)) {
                throw new Error('can`t register multiple themes for one module');
            }
            this._rulesByModule.set(module, rules);
            this._classNamesByModule.set(module, generateClassNames(rules));
        };
        StyleSheet.prototype.getModuleClassNames = function (module) {
            return this._classNamesByModule.get(module);
        };
        StyleSheet.prototype._getModuleCSS = function (module) {
            var _this = this;
            var moduleRules = this._rulesByModule.get(module);
            var moduleClassNames = this._classNamesByModule.get(module);
            if (!moduleRules || !moduleClassNames) {
                return '';
            }
            return Object.keys(moduleRules)
                .map(function (classImportName) {
                return _this._getRuleCSS(moduleRules[classImportName], moduleClassNames[classImportName]);
            })
                .join(' ');
        };
        StyleSheet.prototype._getRuleCSS = function (rule, ruleClassName) {
            var _this = this;
            if (!rule || !ruleClassName) {
                return '';
            }
            var complexRuleNames = Object.keys(rule)
                .filter(function (ruleName) { return typeof rule[ruleName] === 'object'; })
                .map(function (ruleName) { return (ruleName.indexOf('&') !== -1 ? ruleName : "& " + ruleName); });
            var complexRules = complexRuleNames
                .map(function (ruleName) {
                var selector = ruleName.replace(/&/g, "." + ruleClassName);
                //don't want to allow deep nesting now, maybe later
                return selector + " {" + _this._getRuleStyles(rule[ruleName]) + "}";
            })
                .join(' ');
            return "." + ruleClassName + " {" + this._getRuleStyles(rule) + "} " + complexRules;
        };
        StyleSheet.prototype._getRuleStyles = function (rule) {
            var _this = this;
            var simpleRuleNames = Object.keys(rule).filter(function (ruleName) { return typeof rule[ruleName] !== 'object'; });
            return simpleRuleNames
                .map(function (ruleName) {
                return camelToKebab(ruleName) + ": " + (typeof rule[ruleName] === 'function'
                    ? rule[ruleName](_this._data)
                    : rule[ruleName]);
            })
                .join('; ');
        };
        return StyleSheet;
    }());

    var DEFAULT_THEME_CONFIG = {
        color: '#FFF',
        liveColor: '#ea492e',
        progressColor: '#FFF',
    };
    var ThemeService = /** @class */ (function () {
        function ThemeService(_a) {
            var themeConfig = _a.themeConfig;
            var _this = this;
            this._styleSheet = new StyleSheet();
            this._styleSheet.update(__assign({}, DEFAULT_THEME_CONFIG, themeConfig));
            // setTimeout here is for calling `attach` after all modules resolved.
            window.setTimeout(function () {
                _this._styleSheet && _this._styleSheet.attach();
            }, 0);
        }
        /**
         * Method for setting theme for player instance
         *
         * @example
         * player.updateTheme({
         *   progressColor: "#AEAD22"
         * })
         * @note
         *
         * You can check info about theming [here](/themes)
         *
         * @param themeConfig - Theme config
         *
         */
        ThemeService.prototype.updateTheme = function (themeConfig) {
            this._styleSheet.update(themeConfig);
        };
        ThemeService.prototype.registerModuleTheme = function (module, rules) {
            this._styleSheet.registerModuleTheme(module, rules);
        };
        ThemeService.prototype.get = function (module) {
            return this._styleSheet.getModuleClassNames(module);
        };
        ThemeService.prototype.destroy = function () {
            this._styleSheet = null;
        };
        ThemeService.moduleName = 'theme';
        ThemeService.dependencies = ['themeConfig'];
        __decorate([
            playerAPI()
        ], ThemeService.prototype, "updateTheme", null);
        return ThemeService;
    }());

    var map = (_a = {}, _a[TEXT_LABELS.LOGO_LABEL] = 'Watch On Site', _a[TEXT_LABELS.LOGO_TOOLTIP] = 'Watch On Site', _a[TEXT_LABELS.LIVE_INDICATOR_TEXT] = function (_a) {
            var isEnded = _a.isEnded;
            return !isEnded ? 'Live' : 'Live Ended';
        }, _a[TEXT_LABELS.LIVE_SYNC_LABEL] = 'Sync to Live', _a[TEXT_LABELS.LIVE_SYNC_TOOLTIP] = 'Sync to Live', _a[TEXT_LABELS.PAUSE_CONTROL_LABEL] = 'Pause', _a[TEXT_LABELS.PLAY_CONTROL_LABEL] = 'Play', _a[TEXT_LABELS.PROGRESS_CONTROL_LABEL] = 'Progress control', _a[TEXT_LABELS.PROGRESS_CONTROL_VALUE] = function (_a) {
            var percent = _a.percent;
            return "Already played " + percent + "%";
        }, _a[TEXT_LABELS.MUTE_CONTROL_LABEL] = 'Mute', _a[TEXT_LABELS.MUTE_CONTROL_TOOLTIP] = 'Mute', _a[TEXT_LABELS.UNMUTE_CONTROL_LABEL] = 'Unmute', _a[TEXT_LABELS.UNMUTE_CONTROL_TOOLTIP] = 'Unmute', _a[TEXT_LABELS.VOLUME_CONTROL_LABEL] = 'Volume control', _a[TEXT_LABELS.VOLUME_CONTROL_VALUE] = function (_a) {
            var volume = _a.volume;
            return "Volume is " + volume + "%";
        }, _a[TEXT_LABELS.ENTER_FULL_SCREEN_LABEL] = 'Enter full screen mode', _a[TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP] = 'Enter full screen mode', _a[TEXT_LABELS.EXIT_FULL_SCREEN_LABEL] = 'Exit full screen mode', _a[TEXT_LABELS.EXIT_FULL_SCREEN_TOOLTIP] = 'Exit full screen mode', _a);
    var _a;

    var TextMap = /** @class */ (function () {
        function TextMap(_a) {
            var config = _a.config;
            this._textMap = __assign({}, map, config.texts);
        }
        TextMap.prototype.get = function (id, args) {
            if (!this._textMap) {
                return;
            }
            var text = this._textMap[id];
            if (typeof text === 'function') {
                return text(args);
            }
            return text;
        };
        TextMap.prototype.destroy = function () {
            this._textMap = null;
        };
        TextMap.moduleName = 'textMap';
        TextMap.dependencies = ['config'];
        return TextMap;
    }());

    var fnMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror',
        ],
        // new WebKit
        [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
        ],
        // old WebKit (Safari 5.1)
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror',
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError',
        ],
    ];
    /* ignore coverage */
    function getFullScreenFn() {
        var ret = {};
        for (var i = 0; i < fnMap.length; i += 1) {
            if (fnMap[i][1] in document) {
                for (var j = 0; j < fnMap[i].length; j += 1) {
                    ret[fnMap[0][j]] = fnMap[i][j];
                }
                return ret;
            }
        }
        return false;
    }
    var DesktopFullScreen = /** @class */ (function () {
        function DesktopFullScreen(elem, callback) {
            this._elem = elem;
            this._callback = callback;
            this._fullscreenFn = getFullScreenFn();
            this._bindEvents();
        }
        Object.defineProperty(DesktopFullScreen.prototype, "isAPIExist", {
            get: function () {
                return Boolean(this._fullscreenFn);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DesktopFullScreen.prototype, "isInFullScreen", {
            get: function () {
                if (typeof this._fullscreenFn === 'boolean') {
                    return false;
                }
                return Boolean(document[this._fullscreenFn.fullscreenElement]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DesktopFullScreen.prototype, "isEnabled", {
            get: function () {
                if (typeof this._fullscreenFn === 'boolean') {
                    return false;
                }
                return (this.isAPIExist && document[this._fullscreenFn.fullscreenEnabled]);
            },
            enumerable: true,
            configurable: true
        });
        DesktopFullScreen.prototype._bindEvents = function () {
            if (typeof this._fullscreenFn === 'boolean') {
                return false;
            }
            document.addEventListener(this._fullscreenFn.fullscreenchange, this._callback);
        };
        DesktopFullScreen.prototype._unbindEvents = function () {
            if (typeof this._fullscreenFn === 'boolean') {
                return false;
            }
            document.removeEventListener(this._fullscreenFn.fullscreenchange, this._callback);
        };
        DesktopFullScreen.prototype.request = function () {
            if (!this.isEnabled) {
                return;
            }
            var request = this._fullscreenFn.requestFullscreen;
            // Work around Safari 5.1 bug: reports support for
            // keyboard in fullscreen even though it doesn't.
            // Browser sniffing, since the alternative with
            // setTimeout is even worse.
            if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
                this._elem[request]();
            }
            else {
                this._elem[request](Element.ALLOW_KEYBOARD_INPUT);
            }
        };
        DesktopFullScreen.prototype.exit = function () {
            if (!this.isEnabled) {
                return;
            }
            document[this._fullscreenFn.exitFullscreen]();
        };
        DesktopFullScreen.prototype.destroy = function () {
            this._unbindEvents();
            this._elem = null;
            this._callback = null;
        };
        return DesktopFullScreen;
    }());

    var HAVE_METADATA = 1;
    var isFullScreenRequested = false;
    var IOSFullScreen = /** @class */ (function () {
        function IOSFullScreen(elem, callback) {
            this._elem = elem;
            this._callback = callback;
            this._bindEvents();
            this._enterWhenHasMetaData = this._enterWhenHasMetaData.bind(this);
        }
        Object.defineProperty(IOSFullScreen.prototype, "isAPIExist", {
            get: function () {
                return Boolean(this._elem && this._elem.webkitSupportsFullscreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IOSFullScreen.prototype, "isInFullScreen", {
            get: function () {
                return Boolean(this._elem && this._elem.webkitDisplayingFullscreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IOSFullScreen.prototype, "isEnabled", {
            get: function () {
                return this.isAPIExist;
            },
            enumerable: true,
            configurable: true
        });
        IOSFullScreen.prototype._bindEvents = function () {
            this._elem.addEventListener('webkitbeginfullscreen', this._callback);
            this._elem.addEventListener('webkitendfullscreen', this._callback);
        };
        IOSFullScreen.prototype._unbindEvents = function () {
            this._elem.removeEventListener('webkitbeginfullscreen', this._callback);
            this._elem.removeEventListener('webkitendfullscreen', this._callback);
            this._elem.removeEventListener('loadedmetadata', this._enterWhenHasMetaData);
        };
        IOSFullScreen.prototype._enterWhenHasMetaData = function () {
            this._elem.removeEventListener('loadedmetadata', this._enterWhenHasMetaData);
            isFullScreenRequested = false;
            this._elem.webkitEnterFullscreen();
        };
        IOSFullScreen.prototype.request = function () {
            if (!this.isEnabled || this.isInFullScreen) {
                return false;
            }
            try {
                this._elem.webkitEnterFullscreen();
            }
            catch (e) {
                if (this._elem.readyState < HAVE_METADATA) {
                    if (isFullScreenRequested) {
                        return;
                    }
                    this._elem.addEventListener('loadedmetadata', this._enterWhenHasMetaData);
                    isFullScreenRequested = true;
                }
            }
        };
        IOSFullScreen.prototype.exit = function () {
            if (!this.isEnabled || !this.isInFullScreen) {
                return false;
            }
            this._elem.webkitExitFullscreen();
        };
        IOSFullScreen.prototype.destroy = function () {
            this._unbindEvents();
            this._elem = null;
            this._callback = null;
        };
        return IOSFullScreen;
    }());

    var DEFAULT_CONFIG$1 = {
        exitFullScreenOnEnd: true,
        enterFullScreenOnPlay: false,
        exitFullScreenOnPause: false,
        pauseVideoOnFullScreenExit: false,
    };
    var FullScreenManager = /** @class */ (function () {
        function FullScreenManager(_a) {
            var eventEmitter = _a.eventEmitter, engine = _a.engine, rootContainer = _a.rootContainer, config = _a.config;
            this._exitFullScreenOnEnd = false;
            this._enterFullScreenOnPlay = false;
            this._exitFullScreenOnPause = false;
            this._pauseVideoOnFullScreenExit = false;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            if (config.fullScreen === false) {
                this._isEnabled = false;
            }
            else {
                this._isEnabled = true;
                var _config = __assign({}, DEFAULT_CONFIG$1, (typeof config.fullScreen === 'object' ? config.fullScreen : {}));
                this._exitFullScreenOnEnd = _config.exitFullScreenOnEnd;
                this._enterFullScreenOnPlay = _config.enterFullScreenOnPlay;
                this._exitFullScreenOnPause = _config.exitFullScreenOnPause;
                this._pauseVideoOnFullScreenExit = _config.pauseVideoOnFullScreenExit;
            }
            this._onChange = this._onChange.bind(this);
            if (isIOS()) {
                this._helper = new IOSFullScreen(this._engine.getNode(), this._onChange);
            }
            else {
                this._helper = new DesktopFullScreen(rootContainer.node, this._onChange);
            }
            this._bindEvents();
        }
        FullScreenManager.prototype._onChange = function () {
            if (!this._helper.isInFullScreen && this._pauseVideoOnFullScreenExit) {
                this._engine.pause();
            }
            this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._helper.isInFullScreen);
        };
        FullScreenManager.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.STATE_CHANGED, this._processNextStateFromEngine],
                [VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this._enterOnPlayRequested],
            ], this);
        };
        FullScreenManager.prototype._exitOnEnd = function () {
            if (this._exitFullScreenOnEnd && this.isInFullScreen) {
                this.exitFullScreen();
            }
        };
        FullScreenManager.prototype._enterOnPlayRequested = function () {
            if (this._enterFullScreenOnPlay && !this.isInFullScreen) {
                this.enterFullScreen();
            }
        };
        FullScreenManager.prototype._exitOnPauseRequested = function () {
            if (this._exitFullScreenOnPause && this.isInFullScreen) {
                this.exitFullScreen();
            }
        };
        FullScreenManager.prototype._processNextStateFromEngine = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case EngineState$1.ENDED: {
                    this._exitOnEnd();
                    break;
                }
                case EngineState$1.PAUSED: {
                    this._exitOnPauseRequested();
                    break;
                }
                /* ignore coverage */
                default:
                    break;
            }
        };
        /**
         * Player would try to enter fullscreen mode.
         * Behavior of fullscreen mode on different platforms may differ.
         * @example
         * player.enterFullScreen();
         */
        FullScreenManager.prototype.enterFullScreen = function () {
            if (!this.isEnabled) {
                return;
            }
            this._helper.request();
        };
        /**
         * Player would try to exit fullscreen mode.
         * @example
         * player.exitFullScreen();
         */
        FullScreenManager.prototype.exitFullScreen = function () {
            if (!this.isEnabled) {
                return;
            }
            this._helper.exit();
        };
        Object.defineProperty(FullScreenManager.prototype, "isInFullScreen", {
            /**
             * Return true if player is in full screen
             * @example
             * console.log(player.isInFullScreen); // false
             */
            get: function () {
                if (!this.isEnabled) {
                    return false;
                }
                return this._helper.isInFullScreen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullScreenManager.prototype, "isEnabled", {
            get: function () {
                return this._helper.isEnabled && this._isEnabled;
            },
            enumerable: true,
            configurable: true
        });
        FullScreenManager.prototype.destroy = function () {
            this._unbindEvents();
            this._helper.destroy();
            this._helper = null;
            this._eventEmitter = null;
            this._engine = null;
        };
        FullScreenManager.moduleName = 'fullScreenManager';
        FullScreenManager.dependencies = ['eventEmitter', 'engine', 'rootContainer', 'config'];
        __decorate([
            playerAPI()
        ], FullScreenManager.prototype, "enterFullScreen", null);
        __decorate([
            playerAPI()
        ], FullScreenManager.prototype, "exitFullScreen", null);
        __decorate([
            playerAPI()
        ], FullScreenManager.prototype, "isInFullScreen", null);
        return FullScreenManager;
    }());

    var SEEK_BY_UI_EVENTS = [
        UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED,
        UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
        UI_EVENTS.PROGRESS_CHANGE_TRIGGERED,
    ];
    var LiveStateEngine = /** @class */ (function () {
        function LiveStateEngine(_a) {
            var eventEmitter = _a.eventEmitter, engine = _a.engine;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            this._state = LiveState$1.NONE;
            this._isSeekedByUIWhilePlaying = null;
            this._bindEvents();
        }
        Object.defineProperty(LiveStateEngine.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        LiveStateEngine.prototype._bindEvents = function () {
            var _this = this;
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.STATE_CHANGED, this._processStateChange]
            ].concat(SEEK_BY_UI_EVENTS.map(function (eventName) { return [eventName, _this._processSeekByUI]; }), [
                [VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED, this._onDynamicContentEnded],
            ]), this);
        };
        LiveStateEngine.prototype._processStateChange = function (_a) {
            var prevState = _a.prevState, nextState = _a.nextState;
            if (nextState === EngineState$1.SRC_SET) {
                this._setState(LiveState$1.NONE);
                return;
            }
            if (!this._engine.isDynamicContent || this._engine.isDynamicContentEnded) {
                return;
            }
            switch (nextState) {
                case EngineState$1.METADATA_LOADED:
                    this._setState(LiveState$1.INITIAL);
                    break;
                case EngineState$1.PLAY_REQUESTED:
                    if (this._state === LiveState$1.INITIAL) {
                        this._engine.syncWithLive();
                    }
                    break;
                case EngineState$1.PLAYING:
                    // NOTE: skip PLAYING event after events like `WAITING` and other not important events.
                    if (this._state === LiveState$1.INITIAL ||
                        this._state === LiveState$1.NOT_SYNC ||
                        this._isSeekedByUIWhilePlaying) {
                        this._setState(this._engine.isSyncWithLive ? LiveState$1.SYNC : LiveState$1.NOT_SYNC);
                        this._isSeekedByUIWhilePlaying = false;
                    }
                    break;
                case EngineState$1.PAUSED:
                    // NOTE: process `PAUSED` event only `PLAYING`, to be sure its not related with `WAITING` events
                    if (prevState === EngineState$1.PLAYING) {
                        this._setState(LiveState$1.NOT_SYNC);
                    }
                    break;
                default:
                    break;
            }
        };
        LiveStateEngine.prototype._processSeekByUI = function () {
            if (this._engine.isDynamicContent &&
                this._engine.getCurrentState() === EngineState$1.PLAYING) {
                // NOTE: flag should be handled on `PLAYING` state in `_processStateChange`
                this._isSeekedByUIWhilePlaying = true;
            }
        };
        LiveStateEngine.prototype._onDynamicContentEnded = function () {
            this._setState(LiveState$1.ENDED);
        };
        LiveStateEngine.prototype._setState = function (state) {
            if (this._state !== state) {
                var prevState = this._state;
                var nextState = state;
                this._state = state;
                this._eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
                    prevState: prevState,
                    nextState: nextState,
                });
            }
        };
        LiveStateEngine.prototype.destroy = function () {
            this._unbindEvents();
            this._eventEmitter = null;
            this._engine = null;
            this._state = null;
        };
        LiveStateEngine.moduleName = 'liveStateEngine';
        LiveStateEngine.dependencies = ['eventEmitter', 'engine'];
        return LiveStateEngine;
    }());

    var KEYCODES = {
        SPACE_BAR: 32,
        ENTER: 13,
        TAB: 9,
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        DEBUG_KEY: 68,
    };
    var KeyboardInterceptorCore = /** @class */ (function () {
        function KeyboardInterceptorCore(node, callbacks) {
            this._eventEmitter = new eventemitter3_1();
            this._node = node;
            callbacks && this._attachCallbacks(callbacks);
            this._bindCallbacks();
            this._bindEvents();
        }
        KeyboardInterceptorCore.prototype._attachCallbacks = function (callbacks) {
            var _this = this;
            Object.keys(callbacks).forEach(function (keyCode) {
                var keyCodeCallbacks = callbacks[keyCode];
                if (Array.isArray(keyCodeCallbacks)) {
                    keyCodeCallbacks.forEach(function (callback) {
                        return _this._eventEmitter.on(keyCode, callback);
                    });
                }
                else {
                    _this._eventEmitter.on(keyCode, keyCodeCallbacks);
                }
            });
        };
        KeyboardInterceptorCore.prototype._unattachCallbacks = function () {
            this._eventEmitter.removeAllListeners();
        };
        KeyboardInterceptorCore.prototype._bindCallbacks = function () {
            this._processKeyboardInput = this._processKeyboardInput.bind(this);
        };
        KeyboardInterceptorCore.prototype._bindEvents = function () {
            this._node.addEventListener('keydown', this._processKeyboardInput, false);
        };
        KeyboardInterceptorCore.prototype._unbindEvents = function () {
            this._node.removeEventListener('keydown', this._processKeyboardInput, false);
        };
        KeyboardInterceptorCore.prototype.addCallbacks = function (callbacks) {
            this._attachCallbacks(callbacks);
        };
        KeyboardInterceptorCore.prototype._processKeyboardInput = function (e) {
            this._eventEmitter.emit(e.keyCode, e);
        };
        KeyboardInterceptorCore.prototype.destroy = function () {
            this._unbindEvents();
            this._unattachCallbacks();
            this._eventEmitter = null;
            this._node = null;
        };
        return KeyboardInterceptorCore;
    }());

    var AMOUNT_TO_SKIP_SECONDS = 5;
    var AMOUNT_TO_CHANGE_VOLUME = 10;
    var KeyboardControl = /** @class */ (function () {
        function KeyboardControl(_a) {
            var config = _a.config, eventEmitter = _a.eventEmitter, rootContainer = _a.rootContainer, engine = _a.engine;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            this._rootNode = rootContainer.node;
            if (isIPhone() || isIPod() || isIPad() || isAndroid()) {
                this._isEnabled = false;
            }
            else {
                this._isEnabled = config.disableControlWithKeyboard !== false;
            }
            this._initInterceptor();
        }
        KeyboardControl.prototype._initInterceptor = function () {
            if (this._isEnabled) {
                this._keyboardInterceptor = new KeyboardInterceptorCore(this._rootNode);
                this._attachDefaultControls();
            }
        };
        KeyboardControl.prototype._attachDefaultControls = function () {
            var _this = this;
            this._keyboardInterceptor.addCallbacks((_a = {}, _a[KEYCODES.TAB] = function () {
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                }, _a[KEYCODES.SPACE_BAR] = function (e) {
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.togglePlayback();
                }, _a[KEYCODES.LEFT_ARROW] = function (e) {
                    if (_this._engine.isSeekAvailable) {
                        e.preventDefault();
                        _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                        _this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
                        _this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
                    }
                }, _a[KEYCODES.RIGHT_ARROW] = function (e) {
                    if (_this._engine.isSeekAvailable) {
                        e.preventDefault();
                        _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                        _this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
                        _this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
                    }
                }, _a[KEYCODES.UP_ARROW] = function (e) {
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.setMute(false);
                    _this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
                }, _a[KEYCODES.DOWN_ARROW] = function (e) {
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.setMute(false);
                    _this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
                }, _a));
            var _a;
        };
        KeyboardControl.prototype._destroyInterceptor = function () {
            if (this._keyboardInterceptor) {
                this._keyboardInterceptor.destroy();
            }
        };
        KeyboardControl.prototype.addKeyControl = function (key, callback) {
            if (this._isEnabled) {
                this._keyboardInterceptor.addCallbacks((_a = {}, _a[key] = callback, _a));
            }
            var _a;
        };
        KeyboardControl.prototype.destroy = function () {
            this._destroyInterceptor();
            this._rootNode = null;
            this._eventEmitter = null;
            this._engine = null;
        };
        KeyboardControl.moduleName = 'keyboardControl';
        KeyboardControl.dependencies = ['engine', 'eventEmitter', 'rootContainer', 'config'];
        return KeyboardControl;
    }());

    function anonymous$1(props
    /*``*/) {
    var out='<div class="'+(props.styles.debugPanel)+'"> <div class="'+(props.styles.closeButton)+'" data-hook="debug-panel-close-button" > x </div> <pre class="'+(props.styles.infoContainer)+'" data-hook="debug-panel-info-container" > </pre></div>';return out;
    }

    function syntaxHighlight(json, styleNames) {
        json = json
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
            var cls = styleNames.number;
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = styleNames.key;
                }
                else {
                    cls = styleNames.string;
                }
            }
            else if (/true|false/.test(match)) {
                cls = styleNames.boolean;
            }
            else if (/null/.test(match)) {
                cls = styleNames.null;
            }
            return "<span class=\"" + cls + "\">" + match + "</span>";
        });
    }

    function getElementByHook(element, hook) {
        return element.querySelector("[data-hook=\"" + hook + "\"]");
    }

    function toggleNodeClass(node, className, shouldAdd) {
        if (shouldAdd) {
            node.classList.add(className);
        }
        else {
            node.classList.remove(className);
        }
    }

    var css$1 = ".debug-panel__controlButton___pG-WY {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .debug-panel__controlButton___pG-WY:hover {\n    opacity: .7; }\n  .debug-panel__hidden___1TRHR {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .debug-panel__debugPanel___116IW {\n  position: absolute;\n  z-index: 10000;\n  top: 10px;\n  left: 10px;\n  overflow: scroll;\n  width: 400px;\n  height: 250px;\n  border-radius: 3px;\n  background-color: rgba(0, 0, 0, 0.95); }\n  .debug-panel__debugPanel___116IW .debug-panel__closeButton___claHV {\n    position: absolute;\n    top: 10px;\n    right: 5px;\n    cursor: pointer;\n    color: white; }\n  .debug-panel__debugPanel___116IW .debug-panel__closeButton___claHV:hover {\n      opacity: .8; }\n  .debug-panel__debugPanel___116IW .debug-panel__infoContainer___-AZH_ {\n    font-size: 8px;\n    line-height: 8px;\n    margin: 5px;\n    padding: 5px;\n    color: white; }\n  .debug-panel__debugPanel___116IW .debug-panel__infoContainer___-AZH_ .debug-panel__string___1Jfzp {\n      color: green; }\n  .debug-panel__debugPanel___116IW .debug-panel__infoContainer___-AZH_ .debug-panel__number___2WdLF {\n      color: darkorange; }\n  .debug-panel__debugPanel___116IW .debug-panel__infoContainer___-AZH_ .debug-panel__boolean___CpohN {\n      color: blue; }\n  .debug-panel__debugPanel___116IW .debug-panel__infoContainer___-AZH_ .debug-panel__null___2ZOuz {\n      color: magenta; }\n  .debug-panel__debugPanel___116IW .debug-panel__infoContainer___-AZH_ .debug-panel__key___4avak {\n      color: white; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlYnVnLXBhbmVsLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixxQ0FBNkI7RUFBN0IsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLDhCQUE4QjtFQUM5QixvQkFBb0I7RUFDcEIsd0JBQXdCO0VBQ3hCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixzQkFBc0IsRUFBRTtFQUUxQjtFQUNFLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsVUFBVTtFQUNWLFdBQVc7RUFDWCxpQkFBaUI7RUFDakIsYUFBYTtFQUNiLGNBQWM7RUFDZCxtQkFBbUI7RUFDbkIsc0NBQXNDLEVBQUU7RUFDeEM7SUFDRSxtQkFBbUI7SUFDbkIsVUFBVTtJQUNWLFdBQVc7SUFDWCxnQkFBZ0I7SUFDaEIsYUFBYSxFQUFFO0VBQ2Y7TUFDRSxZQUFZLEVBQUU7RUFDbEI7SUFDRSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYSxFQUFFO0VBQ2Y7TUFDRSxhQUFhLEVBQUU7RUFDakI7TUFDRSxrQkFBa0IsRUFBRTtFQUN0QjtNQUNFLFlBQVksRUFBRTtFQUNoQjtNQUNFLGVBQWUsRUFBRTtFQUNuQjtNQUNFLGFBQWEsRUFBRSIsImZpbGUiOiJkZWJ1Zy1wYW5lbC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRyb2xCdXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eTtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmNvbnRyb2xCdXR0b246aG92ZXIge1xuICAgIG9wYWNpdHk6IC43OyB9XG5cbi5oaWRkZW4ge1xuICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDAgIWltcG9ydGFudDsgfVxuXG4uZGVidWdQYW5lbCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTAwMDA7XG4gIHRvcDogMTBweDtcbiAgbGVmdDogMTBweDtcbiAgb3ZlcmZsb3c6IHNjcm9sbDtcbiAgd2lkdGg6IDQwMHB4O1xuICBoZWlnaHQ6IDI1MHB4O1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45NSk7IH1cbiAgLmRlYnVnUGFuZWwgLmNsb3NlQnV0dG9uIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAxMHB4O1xuICAgIHJpZ2h0OiA1cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiB3aGl0ZTsgfVxuICAgIC5kZWJ1Z1BhbmVsIC5jbG9zZUJ1dHRvbjpob3ZlciB7XG4gICAgICBvcGFjaXR5OiAuODsgfVxuICAuZGVidWdQYW5lbCAuaW5mb0NvbnRhaW5lciB7XG4gICAgZm9udC1zaXplOiA4cHg7XG4gICAgbGluZS1oZWlnaHQ6IDhweDtcbiAgICBtYXJnaW46IDVweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgY29sb3I6IHdoaXRlOyB9XG4gICAgLmRlYnVnUGFuZWwgLmluZm9Db250YWluZXIgLnN0cmluZyB7XG4gICAgICBjb2xvcjogZ3JlZW47IH1cbiAgICAuZGVidWdQYW5lbCAuaW5mb0NvbnRhaW5lciAubnVtYmVyIHtcbiAgICAgIGNvbG9yOiBkYXJrb3JhbmdlOyB9XG4gICAgLmRlYnVnUGFuZWwgLmluZm9Db250YWluZXIgLmJvb2xlYW4ge1xuICAgICAgY29sb3I6IGJsdWU7IH1cbiAgICAuZGVidWdQYW5lbCAuaW5mb0NvbnRhaW5lciAubnVsbCB7XG4gICAgICBjb2xvcjogbWFnZW50YTsgfVxuICAgIC5kZWJ1Z1BhbmVsIC5pbmZvQ29udGFpbmVyIC5rZXkge1xuICAgICAgY29sb3I6IHdoaXRlOyB9XG4iXX0= */";
    var styles$1 = {"controlButton":"debug-panel__controlButton___pG-WY","hidden":"debug-panel__hidden___1TRHR","debugPanel":"debug-panel__debugPanel___116IW","closeButton":"debug-panel__closeButton___claHV","infoContainer":"debug-panel__infoContainer___-AZH_","string":"debug-panel__string___1Jfzp","number":"debug-panel__number___2WdLF","boolean":"debug-panel__boolean___CpohN","null":"debug-panel__null___2ZOuz","key":"debug-panel__key___4avak"};
    styleInject(css$1);

    var DebugPanelView = /** @class */ (function (_super) {
        __extends(DebugPanelView, _super);
        function DebugPanelView(config) {
            var _this = _super.call(this) || this;
            var callbacks = config.callbacks;
            _this._callbacks = callbacks;
            _this._initDOM();
            _this._bindEvents();
            return _this;
        }
        DebugPanelView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$1({
                styles: this.styleNames,
            }));
            this._$closeButton = getElementByHook(this._$node, 'debug-panel-close-button');
            this._$infoContainer = getElementByHook(this._$node, 'debug-panel-info-container');
        };
        DebugPanelView.prototype._bindEvents = function () {
            this._$closeButton.addEventListener('click', this._callbacks.onCloseButtonClick);
        };
        DebugPanelView.prototype._unbindEvents = function () {
            this._$closeButton.removeEventListener('click', this._callbacks.onCloseButtonClick);
        };
        DebugPanelView.prototype.show = function () {
            toggleNodeClass(this._$node, this.styleNames.hidden, false);
        };
        DebugPanelView.prototype.hide = function () {
            toggleNodeClass(this._$node, this.styleNames.hidden, true);
        };
        DebugPanelView.prototype.setInfo = function (info) {
            this._$infoContainer.innerHTML = syntaxHighlight(JSON.stringify(info, undefined, 4), this.styleNames);
        };
        DebugPanelView.prototype.getNode = function () {
            return this._$node;
        };
        DebugPanelView.prototype.destroy = function () {
            this._unbindEvents();
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$closeButton = null;
            this._$infoContainer = null;
            this._callbacks = null;
        };
        return DebugPanelView;
    }(View));
    DebugPanelView.extendStyleNames(styles$1);

    var UPDATE_TIME = 1000;
    var DebugPanel = /** @class */ (function () {
        function DebugPanel(_a) {
            var engine = _a.engine, rootContainer = _a.rootContainer, keyboardControl = _a.keyboardControl;
            this._engine = engine;
            this._bindCallbacks();
            this._initUI();
            this.hide();
            rootContainer.appendComponentNode(this.node);
            keyboardControl.addKeyControl(KEYCODES.DEBUG_KEY, this._keyControlCallback);
        }
        DebugPanel.prototype._keyControlCallback = function (e) {
            if (e.ctrlKey && e.shiftKey) {
                this.show();
            }
        };
        Object.defineProperty(DebugPanel.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        DebugPanel.prototype._initUI = function () {
            this.view = new DebugPanelView({
                callbacks: {
                    onCloseButtonClick: this.hide,
                },
            });
        };
        DebugPanel.prototype._bindCallbacks = function () {
            this.updateInfo = this.updateInfo.bind(this);
            this.hide = this.hide.bind(this);
            this._keyControlCallback = this._keyControlCallback.bind(this);
        };
        DebugPanel.prototype.getDebugInfo = function () {
            var _a = this._engine.getDebugInfo(), url = _a.url, type = _a.type, deliveryPriority = _a.deliveryPriority, currentBitrate = _a.currentBitrate, overallBufferLength = _a.overallBufferLength, nearestBufferSegInfo = _a.nearestBufferSegInfo, viewDimensions = _a.viewDimensions, currentTime = _a.currentTime, duration = _a.duration, loadingStateTimestamps = _a.loadingStateTimestamps, bitrates = _a.bitrates, bwEstimate = _a.bwEstimate;
            return {
                url: url,
                type: type,
                deliveryPriority: MediaStreamDeliveryPriority[deliveryPriority],
                currentBitrate: currentBitrate,
                overallBufferLength: overallBufferLength,
                nearestBufferSegInfo: nearestBufferSegInfo,
                viewDimensions: viewDimensions,
                currentTime: currentTime,
                duration: duration,
                loadingStateTimestamps: loadingStateTimestamps,
                bitrates: bitrates,
                bwEstimate: bwEstimate,
            };
        };
        DebugPanel.prototype.updateInfo = function () {
            this.view.setInfo(this.getDebugInfo());
        };
        DebugPanel.prototype.setUpdateInterval = function () {
            this.clearUpdateInterval();
            this._interval = window.setInterval(this.updateInfo, UPDATE_TIME);
        };
        DebugPanel.prototype.clearUpdateInterval = function () {
            window.clearInterval(this._interval);
        };
        DebugPanel.prototype.show = function () {
            if (this.isHidden) {
                this.updateInfo();
                this.setUpdateInterval();
                this.view.show();
                this.isHidden = false;
            }
        };
        DebugPanel.prototype.hide = function () {
            if (!this.isHidden) {
                this.clearUpdateInterval();
                this.view.hide();
                this.isHidden = true;
            }
        };
        DebugPanel.prototype.destroy = function () {
            this.clearUpdateInterval();
            this.view.destroy();
            this.view = null;
        };
        DebugPanel.moduleName = 'debugPanel';
        DebugPanel.View = DebugPanelView;
        DebugPanel.dependencies = ['engine', 'rootContainer', 'keyboardControl'];
        return DebugPanel;
    }());

    function anonymous$2(props
    /*``*/) {
    var out='<div class="'+(props.styles.screen)+'" data-hook="screen-block"> <canvas class="'+(props.styles.backgroundCanvas)+'" data-hook="background-canvas"/></div>';return out;
    }

    var VideoViewMode;
    (function (VideoViewMode) {
        VideoViewMode["REGULAR"] = "REGULAR";
        VideoViewMode["BLUR"] = "BLUR";
        VideoViewMode["FILL"] = "FILL";
    })(VideoViewMode || (VideoViewMode = {}));

    var css$2 = ".screen__screen___3BN2N {\n  position: absolute;\n  z-index: 50;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .screen__screen___3BN2N.screen__regularMode___1Bv69 video {\n    width: 100%;\n    height: 100%; }\n  .screen__screen___3BN2N.screen__verticalVideo___3Z_0A {\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row; }\n  .screen__screen___3BN2N.screen__verticalVideo___3Z_0A.screen__fillMode___rToyv video {\n      width: 100%; }\n  .screen__screen___3BN2N.screen__verticalVideo___3Z_0A.screen__blurMode___Zianj video {\n      height: 100%; }\n  .screen__screen___3BN2N.screen__horizontalVideo___2NcY5 {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column; }\n  .screen__screen___3BN2N.screen__horizontalVideo___2NcY5.screen__fillMode___rToyv video {\n      height: 100%; }\n  .screen__screen___3BN2N.screen__horizontalVideo___2NcY5.screen__blurMode___Zianj video {\n      width: 100%; }\n  .screen__screen___3BN2N video {\n    position: relative;\n    z-index: 1;\n    -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);\n            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); }\n  .screen__screen___3BN2N.screen__hiddenCursor___3-TwW {\n    cursor: none; }\n  .screen__backgroundCanvas___1PHZh {\n  position: absolute;\n  z-index: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  -webkit-filter: blur(14px);\n          filter: blur(14px); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmVlbi5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixPQUFPO0VBQ1AsU0FBUztFQUNULFVBQVU7RUFDVixRQUFRO0VBQ1IscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCw2QkFBdUI7RUFBdkIsOEJBQXVCO01BQXZCLDJCQUF1QjtVQUF2Qix1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLGFBQWE7RUFDYix3QkFBd0I7RUFDeEIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVk7SUFDWixhQUFhLEVBQUU7RUFDakI7SUFDRSwrQkFBb0I7SUFBcEIsOEJBQW9CO1FBQXBCLHdCQUFvQjtZQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtNQUNFLFlBQVksRUFBRTtFQUNoQjtNQUNFLGFBQWEsRUFBRTtFQUNuQjtJQUNFLDZCQUF1QjtJQUF2Qiw4QkFBdUI7UUFBdkIsMkJBQXVCO1lBQXZCLHVCQUF1QixFQUFFO0VBQ3pCO01BQ0UsYUFBYSxFQUFFO0VBQ2pCO01BQ0UsWUFBWSxFQUFFO0VBQ2xCO0lBQ0UsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCxnREFBd0M7WUFBeEMsd0NBQXdDLEVBQUU7RUFDNUM7SUFDRSxhQUFhLEVBQUU7RUFFbkI7RUFDRSxtQkFBbUI7RUFDbkIsV0FBVztFQUNYLE9BQU87RUFDUCxTQUFTO0VBQ1QsVUFBVTtFQUNWLFFBQVE7RUFDUiwyQkFBbUI7VUFBbkIsbUJBQW1CLEVBQUUiLCJmaWxlIjoic2NyZWVuLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2NyZWVuIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA1MDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLnNjcmVlbi5yZWd1bGFyTW9kZSB2aWRlbyB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlOyB9XG4gIC5zY3JlZW4udmVydGljYWxWaWRlbyB7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdzsgfVxuICAgIC5zY3JlZW4udmVydGljYWxWaWRlby5maWxsTW9kZSB2aWRlbyB7XG4gICAgICB3aWR0aDogMTAwJTsgfVxuICAgIC5zY3JlZW4udmVydGljYWxWaWRlby5ibHVyTW9kZSB2aWRlbyB7XG4gICAgICBoZWlnaHQ6IDEwMCU7IH1cbiAgLnNjcmVlbi5ob3Jpem9udGFsVmlkZW8ge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IH1cbiAgICAuc2NyZWVuLmhvcml6b250YWxWaWRlby5maWxsTW9kZSB2aWRlbyB7XG4gICAgICBoZWlnaHQ6IDEwMCU7IH1cbiAgICAuc2NyZWVuLmhvcml6b250YWxWaWRlby5ibHVyTW9kZSB2aWRlbyB7XG4gICAgICB3aWR0aDogMTAwJTsgfVxuICAuc2NyZWVuIHZpZGVvIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgei1pbmRleDogMTtcbiAgICBib3gtc2hhZG93OiAwIDAgMjBweCByZ2JhKDAsIDAsIDAsIDAuMik7IH1cbiAgLnNjcmVlbi5oaWRkZW5DdXJzb3Ige1xuICAgIGN1cnNvcjogbm9uZTsgfVxuXG4uYmFja2dyb3VuZENhbnZhcyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBmaWx0ZXI6IGJsdXIoMTRweCk7IH1cbiJdfQ== */";
    var styles$2 = {"screen":"screen__screen___3BN2N","regularMode":"screen__regularMode___1Bv69","verticalVideo":"screen__verticalVideo___3Z_0A","fillMode":"screen__fillMode___rToyv","blurMode":"screen__blurMode___Zianj","horizontalVideo":"screen__horizontalVideo___2NcY5","hiddenCursor":"screen__hiddenCursor___3-TwW","backgroundCanvas":"screen__backgroundCanvas___1PHZh"};
    styleInject(css$2);

    var ScreenView = /** @class */ (function (_super) {
        __extends(ScreenView, _super);
        function ScreenView(config) {
            var _this = _super.call(this) || this;
            var callbacks = config.callbacks, nativeControls = config.nativeControls, playbackViewNode = config.playbackViewNode;
            _this._callbacks = callbacks;
            _this._styleNamesByViewMode = (_a = {}, _a[VideoViewMode.REGULAR] = _this.styleNames.regularMode, _a[VideoViewMode.BLUR] = _this.styleNames.blurMode, _a[VideoViewMode.FILL] = _this.styleNames.fillMode, _a);
            _this._bindCallbacks();
            if (nativeControls) {
                playbackViewNode.setAttribute('controls', 'true');
            }
            _this._initDOM(playbackViewNode);
            _this._bindEvents();
            _this.setViewMode(VideoViewMode.REGULAR);
            return _this;
            var _a;
        }
        ScreenView.prototype._bindCallbacks = function () {
            this._updateBackground = this._updateBackground.bind(this);
        };
        ScreenView.prototype._initDOM = function (playbackViewNode) {
            this._$node = htmlToElement(anonymous$2({
                styles: this.styleNames,
            }));
            this._$playbackNode = playbackViewNode;
            this._$node.appendChild(playbackViewNode);
            this._$canvas = getElementByHook(this._$node, 'background-canvas');
            this._ctx = this._$canvas.getContext('2d');
        };
        ScreenView.prototype._bindEvents = function () {
            this._$node.addEventListener('click', this._callbacks.onWrapperMouseClick);
            this._$node.addEventListener('dblclick', this._callbacks.onWrapperMouseDblClick);
        };
        ScreenView.prototype._unbindEvents = function () {
            this._$node.removeEventListener('click', this._callbacks.onWrapperMouseClick);
            this._$node.removeEventListener('dblclick', this._callbacks.onWrapperMouseDblClick);
        };
        ScreenView.prototype.updateVideoAspectRatio = function (widthHeightRatio) {
            this._widthHeightRatio = widthHeightRatio;
            var isHorizontal = this._widthHeightRatio > 1;
            toggleNodeClass(this._$node, this.styleNames.horizontalVideo, isHorizontal);
            toggleNodeClass(this._$node, this.styleNames.verticalVideo, !isHorizontal);
        };
        ScreenView.prototype.focusOnNode = function () {
            this._$node.focus();
        };
        ScreenView.prototype.show = function () {
            toggleNodeClass(this._$node, this.styleNames.hidden, false);
        };
        ScreenView.prototype.hide = function () {
            toggleNodeClass(this._$node, this.styleNames.hidden, true);
        };
        ScreenView.prototype.getNode = function () {
            return this._$node;
        };
        ScreenView.prototype.appendComponentNode = function (node) {
            this._$node.appendChild(node);
        };
        ScreenView.prototype.hideCursor = function () {
            toggleNodeClass(this._$node, this.styleNames.hiddenCursor, true);
        };
        ScreenView.prototype.showCursor = function () {
            toggleNodeClass(this._$node, this.styleNames.hiddenCursor, false);
        };
        ScreenView.prototype.setViewMode = function (viewMode) {
            var _this = this;
            if (this._styleNamesByViewMode[viewMode]) {
                this.resetBackground();
                Object.keys(this._styleNamesByViewMode).forEach(function (mode) {
                    toggleNodeClass(_this._$node, _this._styleNamesByViewMode[mode], false);
                });
                toggleNodeClass(this._$node, this._styleNamesByViewMode[viewMode], true);
                if (viewMode === VideoViewMode.BLUR) {
                    this._startUpdatingBackground();
                }
                else {
                    this._stopUpdatingBackground();
                }
                this._currentMode = viewMode;
            }
        };
        ScreenView.prototype.setBackgroundSize = function (width, height) {
            this.setBackgroundWidth(width);
            this.setBackgroundHeight(height);
        };
        ScreenView.prototype.setBackgroundWidth = function (width) {
            this._$canvas.width = width;
        };
        ScreenView.prototype.setBackgroundHeight = function (height) {
            this._$canvas.height = height;
        };
        ScreenView.prototype._startUpdatingBackground = function () {
            if (!this._requestAnimationFrameID) {
                this._updateBackground();
            }
        };
        ScreenView.prototype._stopUpdatingBackground = function () {
            if (this._requestAnimationFrameID) {
                cancelAnimationFrame(this._requestAnimationFrameID);
                this._requestAnimationFrameID = null;
            }
        };
        ScreenView.prototype.resetAspectRatio = function () {
            var _a = this._$playbackNode, videoWidth = _a.videoWidth, videoHeight = _a.videoHeight;
            this._widthHeightRatio = videoHeight ? videoWidth / videoHeight : 0;
            var isHorizontal = this._widthHeightRatio > 1;
            toggleNodeClass(this._$node, this.styleNames.horizontalVideo, isHorizontal);
            toggleNodeClass(this._$node, this.styleNames.verticalVideo, !isHorizontal);
        };
        ScreenView.prototype.resetBackground = function () {
            if (this._currentMode === VideoViewMode.BLUR) {
                this._clearBackground();
            }
        };
        ScreenView.prototype._getSourceAreas = function (width, height) {
            if (this._widthHeightRatio > 1) {
                return [[0, 0, width, 1], [0, height - 1, width, 1]];
            }
            return [[0, 0, 1, height], [width - 1, 0, 1, height]];
        };
        ScreenView.prototype._getCanvasAreas = function (width, height) {
            if (this._widthHeightRatio > 1) {
                return [[0, 0, width, height / 2], [0, height / 2, width, height / 2]];
            }
            return [[0, 0, width / 2, height], [width / 2, 0, width / 2, height]];
        };
        ScreenView.prototype._drawAreaFromSource = function (source, area) {
            var sourceX = source[0], sourceY = source[1], sourceWidth = source[2], sourceHeight = source[3];
            var areaX = area[0], areaY = area[1], areaWidth = area[2], areaHeight = area[3];
            this._ctx.drawImage(this._$playbackNode, sourceX, sourceY, sourceWidth, sourceHeight, areaX, areaY, areaWidth, areaHeight);
        };
        ScreenView.prototype._drawBackground = function () {
            var _a = this._$playbackNode, videoWidth = _a.videoWidth, videoHeight = _a.videoHeight;
            var canvasWidth = this._$canvas.width;
            var canvasHeight = this._$canvas.height;
            var sourceAreas = this._getSourceAreas(videoWidth, videoHeight);
            var canvasAreas = this._getCanvasAreas(canvasWidth, canvasHeight);
            this._drawAreaFromSource(sourceAreas[0], canvasAreas[0]);
            this._drawAreaFromSource(sourceAreas[1], canvasAreas[1]);
        };
        ScreenView.prototype._updateBackground = function () {
            this._drawBackground();
            this._requestAnimationFrameID = requestAnimationFrame(this._updateBackground);
        };
        ScreenView.prototype._clearBackground = function () {
            this._ctx.clearRect(0, 0, this._$canvas.width, this._$canvas.height);
        };
        ScreenView.prototype.destroy = function () {
            this._stopUpdatingBackground();
            this._unbindEvents();
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$playbackNode = null;
            this._$canvas = null;
            this._ctx = null;
            this._callbacks = null;
        };
        return ScreenView;
    }(View));
    ScreenView.extendStyleNames(styles$2);

    var PLAYBACK_CHANGE_TIMEOUT = 300;
    var DEFAULT_CONFIG$2 = {
        disableClickProcessing: false,
        nativeControls: false,
    };
    var Screen = /** @class */ (function () {
        function Screen(_a) {
            var config = _a.config, eventEmitter = _a.eventEmitter, engine = _a.engine, fullScreenManager = _a.fullScreenManager, interactionIndicator = _a.interactionIndicator, rootContainer = _a.rootContainer;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            this._fullScreenManager = fullScreenManager;
            this._interactionIndicator = interactionIndicator;
            this._isInFullScreen = false;
            this.isHidden = false;
            this._delayedToggleVideoPlaybackTimeout = null;
            var screenConfig = __assign({}, DEFAULT_CONFIG$2, config.screen);
            this._isClickProcessingDisabled = screenConfig.disableClickProcessing;
            this._bindCallbacks();
            this._initUI(screenConfig.nativeControls);
            this._bindEvents();
            rootContainer.appendComponentNode(this.node);
        }
        Object.defineProperty(Screen.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        Screen.prototype._bindCallbacks = function () {
            this._processNodeClick = this._processNodeClick.bind(this);
            this._processNodeDblClick = this._processNodeDblClick.bind(this);
            this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
        };
        Screen.prototype._initUI = function (isNativeControls) {
            var config = {
                nativeControls: isNativeControls,
                callbacks: {
                    onWrapperMouseClick: this._processNodeClick,
                    onWrapperMouseDblClick: this._processNodeDblClick,
                },
                playbackViewNode: this._engine.getNode(),
            };
            this.view = new ScreenView(config);
        };
        Screen.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._setFullScreenStatus],
                [UI_EVENTS.PLAY_OVERLAY_TRIGGERED, this.view.focusOnNode, this.view],
                [UI_EVENTS.RESIZE, this._updateBackgroundSize],
                [EngineState$1.SRC_SET, this.view.resetBackground, this.view],
                [EngineState$1.METADATA_LOADED, this.view.resetAspectRatio, this.view],
            ], this);
        };
        Screen.prototype._updateBackgroundSize = function (_a) {
            var width = _a.width, height = _a.height;
            this.view.setBackgroundSize(width, height);
        };
        Screen.prototype.showCursor = function () {
            this.view.showCursor();
        };
        Screen.prototype.hideCursor = function () {
            this.view.hideCursor();
        };
        Screen.prototype._setFullScreenStatus = function (isInFullScreen) {
            this._isInFullScreen = isInFullScreen;
        };
        Screen.prototype._processNodeClick = function () {
            if (this._isClickProcessingDisabled) {
                return;
            }
            this._showPlaybackChangeIndicator();
            if (!this._fullScreenManager.isEnabled) {
                this._toggleVideoPlayback();
            }
            else {
                this._setDelayedPlaybackToggle();
            }
        };
        Screen.prototype._processNodeDblClick = function () {
            if (this._isClickProcessingDisabled) {
                return;
            }
            if (this._fullScreenManager.isEnabled) {
                if (this._isDelayedPlaybackToggleExist) {
                    this._clearDelayedPlaybackToggle();
                    this._hideDelayedPlaybackChangeIndicator();
                }
                this._toggleFullScreen();
            }
        };
        Screen.prototype._showPlaybackChangeIndicator = function () {
            var state = this._engine.getCurrentState();
            if (state === EngineState$1.PLAY_REQUESTED || state === EngineState$1.PLAYING) {
                this._interactionIndicator.showPause();
            }
            else {
                this._interactionIndicator.showPlay();
            }
        };
        Screen.prototype._hideDelayedPlaybackChangeIndicator = function () {
            this._interactionIndicator.hideIcons();
        };
        Screen.prototype._setDelayedPlaybackToggle = function () {
            this._clearDelayedPlaybackToggle();
            this._delayedToggleVideoPlaybackTimeout = window.setTimeout(this._toggleVideoPlayback, PLAYBACK_CHANGE_TIMEOUT);
        };
        Screen.prototype._clearDelayedPlaybackToggle = function () {
            window.clearTimeout(this._delayedToggleVideoPlaybackTimeout);
            this._delayedToggleVideoPlaybackTimeout = null;
        };
        Object.defineProperty(Screen.prototype, "_isDelayedPlaybackToggleExist", {
            get: function () {
                return Boolean(this._delayedToggleVideoPlaybackTimeout);
            },
            enumerable: true,
            configurable: true
        });
        Screen.prototype._toggleVideoPlayback = function () {
            this._clearDelayedPlaybackToggle();
            var state = this._engine.getCurrentState();
            if (state === EngineState$1.PLAY_REQUESTED || state === EngineState$1.PLAYING) {
                this._eventEmitter.emit(UI_EVENTS.PAUSE_WITH_SCREEN_CLICK_TRIGGERED);
                this._engine.pause();
            }
            else {
                this._eventEmitter.emit(UI_EVENTS.PLAY_WITH_SCREEN_CLICK_TRIGGERED);
                this._engine.play();
            }
        };
        Screen.prototype._toggleFullScreen = function () {
            if (this._isInFullScreen) {
                this._exitFullScreen();
            }
            else {
                this._enterFullScreen();
            }
        };
        Screen.prototype.hide = function () {
            if (!this.isHidden) {
                this.view.hide();
                this.isHidden = true;
            }
        };
        Screen.prototype.show = function () {
            if (this.isHidden) {
                this.view.show();
                this.isHidden = false;
            }
        };
        Screen.prototype.setVideoViewMode = function (viewMode) {
            this.view.setViewMode(viewMode);
        };
        Screen.prototype._enterFullScreen = function () {
            this._fullScreenManager.enterFullScreen();
        };
        Screen.prototype._exitFullScreen = function () {
            this._fullScreenManager.exitFullScreen();
        };
        Screen.prototype.destroy = function () {
            this._unbindEvents();
            this._clearDelayedPlaybackToggle();
            this.view.destroy();
            this.view = null;
            this._interactionIndicator = null;
            this._eventEmitter = null;
            this._engine = null;
            this._fullScreenManager = null;
        };
        Screen.moduleName = 'screen';
        Screen.View = ScreenView;
        Screen.dependencies = [
            'engine',
            'eventEmitter',
            'config',
            'fullScreenManager',
            'interactionIndicator',
            'rootContainer',
        ];
        __decorate([
            playerAPI()
        ], Screen.prototype, "setVideoViewMode", null);
        return Screen;
    }());

    function anonymous$3(props
    /*``*/) {
    var out='<div class="'+(props.styles.iconContainer)+'"></div>';return out;
    }

    function anonymous$4(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg class="'+(props.styles.playIcon)+' '+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 14"> <path fill="#FFF" fill-rule="evenodd" d="M.079 0L0 14l10.5-7.181z"/> </svg></div>';return out;
    }

    function anonymous$5(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg class="'+(props.styles.pauseIcon)+' '+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"> <path fill="#FFF" fill-rule="evenodd" d="M7 0h3v14H7V0zM0 0h3v14H0V0z"/> </svg></div>';return out;
    }

    function anonymous$6(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <div class="'+(props.styles.seconds)+'"> <span>'+(props.texts.SECONDS_COUNT)+'</span> </div> <svg class="'+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"> <path fill="#FFF" fill-rule="evenodd" d="M17 0c4.59 0 8.84 1.87 11.9 4.93V1.7h3.4v10.2H22.1V8.5h5.44C24.99 5.27 21.25 3.4 17 3.4 9.52 3.4 3.4 9.52 3.4 17c0 7.48 6.12 13.6 13.6 13.6 7.48 0 13.6-6.12 13.6-13.6H34c0 9.35-7.65 17-17 17S0 26.35 0 17 7.65 0 17 0z"/> </svg></div>';return out;
    }

    function anonymous$7(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <div class="'+(props.styles.seconds)+'"> <span>'+(props.texts.SECONDS_COUNT)+'</span> </div> <svg class="'+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"> <path fill="#FFF" fill-rule="evenodd" d="M17 0C12.41 0 8.16 1.87 5.1 4.93V1.7H1.7v10.2h10.2V8.5H6.46C9.01 5.27 12.75 3.4 17 3.4c7.48 0 13.6 6.12 13.6 13.6 0 7.48-6.12 13.6-13.6 13.6-7.48 0-13.6-6.12-13.6-13.6H0c0 9.35 7.65 17 17 17s17-7.65 17-17S26.35 0 17 0z"/> </svg></div>';return out;
    }

    function anonymous$8(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg class="'+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"> <g fill="none" fill-rule="evenodd"> <path fill="#FFF" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/> <path stroke="#FFF" d="M12.793 13.716a9.607 9.607 0 0 0 0-13.586M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/> </g> </svg></div>';return out;
    }

    function anonymous$9(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg class="'+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"> <g fill="none" fill-rule="evenodd"> <path fill="#FFF" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/> <path stroke="#FFF" d="M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/> </g> </svg></div>';return out;
    }

    function anonymous$10(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg class="'+(props.styles.animatedIcon)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"> <g fill="#FFF" fill-rule="evenodd"> <path fill="#FFF" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/> <path stroke="#FFF" d="M13 6.257l-2.05-2.05-.743.743L12.257 7l-2.05 2.05.743.743L13 7.743l2.05 2.05.743-.743L13.743 7l2.05-2.05-.743-.743L13 6.257z"/> </g> </svg></div>';return out;
    }

    var css$3 = ".interaction-indicator__iconContainer___2r3Wb {\n  position: absolute;\n  z-index: 100;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  pointer-events: none;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .interaction-indicator__iconContainer___2r3Wb .interaction-indicator__icon___1pjM4 {\n    font-size: 9px;\n    line-height: 9px;\n    position: relative;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-animation-name: interaction-indicator__fadeOut___P6kY6;\n            animation-name: interaction-indicator__fadeOut___P6kY6;\n    -webkit-animation-duration: .5s;\n            animation-duration: .5s;\n    opacity: 0;\n    border-radius: 100px;\n    background-color: rgba(0, 0, 0, 0.5);\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center; }\n  .interaction-indicator__iconContainer___2r3Wb .interaction-indicator__animatedIcon___3cK8N {\n    -webkit-animation-name: interaction-indicator__iconSize___IYB2z;\n            animation-name: interaction-indicator__iconSize___IYB2z;\n    -webkit-animation-duration: .5s;\n            animation-duration: .5s; }\n  .interaction-indicator__iconContainer___2r3Wb .interaction-indicator__playIcon___1XtXN {\n    position: relative;\n    left: 3px; }\n  .interaction-indicator__iconContainer___2r3Wb .interaction-indicator__pauseIcon___qH2VX {\n    margin: 5px 0; }\n  .interaction-indicator__iconContainer___2r3Wb .interaction-indicator__seconds___2TlaJ {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    min-width: 5px;\n    min-height: 8px;\n    color: white;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center; }\n  .interaction-indicator__iconContainer___2r3Wb .interaction-indicator__seconds___2TlaJ span {\n      display: block; }\n  @-webkit-keyframes interaction-indicator__iconSize___IYB2z {\n  from {\n    width: 22px;\n    height: 22px; }\n  to {\n    width: 30px;\n    height: 30px; } }\n  @keyframes interaction-indicator__iconSize___IYB2z {\n  from {\n    width: 22px;\n    height: 22px; }\n  to {\n    width: 30px;\n    height: 30px; } }\n  @-webkit-keyframes interaction-indicator__fadeOut___P6kY6 {\n  from {\n    width: 22px;\n    height: 22px;\n    padding: 19px;\n    opacity: .9; }\n  to {\n    font-size: 14px;\n    line-height: 14px;\n    width: 30px;\n    height: 30px;\n    padding: 25px;\n    opacity: 0; } }\n  @keyframes interaction-indicator__fadeOut___P6kY6 {\n  from {\n    width: 22px;\n    height: 22px;\n    padding: 19px;\n    opacity: .9; }\n  to {\n    font-size: 14px;\n    line-height: 14px;\n    width: 30px;\n    height: 30px;\n    padding: 25px;\n    opacity: 0; } }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyYWN0aW9uLWluZGljYXRvci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsbUJBQW1CO0VBQ25CLGFBQWE7RUFDYixPQUFPO0VBQ1AsU0FBUztFQUNULFVBQVU7RUFDVixRQUFRO0VBQ1IscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxxQkFBcUI7RUFDckIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsbUJBQW1CO0lBQ25CLHFCQUFjO0lBQWQscUJBQWM7SUFBZCxjQUFjO0lBQ2QsK0RBQXdCO1lBQXhCLHVEQUF3QjtJQUN4QixnQ0FBd0I7WUFBeEIsd0JBQXdCO0lBQ3hCLFdBQVc7SUFDWCxxQkFBcUI7SUFDckIscUNBQXFDO0lBQ3JDLHlCQUF3QjtRQUF4QixzQkFBd0I7WUFBeEIsd0JBQXdCO0lBQ3hCLDBCQUFvQjtRQUFwQix1QkFBb0I7WUFBcEIsb0JBQW9CLEVBQUU7RUFDeEI7SUFDRSxnRUFBeUI7WUFBekIsd0RBQXlCO0lBQ3pCLGdDQUF3QjtZQUF4Qix3QkFBd0IsRUFBRTtFQUM1QjtJQUNFLG1CQUFtQjtJQUNuQixVQUFVLEVBQUU7RUFDZDtJQUNFLGNBQWMsRUFBRTtFQUNsQjtJQUNFLG1CQUFtQjtJQUNuQixPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFDVixRQUFRO0lBQ1IscUJBQWM7SUFBZCxxQkFBYztJQUFkLGNBQWM7SUFDZCxlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYix5QkFBd0I7UUFBeEIsc0JBQXdCO1lBQXhCLHdCQUF3QjtJQUN4QiwwQkFBb0I7UUFBcEIsdUJBQW9CO1lBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO01BQ0UsZUFBZSxFQUFFO0VBRXZCO0VBQ0U7SUFDRSxZQUFZO0lBQ1osYUFBYSxFQUFFO0VBQ2pCO0lBQ0UsWUFBWTtJQUNaLGFBQWEsRUFBRSxFQUFFO0VBTnJCO0VBQ0U7SUFDRSxZQUFZO0lBQ1osYUFBYSxFQUFFO0VBQ2pCO0lBQ0UsWUFBWTtJQUNaLGFBQWEsRUFBRSxFQUFFO0VBRXJCO0VBQ0U7SUFDRSxZQUFZO0lBQ1osYUFBYTtJQUNiLGNBQWM7SUFDZCxZQUFZLEVBQUU7RUFDaEI7SUFDRSxnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWixhQUFhO0lBQ2IsY0FBYztJQUNkLFdBQVcsRUFBRSxFQUFFO0VBWm5CO0VBQ0U7SUFDRSxZQUFZO0lBQ1osYUFBYTtJQUNiLGNBQWM7SUFDZCxZQUFZLEVBQUU7RUFDaEI7SUFDRSxnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWixhQUFhO0lBQ2IsY0FBYztJQUNkLFdBQVcsRUFBRSxFQUFFIiwiZmlsZSI6ImludGVyYWN0aW9uLWluZGljYXRvci5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmljb25Db250YWluZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDEwMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmljb25Db250YWluZXIgLmljb24ge1xuICAgIGZvbnQtc2l6ZTogOXB4O1xuICAgIGxpbmUtaGVpZ2h0OiA5cHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYW5pbWF0aW9uLW5hbWU6IGZhZGVPdXQ7XG4gICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAuNXM7XG4gICAgb3BhY2l0eTogMDtcbiAgICBib3JkZXItcmFkaXVzOiAxMDBweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAuaWNvbkNvbnRhaW5lciAuYW5pbWF0ZWRJY29uIHtcbiAgICBhbmltYXRpb24tbmFtZTogaWNvblNpemU7XG4gICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAuNXM7IH1cbiAgLmljb25Db250YWluZXIgLnBsYXlJY29uIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGVmdDogM3B4OyB9XG4gIC5pY29uQ29udGFpbmVyIC5wYXVzZUljb24ge1xuICAgIG1hcmdpbjogNXB4IDA7IH1cbiAgLmljb25Db250YWluZXIgLnNlY29uZHMge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgYm90dG9tOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBtaW4td2lkdGg6IDVweDtcbiAgICBtaW4taGVpZ2h0OiA4cHg7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgICAuaWNvbkNvbnRhaW5lciAuc2Vjb25kcyBzcGFuIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrOyB9XG5cbkBrZXlmcmFtZXMgaWNvblNpemUge1xuICBmcm9tIHtcbiAgICB3aWR0aDogMjJweDtcbiAgICBoZWlnaHQ6IDIycHg7IH1cbiAgdG8ge1xuICAgIHdpZHRoOiAzMHB4O1xuICAgIGhlaWdodDogMzBweDsgfSB9XG5cbkBrZXlmcmFtZXMgZmFkZU91dCB7XG4gIGZyb20ge1xuICAgIHdpZHRoOiAyMnB4O1xuICAgIGhlaWdodDogMjJweDtcbiAgICBwYWRkaW5nOiAxOXB4O1xuICAgIG9wYWNpdHk6IC45OyB9XG4gIHRvIHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbGluZS1oZWlnaHQ6IDE0cHg7XG4gICAgd2lkdGg6IDMwcHg7XG4gICAgaGVpZ2h0OiAzMHB4O1xuICAgIHBhZGRpbmc6IDI1cHg7XG4gICAgb3BhY2l0eTogMDsgfSB9XG4iXX0= */";
    var styles$3 = {"iconContainer":"interaction-indicator__iconContainer___2r3Wb","icon":"interaction-indicator__icon___1pjM4","fadeOut":"interaction-indicator__fadeOut___P6kY6","animatedIcon":"interaction-indicator__animatedIcon___3cK8N","iconSize":"interaction-indicator__iconSize___IYB2z","playIcon":"interaction-indicator__playIcon___1XtXN","pauseIcon":"interaction-indicator__pauseIcon___qH2VX","seconds":"interaction-indicator__seconds___2TlaJ"};
    styleInject(css$3);

    var SECONDS_COUNT = 5;
    var InteractionIndicatorView = /** @class */ (function (_super) {
        __extends(InteractionIndicatorView, _super);
        function InteractionIndicatorView() {
            var _this = _super.call(this) || this;
            _this._$node = htmlToElement(anonymous$3({
                styles: _this.styleNames,
            }));
            _this._playIcon = anonymous$4({
                styles: _this.styleNames,
            });
            _this._pauseIcon = anonymous$5({
                styles: _this.styleNames,
            });
            _this._forwardIcon = anonymous$6({
                texts: {
                    SECONDS_COUNT: SECONDS_COUNT,
                },
                styles: _this.styleNames,
            });
            _this._rewindIcon = anonymous$7({
                texts: {
                    SECONDS_COUNT: SECONDS_COUNT,
                },
                styles: _this.styleNames,
            });
            _this._increaseVolumeIcon = anonymous$8({
                styles: _this.styleNames,
            });
            _this._decreaseVolumeIcon = anonymous$9({
                styles: _this.styleNames,
            });
            _this._muteIcon = anonymous$10({
                styles: _this.styleNames,
            });
            return _this;
        }
        InteractionIndicatorView.prototype.activatePlayIcon = function () {
            this._$node.innerHTML = this._playIcon;
        };
        InteractionIndicatorView.prototype.activatePauseIcon = function () {
            this._$node.innerHTML = this._pauseIcon;
        };
        InteractionIndicatorView.prototype.activateForwardIcon = function () {
            this._$node.innerHTML = this._forwardIcon;
        };
        InteractionIndicatorView.prototype.activateRewindIcon = function () {
            this._$node.innerHTML = this._rewindIcon;
        };
        InteractionIndicatorView.prototype.activateIncreaseVolumeIcon = function () {
            this._$node.innerHTML = this._increaseVolumeIcon;
        };
        InteractionIndicatorView.prototype.activateDecreaseVolumeIcon = function () {
            this._$node.innerHTML = this._decreaseVolumeIcon;
        };
        InteractionIndicatorView.prototype.activateMuteVolumeIcon = function () {
            this._$node.innerHTML = this._muteIcon;
        };
        InteractionIndicatorView.prototype.deactivateIcon = function () {
            this._$node.innerHTML = '';
        };
        InteractionIndicatorView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        InteractionIndicatorView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        InteractionIndicatorView.prototype.getNode = function () {
            return this._$node;
        };
        InteractionIndicatorView.prototype.destroy = function () {
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
        };
        return InteractionIndicatorView;
    }(View));
    InteractionIndicatorView.extendStyleNames(styles$3);

    var InteractionIndicator = /** @class */ (function () {
        function InteractionIndicator(_a) {
            var eventEmitter = _a.eventEmitter, engine = _a.engine, config = _a.config, rootContainer = _a.rootContainer;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            this._initUI();
            this._bindEvents();
            rootContainer.appendComponentNode(this.node);
            if (config.showInteractionIndicator === false) {
                this.hide();
            }
        }
        Object.defineProperty(InteractionIndicator.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        InteractionIndicator.prototype._initUI = function () {
            this.view = new InteractionIndicatorView();
        };
        InteractionIndicator.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [
                    UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
                    this._showPlaybackChangeIndicator,
                ],
                [UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED, this.showRewind],
                [UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED, this.showForward],
                [
                    UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
                    this.showIncreaseVolume,
                ],
                [
                    UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
                    this.showDecreaseVolume,
                ],
                [UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED, this.showMute],
                [
                    UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
                    this.showIncreaseVolume,
                ],
            ], this);
        };
        InteractionIndicator.prototype.showPause = function () {
            this.view.activatePauseIcon();
        };
        InteractionIndicator.prototype.showPlay = function () {
            this.view.activatePlayIcon();
        };
        InteractionIndicator.prototype.showRewind = function () {
            this.view.activateRewindIcon();
        };
        InteractionIndicator.prototype.showForward = function () {
            this.view.activateForwardIcon();
        };
        InteractionIndicator.prototype.showMute = function () {
            this.view.activateMuteVolumeIcon();
        };
        InteractionIndicator.prototype.showIncreaseVolume = function () {
            this.view.activateIncreaseVolumeIcon();
        };
        InteractionIndicator.prototype.showDecreaseVolume = function () {
            this.view.activateDecreaseVolumeIcon();
        };
        InteractionIndicator.prototype.hideIcons = function () {
            this.view.deactivateIcon();
            this._eventEmitter.emit(UI_EVENTS.HIDE_INTERACTION_INDICATOR_TRIGGERED);
        };
        InteractionIndicator.prototype.show = function () {
            this.view.hide();
        };
        InteractionIndicator.prototype.hide = function () {
            this.view.show();
        };
        InteractionIndicator.prototype._showPlaybackChangeIndicator = function () {
            var state = this._engine.getCurrentState();
            if (state === EngineState$1.PLAY_REQUESTED || state === EngineState$1.PLAYING) {
                this.view.activatePauseIcon();
            }
            else {
                this.view.activatePlayIcon();
            }
        };
        InteractionIndicator.prototype.destroy = function () {
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
        };
        InteractionIndicator.moduleName = 'interactionIndicator';
        InteractionIndicator.View = InteractionIndicatorView;
        InteractionIndicator.dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];
        return InteractionIndicator;
    }());

    function anonymous$11(props
    /*``*/) {
    var out='<div class="'+(props.styles.overlay)+' '+(props.styles.active)+'" data-hook="overlay" > <div class="'+(props.styles.poster)+'" data-hook="overlay-content" > </div> <div class="'+(props.styles.icon)+'" data-hook="overlay-play-button" > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 100%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <g         fill="none"         fill-rule="evenodd" > <circle           cx="18" cy="18" r="17" class="'+(props.themeStyles.overlayPlaySvgStroke)+'"           stroke-width="2" /> <path class="'+(props.themeStyles.overlayPlaySvgFill)+'" d="M23.935 17.708l-10.313 6.033V11.676z" /> </g> </svg> </div></div>';return out;
    }

    var overlayViewTheme = {
        overlayPlaySvgFill: {
            fill: function (data) { return data.color; },
        },
        overlayPlaySvgStroke: {
            stroke: function (data) { return data.color; },
        },
    };

    var css$4 = ".overlay__controlButton___1ASmF {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .overlay__controlButton___1ASmF:hover {\n    opacity: .7; }\n  .overlay__hidden___1Vt3d {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .overlay__overlay___3RC8o {\n  position: absolute;\n  z-index: 100;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: none; }\n  .overlay__overlay___3RC8o.overlay__active___3k0Mi {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center; }\n  .overlay__poster___1mX3C {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: black no-repeat center;\n  background-size: cover;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .overlay__poster___1mX3C:before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  content: '';\n  background-color: rgba(0, 0, 0, 0.35); }\n  .overlay__icon___3zDVy {\n  position: relative;\n  width: 71px;\n  height: 71px;\n  cursor: pointer;\n  opacity: 1; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .overlay__icon___3zDVy {\n    width: 54px;\n    height: 54px; }\n  div[data-hook='player-container'][max-width~=\"400px\"] .overlay__icon___3zDVy {\n    width: 36px;\n    height: 36px; }\n  .overlay__icon___3zDVy:hover {\n    opacity: .8; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm92ZXJsYXkuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixpQ0FBeUI7VUFBekIseUJBQXlCO0VBQ3pCLHFDQUE2QjtFQUE3Qiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLFVBQVU7RUFDVixpQkFBaUI7RUFDakIsY0FBYztFQUNkLDhCQUE4QjtFQUM5Qix5QkFBd0I7TUFBeEIsc0JBQXdCO1VBQXhCLHdCQUF3QjtFQUN4QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO0lBQ0UsWUFBWSxFQUFFO0VBRWxCO0VBQ0UsOEJBQThCO0VBQzlCLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIscUJBQXFCO0VBQ3JCLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsc0JBQXNCO0VBQ3RCLHNCQUFzQixFQUFFO0VBRTFCO0VBQ0UsbUJBQW1CO0VBQ25CLGFBQWE7RUFDYixPQUFPO0VBQ1AsU0FBUztFQUNULFVBQVU7RUFDVixRQUFRO0VBQ1IsY0FBYyxFQUFFO0VBQ2hCO0lBQ0UscUJBQWM7SUFBZCxxQkFBYztJQUFkLGNBQWM7SUFDZCx5QkFBd0I7UUFBeEIsc0JBQXdCO1lBQXhCLHdCQUF3QjtJQUN4QiwwQkFBb0I7UUFBcEIsdUJBQW9CO1lBQXBCLG9CQUFvQixFQUFFO0VBRTFCO0VBQ0UsbUJBQW1CO0VBQ25CLE9BQU87RUFDUCxTQUFTO0VBQ1QsVUFBVTtFQUNWLFFBQVE7RUFDUixZQUFZO0VBQ1osYUFBYTtFQUNiLG1DQUFtQztFQUNuQyx1QkFBdUI7RUFDdkIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUV4QjtFQUNFLG1CQUFtQjtFQUNuQixPQUFPO0VBQ1AsUUFBUTtFQUNSLFlBQVk7RUFDWixhQUFhO0VBQ2IsWUFBWTtFQUNaLHNDQUFzQyxFQUFFO0VBRTFDO0VBQ0UsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLFdBQVcsRUFBRTtFQUNiO0lBQ0UsWUFBWTtJQUNaLGFBQWEsRUFBRTtFQUNqQjtJQUNFLFlBQVk7SUFDWixhQUFhLEVBQUU7RUFDakI7SUFDRSxZQUFZLEVBQUUiLCJmaWxlIjoib3ZlcmxheS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRyb2xCdXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eTtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmNvbnRyb2xCdXR0b246aG92ZXIge1xuICAgIG9wYWNpdHk6IC43OyB9XG5cbi5oaWRkZW4ge1xuICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDAgIWltcG9ydGFudDsgfVxuXG4ub3ZlcmxheSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIGRpc3BsYXk6IG5vbmU7IH1cbiAgLm92ZXJsYXkuYWN0aXZlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cblxuLnBvc3RlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kOiBibGFjayBuby1yZXBlYXQgY2VudGVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuXG4ucG9zdGVyOmJlZm9yZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBjb250ZW50OiAnJztcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjM1KTsgfVxuXG4uaWNvbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDcxcHg7XG4gIGhlaWdodDogNzFweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBvcGFjaXR5OiAxOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiNTUwcHhcIl0gLmljb24ge1xuICAgIHdpZHRoOiA1NHB4O1xuICAgIGhlaWdodDogNTRweDsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bbWF4LXdpZHRofj1cIjQwMHB4XCJdIC5pY29uIHtcbiAgICB3aWR0aDogMzZweDtcbiAgICBoZWlnaHQ6IDM2cHg7IH1cbiAgLmljb246aG92ZXIge1xuICAgIG9wYWNpdHk6IC44OyB9XG4iXX0= */";
    var styles$4 = {"controlButton":"overlay__controlButton___1ASmF","hidden":"overlay__hidden___1Vt3d","overlay":"overlay__overlay___3RC8o","active":"overlay__active___3k0Mi","poster":"overlay__poster___1mX3C","icon":"overlay__icon___3zDVy"};
    styleInject(css$4);

    var OverlayView = /** @class */ (function (_super) {
        __extends(OverlayView, _super);
        function OverlayView(config) {
            var _this = _super.call(this, config.theme) || this;
            var callbacks = config.callbacks, src = config.src;
            _this._callbacks = callbacks;
            _this._initDOM();
            _this._bindEvents();
            _this.setPoster(src);
            return _this;
        }
        OverlayView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$11({
                styles: this.styleNames,
                themeStyles: this.themeStyles,
            }));
            this._$content = getElementByHook(this._$node, 'overlay-content');
            this._$playButton = getElementByHook(this._$node, 'overlay-play-button');
        };
        OverlayView.prototype._bindEvents = function () {
            this._$playButton.addEventListener('click', this._callbacks.onPlayClick);
        };
        OverlayView.prototype._unbindEvents = function () {
            this._$playButton.removeEventListener('click', this._callbacks.onPlayClick);
        };
        OverlayView.prototype.getNode = function () {
            return this._$node;
        };
        OverlayView.prototype.hideContent = function () {
            this._$node.classList.remove(this.styleNames.active);
        };
        OverlayView.prototype.showContent = function () {
            this._$node.classList.add(this.styleNames.active);
        };
        OverlayView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        OverlayView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        OverlayView.prototype.setPoster = function (src) {
            this._$content.style.backgroundImage = src ? "url('" + src + "')" : 'none';
        };
        OverlayView.prototype.destroy = function () {
            this._unbindEvents();
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$content = null;
            this._$playButton = null;
        };
        return OverlayView;
    }(View));
    OverlayView.setTheme(overlayViewTheme);
    OverlayView.extendStyleNames(styles$4);

    var Overlay = /** @class */ (function () {
        function Overlay(_a) {
            var config = _a.config, eventEmitter = _a.eventEmitter, engine = _a.engine, rootContainer = _a.rootContainer, theme = _a.theme;
            this.isHidden = false;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            this._theme = theme;
            this._bindEvents();
            this._initUI(config.overlay);
            rootContainer.appendComponentNode(this.node);
            if (config.overlay === false) {
                this.hide();
            }
        }
        Object.defineProperty(Overlay.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        Overlay.prototype._initUI = function (overlayConfig) {
            var poster = typeof overlayConfig === 'object' ? overlayConfig.poster : null;
            var viewConfig = {
                callbacks: {
                    onPlayClick: this._playVideo.bind(this),
                },
                src: poster,
                theme: this._theme,
            };
            this.view = new Overlay.View(viewConfig);
        };
        Overlay.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus],
                [VIDEO_EVENTS.RESET, this._tryShowContent],
            ], this);
        };
        Overlay.prototype._updatePlayingStatus = function (_a) {
            var nextState = _a.nextState;
            if (nextState === EngineState$1.PLAY_REQUESTED) {
                this._hideContent();
            }
            else if (nextState === EngineState$1.ENDED ||
                nextState === EngineState$1.SRC_SET) {
                this._tryShowContent();
            }
        };
        Overlay.prototype._playVideo = function () {
            this._engine.play();
            this._eventEmitter.emit(UI_EVENTS.PLAY_OVERLAY_TRIGGERED);
        };
        Overlay.prototype._tryShowContent = function () {
            if (this._engine.isVideoPaused) {
                this._showContent();
            }
        };
        Overlay.prototype._hideContent = function () {
            this.view.hideContent();
        };
        Overlay.prototype._showContent = function () {
            this.view.showContent();
        };
        Overlay.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        Overlay.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        /**
         * Method for setting overlay poster
         * @param src - Source of image
         * @example
         * player.setPoster('https://example.com/poster.png');
         *
         */
        Overlay.prototype.setPoster = function (src) {
            this.view.setPoster(src);
        };
        Overlay.prototype.destroy = function () {
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
        };
        Overlay.moduleName = 'overlay';
        Overlay.View = OverlayView;
        Overlay.dependencies = [
            'engine',
            'eventEmitter',
            'config',
            'rootContainer',
            'theme',
        ];
        __decorate([
            playerAPI()
        ], Overlay.prototype, "setPoster", null);
        return Overlay;
    }());

    function anonymous$12(props
    /*``*/) {
    var out='<div class="'+(props.styles.loader)+' '+(props.styles.active)+'" data-hook="loader" ></div>';return out;
    }

    var css$5 = ".loader__controlButton___1YHb4 {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .loader__controlButton___1YHb4:hover {\n    opacity: .7; }\n  .loader__hidden___3MeyV {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .loader__loader___1J20N {\n  position: absolute;\n  z-index: 90;\n  top: 50%;\n  left: 50%;\n  display: none;\n  clip: rect(0, 48px, 48px, 24px);\n  width: 42px;\n  height: 42px;\n  margin-top: -21px;\n  margin-left: -21px;\n  -webkit-animation: loader__rotate___3K3Iv 1s linear infinite;\n          animation: loader__rotate___3K3Iv 1s linear infinite;\n  color: white; }\n  .loader__loader___1J20N.loader__active___29tvY {\n    display: block; }\n  .loader__loader___1J20N::after {\n    clip: rect(4px, 48px, 48px, 24px);\n    -webkit-animation: loader__clip___1RIdi 1s linear infinite;\n            animation: loader__clip___1RIdi 1s linear infinite;\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    content: '';\n    border: 3px solid currentColor;\n    border-radius: 50%; }\n  .loader__loader___1J20N::before {\n    clip: rect(0, 48px, 48px, 24px);\n    -webkit-animation: loader__clip-reverse___20o6x 1s linear infinite;\n            animation: loader__clip-reverse___20o6x 1s linear infinite;\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    content: '';\n    border: 3px solid currentColor;\n    border-radius: 50%; }\n  @-webkit-keyframes loader__clip___1RIdi {\n  50% {\n    clip: rect(42px, 48px, 48px, 24px);\n    -webkit-animation-timing-function: ease-in-out;\n            animation-timing-function: ease-in-out; } }\n  @keyframes loader__clip___1RIdi {\n  50% {\n    clip: rect(42px, 48px, 48px, 24px);\n    -webkit-animation-timing-function: ease-in-out;\n            animation-timing-function: ease-in-out; } }\n  @-webkit-keyframes loader__clip-reverse___20o6x {\n  50% {\n    clip: rect(0, 48px, 9px, 24px);\n    -webkit-transform: rotate(135deg);\n            transform: rotate(135deg);\n    -webkit-animation-timing-function: ease-in-out;\n            animation-timing-function: ease-in-out; } }\n  @keyframes loader__clip-reverse___20o6x {\n  50% {\n    clip: rect(0, 48px, 9px, 24px);\n    -webkit-transform: rotate(135deg);\n            transform: rotate(135deg);\n    -webkit-animation-timing-function: ease-in-out;\n            animation-timing-function: ease-in-out; } }\n  @-webkit-keyframes loader__rotate___3K3Iv {\n  from {\n    -webkit-transform: rotate(0);\n            transform: rotate(0);\n    -webkit-animation-timing-function: ease-out;\n            animation-timing-function: ease-out; }\n  45% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n    color: white; }\n  55% {\n    -webkit-transform: rotate(54deg);\n            transform: rotate(54deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n  @keyframes loader__rotate___3K3Iv {\n  from {\n    -webkit-transform: rotate(0);\n            transform: rotate(0);\n    -webkit-animation-timing-function: ease-out;\n            animation-timing-function: ease-out; }\n  45% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n    color: white; }\n  55% {\n    -webkit-transform: rotate(54deg);\n            transform: rotate(54deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWRlci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGlDQUF5QjtVQUF6Qix5QkFBeUI7RUFDekIscUNBQTZCO0VBQTdCLDZCQUE2QjtFQUM3QixXQUFXO0VBQ1gsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixjQUFjO0VBQ2QsOEJBQThCO0VBQzlCLHlCQUF3QjtNQUF4QixzQkFBd0I7VUFBeEIsd0JBQXdCO0VBQ3hCLDBCQUFvQjtNQUFwQix1QkFBb0I7VUFBcEIsb0JBQW9CLEVBQUU7RUFDdEI7SUFDRSxZQUFZLEVBQUU7RUFFbEI7RUFDRSw4QkFBOEI7RUFDOUIsb0JBQW9CO0VBQ3BCLHdCQUF3QjtFQUN4QixxQkFBcUI7RUFDckIseUJBQXlCO0VBQ3pCLHFCQUFxQjtFQUNyQixzQkFBc0I7RUFDdEIsc0JBQXNCLEVBQUU7RUFFMUI7RUFDRSxtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLFNBQVM7RUFDVCxVQUFVO0VBQ1YsY0FBYztFQUNkLGdDQUFnQztFQUNoQyxZQUFZO0VBQ1osYUFBYTtFQUNiLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsNkRBQXFDO1VBQXJDLHFEQUFxQztFQUNyQyxhQUFhLEVBQUU7RUFDZjtJQUNFLGVBQWUsRUFBRTtFQUNuQjtJQUNFLGtDQUFrQztJQUNsQywyREFBbUM7WUFBbkMsbURBQW1DO0lBQ25DLG1CQUFtQjtJQUNuQixPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFDVixRQUFRO0lBQ1IsWUFBWTtJQUNaLCtCQUErQjtJQUMvQixtQkFBbUIsRUFBRTtFQUN2QjtJQUNFLGdDQUFnQztJQUNoQyxtRUFBMkM7WUFBM0MsMkRBQTJDO0lBQzNDLG1CQUFtQjtJQUNuQixPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFDVixRQUFRO0lBQ1IsWUFBWTtJQUNaLCtCQUErQjtJQUMvQixtQkFBbUIsRUFBRTtFQUV6QjtFQUNFO0lBQ0UsbUNBQW1DO0lBQ25DLCtDQUF1QztZQUF2Qyx1Q0FBdUMsRUFBRSxFQUFFO0VBSC9DO0VBQ0U7SUFDRSxtQ0FBbUM7SUFDbkMsK0NBQXVDO1lBQXZDLHVDQUF1QyxFQUFFLEVBQUU7RUFFL0M7RUFDRTtJQUNFLCtCQUErQjtJQUMvQixrQ0FBMEI7WUFBMUIsMEJBQTBCO0lBQzFCLCtDQUF1QztZQUF2Qyx1Q0FBdUMsRUFBRSxFQUFFO0VBSi9DO0VBQ0U7SUFDRSwrQkFBK0I7SUFDL0Isa0NBQTBCO1lBQTFCLDBCQUEwQjtJQUMxQiwrQ0FBdUM7WUFBdkMsdUNBQXVDLEVBQUUsRUFBRTtFQUUvQztFQUNFO0lBQ0UsNkJBQXFCO1lBQXJCLHFCQUFxQjtJQUNyQiw0Q0FBb0M7WUFBcEMsb0NBQW9DLEVBQUU7RUFDeEM7SUFDRSxpQ0FBeUI7WUFBekIseUJBQXlCO0lBQ3pCLGFBQWEsRUFBRTtFQUNqQjtJQUNFLGlDQUF5QjtZQUF6Qix5QkFBeUIsRUFBRTtFQUM3QjtJQUNFLGtDQUEwQjtZQUExQiwwQkFBMEIsRUFBRSxFQUFFO0VBVmxDO0VBQ0U7SUFDRSw2QkFBcUI7WUFBckIscUJBQXFCO0lBQ3JCLDRDQUFvQztZQUFwQyxvQ0FBb0MsRUFBRTtFQUN4QztJQUNFLGlDQUF5QjtZQUF6Qix5QkFBeUI7SUFDekIsYUFBYSxFQUFFO0VBQ2pCO0lBQ0UsaUNBQXlCO1lBQXpCLHlCQUF5QixFQUFFO0VBQzdCO0lBQ0Usa0NBQTBCO1lBQTFCLDBCQUEwQixFQUFFLEVBQUUiLCJmaWxlIjoibG9hZGVyLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udHJvbEJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjJzO1xuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5O1xuICBvcGFjaXR5OiAxO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAuY29udHJvbEJ1dHRvbjpob3ZlciB7XG4gICAgb3BhY2l0eTogLjc7IH1cblxuLmhpZGRlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB3aWR0aDogMCAhaW1wb3J0YW50O1xuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1pbi1oZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgb3BhY2l0eTogMCAhaW1wb3J0YW50OyB9XG5cbi5sb2FkZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDkwO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuICBkaXNwbGF5OiBub25lO1xuICBjbGlwOiByZWN0KDAsIDQ4cHgsIDQ4cHgsIDI0cHgpO1xuICB3aWR0aDogNDJweDtcbiAgaGVpZ2h0OiA0MnB4O1xuICBtYXJnaW4tdG9wOiAtMjFweDtcbiAgbWFyZ2luLWxlZnQ6IC0yMXB4O1xuICBhbmltYXRpb246IHJvdGF0ZSAxcyBsaW5lYXIgaW5maW5pdGU7XG4gIGNvbG9yOiB3aGl0ZTsgfVxuICAubG9hZGVyLmFjdGl2ZSB7XG4gICAgZGlzcGxheTogYmxvY2s7IH1cbiAgLmxvYWRlcjo6YWZ0ZXIge1xuICAgIGNsaXA6IHJlY3QoNHB4LCA0OHB4LCA0OHB4LCAyNHB4KTtcbiAgICBhbmltYXRpb246IGNsaXAgMXMgbGluZWFyIGluZmluaXRlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgYm90dG9tOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgY29udGVudDogJyc7XG4gICAgYm9yZGVyOiAzcHggc29saWQgY3VycmVudENvbG9yO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgfVxuICAubG9hZGVyOjpiZWZvcmUge1xuICAgIGNsaXA6IHJlY3QoMCwgNDhweCwgNDhweCwgMjRweCk7XG4gICAgYW5pbWF0aW9uOiBjbGlwLXJldmVyc2UgMXMgbGluZWFyIGluZmluaXRlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgYm90dG9tOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgY29udGVudDogJyc7XG4gICAgYm9yZGVyOiAzcHggc29saWQgY3VycmVudENvbG9yO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgfVxuXG5Aa2V5ZnJhbWVzIGNsaXAge1xuICA1MCUge1xuICAgIGNsaXA6IHJlY3QoNDJweCwgNDhweCwgNDhweCwgMjRweCk7XG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQ7IH0gfVxuXG5Aa2V5ZnJhbWVzIGNsaXAtcmV2ZXJzZSB7XG4gIDUwJSB7XG4gICAgY2xpcDogcmVjdCgwLCA0OHB4LCA5cHgsIDI0cHgpO1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDEzNWRlZyk7XG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQ7IH0gfVxuXG5Aa2V5ZnJhbWVzIHJvdGF0ZSB7XG4gIGZyb20ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDApO1xuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0OyB9XG4gIDQ1JSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMThkZWcpO1xuICAgIGNvbG9yOiB3aGl0ZTsgfVxuICA1NSUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDU0ZGVnKTsgfVxuICB0byB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9XG4iXX0= */";
    var styles$5 = {"controlButton":"loader__controlButton___1YHb4","hidden":"loader__hidden___3MeyV","loader":"loader__loader___1J20N","rotate":"loader__rotate___3K3Iv","active":"loader__active___29tvY","clip":"loader__clip___1RIdi","clip-reverse":"loader__clip-reverse___20o6x"};
    styleInject(css$5);

    var LoaderView = /** @class */ (function (_super) {
        __extends(LoaderView, _super);
        function LoaderView() {
            var _this = _super.call(this) || this;
            _this._$node = htmlToElement(anonymous$12({
                styles: _this.styleNames,
            }));
            return _this;
        }
        LoaderView.prototype.getNode = function () {
            return this._$node;
        };
        LoaderView.prototype.showContent = function () {
            this._$node.classList.add(this.styleNames.active);
        };
        LoaderView.prototype.hideContent = function () {
            this._$node.classList.remove(this.styleNames.active);
        };
        LoaderView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        LoaderView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        LoaderView.prototype.destroy = function () {
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
        };
        return LoaderView;
    }(View));
    LoaderView.extendStyleNames(styles$5);

    var DELAYED_SHOW_TIMEOUT = 100;
    var Loader = /** @class */ (function () {
        function Loader(_a) {
            var config = _a.config, eventEmitter = _a.eventEmitter, engine = _a.engine, rootContainer = _a.rootContainer;
            this._eventEmitter = eventEmitter;
            this.isHidden = false;
            this._engine = engine;
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
            this._hideContent();
            rootContainer.appendComponentNode(this.node);
            if (config.loader === false) {
                this.hide();
            }
        }
        Object.defineProperty(Loader.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype._bindCallbacks = function () {
            this._showContent = this._showContent.bind(this);
            this._hideContent = this._hideContent.bind(this);
        };
        Loader.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState],
                [VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide],
            ], this);
        };
        Loader.prototype._checkForWaitingState = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case EngineState$1.SEEK_IN_PROGRESS:
                    this.startDelayedShow();
                    break;
                case EngineState$1.WAITING:
                    this.startDelayedShow();
                    break;
                case EngineState$1.LOAD_STARTED:
                    if (this._engine.isPreloadAvailable) {
                        this._showContent();
                    }
                    break;
                case EngineState$1.READY_TO_PLAY:
                    this.stopDelayedShow();
                    this._hideContent();
                    break;
                case EngineState$1.PLAYING:
                    this.stopDelayedShow();
                    this._hideContent();
                    break;
                case EngineState$1.PAUSED:
                    this.stopDelayedShow();
                    this._hideContent();
                    break;
                /* ignore coverage */
                default:
                    break;
            }
        };
        Loader.prototype._initUI = function () {
            this.view = new Loader.View();
        };
        Loader.prototype._showContent = function () {
            if (this.isHidden) {
                this._eventEmitter.emit(UI_EVENTS.LOADER_SHOW_TRIGGERED);
                this.view.showContent();
                this.isHidden = false;
            }
        };
        Loader.prototype._hideContent = function () {
            if (!this.isHidden) {
                this._eventEmitter.emit(UI_EVENTS.LOADER_HIDE_TRIGGERED);
                this.view.hideContent();
                this.isHidden = true;
            }
        };
        Loader.prototype.hide = function () {
            this.view.hide();
        };
        Loader.prototype.show = function () {
            this.view.show();
        };
        Loader.prototype.startDelayedShow = function () {
            if (this.isDelayedShowScheduled) {
                this.stopDelayedShow();
            }
            this._delayedShowTimeout = window.setTimeout(this._showContent, DELAYED_SHOW_TIMEOUT);
        };
        Loader.prototype.stopDelayedShow = function () {
            window.clearTimeout(this._delayedShowTimeout);
            this._delayedShowTimeout = null;
        };
        Object.defineProperty(Loader.prototype, "isDelayedShowScheduled", {
            get: function () {
                return Boolean(this._delayedShowTimeout);
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.destroy = function () {
            this._unbindEvents();
            this.stopDelayedShow();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
        };
        Loader.moduleName = 'loader';
        Loader.View = LoaderView;
        Loader.dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];
        return Loader;
    }());

    function anonymous$13(props
    /*``*/) {
    var out='<div class="'+(props.styles.mainUiBlock)+'"></div>';return out;
    }

    var css$6 = ".main-ui-block__mainUiBlock___3fUqI {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n  .main-ui-block__mainUiBlock___3fUqI .main-ui-block__tooltipContainerWrapper___3e2KW {\n    position: relative;\n    -webkit-box-flex: 2;\n        -ms-flex-positive: 2;\n            flex-grow: 2; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4tdWktYmxvY2suc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG1CQUFtQjtFQUNuQixPQUFPO0VBQ1AsU0FBUztFQUNULFVBQVU7RUFDVixRQUFRO0VBQ1IscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCw2QkFBdUI7RUFBdkIsOEJBQXVCO01BQXZCLDJCQUF1QjtVQUF2Qix1QkFBdUIsRUFBRTtFQUN6QjtJQUNFLG1CQUFtQjtJQUNuQixvQkFBYTtRQUFiLHFCQUFhO1lBQWIsYUFBYSxFQUFFIiwiZmlsZSI6Im1haW4tdWktYmxvY2suc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tYWluVWlCbG9jayB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyB9XG4gIC5tYWluVWlCbG9jayAudG9vbHRpcENvbnRhaW5lcldyYXBwZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBmbGV4LWdyb3c6IDI7IH1cbiJdfQ== */";
    var styles$6 = {"mainUiBlock":"main-ui-block__mainUiBlock___3fUqI","tooltipContainerWrapper":"main-ui-block__tooltipContainerWrapper___3e2KW"};
    styleInject(css$6);

    var MainUIBlockView = /** @class */ (function (_super) {
        __extends(MainUIBlockView, _super);
        function MainUIBlockView(config) {
            var _this = _super.call(this) || this;
            _this._initDOM(config.elements);
            return _this;
        }
        MainUIBlockView.prototype._initDOM = function (elements) {
            this._$node = htmlToElement(anonymous$13({
                styles: this.styleNames,
            }));
            var $tooltipContainerWrapper = document.createElement('div');
            $tooltipContainerWrapper.classList.add(this.styleNames.tooltipContainerWrapper);
            $tooltipContainerWrapper.appendChild(elements.tooltipContainer);
            this._$node.appendChild(elements.topBlock);
            this._$node.appendChild($tooltipContainerWrapper);
            this._$node.appendChild(elements.bottomBlock);
        };
        MainUIBlockView.prototype.getNode = function () {
            return this._$node;
        };
        MainUIBlockView.prototype.destroy = function () {
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
        };
        return MainUIBlockView;
    }(View));
    MainUIBlockView.extendStyleNames(styles$6);

    var HIDE_BLOCK_TIMEOUT = 2000;
    var DEFAULT_CONFIG$3 = {
        shouldAlwaysShow: false,
    };
    var MainUIBlock = /** @class */ (function () {
        function MainUIBlock(dependencies) {
            this._hideTimeout = null;
            this._isContentShowingEnabled = true;
            this._isContentShown = false;
            this._shouldShowContent = true;
            this._shouldAlwaysShow = false;
            this._isDragging = false;
            var config = dependencies.config, eventEmitter = dependencies.eventEmitter, rootContainer = dependencies.rootContainer, tooltipService = dependencies.tooltipService, topBlock = dependencies.topBlock, bottomBlock = dependencies.bottomBlock, screen = dependencies.screen;
            this._eventEmitter = eventEmitter;
            this._topBlock = topBlock;
            this._bottomBlock = bottomBlock;
            this._screen = screen;
            this.isHidden = false;
            var mainBlockConfig = __assign({}, DEFAULT_CONFIG$3, (typeof config.controls === 'object' ? config.controls : null));
            this._shouldAlwaysShow = mainBlockConfig.shouldAlwaysShow;
            this._initUI({
                tooltipContainer: tooltipService.tooltipContainerNode,
                topBlock: topBlock.node,
                bottomBlock: bottomBlock.node,
            });
            this._bindViewCallbacks();
            this._bindEvents();
            rootContainer.appendComponentNode(this.view.getNode());
            if (config.controls === false) {
                this.hide();
            }
        }
        Object.defineProperty(MainUIBlock.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        MainUIBlock.prototype._initUI = function (elements) {
            this.view = new MainUIBlock.View({ elements: elements });
        };
        MainUIBlock.prototype._bindViewCallbacks = function () {
            this._startHideBlockTimeout = this._startHideBlockTimeout.bind(this);
            this._tryShowContent = this._tryShowContent.bind(this);
            this._tryHideContent = this._tryHideContent.bind(this);
        };
        MainUIBlock.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED, this._startHideBlockTimeout],
                [UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED, this._tryHideContent],
                [UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED, this._startHideBlockTimeout],
                [UI_EVENTS.LOADER_HIDE_TRIGGERED, this._startHideBlockTimeout],
                [VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus],
                [UI_EVENTS.CONTROL_DRAG_START, this._onControlDragStart],
                [UI_EVENTS.CONTROL_DRAG_END, this._onControlDragEnd],
            ], this);
        };
        MainUIBlock.prototype._updatePlayingStatus = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case EngineState$1.PLAY_REQUESTED: {
                    this._shouldShowContent = false;
                    this._startHideBlockTimeout();
                    break;
                }
                case EngineState$1.ENDED: {
                    this._shouldShowContent = true;
                    this._tryShowContent();
                    break;
                }
                case EngineState$1.PAUSED: {
                    this._shouldShowContent = true;
                    this._tryShowContent();
                    break;
                }
                case EngineState$1.SRC_SET: {
                    this._shouldShowContent = true;
                    this._tryShowContent();
                    break;
                }
                default:
                    break;
            }
        };
        Object.defineProperty(MainUIBlock.prototype, "_isBlockFocused", {
            get: function () {
                return this._bottomBlock.isFocused;
            },
            enumerable: true,
            configurable: true
        });
        MainUIBlock.prototype._startHideBlockTimeout = function () {
            this._stopHideBlockTimeout();
            this._tryShowContent();
            this._hideTimeout = window.setTimeout(this._tryHideContent, HIDE_BLOCK_TIMEOUT);
        };
        MainUIBlock.prototype._stopHideBlockTimeout = function () {
            if (this._hideTimeout) {
                window.clearTimeout(this._hideTimeout);
            }
        };
        MainUIBlock.prototype._tryShowContent = function () {
            if (this._isContentShowingEnabled) {
                this._showContent();
            }
        };
        MainUIBlock.prototype._onControlDragStart = function () {
            this._isDragging = true;
        };
        MainUIBlock.prototype._onControlDragEnd = function () {
            this._isDragging = false;
            this._tryHideContent();
        };
        MainUIBlock.prototype._showContent = function () {
            if (this.isHidden || this._isContentShown) {
                return;
            }
            this._screen.showCursor();
            this._eventEmitter.emit(UI_EVENTS.MAIN_BLOCK_SHOW_TRIGGERED);
            this._bottomBlock.showContent();
            this._topBlock.showContent();
            this._isContentShown = true;
        };
        MainUIBlock.prototype._tryHideContent = function () {
            if (!this._isBlockFocused &&
                !this._isDragging &&
                !this._shouldShowContent &&
                !this._shouldAlwaysShow) {
                this._hideContent();
            }
        };
        MainUIBlock.prototype._hideContent = function () {
            if (this.isHidden || !this._isContentShown) {
                return;
            }
            if (this._isContentShowingEnabled) {
                this._screen.hideCursor();
            }
            this._eventEmitter.emit(UI_EVENTS.MAIN_BLOCK_HIDE_TRIGGERED);
            this._bottomBlock.hideContent();
            this._topBlock.hideContent();
            this._isContentShown = false;
        };
        MainUIBlock.prototype.disableShowingContent = function () {
            this._isContentShowingEnabled = false;
            this._hideContent();
        };
        MainUIBlock.prototype.enableShowingContent = function () {
            this._isContentShowingEnabled = true;
            if (this._shouldShowContent) {
                this._showContent();
            }
        };
        MainUIBlock.prototype.hide = function () {
            this.isHidden = true;
            this._topBlock.hide();
            this._bottomBlock.hide();
        };
        MainUIBlock.prototype.show = function () {
            this.isHidden = false;
            this._topBlock.show();
            this._bottomBlock.show();
        };
        /**
         * Method for allowing bottom block to be always shown.
         * @param flag - `true` for showing always
         * @example
         * player.setControlsShouldAlwaysShow(true);
         *
         */
        MainUIBlock.prototype.setShouldAlwaysShow = function (flag) {
            this._shouldAlwaysShow = flag;
            if (this._shouldAlwaysShow) {
                this._tryShowContent();
            }
            else {
                this._startHideBlockTimeout();
            }
        };
        MainUIBlock.prototype.destroy = function () {
            this._stopHideBlockTimeout();
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._topBlock = null;
            this._bottomBlock = null;
        };
        MainUIBlock.moduleName = 'mainUIBlock';
        MainUIBlock.View = MainUIBlockView;
        MainUIBlock.dependencies = [
            'config',
            'screen',
            'rootContainer',
            'tooltipService',
            'eventEmitter',
            'topBlock',
            'bottomBlock',
        ];
        __decorate([
            playerAPI('setControlsShouldAlwaysShow')
        ], MainUIBlock.prototype, "setShouldAlwaysShow", null);
        return MainUIBlock;
    }());

    function anonymous$14(props
    /*``*/) {
    var out='<div data-hook="top-block" class="'+(props.styles.topBlock)+'"> <div class="'+(props.styles.background)+'" data-hook="screen-top-background"> </div> <div class="'+(props.styles.elementsContainer)+'"> <div class="'+(props.styles.liveIndicatorContainer)+'" data-hook="live-indicator-container"> </div> <div class="'+(props.styles.titleContainer)+'" data-hook="title-container"> </div> </div></div>';return out;
    }

    var css$7 = ".top-block__controlButton___2Irx0 {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .top-block__controlButton___2Irx0:hover {\n    opacity: .7; }\n  .top-block__hidden___JNzhk {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .top-block__topBlock___2nOmO {\n  position: relative;\n  z-index: 60; }\n  .top-block__topBlock___2nOmO::-moz-focus-inner {\n    border: 0; }\n  .top-block__topBlock___2nOmO.top-block__activated___2ThkU .top-block__titleContainer___1gKBN, .top-block__topBlock___2nOmO.top-block__focus-within___21rt2 .top-block__titleContainer___1gKBN {\n    visibility: visible;\n    opacity: 1; }\n  .top-block__topBlock___2nOmO.top-block__activated___2ThkU .top-block__background___2RYBo, .top-block__topBlock___2nOmO.top-block__focus-within___21rt2 .top-block__background___2RYBo {\n    visibility: visible;\n    opacity: 1; }\n  .top-block__liveIndicatorContainer___3wTlQ {\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0; }\n  .top-block__elementsContainer___11-A7 {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  margin-top: 20px;\n  margin-left: 20px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .top-block__elementsContainer___11-A7 {\n    margin-top: 30px;\n    margin-left: 30px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .top-block__elementsContainer___11-A7 {\n    margin-top: 15px;\n    margin-left: 15px; }\n  div[data-hook='player-container'][max-width~=\"280px\"] .top-block__elementsContainer___11-A7 {\n    margin-top: 12px;\n    margin-left: 12px; }\n  .top-block__titleContainer___1gKBN {\n  visibility: hidden;\n  max-width: calc(100% - 200px);\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  opacity: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n  .top-block__background___2RYBo {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  visibility: hidden;\n  height: 181px;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  pointer-events: none;\n  opacity: 0;\n  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(0, 0, 0, 0)), color-stop(24%, rgba(0, 0, 0, 0.03)), color-stop(50%, rgba(0, 0, 0, 0.15)), color-stop(75%, rgba(0, 0, 0, 0.3)), to(rgba(0, 0, 0, 0.4)));\n  background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.03) 24%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.3) 75%, rgba(0, 0, 0, 0.4));\n  background-size: 100% 182px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvcC1ibG9jay5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGlDQUF5QjtVQUF6Qix5QkFBeUI7RUFDekIscUNBQTZCO0VBQTdCLDZCQUE2QjtFQUM3QixXQUFXO0VBQ1gsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixjQUFjO0VBQ2QsOEJBQThCO0VBQzlCLHlCQUF3QjtNQUF4QixzQkFBd0I7VUFBeEIsd0JBQXdCO0VBQ3hCLDBCQUFvQjtNQUFwQix1QkFBb0I7VUFBcEIsb0JBQW9CLEVBQUU7RUFDdEI7SUFDRSxZQUFZLEVBQUU7RUFFbEI7RUFDRSw4QkFBOEI7RUFDOUIsb0JBQW9CO0VBQ3BCLHdCQUF3QjtFQUN4QixxQkFBcUI7RUFDckIseUJBQXlCO0VBQ3pCLHFCQUFxQjtFQUNyQixzQkFBc0I7RUFDdEIsc0JBQXNCLEVBQUU7RUFFMUI7RUFDRSxtQkFBbUI7RUFDbkIsWUFBWSxFQUFFO0VBQ2Q7SUFDRSxVQUFVLEVBQUU7RUFDZDtJQUNFLG9CQUFvQjtJQUNwQixXQUFXLEVBQUU7RUFDZjtJQUNFLG9CQUFvQjtJQUNwQixXQUFXLEVBQUU7RUFFakI7RUFDRSxvQkFBYTtNQUFiLHFCQUFhO1VBQWIsYUFBYSxFQUFFO0VBRWpCO0VBQ0UsbUJBQW1CO0VBQ25CLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsK0JBQW9CO0VBQXBCLDhCQUFvQjtNQUFwQix3QkFBb0I7VUFBcEIsb0JBQW9CO0VBQ3BCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLGlCQUFpQjtJQUNqQixrQkFBa0IsRUFBRTtFQUN0QjtJQUNFLGlCQUFpQjtJQUNqQixrQkFBa0IsRUFBRTtFQUN0QjtJQUNFLGlCQUFpQjtJQUNqQixrQkFBa0IsRUFBRTtFQUV4QjtFQUNFLG1CQUFtQjtFQUNuQiw4QkFBOEI7RUFDOUIsZ0RBQXdDO0VBQXhDLHdDQUF3QztFQUN4QyxXQUFXO0VBQ1gsb0JBQWE7TUFBYixxQkFBYTtVQUFiLGFBQWEsRUFBRTtFQUVqQjtFQUNFLG1CQUFtQjtFQUNuQixPQUFPO0VBQ1AsU0FBUztFQUNULFFBQVE7RUFDUixtQkFBbUI7RUFDbkIsY0FBYztFQUNkLGdEQUF3QztFQUF4Qyx3Q0FBd0M7RUFDeEMscUJBQXFCO0VBQ3JCLFdBQVc7RUFDWCxtT0FBMEo7RUFBMUosMEpBQTBKO0VBQzFKLDRCQUE0QixFQUFFIiwiZmlsZSI6InRvcC1ibG9jay5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRyb2xCdXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eTtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmNvbnRyb2xCdXR0b246aG92ZXIge1xuICAgIG9wYWNpdHk6IC43OyB9XG5cbi5oaWRkZW4ge1xuICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDAgIWltcG9ydGFudDsgfVxuXG4udG9wQmxvY2sge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDYwOyB9XG4gIC50b3BCbG9jazo6LW1vei1mb2N1cy1pbm5lciB7XG4gICAgYm9yZGVyOiAwOyB9XG4gIC50b3BCbG9jay5hY3RpdmF0ZWQgLnRpdGxlQ29udGFpbmVyLCAudG9wQmxvY2suZm9jdXMtd2l0aGluIC50aXRsZUNvbnRhaW5lciB7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICBvcGFjaXR5OiAxOyB9XG4gIC50b3BCbG9jay5hY3RpdmF0ZWQgLmJhY2tncm91bmQsIC50b3BCbG9jay5mb2N1cy13aXRoaW4gLmJhY2tncm91bmQge1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgb3BhY2l0eTogMTsgfVxuXG4ubGl2ZUluZGljYXRvckNvbnRhaW5lciB7XG4gIGZsZXgtZ3JvdzogMDsgfVxuXG4uZWxlbWVudHNDb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIG1hcmdpbi10b3A6IDIwcHg7XG4gIG1hcmdpbi1sZWZ0OiAyMHB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLmVsZW1lbnRzQ29udGFpbmVyIHtcbiAgICBtYXJnaW4tdG9wOiAzMHB4O1xuICAgIG1hcmdpbi1sZWZ0OiAzMHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiNTUwcHhcIl0gLmVsZW1lbnRzQ29udGFpbmVyIHtcbiAgICBtYXJnaW4tdG9wOiAxNXB4O1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiMjgwcHhcIl0gLmVsZW1lbnRzQ29udGFpbmVyIHtcbiAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICAgIG1hcmdpbi1sZWZ0OiAxMnB4OyB9XG5cbi50aXRsZUNvbnRhaW5lciB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSAyMDBweCk7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzLCB2aXNpYmlsaXR5IC4ycztcbiAgb3BhY2l0eTogMDtcbiAgZmxleC1ncm93OiAxOyB9XG5cbi5iYWNrZ3JvdW5kIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIGhlaWdodDogMTgxcHg7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzLCB2aXNpYmlsaXR5IC4ycztcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIG9wYWNpdHk6IDA7XG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byB0b3AsIHJnYmEoMCwgMCwgMCwgMCksIHJnYmEoMCwgMCwgMCwgMC4wMykgMjQlLCByZ2JhKDAsIDAsIDAsIDAuMTUpIDUwJSwgcmdiYSgwLCAwLCAwLCAwLjMpIDc1JSwgcmdiYSgwLCAwLCAwLCAwLjQpKTtcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDE4MnB4OyB9XG4iXX0= */";
    var styles$7 = {"controlButton":"top-block__controlButton___2Irx0","hidden":"top-block__hidden___JNzhk","topBlock":"top-block__topBlock___2nOmO","activated":"top-block__activated___2ThkU","titleContainer":"top-block__titleContainer___1gKBN","focus-within":"top-block__focus-within___21rt2","background":"top-block__background___2RYBo","liveIndicatorContainer":"top-block__liveIndicatorContainer___3wTlQ","elementsContainer":"top-block__elementsContainer___11-A7"};
    styleInject(css$7);

    var TopBlockView = /** @class */ (function (_super) {
        __extends(TopBlockView, _super);
        function TopBlockView(config) {
            var _this = _super.call(this) || this;
            var elements = config.elements;
            _this._initDOM(elements);
            _this._bindEvents();
            return _this;
        }
        TopBlockView.prototype._initDOM = function (elements) {
            this._$node = htmlToElement(anonymous$14({
                styles: this.styleNames,
            }));
            var $titleContainer = getElementByHook(this._$node, 'title-container');
            var $liveIndicatorContainer = getElementByHook(this._$node, 'live-indicator-container');
            $titleContainer.appendChild(elements.title);
            $liveIndicatorContainer.appendChild(elements.liveIndicator);
        };
        TopBlockView.prototype._preventClickPropagation = function (e) {
            e.stopPropagation();
        };
        TopBlockView.prototype._bindEvents = function () {
            this._$node.addEventListener('click', this._preventClickPropagation);
        };
        TopBlockView.prototype._unbindEvents = function () {
            this._$node.removeEventListener('click', this._preventClickPropagation);
        };
        TopBlockView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        TopBlockView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        TopBlockView.prototype.getNode = function () {
            return this._$node;
        };
        TopBlockView.prototype.showContent = function () {
            this._$node.classList.add(this.styleNames.activated);
        };
        TopBlockView.prototype.hideContent = function () {
            this._$node.classList.remove(this.styleNames.activated);
        };
        TopBlockView.prototype.destroy = function () {
            this._unbindEvents();
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
        };
        return TopBlockView;
    }(View));
    TopBlockView.extendStyleNames(styles$7);

    var TopBlock = /** @class */ (function () {
        function TopBlock(dependencies) {
            this.isHidden = false;
            this._initUI(this._getElementsNodes(dependencies));
        }
        TopBlock.prototype._initUI = function (elementNodes) {
            var config = {
                elements: elementNodes,
            };
            this.view = new TopBlock.View(config);
        };
        TopBlock.prototype._getElementsNodes = function (dependencies) {
            var title = dependencies.title, liveIndicator = dependencies.liveIndicator;
            return {
                title: title.node,
                liveIndicator: liveIndicator.node,
            };
        };
        Object.defineProperty(TopBlock.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        TopBlock.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        TopBlock.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        TopBlock.prototype.showContent = function () {
            this.view.showContent();
        };
        TopBlock.prototype.hideContent = function () {
            this.view.hideContent();
        };
        TopBlock.prototype.destroy = function () {
            this.view.destroy();
            this.view = null;
        };
        TopBlock.moduleName = 'topBlock';
        TopBlock.View = TopBlockView;
        TopBlock.dependencies = ['title', 'liveIndicator'];
        return TopBlock;
    }());

    function anonymous$15(props
    /*``*/) {
    var out='<div> <div class="'+(props.styles.title)+' '+(props.themeStyles.titleText)+'" data-hook="video-title"></div></div>';return out;
    }

    var titleViewTheme = {
        titleText: {
            color: function (data) { return data.color; },
        },
    };

    var css$8 = ".title__controlButton___tyPdk {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .title__controlButton___tyPdk:hover {\n    opacity: .7; }\n  .title__hidden___3SyPm {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .title__title___324Zx {\n  font-size: 16px;\n  line-height: 17px;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .title__title___324Zx {\n    font-size: 14px;\n    line-height: 15px; }\n  div[data-hook='player-container'][max-width~=\"300px\"] .title__title___324Zx {\n    font-size: 12px;\n    line-height: 13px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .title__title___324Zx {\n    font-size: 20px;\n    line-height: 20px; }\n  .title__title___324Zx.title__link___2x3nu {\n    cursor: pointer; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpdGxlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixxQ0FBNkI7RUFBN0IsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLDhCQUE4QjtFQUM5QixvQkFBb0I7RUFDcEIsd0JBQXdCO0VBQ3hCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixzQkFBc0IsRUFBRTtFQUUxQjtFQUNFLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQix3QkFBd0IsRUFBRTtFQUMxQjtJQUNFLGdCQUFnQjtJQUNoQixrQkFBa0IsRUFBRTtFQUN0QjtJQUNFLGdCQUFnQjtJQUNoQixrQkFBa0IsRUFBRTtFQUN0QjtJQUNFLGdCQUFnQjtJQUNoQixrQkFBa0IsRUFBRTtFQUN0QjtJQUNFLGdCQUFnQixFQUFFIiwiZmlsZSI6InRpdGxlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udHJvbEJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjJzO1xuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5O1xuICBvcGFjaXR5OiAxO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAuY29udHJvbEJ1dHRvbjpob3ZlciB7XG4gICAgb3BhY2l0eTogLjc7IH1cblxuLmhpZGRlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB3aWR0aDogMCAhaW1wb3J0YW50O1xuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1pbi1oZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgb3BhY2l0eTogMCAhaW1wb3J0YW50OyB9XG5cbi50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgbGluZS1oZWlnaHQ6IDE3cHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiNTUwcHhcIl0gLnRpdGxlIHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbGluZS1oZWlnaHQ6IDE1cHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCIzMDBweFwiXSAudGl0bGUge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBsaW5lLWhlaWdodDogMTNweDsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC50aXRsZSB7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAyMHB4OyB9XG4gIC50aXRsZS5saW5rIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7IH1cbiJdfQ== */";
    var styles$8 = {"controlButton":"title__controlButton___tyPdk","hidden":"title__hidden___3SyPm","title":"title__title___324Zx","link":"title__link___2x3nu"};
    styleInject(css$8);

    var TitleView = /** @class */ (function (_super) {
        __extends(TitleView, _super);
        function TitleView(config) {
            var _this = this;
            var callbacks = config.callbacks, theme = config.theme;
            _this = _super.call(this, theme) || this;
            _this._callbacks = callbacks;
            _this._initDOM();
            _this._bindEvents();
            return _this;
        }
        TitleView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$15({ styles: this.styleNames, themeStyles: this.themeStyles }));
            this._$title = getElementByHook(this._$node, 'video-title');
        };
        TitleView.prototype._bindEvents = function () {
            this._$title.addEventListener('click', this._callbacks.onClick);
        };
        TitleView.prototype._unbindEvents = function () {
            this._$title.removeEventListener('click', this._callbacks.onClick);
        };
        TitleView.prototype.setDisplayAsLink = function (flag) {
            toggleNodeClass(this._$title, this.styleNames.link, flag);
        };
        TitleView.prototype.setTitle = function (title) {
            // TODO: mb move this logic to controller? title.isHidden is out of control of this method
            // TODO: what if we call with empty value `.setTitle('')` and then call `.show()` method? Mb clear value anyway?
            if (title) {
                this.show();
                this._$title.innerHTML = title;
            }
            else {
                this.hide();
            }
        };
        TitleView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        TitleView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        TitleView.prototype.getNode = function () {
            return this._$node;
        };
        TitleView.prototype.destroy = function () {
            this._unbindEvents();
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$title = null;
        };
        return TitleView;
    }(View));
    TitleView.setTheme(titleViewTheme);
    TitleView.extendStyleNames(styles$8);

    var TitleControl = /** @class */ (function () {
        function TitleControl(_a) {
            var config = _a.config, theme = _a.theme;
            this._theme = theme;
            this._bindCallbacks();
            this._initUI();
            if (typeof config.title === 'object') {
                this.setTitleClickCallback(config.title.callback || null);
                this.setTitle(config.title.text);
            }
            else if (config.title === false) {
                this.hide();
            }
        }
        Object.defineProperty(TitleControl.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        TitleControl.prototype._bindCallbacks = function () {
            this._triggerCallback = this._triggerCallback.bind(this);
        };
        TitleControl.prototype._initUI = function () {
            var config = {
                theme: this._theme,
                callbacks: {
                    onClick: this._triggerCallback,
                },
            };
            this.view = new TitleControl.View(config);
            this.view.setTitle();
        };
        /**
         * Display title text over the video. If you want to have clickable title, use `setTitleClickCallback`
         *
         * @param title - Text for the video title
         *
         * @example
         * player.setTitle('Your awesome video title here');
         *
         * @note
         * [Live Demo](https://jsfiddle.net/bodia/243k6m0u/)
         */
        TitleControl.prototype.setTitle = function (title) {
            this.view.setTitle(title);
        };
        /**
         * Method for attaching callback for click on title
         *
         * @param callback - Your function
         *
         * @example
         * const callback = () => {
         *   console.log('Click on title);
         * }
         * player.setTitleClickCallback(callback);
         *
         */
        TitleControl.prototype.setTitleClickCallback = function (callback) {
            this._callback = callback;
            this.view.setDisplayAsLink(Boolean(this._callback));
        };
        TitleControl.prototype._triggerCallback = function () {
            if (this._callback) {
                this._callback();
            }
        };
        TitleControl.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        TitleControl.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        TitleControl.prototype.destroy = function () {
            this.view.destroy();
            this.view = null;
        };
        TitleControl.moduleName = 'title';
        TitleControl.View = TitleView;
        TitleControl.dependencies = ['config', 'theme'];
        __decorate([
            playerAPI()
        ], TitleControl.prototype, "setTitle", null);
        __decorate([
            playerAPI()
        ], TitleControl.prototype, "setTitleClickCallback", null);
        return TitleControl;
    }());

    function anonymous$16(props
    /*``*/) {
    var out='<div class="'+(props.styles.liveIndicator)+' '+(props.styles.hidden)+'"> <span class="'+(props.styles.liveIndicatorText)+'" aria-label="'+(props.texts.label || '')+'" data-hook="live-indicator-text"> '+(props.texts.text || '')+' </span></div>';return out;
    }

    var css$9 = ".live-indicator__controlButton___1FH60 {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .live-indicator__controlButton___1FH60:hover {\n    opacity: .7; }\n  .live-indicator__hidden___1MQc0 {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .live-indicator__liveIndicator___3Vudz {\n  position: relative;\n  margin-right: 15px;\n  padding: 5px 6px;\n  cursor: pointer;\n  -webkit-transition: background-color .2s;\n  transition: background-color .2s;\n  color: #fff;\n  background-color: #959595; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .live-indicator__liveIndicator___3Vudz {\n    margin-right: 20px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .live-indicator__liveIndicator___3Vudz {\n    margin-right: 10px; }\n  div[data-hook='player-container'][max-width~=\"280px\"] .live-indicator__liveIndicator___3Vudz {\n    margin-right: 10px;\n    padding: 2px 3px; }\n  .live-indicator__liveIndicator___3Vudz.live-indicator__ended___18KqE {\n    cursor: default; }\n  .live-indicator__liveIndicator___3Vudz:hover:not(.live-indicator__ended___18KqE), .live-indicator__liveIndicator___3Vudz.live-indicator__active___2Lobb {\n    background-color: #ea492e; }\n  .live-indicator__liveIndicatorText___1EIfu {\n  font-size: 12px;\n  line-height: 14px;\n  text-transform: uppercase; }\n  div[data-hook='player-container'][max-width~=\"280px\"] .live-indicator__liveIndicatorText___1EIfu {\n    font-size: 10px;\n    line-height: 12px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpdmUtaW5kaWNhdG9yLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixxQ0FBNkI7RUFBN0IsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLDhCQUE4QjtFQUM5QixvQkFBb0I7RUFDcEIsd0JBQXdCO0VBQ3hCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixzQkFBc0IsRUFBRTtFQUUxQjtFQUNFLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsaUJBQWlCO0VBQ2pCLGdCQUFnQjtFQUNoQix5Q0FBaUM7RUFBakMsaUNBQWlDO0VBQ2pDLFlBQVk7RUFDWiwwQkFBMEIsRUFBRTtFQUM1QjtJQUNFLG1CQUFtQixFQUFFO0VBQ3ZCO0lBQ0UsbUJBQW1CLEVBQUU7RUFDdkI7SUFDRSxtQkFBbUI7SUFDbkIsaUJBQWlCLEVBQUU7RUFDckI7SUFDRSxnQkFBZ0IsRUFBRTtFQUNwQjtJQUNFLDBCQUEwQixFQUFFO0VBRWhDO0VBQ0UsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtFQUNsQiwwQkFBMEIsRUFBRTtFQUM1QjtJQUNFLGdCQUFnQjtJQUNoQixrQkFBa0IsRUFBRSIsImZpbGUiOiJsaXZlLWluZGljYXRvci5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRyb2xCdXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eTtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmNvbnRyb2xCdXR0b246aG92ZXIge1xuICAgIG9wYWNpdHk6IC43OyB9XG5cbi5oaWRkZW4ge1xuICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDAgIWltcG9ydGFudDsgfVxuXG4ubGl2ZUluZGljYXRvciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xuICBwYWRkaW5nOiA1cHggNnB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgLjJzO1xuICBjb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzk1OTU5NTsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5saXZlSW5kaWNhdG9yIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCI1NTBweFwiXSAubGl2ZUluZGljYXRvciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiMjgwcHhcIl0gLmxpdmVJbmRpY2F0b3Ige1xuICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICBwYWRkaW5nOiAycHggM3B4OyB9XG4gIC5saXZlSW5kaWNhdG9yLmVuZGVkIHtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7IH1cbiAgLmxpdmVJbmRpY2F0b3I6aG92ZXI6bm90KC5lbmRlZCksIC5saXZlSW5kaWNhdG9yLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VhNDkyZTsgfVxuXG4ubGl2ZUluZGljYXRvclRleHQge1xuICBmb250LXNpemU6IDEycHg7XG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiMjgwcHhcIl0gLmxpdmVJbmRpY2F0b3JUZXh0IHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gICAgbGluZS1oZWlnaHQ6IDEycHg7IH1cbiJdfQ== */";
    var styles$9 = {"controlButton":"live-indicator__controlButton___1FH60","hidden":"live-indicator__hidden___1MQc0","liveIndicator":"live-indicator__liveIndicator___3Vudz","ended":"live-indicator__ended___18KqE","active":"live-indicator__active___2Lobb","liveIndicatorText":"live-indicator__liveIndicatorText___1EIfu"};
    styleInject(css$9);

    var LiveIndicatorView = /** @class */ (function (_super) {
        __extends(LiveIndicatorView, _super);
        function LiveIndicatorView(config) {
            var _this = _super.call(this) || this;
            _this._callbacks = config.callbacks;
            _this._textMap = config.textMap;
            _this._tooltipService = config.tooltipService;
            _this._initDOM();
            _this._bindEvents();
            return _this;
        }
        LiveIndicatorView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$16({
                styles: this.styleNames,
                themeStyles: this.themeStyles,
                texts: {},
            }));
            this._$liveIndicatorText = getElementByHook(this._$node, 'live-indicator-text');
            this._tooltipReference = this._tooltipService.createReference(this._$node, {
                text: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
            });
            // NOTE: LIVE indicator is hidden and inactive by default
            this.toggle(false);
            this.toggleActive(false);
            this.toggleEnded(false);
        };
        LiveIndicatorView.prototype._bindEvents = function () {
            this._$node.addEventListener('click', this._callbacks.onClick);
        };
        LiveIndicatorView.prototype._unbindEvents = function () {
            this._$node.removeEventListener('click', this._callbacks.onClick);
        };
        LiveIndicatorView.prototype.toggleActive = function (shouldActivate) {
            toggleNodeClass(this._$node, this.styleNames.active, shouldActivate);
            // NOTE: disable tooltip while video is sync with live
            if (shouldActivate) {
                this._tooltipReference.disable();
            }
            else {
                this._tooltipReference.enable();
            }
        };
        LiveIndicatorView.prototype.toggleEnded = function (isEnded) {
            toggleNodeClass(this._$node, this.styleNames.ended, isEnded);
            this._$liveIndicatorText.innerText = this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TEXT, { isEnded: isEnded });
            this._$liveIndicatorText.setAttribute('aria-label', !isEnded ? this._textMap.get(TEXT_LABELS.LIVE_SYNC_LABEL) : '');
            if (isEnded) {
                this._tooltipReference.disable();
            }
            else {
                this._tooltipReference.enable();
            }
        };
        LiveIndicatorView.prototype.show = function () {
            this.toggle(true);
        };
        LiveIndicatorView.prototype.hide = function () {
            this.toggle(false);
        };
        LiveIndicatorView.prototype.toggle = function (shouldShow) {
            toggleNodeClass(this._$node, this.styleNames.hidden, !shouldShow);
        };
        LiveIndicatorView.prototype.getNode = function () {
            return this._$node;
        };
        LiveIndicatorView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            this._tooltipReference.destroy();
            this._tooltipReference = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$liveIndicatorText = null;
            this._callbacks = null;
            this._textMap = null;
        };
        return LiveIndicatorView;
    }(View));
    LiveIndicatorView.extendStyleNames(styles$9);

    var LiveIndicator = /** @class */ (function () {
        function LiveIndicator(_a) {
            var engine = _a.engine, eventEmitter = _a.eventEmitter, textMap = _a.textMap, tooltipService = _a.tooltipService;
            this._isHidden = true;
            this._isActive = false;
            this._isEnded = false;
            this._engine = engine;
            this._eventEmitter = eventEmitter;
            this._textMap = textMap;
            this._tooltipService = tooltipService;
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
        }
        Object.defineProperty(LiveIndicator.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiveIndicator.prototype, "isHidden", {
            get: function () {
                return this._isHidden;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiveIndicator.prototype, "isActive", {
            get: function () {
                return this._isActive;
            },
            enumerable: true,
            configurable: true
        });
        LiveIndicator.prototype.show = function () {
            this._toggle(true);
        };
        LiveIndicator.prototype.hide = function () {
            this._toggle(false);
        };
        LiveIndicator.prototype._initUI = function () {
            this.view = new LiveIndicator.View({
                callbacks: {
                    onClick: this._syncWithLive,
                },
                textMap: this._textMap,
                tooltipService: this._tooltipService,
            });
        };
        LiveIndicator.prototype._bindCallbacks = function () {
            this._syncWithLive = this._syncWithLive.bind(this);
        };
        LiveIndicator.prototype._bindEvents = function () {
            var _this = this;
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processStateChange],
                [
                    UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_ENTER_TRIGGERED,
                    function () {
                        _this.view.toggleActive(true);
                    },
                ],
                [
                    UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_LEAVE_TRIGGERED,
                    function () {
                        // NOTE: restore state before mouse enter
                        _this.view.toggleActive(_this._isActive);
                    },
                ],
            ], this);
        };
        LiveIndicator.prototype._processStateChange = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case LiveState$1.NONE:
                    this._toggle(false);
                    this._toggleActive(false);
                    this._toggleEnded(false);
                    break;
                case LiveState$1.INITIAL:
                    this._toggle(true);
                    break;
                case LiveState$1.SYNC:
                    this._toggleActive(true);
                    break;
                case LiveState$1.NOT_SYNC:
                    this._toggleActive(false);
                    break;
                case LiveState$1.ENDED:
                    this._toggleActive(false);
                    this._toggleEnded(true);
                    break;
                default:
                    break;
            }
        };
        LiveIndicator.prototype._syncWithLive = function () {
            if (!this._isEnded) {
                this._engine.syncWithLive();
            }
        };
        LiveIndicator.prototype._toggle = function (shouldShow) {
            this._isHidden = !shouldShow;
            this.view.toggle(shouldShow);
        };
        LiveIndicator.prototype._toggleActive = function (shouldActivate) {
            this._isActive = shouldActivate;
            this.view.toggleActive(shouldActivate);
        };
        LiveIndicator.prototype._toggleEnded = function (isEnded) {
            this._isEnded = isEnded;
            this.view.toggleEnded(isEnded);
        };
        LiveIndicator.prototype.destroy = function () {
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._engine = null;
            this._eventEmitter = null;
            this._textMap = null;
        };
        LiveIndicator.moduleName = 'liveIndicator';
        LiveIndicator.View = LiveIndicatorView;
        LiveIndicator.dependencies = ['engine', 'eventEmitter', 'textMap', 'tooltipService'];
        return LiveIndicator;
    }());

    function anonymous$17(props
    /*``*/) {
    var out='<div data-hook="bottom-block" class="'+(props.styles.bottomBlock)+'"> <div class="'+(props.styles.background)+'" data-hook="screen-bottom-background"> </div> <div class="'+(props.styles.progressBarContainer)+'" data-hook="progress-bar-container"> </div> <div class="'+(props.styles.elementsContainer)+'"> <div class="'+(props.styles.controlsContainerLeft)+'" data-hook="controls-container-left"> <div class="'+(props.styles.playContainer)+'" data-hook="play-container"> </div> <div class="'+(props.styles.volumeContainer)+'" data-hook="volume-container"> </div> <div class="'+(props.styles.timeContainer)+'" data-hook="time-container"> </div> </div> <div class="'+(props.styles.controlsContainerRight)+'" data-hook="controls-container-right"> <div class="'+(props.styles.fullScreenContainer)+'" data-hook="full-screen-container"> </div> </div> <div class="'+(props.styles.logoContainer)+'" data-hook="logo-container"> </div> </div></div>';return out;
    }

    var css$10 = ".bottom-block__controlButton___2zYHZ {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .bottom-block__controlButton___2zYHZ:hover {\n    opacity: .7; }\n  .bottom-block__hidden___361S0 {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .bottom-block__bottomBlock___3Y_rW {\n  z-index: 60;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n  .bottom-block__bottomBlock___3Y_rW::-moz-focus-inner {\n    border: 0; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__activated___YvJ-R .bottom-block__progressBarContainer___2CxAg,\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__activated___YvJ-R .bottom-block__controlsContainerLeft___2Ozxp,\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__activated___YvJ-R .bottom-block__controlsContainerRight___qaM9T,\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__activated___YvJ-R .bottom-block__logoContainer___1esHz, .bottom-block__bottomBlock___3Y_rW.bottom-block__focus-within___2aMER .bottom-block__progressBarContainer___2CxAg,\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__focus-within___2aMER .bottom-block__controlsContainerLeft___2Ozxp,\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__focus-within___2aMER .bottom-block__controlsContainerRight___qaM9T,\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__focus-within___2aMER .bottom-block__logoContainer___1esHz {\n    visibility: visible;\n    opacity: 1; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__activated___YvJ-R .bottom-block__background___2ZL6j, .bottom-block__bottomBlock___3Y_rW.bottom-block__focus-within___2aMER .bottom-block__background___2ZL6j {\n    visibility: visible;\n    opacity: 1; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__showLogoAlways___2bJeD .bottom-block__logoContainer___1esHz {\n    opacity: 1; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__logoHidden___2N6oy .bottom-block__fullScreenContainer___3q_py {\n    margin-right: 14px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .bottom-block__bottomBlock___3Y_rW.bottom-block__logoHidden___2N6oy .bottom-block__fullScreenContainer___3q_py {\n      margin-right: 7px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__bottomBlock___3Y_rW.bottom-block__logoHidden___2N6oy .bottom-block__fullScreenContainer___3q_py {\n      margin-right: 25px; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__logoHidden___2N6oy .bottom-block__logoContainer___1esHz {\n    display: none; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__playControlHidden___1mEi9 .bottom-block__playContainer___25g5A {\n    display: none; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__timeControlHidden___32pcE .bottom-block__timeContainer___2N6cy {\n    display: none; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__volumeControlHidden___41JXw .bottom-block__volumeContainer___1Zwk- {\n    display: none; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__fullScreenControlHidden___1jT2c .bottom-block__fullScreenContainer___3q_py {\n    display: none; }\n  .bottom-block__bottomBlock___3Y_rW.bottom-block__progressControlHidden___1rhHL .bottom-block__progressBarContainer___2CxAg {\n    display: none; }\n  .bottom-block__elementsContainer___1MGej {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%;\n  -webkit-box-flex: 2;\n      -ms-flex-positive: 2;\n          flex-grow: 2; }\n  .bottom-block__progressBarContainer___2CxAg {\n  position: relative;\n  top: 2px;\n  padding: 0 20px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__progressBarContainer___2CxAg {\n    top: 3px;\n    padding: 0 30px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .bottom-block__progressBarContainer___2CxAg {\n    padding: 0 15px; }\n  div[data-hook='player-container'][max-width~=\"280px\"] .bottom-block__progressBarContainer___2CxAg {\n    padding: 0 12px; }\n  .bottom-block__progressBarContainer___2CxAg,\n.bottom-block__controlsContainerLeft___2Ozxp,\n.bottom-block__controlsContainerRight___qaM9T,\n.bottom-block__logoContainer___1esHz {\n  visibility: hidden;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  opacity: 0; }\n  .bottom-block__controlsContainerRight___qaM9T,\n.bottom-block__controlsContainerLeft___2Ozxp {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  width: 100%;\n  max-width: 100%;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .bottom-block__controlsContainerRight___qaM9T {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n  .bottom-block__controlsContainerRight___qaM9T,\n.bottom-block__controlsContainerLeft___2Ozxp,\n.bottom-block__logoContainer___1esHz {\n  height: 54px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__controlsContainerRight___qaM9T, div[data-hook='player-container'][data-in-full-screen='true']\n  .bottom-block__controlsContainerLeft___2Ozxp, div[data-hook='player-container'][data-in-full-screen='true']\n  .bottom-block__logoContainer___1esHz {\n    height: 80px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .bottom-block__controlsContainerRight___qaM9T, div[data-hook='player-container'][max-width~=\"550px\"]\n  .bottom-block__controlsContainerLeft___2Ozxp, div[data-hook='player-container'][max-width~=\"550px\"]\n  .bottom-block__logoContainer___1esHz {\n    height: 42px; }\n  div[data-hook='player-container'][max-width~=\"350px\"] .bottom-block__controlsContainerRight___qaM9T, div[data-hook='player-container'][max-width~=\"350px\"]\n  .bottom-block__controlsContainerLeft___2Ozxp, div[data-hook='player-container'][max-width~=\"350px\"]\n  .bottom-block__logoContainer___1esHz {\n    height: 36px; }\n  .bottom-block__playContainer___25g5A {\n  margin-right: 9px;\n  margin-left: 13px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__playContainer___25g5A {\n    margin-right: 20px;\n    margin-left: 20px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .bottom-block__playContainer___25g5A {\n    margin-left: 7px; }\n  div[data-hook='player-container'][max-width~=\"280px\"] .bottom-block__playContainer___25g5A {\n    margin-left: 4px; }\n  .bottom-block__volumeContainer___1Zwk- {\n  margin-right: 15px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__volumeContainer___1Zwk- {\n    margin-right: 20px; }\n  .bottom-block__timeContainer___2N6cy {\n  margin-right: 18px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__timeContainer___2N6cy {\n    margin-right: 30px; }\n  div[data-hook='player-container'][max-width~=\"400px\"] .bottom-block__timeContainer___2N6cy {\n    display: none; }\n  .bottom-block__fullScreenContainer___3q_py {\n  margin-right: 8px;\n  margin-left: 5px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .bottom-block__fullScreenContainer___3q_py {\n    margin-right: 1px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__fullScreenContainer___3q_py {\n    margin-right: 18px;\n    margin-left: 0; }\n  .bottom-block__logoContainer___1esHz {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin-right: 14px; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .bottom-block__logoContainer___1esHz {\n    margin-right: 9px;\n    margin-left: 1px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .bottom-block__logoContainer___1esHz {\n    margin-right: 23px;\n    margin-left: 0; }\n  div[data-hook='player-container'][max-width~=\"280px\"] .bottom-block__logoContainer___1esHz {\n    margin-right: 12px; }\n  .bottom-block__background___2ZL6j {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  visibility: hidden;\n  height: 181px;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  pointer-events: none;\n  opacity: 0;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), color-stop(24%, rgba(0, 0, 0, 0.03)), color-stop(50%, rgba(0, 0, 0, 0.15)), color-stop(75%, rgba(0, 0, 0, 0.3)), to(rgba(0, 0, 0, 0.4)));\n  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.03) 24%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.3) 75%, rgba(0, 0, 0, 0.4));\n  background-size: 100% 182px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvdHRvbS1ibG9jay5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGlDQUF5QjtVQUF6Qix5QkFBeUI7RUFDekIscUNBQTZCO0VBQTdCLDZCQUE2QjtFQUM3QixXQUFXO0VBQ1gsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixjQUFjO0VBQ2QsOEJBQThCO0VBQzlCLHlCQUF3QjtNQUF4QixzQkFBd0I7VUFBeEIsd0JBQXdCO0VBQ3hCLDBCQUFvQjtNQUFwQix1QkFBb0I7VUFBcEIsb0JBQW9CLEVBQUU7RUFDdEI7SUFDRSxZQUFZLEVBQUU7RUFFbEI7RUFDRSw4QkFBOEI7RUFDOUIsb0JBQW9CO0VBQ3BCLHdCQUF3QjtFQUN4QixxQkFBcUI7RUFDckIseUJBQXlCO0VBQ3pCLHFCQUFxQjtFQUNyQixzQkFBc0I7RUFDdEIsc0JBQXNCLEVBQUU7RUFFMUI7RUFDRSxZQUFZO0VBQ1oscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCw2QkFBdUI7RUFBdkIsOEJBQXVCO01BQXZCLDJCQUF1QjtVQUF2Qix1QkFBdUIsRUFBRTtFQUN6QjtJQUNFLFVBQVUsRUFBRTtFQUNkOzs7Ozs7O0lBT0Usb0JBQW9CO0lBQ3BCLFdBQVcsRUFBRTtFQUNmO0lBQ0Usb0JBQW9CO0lBQ3BCLFdBQVcsRUFBRTtFQUNmO0lBQ0UsV0FBVyxFQUFFO0VBQ2Y7SUFDRSxtQkFBbUIsRUFBRTtFQUNyQjtNQUNFLGtCQUFrQixFQUFFO0VBQ3RCO01BQ0UsbUJBQW1CLEVBQUU7RUFDekI7SUFDRSxjQUFjLEVBQUU7RUFDbEI7SUFDRSxjQUFjLEVBQUU7RUFDbEI7SUFDRSxjQUFjLEVBQUU7RUFDbEI7SUFDRSxjQUFjLEVBQUU7RUFDbEI7SUFDRSxjQUFjLEVBQUU7RUFDbEI7SUFDRSxjQUFjLEVBQUU7RUFFcEI7RUFDRSxtQkFBbUI7RUFDbkIscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxZQUFZO0VBQ1osb0JBQWE7TUFBYixxQkFBYTtVQUFiLGFBQWEsRUFBRTtFQUVqQjtFQUNFLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsZ0JBQWdCLEVBQUU7RUFDbEI7SUFDRSxTQUFTO0lBQ1QsZ0JBQWdCLEVBQUU7RUFDcEI7SUFDRSxnQkFBZ0IsRUFBRTtFQUNwQjtJQUNFLGdCQUFnQixFQUFFO0VBRXRCOzs7O0VBSUUsbUJBQW1CO0VBQ25CLGdEQUF3QztFQUF4Qyx3Q0FBd0M7RUFDeEMsV0FBVyxFQUFFO0VBRWY7O0VBRUUsbUJBQW1CO0VBQ25CLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2Qsb0JBQVE7TUFBUixZQUFRO1VBQVIsUUFBUTtFQUNSLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUV4QjtFQUNFLHNCQUEwQjtNQUExQixtQkFBMEI7VUFBMUIsMEJBQTBCLEVBQUU7RUFFOUI7OztFQUdFLGFBQWEsRUFBRTtFQUNmOzs7SUFHRSxhQUFhLEVBQUU7RUFDakI7OztJQUdFLGFBQWEsRUFBRTtFQUNqQjs7O0lBR0UsYUFBYSxFQUFFO0VBRW5CO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQixFQUFFO0VBQ3BCO0lBQ0UsbUJBQW1CO0lBQ25CLGtCQUFrQixFQUFFO0VBQ3RCO0lBQ0UsaUJBQWlCLEVBQUU7RUFDckI7SUFDRSxpQkFBaUIsRUFBRTtFQUV2QjtFQUNFLG1CQUFtQixFQUFFO0VBQ3JCO0lBQ0UsbUJBQW1CLEVBQUU7RUFFekI7RUFDRSxtQkFBbUIsRUFBRTtFQUNyQjtJQUNFLG1CQUFtQixFQUFFO0VBQ3ZCO0lBQ0UsY0FBYyxFQUFFO0VBRXBCO0VBQ0Usa0JBQWtCO0VBQ2xCLGlCQUFpQixFQUFFO0VBQ25CO0lBQ0Usa0JBQWtCLEVBQUU7RUFDdEI7SUFDRSxtQkFBbUI7SUFDbkIsZUFBZSxFQUFFO0VBRXJCO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxtQkFBbUIsRUFBRTtFQUNyQjtJQUNFLGtCQUFrQjtJQUNsQixpQkFBaUIsRUFBRTtFQUNyQjtJQUNFLG1CQUFtQjtJQUNuQixlQUFlLEVBQUU7RUFDbkI7SUFDRSxtQkFBbUIsRUFBRTtFQUV6QjtFQUNFLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsVUFBVTtFQUNWLFFBQVE7RUFDUixtQkFBbUI7RUFDbkIsY0FBYztFQUNkLGdEQUF3QztFQUF4Qyx3Q0FBd0M7RUFDeEMscUJBQXFCO0VBQ3JCLFdBQVc7RUFDWCxtT0FBNko7RUFBN0osNkpBQTZKO0VBQzdKLDRCQUE0QixFQUFFIiwiZmlsZSI6ImJvdHRvbS1ibG9jay5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRyb2xCdXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eTtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmNvbnRyb2xCdXR0b246aG92ZXIge1xuICAgIG9wYWNpdHk6IC43OyB9XG5cbi5oaWRkZW4ge1xuICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDAgIWltcG9ydGFudDsgfVxuXG4uYm90dG9tQmxvY2sge1xuICB6LWluZGV4OiA2MDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxuICAuYm90dG9tQmxvY2s6Oi1tb3otZm9jdXMtaW5uZXIge1xuICAgIGJvcmRlcjogMDsgfVxuICAuYm90dG9tQmxvY2suYWN0aXZhdGVkIC5wcm9ncmVzc0JhckNvbnRhaW5lcixcbiAgLmJvdHRvbUJsb2NrLmFjdGl2YXRlZCAuY29udHJvbHNDb250YWluZXJMZWZ0LFxuICAuYm90dG9tQmxvY2suYWN0aXZhdGVkIC5jb250cm9sc0NvbnRhaW5lclJpZ2h0LFxuICAuYm90dG9tQmxvY2suYWN0aXZhdGVkIC5sb2dvQ29udGFpbmVyLCAuYm90dG9tQmxvY2suZm9jdXMtd2l0aGluIC5wcm9ncmVzc0JhckNvbnRhaW5lcixcbiAgLmJvdHRvbUJsb2NrLmZvY3VzLXdpdGhpbiAuY29udHJvbHNDb250YWluZXJMZWZ0LFxuICAuYm90dG9tQmxvY2suZm9jdXMtd2l0aGluIC5jb250cm9sc0NvbnRhaW5lclJpZ2h0LFxuICAuYm90dG9tQmxvY2suZm9jdXMtd2l0aGluIC5sb2dvQ29udGFpbmVyIHtcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICAgIG9wYWNpdHk6IDE7IH1cbiAgLmJvdHRvbUJsb2NrLmFjdGl2YXRlZCAuYmFja2dyb3VuZCwgLmJvdHRvbUJsb2NrLmZvY3VzLXdpdGhpbiAuYmFja2dyb3VuZCB7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICBvcGFjaXR5OiAxOyB9XG4gIC5ib3R0b21CbG9jay5zaG93TG9nb0Fsd2F5cyAubG9nb0NvbnRhaW5lciB7XG4gICAgb3BhY2l0eTogMTsgfVxuICAuYm90dG9tQmxvY2subG9nb0hpZGRlbiAuZnVsbFNjcmVlbkNvbnRhaW5lciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxNHB4OyB9XG4gICAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCI1NTBweFwiXSAuYm90dG9tQmxvY2subG9nb0hpZGRlbiAuZnVsbFNjcmVlbkNvbnRhaW5lciB7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDdweDsgfVxuICAgIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLmJvdHRvbUJsb2NrLmxvZ29IaWRkZW4gLmZ1bGxTY3JlZW5Db250YWluZXIge1xuICAgICAgbWFyZ2luLXJpZ2h0OiAyNXB4OyB9XG4gIC5ib3R0b21CbG9jay5sb2dvSGlkZGVuIC5sb2dvQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBub25lOyB9XG4gIC5ib3R0b21CbG9jay5wbGF5Q29udHJvbEhpZGRlbiAucGxheUNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogbm9uZTsgfVxuICAuYm90dG9tQmxvY2sudGltZUNvbnRyb2xIaWRkZW4gLnRpbWVDb250YWluZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7IH1cbiAgLmJvdHRvbUJsb2NrLnZvbHVtZUNvbnRyb2xIaWRkZW4gLnZvbHVtZUNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogbm9uZTsgfVxuICAuYm90dG9tQmxvY2suZnVsbFNjcmVlbkNvbnRyb2xIaWRkZW4gLmZ1bGxTY3JlZW5Db250YWluZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7IH1cbiAgLmJvdHRvbUJsb2NrLnByb2dyZXNzQ29udHJvbEhpZGRlbiAucHJvZ3Jlc3NCYXJDb250YWluZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7IH1cblxuLmVsZW1lbnRzQ29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMTAwJTtcbiAgZmxleC1ncm93OiAyOyB9XG5cbi5wcm9ncmVzc0JhckNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiAycHg7XG4gIHBhZGRpbmc6IDAgMjBweDsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5wcm9ncmVzc0JhckNvbnRhaW5lciB7XG4gICAgdG9wOiAzcHg7XG4gICAgcGFkZGluZzogMCAzMHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiNTUwcHhcIl0gLnByb2dyZXNzQmFyQ29udGFpbmVyIHtcbiAgICBwYWRkaW5nOiAwIDE1cHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCIyODBweFwiXSAucHJvZ3Jlc3NCYXJDb250YWluZXIge1xuICAgIHBhZGRpbmc6IDAgMTJweDsgfVxuXG4ucHJvZ3Jlc3NCYXJDb250YWluZXIsXG4uY29udHJvbHNDb250YWluZXJMZWZ0LFxuLmNvbnRyb2xzQ29udGFpbmVyUmlnaHQsXG4ubG9nb0NvbnRhaW5lciB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMnMsIHZpc2liaWxpdHkgLjJzO1xuICBvcGFjaXR5OiAwOyB9XG5cbi5jb250cm9sc0NvbnRhaW5lclJpZ2h0LFxuLmNvbnRyb2xzQ29udGFpbmVyTGVmdCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMTtcbiAgd2lkdGg6IDEwMCU7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuXG4uY29udHJvbHNDb250YWluZXJSaWdodCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7IH1cblxuLmNvbnRyb2xzQ29udGFpbmVyUmlnaHQsXG4uY29udHJvbHNDb250YWluZXJMZWZ0LFxuLmxvZ29Db250YWluZXIge1xuICBoZWlnaHQ6IDU0cHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAuY29udHJvbHNDb250YWluZXJSaWdodCwgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXVxuICAuY29udHJvbHNDb250YWluZXJMZWZ0LCBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddXG4gIC5sb2dvQ29udGFpbmVyIHtcbiAgICBoZWlnaHQ6IDgwcHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCI1NTBweFwiXSAuY29udHJvbHNDb250YWluZXJSaWdodCwgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCI1NTBweFwiXVxuICAuY29udHJvbHNDb250YWluZXJMZWZ0LCBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bbWF4LXdpZHRofj1cIjU1MHB4XCJdXG4gIC5sb2dvQ29udGFpbmVyIHtcbiAgICBoZWlnaHQ6IDQycHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCIzNTBweFwiXSAuY29udHJvbHNDb250YWluZXJSaWdodCwgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCIzNTBweFwiXVxuICAuY29udHJvbHNDb250YWluZXJMZWZ0LCBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bbWF4LXdpZHRofj1cIjM1MHB4XCJdXG4gIC5sb2dvQ29udGFpbmVyIHtcbiAgICBoZWlnaHQ6IDM2cHg7IH1cblxuLnBsYXlDb250YWluZXIge1xuICBtYXJnaW4tcmlnaHQ6IDlweDtcbiAgbWFyZ2luLWxlZnQ6IDEzcHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAucGxheUNvbnRhaW5lciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xuICAgIG1hcmdpbi1sZWZ0OiAyMHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiNTUwcHhcIl0gLnBsYXlDb250YWluZXIge1xuICAgIG1hcmdpbi1sZWZ0OiA3cHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCIyODBweFwiXSAucGxheUNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWxlZnQ6IDRweDsgfVxuXG4udm9sdW1lQ29udGFpbmVyIHtcbiAgbWFyZ2luLXJpZ2h0OiAxNXB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnZvbHVtZUNvbnRhaW5lciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAyMHB4OyB9XG5cbi50aW1lQ29udGFpbmVyIHtcbiAgbWFyZ2luLXJpZ2h0OiAxOHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnRpbWVDb250YWluZXIge1xuICAgIG1hcmdpbi1yaWdodDogMzBweDsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bbWF4LXdpZHRofj1cIjQwMHB4XCJdIC50aW1lQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBub25lOyB9XG5cbi5mdWxsU2NyZWVuQ29udGFpbmVyIHtcbiAgbWFyZ2luLXJpZ2h0OiA4cHg7XG4gIG1hcmdpbi1sZWZ0OiA1cHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCI1NTBweFwiXSAuZnVsbFNjcmVlbkNvbnRhaW5lciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxcHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAuZnVsbFNjcmVlbkNvbnRhaW5lciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxOHB4O1xuICAgIG1hcmdpbi1sZWZ0OiAwOyB9XG5cbi5sb2dvQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgbWFyZ2luLXJpZ2h0OiAxNHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiNTUwcHhcIl0gLmxvZ29Db250YWluZXIge1xuICAgIG1hcmdpbi1yaWdodDogOXB4O1xuICAgIG1hcmdpbi1sZWZ0OiAxcHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAubG9nb0NvbnRhaW5lciB7XG4gICAgbWFyZ2luLXJpZ2h0OiAyM3B4O1xuICAgIG1hcmdpbi1sZWZ0OiAwOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVttYXgtd2lkdGh+PVwiMjgwcHhcIl0gLmxvZ29Db250YWluZXIge1xuICAgIG1hcmdpbi1yaWdodDogMTJweDsgfVxuXG4uYmFja2dyb3VuZCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBoZWlnaHQ6IDE4MXB4O1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4ycywgdmlzaWJpbGl0eSAuMnM7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBvcGFjaXR5OiAwO1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsIDAsIDAsIDApLCByZ2JhKDAsIDAsIDAsIDAuMDMpIDI0JSwgcmdiYSgwLCAwLCAwLCAwLjE1KSA1MCUsIHJnYmEoMCwgMCwgMCwgMC4zKSA3NSUsIHJnYmEoMCwgMCwgMCwgMC40KSk7XG4gIGJhY2tncm91bmQtc2l6ZTogMTAwJSAxODJweDsgfVxuIl19 */";
    var styles$10 = {"controlButton":"bottom-block__controlButton___2zYHZ","hidden":"bottom-block__hidden___361S0","bottomBlock":"bottom-block__bottomBlock___3Y_rW","activated":"bottom-block__activated___YvJ-R","progressBarContainer":"bottom-block__progressBarContainer___2CxAg","controlsContainerLeft":"bottom-block__controlsContainerLeft___2Ozxp","controlsContainerRight":"bottom-block__controlsContainerRight___qaM9T","logoContainer":"bottom-block__logoContainer___1esHz","focus-within":"bottom-block__focus-within___2aMER","background":"bottom-block__background___2ZL6j","showLogoAlways":"bottom-block__showLogoAlways___2bJeD","logoHidden":"bottom-block__logoHidden___2N6oy","fullScreenContainer":"bottom-block__fullScreenContainer___3q_py","playControlHidden":"bottom-block__playControlHidden___1mEi9","playContainer":"bottom-block__playContainer___25g5A","timeControlHidden":"bottom-block__timeControlHidden___32pcE","timeContainer":"bottom-block__timeContainer___2N6cy","volumeControlHidden":"bottom-block__volumeControlHidden___41JXw","volumeContainer":"bottom-block__volumeContainer___1Zwk-","fullScreenControlHidden":"bottom-block__fullScreenControlHidden___1jT2c","progressControlHidden":"bottom-block__progressControlHidden___1rhHL","elementsContainer":"bottom-block__elementsContainer___1MGej"};
    styleInject(css$10);

    var BottomBlockView = /** @class */ (function (_super) {
        __extends(BottomBlockView, _super);
        function BottomBlockView(config) {
            var _this = _super.call(this) || this;
            var callbacks = config.callbacks, elements = config.elements;
            _this._callbacks = callbacks;
            _this._initDOM(elements);
            _this._bindEvents();
            return _this;
        }
        BottomBlockView.prototype._initDOM = function (elements) {
            this._$node = htmlToElement(anonymous$17({
                styles: this.styleNames,
            }));
            var $playContainer = getElementByHook(this._$node, 'play-container');
            var $volumeContainer = getElementByHook(this._$node, 'volume-container');
            var $timeContainer = getElementByHook(this._$node, 'time-container');
            var $fullScreenContainer = getElementByHook(this._$node, 'full-screen-container');
            var $logoContainer = getElementByHook(this._$node, 'logo-container');
            var $progressBarContainer = getElementByHook(this._$node, 'progress-bar-container');
            $playContainer.appendChild(elements.play);
            $volumeContainer.appendChild(elements.volume);
            $timeContainer.appendChild(elements.time);
            $fullScreenContainer.appendChild(elements.fullScreen);
            $logoContainer.appendChild(elements.logo);
            $progressBarContainer.appendChild(elements.progress);
        };
        BottomBlockView.prototype._preventClickPropagation = function (e) {
            e.stopPropagation();
        };
        BottomBlockView.prototype._bindEvents = function () {
            this._$node.addEventListener('click', this._preventClickPropagation);
            this._$node.addEventListener('mousemove', this._callbacks.onBlockMouseMove);
            this._$node.addEventListener('mouseleave', this._callbacks.onBlockMouseOut);
        };
        BottomBlockView.prototype._unbindEvents = function () {
            this._$node.removeEventListener('click', this._preventClickPropagation);
            this._$node.removeEventListener('mousemove', this._callbacks.onBlockMouseMove);
            this._$node.removeEventListener('mouseleave', this._callbacks.onBlockMouseOut);
        };
        BottomBlockView.prototype.setShouldLogoShowAlwaysFlag = function (isShowAlways) {
            toggleNodeClass(this._$node, this.styleNames.showLogoAlways, isShowAlways);
            this.showLogo();
        };
        BottomBlockView.prototype.showPlayControl = function () {
            this._$node.classList.remove(this.styleNames.playControlHidden);
        };
        BottomBlockView.prototype.hidePlayControl = function () {
            this._$node.classList.add(this.styleNames.playControlHidden);
        };
        BottomBlockView.prototype.showTimeControl = function () {
            this._$node.classList.remove(this.styleNames.timeControlHidden);
        };
        BottomBlockView.prototype.hideTimeControl = function () {
            this._$node.classList.add(this.styleNames.timeControlHidden);
        };
        BottomBlockView.prototype.showVolumeControl = function () {
            this._$node.classList.remove(this.styleNames.volumeControlHidden);
        };
        BottomBlockView.prototype.hideVolumeControl = function () {
            this._$node.classList.add(this.styleNames.volumeControlHidden);
        };
        BottomBlockView.prototype.showFullScreenControl = function () {
            this._$node.classList.remove(this.styleNames.fullScreenControlHidden);
        };
        BottomBlockView.prototype.hideFullScreenControl = function () {
            this._$node.classList.add(this.styleNames.fullScreenControlHidden);
        };
        BottomBlockView.prototype.showLogo = function () {
            this._$node.classList.remove(this.styleNames.logoHidden);
        };
        BottomBlockView.prototype.hideLogo = function () {
            this._$node.classList.add(this.styleNames.logoHidden);
        };
        BottomBlockView.prototype.showProgressControl = function () {
            this._$node.classList.remove(this.styleNames.progressControlHidden);
        };
        BottomBlockView.prototype.hideProgressControl = function () {
            this._$node.classList.add(this.styleNames.progressControlHidden);
        };
        BottomBlockView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        BottomBlockView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        BottomBlockView.prototype.getNode = function () {
            return this._$node;
        };
        BottomBlockView.prototype.showContent = function () {
            this._$node.classList.add(this.styleNames.activated);
        };
        BottomBlockView.prototype.hideContent = function () {
            this._$node.classList.remove(this.styleNames.activated);
        };
        BottomBlockView.prototype.destroy = function () {
            this._unbindEvents();
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
        };
        return BottomBlockView;
    }(View));
    BottomBlockView.extendStyleNames(styles$10);

    var BottomBlock = /** @class */ (function () {
        function BottomBlock(dependencies) {
            this._isBlockFocused = false;
            this.isHidden = false;
            var config = dependencies.config, eventEmitter = dependencies.eventEmitter;
            this._eventEmitter = eventEmitter;
            this._bindViewCallbacks();
            this._initUI(this._getElementsNodes(dependencies));
            this._initLogo(config.logo);
            this._bindEvents();
        }
        BottomBlock.prototype._getElementsNodes = function (dependencies) {
            var playControl = dependencies.playControl, progressControl = dependencies.progressControl, timeControl = dependencies.timeControl, volumeControl = dependencies.volumeControl, fullScreenControl = dependencies.fullScreenControl, logo = dependencies.logo;
            return {
                play: playControl.node,
                progress: progressControl.node,
                time: timeControl.node,
                volume: volumeControl.node,
                fullScreen: fullScreenControl.node,
                logo: logo.node,
            };
        };
        Object.defineProperty(BottomBlock.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        BottomBlock.prototype._initUI = function (elementNodes) {
            var config = {
                elements: elementNodes,
                callbacks: {
                    onBlockMouseMove: this._setFocusState,
                    onBlockMouseOut: this._removeFocusState,
                },
            };
            this.view = new BottomBlock.View(config);
        };
        BottomBlock.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([[UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._removeFocusState]], this);
        };
        BottomBlock.prototype._initLogo = function (logoConfig) {
            if (logoConfig) {
                if (typeof logoConfig === 'object') {
                    this.setLogoAlwaysShowFlag(logoConfig.showAlways);
                }
            }
            else {
                this.hideLogo();
            }
        };
        BottomBlock.prototype._bindViewCallbacks = function () {
            this._setFocusState = this._setFocusState.bind(this);
            this._removeFocusState = this._removeFocusState.bind(this);
        };
        BottomBlock.prototype._setFocusState = function () {
            this._isBlockFocused = true;
        };
        BottomBlock.prototype._removeFocusState = function () {
            this._isBlockFocused = false;
        };
        Object.defineProperty(BottomBlock.prototype, "isFocused", {
            get: function () {
                return this._isBlockFocused;
            },
            enumerable: true,
            configurable: true
        });
        BottomBlock.prototype.showContent = function () {
            this.view.showContent();
        };
        BottomBlock.prototype.hideContent = function () {
            this.view.hideContent();
        };
        BottomBlock.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        BottomBlock.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        /**
         * Method for allowing logo to be always shown in bottom block
         * @param flag - `true` for showing always
         * @example
         * player.setLogoAlwaysShowFlag(true);
         *
         */
        BottomBlock.prototype.setLogoAlwaysShowFlag = function (flag) {
            this.view.setShouldLogoShowAlwaysFlag(flag);
        };
        /**
         * Method for hidding logo. If you use `setLogoAlwaysShowFlag` or `setControlsShouldAlwaysShow`, logo would automaticaly appear.
         * @example
         * player.hideLogo();
         */
        BottomBlock.prototype.hideLogo = function () {
            this.view.hideLogo();
        };
        /**
         * Method for showing logo.
         * @example
         * player.showLogo();
         */
        BottomBlock.prototype.showLogo = function () {
            this.view.showLogo();
        };
        /**
         * Method for showing play control.
         * @example
         * player.showPlayControl();
         */
        BottomBlock.prototype.showPlayControl = function () {
            this.view.showPlayControl();
        };
        /**
         * Method for showing volume control.
         * @example
         * player.showVolumeControl();
         */
        BottomBlock.prototype.showVolumeControl = function () {
            this.view.showVolumeControl();
        };
        /**
         * Method for showing time control.
         * @example
         * player.showTimeControl();
         */
        BottomBlock.prototype.showTimeControl = function () {
            this.view.showTimeControl();
        };
        /**
         * Method for showing full screen control.
         * @example
         * player.showFullScreenControl();
         */
        BottomBlock.prototype.showFullScreenControl = function () {
            this.view.showFullScreenControl();
        };
        /**
         * Method for showing progress control.
         * @example
         * player.showProgressControl();
         */
        BottomBlock.prototype.showProgressControl = function () {
            this.view.showProgressControl();
        };
        /**
         * Method for hidding play control.
         * @example
         * player.hidePlayControl();
         */
        BottomBlock.prototype.hidePlayControl = function () {
            this.view.hidePlayControl();
        };
        /**
         * Method for hidding voluem control.
         * @example
         * player.hideVolumeControl();
         */
        BottomBlock.prototype.hideVolumeControl = function () {
            this.view.hideVolumeControl();
        };
        /**
         * Method for hidding time control.
         * @example
         * player.hideTimeControl();
         */
        BottomBlock.prototype.hideTimeControl = function () {
            this.view.hideTimeControl();
        };
        /**
         * Method for hidding full screen control.
         * @example
         * player.hideFullScreenControl();
         */
        BottomBlock.prototype.hideFullScreenControl = function () {
            this.view.hideFullScreenControl();
        };
        /**
         * Method for hidding progress control.
         * @example
         * player.hideProgressControl();
         */
        BottomBlock.prototype.hideProgressControl = function () {
            this.view.hideProgressControl();
        };
        BottomBlock.prototype.destroy = function () {
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
        };
        BottomBlock.moduleName = 'bottomBlock';
        BottomBlock.View = BottomBlockView;
        BottomBlock.dependencies = [
            'config',
            'playControl',
            'progressControl',
            'timeControl',
            'volumeControl',
            'fullScreenControl',
            'logo',
            'eventEmitter',
        ];
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "setLogoAlwaysShowFlag", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "hideLogo", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "showLogo", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "showPlayControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "showVolumeControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "showTimeControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "showFullScreenControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "showProgressControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "hidePlayControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "hideVolumeControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "hideTimeControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "hideFullScreenControl", null);
        __decorate([
            playerAPI()
        ], BottomBlock.prototype, "hideProgressControl", null);
        return BottomBlock;
    }());

    function formatTime(seconds) {
        var isValid = !isNaN(seconds) && isFinite(seconds);
        var isNegative = isValid && seconds < 0;
        var date = new Date(null);
        date.setSeconds(isValid ? Math.abs(Math.floor(seconds)) : 0);
        // get HH:mm:ss part, remove hours if they are "00:"
        var time = date
            .toISOString()
            .substr(11, 8)
            .replace(/^00:/, '');
        return isNegative ? "-" + time : time;
    }

    function anonymous$18(props
    /*``*/) {
    var out='<div class="'+(props.styles.tooltip)+'" role="tooltip"> <div class="'+(props.styles.tooltipInner)+'" data-hook="tooltipInner"></div></div>';return out;
    }

    function anonymous$19(props
    /*``*/) {
    var out='<div class="'+(props.styles.tooltipContainer)+'"></div>';return out;
    }

    var css$11 = ".tooltip__controlButton___E3x3L {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .tooltip__controlButton___E3x3L:hover {\n    opacity: .7; }\n  .tooltip__hidden___3R_Au {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .tooltip__tooltip___1TO08 {\n  position: absolute;\n  z-index: 100;\n  visibility: hidden;\n  padding: 4px 5px;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  opacity: 0;\n  background: rgba(0, 0, 0, 0.5); }\n  .tooltip__tooltip___1TO08.tooltip__tooltipVisible___37y2K {\n    visibility: visible;\n    opacity: 1; }\n  .tooltip__tooltipInner___2s85x {\n  font-size: 11px;\n  line-height: 12px;\n  white-space: nowrap;\n  color: white; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixpQ0FBeUI7VUFBekIseUJBQXlCO0VBQ3pCLHFDQUE2QjtFQUE3Qiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLFVBQVU7RUFDVixpQkFBaUI7RUFDakIsY0FBYztFQUNkLDhCQUE4QjtFQUM5Qix5QkFBd0I7TUFBeEIsc0JBQXdCO1VBQXhCLHdCQUF3QjtFQUN4QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO0lBQ0UsWUFBWSxFQUFFO0VBRWxCO0VBQ0UsOEJBQThCO0VBQzlCLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIscUJBQXFCO0VBQ3JCLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsc0JBQXNCO0VBQ3RCLHNCQUFzQixFQUFFO0VBRTFCO0VBQ0UsbUJBQW1CO0VBQ25CLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsaUJBQWlCO0VBQ2pCLGdEQUF3QztFQUF4Qyx3Q0FBd0M7RUFDeEMsV0FBVztFQUNYLCtCQUErQixFQUFFO0VBQ2pDO0lBQ0Usb0JBQW9CO0lBQ3BCLFdBQVcsRUFBRTtFQUVqQjtFQUNFLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsb0JBQW9CO0VBQ3BCLGFBQWEsRUFBRSIsImZpbGUiOiJ0b29sdGlwLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udHJvbEJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjJzO1xuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5O1xuICBvcGFjaXR5OiAxO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAuY29udHJvbEJ1dHRvbjpob3ZlciB7XG4gICAgb3BhY2l0eTogLjc7IH1cblxuLmhpZGRlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB3aWR0aDogMCAhaW1wb3J0YW50O1xuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1pbi1oZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgb3BhY2l0eTogMCAhaW1wb3J0YW50OyB9XG5cbi50b29sdGlwIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDA7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgcGFkZGluZzogNHB4IDVweDtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMnMsIHZpc2liaWxpdHkgLjJzO1xuICBvcGFjaXR5OiAwO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7IH1cbiAgLnRvb2x0aXAudG9vbHRpcFZpc2libGUge1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgb3BhY2l0eTogMTsgfVxuXG4udG9vbHRpcElubmVyIHtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBsaW5lLWhlaWdodDogMTJweDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgY29sb3I6IHdoaXRlOyB9XG4iXX0= */";
    var styles$11 = {"controlButton":"tooltip__controlButton___E3x3L","hidden":"tooltip__hidden___3R_Au","tooltip":"tooltip__tooltip___1TO08","tooltipVisible":"tooltip__tooltipVisible___37y2K","tooltipInner":"tooltip__tooltipInner___2s85x"};
    styleInject(css$11);

    var Tooltip = /** @class */ (function (_super) {
        __extends(Tooltip, _super);
        function Tooltip() {
            var _this = _super.call(this) || this;
            _this._isHidden = true;
            _this._initDOM();
            return _this;
        }
        Tooltip.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$18({
                styles: this.styleNames,
            }));
            this._$tooltipInner = getElementByHook(this._$node, 'tooltipInner');
        };
        Object.defineProperty(Tooltip.prototype, "node", {
            get: function () {
                return this._$node;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip.prototype, "isHidden", {
            get: function () {
                return this._isHidden;
            },
            enumerable: true,
            configurable: true
        });
        Tooltip.prototype.show = function () {
            if (!this._isHidden) {
                return;
            }
            this._isHidden = false;
            this._$node.classList.add(this.styleNames.tooltipVisible);
        };
        Tooltip.prototype.hide = function () {
            if (this._isHidden) {
                return;
            }
            this._isHidden = true;
            this._$node.classList.remove(this.styleNames.tooltipVisible);
        };
        Tooltip.prototype.setText = function (text) {
            this.clearElement();
            this._$tooltipInner.innerText = text;
        };
        Tooltip.prototype.clearElement = function () {
            this._$tooltipInner.firstChild &&
                this._$tooltipInner.removeChild(this._$tooltipInner.firstChild);
        };
        Tooltip.prototype.setElement = function (element) {
            this.clearElement();
            if (element) {
                this._$tooltipInner.appendChild(element);
            }
        };
        Tooltip.prototype.setStyle = function (style) {
            var _this = this;
            Object.keys(style).forEach(function (styleKey) {
                _this._$node.style[styleKey] = style[styleKey];
            });
        };
        Tooltip.prototype.destroy = function () {
            this._$node = null;
            this._$tooltipInner = null;
        };
        return Tooltip;
    }(Stylable));
    Tooltip.extendStyleNames(styles$11);

    var ITooltipPositionPlacement;
    (function (ITooltipPositionPlacement) {
        ITooltipPositionPlacement["TOP"] = "top";
        ITooltipPositionPlacement["BOTTOM"] = "bottom";
    })(ITooltipPositionPlacement || (ITooltipPositionPlacement = {}));

    function calcTooltipCenterX(tooltipReferenceOffsetX, tooltipReferenceWidth) {
        return tooltipReferenceOffsetX + tooltipReferenceWidth / 2;
    }
    function getTooltipPositionByReferenceNode(tooltipReferenceNode, tooltipContainerNode, tooltipCenterXfn) {
        if (tooltipCenterXfn === void 0) { tooltipCenterXfn = calcTooltipCenterX; }
        var tooltipReferenceRect = tooltipReferenceNode.getBoundingClientRect();
        var tooltipContainerRect = tooltipContainerNode.getBoundingClientRect();
        var tooltipPlacement = tooltipReferenceRect.top > tooltipContainerRect.top
            ? ITooltipPositionPlacement.BOTTOM
            : ITooltipPositionPlacement.TOP;
        var tooltipReferenceOffsetX = tooltipReferenceRect.left - tooltipContainerRect.left;
        var tooltipCenterX = tooltipCenterXfn(tooltipReferenceOffsetX, tooltipReferenceRect.width);
        return { placement: tooltipPlacement, x: tooltipCenterX };
    }

    var SHOW_EVENTS = ['mouseenter', 'focus'];
    var HIDE_EVENTS = ['mouseleave', 'blur'];
    var TooltipReference = /** @class */ (function () {
        function TooltipReference(reference, tooltipService, options) {
            this._$reference = reference;
            this._options = options;
            this._tooltipService = tooltipService;
            this._eventListeners = [];
            this._bindEvents();
        }
        TooltipReference.prototype._bindEvents = function () {
            var _this = this;
            SHOW_EVENTS.forEach(function (event) {
                var fn = function () {
                    _this.show();
                };
                _this._eventListeners.push({ event: event, fn: fn });
                _this._$reference.addEventListener(event, fn);
            });
            HIDE_EVENTS.forEach(function (event) {
                var fn = function () {
                    _this.hide();
                };
                _this._eventListeners.push({ event: event, fn: fn });
                _this._$reference.addEventListener(event, fn);
            });
        };
        Object.defineProperty(TooltipReference.prototype, "isHidden", {
            get: function () {
                return this._tooltipService.isHidden;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TooltipReference.prototype, "isDisabled", {
            get: function () {
                return this._isDisabled;
            },
            enumerable: true,
            configurable: true
        });
        TooltipReference.prototype.show = function () {
            if (this._isDisabled) {
                return;
            }
            this._tooltipService.show({
                text: this._options.text,
                element: this._options.element,
                position: getTooltipPositionByReferenceNode(this._$reference, this._tooltipService.tooltipContainerNode),
            });
        };
        TooltipReference.prototype.hide = function () {
            this._tooltipService.hide();
        };
        TooltipReference.prototype.setText = function (text) {
            this._options.text = text;
            this._tooltipService.setText(text);
        };
        TooltipReference.prototype.disable = function () {
            this._isDisabled = true;
        };
        TooltipReference.prototype.enable = function () {
            this._isDisabled = false;
        };
        TooltipReference.prototype.destroy = function () {
            var _this = this;
            this._eventListeners.forEach(function (_a) {
                var event = _a.event, fn = _a.fn;
                _this._$reference.removeEventListener(event, fn);
            });
            this._eventListeners = null;
            this._$reference = null;
            this._tooltipService = null;
            this._options = null;
        };
        return TooltipReference;
    }());

    var css$12 = ".tooltip-container__tooltipContainer___2guVa {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin: 10px 10px 6px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAtY29udGFpbmVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxtQkFBbUI7RUFDbkIsT0FBTztFQUNQLFNBQVM7RUFDVCxVQUFVO0VBQ1YsUUFBUTtFQUNSLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2Qsc0JBQXNCLEVBQUUiLCJmaWxlIjoidG9vbHRpcC1jb250YWluZXIuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi50b29sdGlwQ29udGFpbmVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1hcmdpbjogMTBweCAxMHB4IDZweDsgfVxuIl19 */";
    var styles$12 = {"tooltipContainer":"tooltip-container__tooltipContainer___2guVa"};
    styleInject(css$12);

    var TooltipContainer = /** @class */ (function (_super) {
        __extends(TooltipContainer, _super);
        function TooltipContainer(tooltip) {
            var _this = _super.call(this) || this;
            _this._tooltip = tooltip;
            _this._initDOM();
            return _this;
        }
        Object.defineProperty(TooltipContainer.prototype, "node", {
            get: function () {
                return this._$node;
            },
            enumerable: true,
            configurable: true
        });
        TooltipContainer.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$19({
                styles: this.styleNames,
            }));
            this._$node.appendChild(this._tooltip.node);
        };
        TooltipContainer.prototype.getTooltipPositionStyles = function (position) {
            if (typeof position === 'function') {
                position = position(this._$node);
            }
            if (position.placement === ITooltipPositionPlacement.TOP) {
                return {
                    left: this._getTooltipLeftX(position.x) + "px",
                    top: 0,
                    bottom: 'initial',
                };
            }
            return {
                left: this._getTooltipLeftX(position.x) + "px",
                top: 'initial',
                bottom: 0,
            };
        };
        TooltipContainer.prototype.destroy = function () {
            this._tooltip = null;
            this._$node = null;
        };
        TooltipContainer.prototype._getTooltipLeftX = function (tooltipCenterX) {
            var tooltipRect = this._tooltip.node.getBoundingClientRect();
            var tooltipContainerRect = this._$node.getBoundingClientRect();
            var tooltipLeftX = tooltipCenterX - tooltipRect.width / 2;
            // ensure `x` is in range of placeholder rect
            tooltipLeftX = Math.max(tooltipLeftX, 0);
            tooltipLeftX = Math.min(tooltipLeftX, tooltipContainerRect.width - tooltipRect.width);
            return tooltipLeftX;
        };
        return TooltipContainer;
    }(Stylable));
    TooltipContainer.extendStyleNames(styles$12);

    var TooltipService = /** @class */ (function () {
        function TooltipService(_a) {
            var eventEmitter = _a.eventEmitter;
            this._eventEmitter = eventEmitter;
            this._tooltip = new Tooltip();
            this._tooltipContainer = new TooltipContainer(this._tooltip);
            this._bindEvents();
        }
        Object.defineProperty(TooltipService.prototype, "isHidden", {
            get: function () {
                return this._tooltip.isHidden;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TooltipService.prototype, "tooltipContainerNode", {
            get: function () {
                return this._tooltipContainer.node;
            },
            enumerable: true,
            configurable: true
        });
        TooltipService.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([[UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.hide]], this);
        };
        /**
         * Set new tooltip title
         */
        TooltipService.prototype.setText = function (text) {
            this._tooltip.setText(text);
        };
        /**
         * Show tooltip with title
         */
        TooltipService.prototype.show = function (options) {
            // NOTE: its important to set tooltip text before update tooltip position styles
            if (options.element) {
                this._tooltip.setElement(options.element);
            }
            else {
                this._tooltip.setText(options.text);
            }
            this._tooltip.setStyle(this._tooltipContainer.getTooltipPositionStyles(options.position));
            this._tooltip.show();
        };
        TooltipService.prototype.clearElement = function () {
            this._tooltip.clearElement();
        };
        /**
         * Hide tooltip
         */
        TooltipService.prototype.hide = function () {
            this._tooltip.hide();
        };
        /**
         * Create tooltip reference which show/hide tooltip on hover and focus events
         * @param reference - reference node
         * @param options - tooltip title and other options
         * @returns tooltip reference instance
         */
        TooltipService.prototype.createReference = function (reference, options) {
            return new TooltipReference(reference, this, options);
        };
        TooltipService.prototype.destroy = function () {
            this._unbindEvents();
            this._tooltip.destroy();
            this._tooltipContainer.destroy();
            this._tooltip = null;
            this._tooltipContainer = null;
            this._eventEmitter = null;
        };
        TooltipService.moduleName = 'tooltipService';
        TooltipService.dependencies = ['eventEmitter'];
        return TooltipService;
    }());

    function calcProgressTimeTooltipCenterX(progressPercent, progressNodeOffsetX, progressNodeWidth) {
        return progressNodeOffsetX + progressPercent * progressNodeWidth / 100;
    }
    function getProgressTimeTooltipPosition(progressPercent, progressNode, tooltipContainerNode) {
        return getTooltipPositionByReferenceNode(progressNode, tooltipContainerNode, function (progressNodeOffsetX, progressNodeWidth) {
            return calcProgressTimeTooltipCenterX(progressPercent, progressNodeOffsetX, progressNodeWidth);
        });
    }

    function anonymous$20(props
    /*``*/) {
    var out='<div data-hook="progress-control" class="'+(props.styles.seekBlock)+'" tabindex="0"> <div class="'+(props.styles.progressBarsWrapper)+'"> <div class="'+(props.styles.progressBar)+' '+(props.styles.background)+' '+(props.themeStyles.progressBackground)+'"> </div> <div data-hook="progress-buffered" class="'+(props.styles.progressBar)+' '+(props.styles.buffered)+'"> </div> <div data-hook="progress-seek-to" class="'+(props.styles.progressBar)+' '+(props.styles.seekTo)+' '+(props.themeStyles.progressSeekTo)+'"> </div> <div data-hook="progress-played" class="'+(props.styles.progressBar)+' '+(props.styles.played)+' '+(props.themeStyles.progressPlayed)+'"> </div> <div data-hook="progress-time-indicators" class="'+(props.styles.timeIndicators)+'"> </div> </div> <div data-hook="progress-hitbox" class="'+(props.styles.hitbox)+'"> </div> <div data-hook="progress-seek-button" class="'+(props.styles.seekButton)+' '+(props.themeStyles.progressSeekBtn)+'"> </div> <div data-hook="progress-sync-button" class="'+(props.styles.syncButton)+' '+(props.themeStyles.progressSyncBtn)+'"> </div></div>';return out;
    }

    function anonymous$21(props
    /*``*/) {
    var out='<div class="'+(props.styles.timeIndicator)+'" style="left: '+(props.percent)+'%"></div>';return out;
    }

    var progressViewTheme = {
        progressPlayed: {
            backgroundColor: function (data) { return data.progressColor; },
        },
        progressSeekTo: {
            backgroundColor: function (data) {
                return transperentizeColor(data.progressColor, 0.5);
            },
        },
        progressBackground: {
            backgroundColor: function (data) {
                return transperentizeColor(data.progressColor, 0.25);
            },
        },
        progressSeekBtn: {
            backgroundColor: function (data) { return data.progressColor; },
        },
        progressSyncBtn: {
            borderColor: function (data) { return data.progressColor; },
        },
    };

    var css$13 = ".progress__controlButton___2pi4V {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .progress__controlButton___2pi4V:hover {\n    opacity: .7; }\n  .progress__hidden___3Rjqh {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .progress__seekBlock___V4YqW {\n  position: relative;\n  display: block;\n  width: 100%;\n  height: 6px;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  -ms-touch-action: none;\n      touch-action: none; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__seekBlock___V4YqW {\n    height: 8px; }\n  .progress__seekBlock___V4YqW.progress__inLive___3324R .progress__played___1dShL {\n    background-color: #ea492e; }\n  .progress__seekBlock___V4YqW.progress__inLive___3324R .progress__seekTo___T0D_O {\n    background-color: rgba(234, 73, 46, 0.5); }\n  .progress__seekBlock___V4YqW.progress__inLive___3324R .progress__syncButton___3N1QN {\n    display: initial; }\n  .progress__seekBlock___V4YqW:hover .progress__progressBarsWrapper___1SSlL, .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__progressBarsWrapper___1SSlL {\n    -webkit-transform: scaleY(1);\n            transform: scaleY(1); }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__seekBlock___V4YqW:hover .progress__progressBarsWrapper___1SSlL, div[data-hook='player-container'][data-in-full-screen='true'] .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__progressBarsWrapper___1SSlL {\n      -webkit-transform: scaleY(1);\n              transform: scaleY(1); }\n  .progress__seekBlock___V4YqW:hover .progress__progressBarsWrapper___1SSlL .progress__seekTo___T0D_O, .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__progressBarsWrapper___1SSlL .progress__seekTo___T0D_O {\n      opacity: 1; }\n  .progress__seekBlock___V4YqW:hover .progress__progressBarsWrapper___1SSlL .progress__timeIndicator___2wltB:after, .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__progressBarsWrapper___1SSlL .progress__timeIndicator___2wltB:after {\n      -webkit-transform: scale(1);\n              transform: scale(1); }\n  .progress__seekBlock___V4YqW:hover .progress__seekButton___3UtgF, .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__seekButton___3UtgF {\n    -webkit-transform: scale(1);\n            transform: scale(1); }\n  .progress__seekBlock___V4YqW:hover .progress__syncButton___3N1QN, .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__syncButton___3N1QN {\n    -webkit-transform: scale(1.4);\n            transform: scale(1.4); }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__seekBlock___V4YqW:hover .progress__syncButton___3N1QN, div[data-hook='player-container'][data-in-full-screen='true'] .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__syncButton___3N1QN {\n      -webkit-transform: scale(1.33);\n              transform: scale(1.33); }\n  .progress__seekBlock___V4YqW:hover .progress__syncButton___3N1QN.progress__liveSync___PIvwF, .progress__seekBlock___V4YqW.progress__isDragging___2Tcb5 .progress__syncButton___3N1QN.progress__liveSync___PIvwF {\n      background-color: #fff; }\n  .progress__seekButton___3UtgF {\n  position: absolute;\n  z-index: 7;\n  top: -3px;\n  left: 0;\n  width: 12px;\n  height: 12px;\n  margin-left: -6px;\n  content: '';\n  cursor: pointer;\n  -webkit-transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  -webkit-transform: scale(0);\n          transform: scale(0);\n  border-radius: 50%;\n  background-color: #fff; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__seekButton___3UtgF {\n    top: -4px;\n    left: 0;\n    width: 16px;\n    height: 16px;\n    margin-left: -8px; }\n  .progress__syncButton___3N1QN {\n  position: absolute;\n  z-index: 6;\n  top: -2px;\n  right: -5px;\n  display: none;\n  width: 6px;\n  height: 6px;\n  cursor: pointer;\n  -webkit-transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  border: 2px solid #bababa;\n  border-radius: 50%;\n  background-color: #ea492e; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__syncButton___3N1QN {\n    top: -2px;\n    right: -6px;\n    width: 8px;\n    height: 8px; }\n  .progress__syncButton___3N1QN:hover {\n    background-color: #fff; }\n  .progress__syncButton___3N1QN.progress__hidden___3Rjqh {\n    display: none; }\n  .progress__progressBarsWrapper___1SSlL {\n  height: 6px;\n  -webkit-transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n  -webkit-transform: scaleY(0.34);\n          transform: scaleY(0.34); }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__progressBarsWrapper___1SSlL {\n    height: 8px;\n    -webkit-transform: scaleY(0.25);\n            transform: scaleY(0.25); }\n  .progress__progressBar___210E8 {\n  position: absolute;\n  height: 6px;\n  padding: 0; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__progressBar___210E8 {\n    height: 8px; }\n  .progress__played___1dShL {\n  background-color: #fff; }\n  .progress__buffered___2LiZB {\n  -webkit-transition: width .2s ease;\n  transition: width .2s ease;\n  background-color: rgba(255, 255, 255, 0.25); }\n  .progress__background___lqeL2 {\n  width: 100%; }\n  .progress__seekTo___T0D_O {\n  -webkit-transition: opacity .2s;\n  transition: opacity .2s;\n  background-color: rgba(255, 255, 255, 0.5); }\n  .progress__timeIndicators___c6h-a {\n  position: absolute;\n  overflow-x: hidden;\n  width: 100%;\n  height: 100%;\n  background-color: transparent; }\n  .progress__timeIndicator___2wltB {\n  position: absolute; }\n  .progress__timeIndicator___2wltB:after {\n    position: absolute;\n    right: -3px;\n    width: 6px;\n    height: 6px;\n    content: '';\n    -webkit-transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n    transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n    transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n    transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);\n    -webkit-transform: scale(0);\n            transform: scale(0);\n    opacity: .6;\n    border-radius: 50%;\n    background-color: #fff; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .progress__timeIndicator___2wltB:after {\n      right: -4px;\n      width: 8px;\n      height: 8px; }\n  .progress__timeIndicator___2wltB:after:hover {\n      opacity: 1; }\n  .progress__hitbox___xqdFP {\n  position: relative;\n  z-index: 5;\n  top: -11px;\n  display: block;\n  width: 100%;\n  height: 16px;\n  cursor: pointer;\n  opacity: 0; }\n  [data-focus-source='key'] [data-hook='progress-control'].focus-within,\n[data-focus-source='script'] [data-hook='progress-control'].focus-within {\n  opacity: 1;\n  -webkit-box-shadow: 0 0 0 2px rgba(56, 153, 236, 0.8);\n          box-shadow: 0 0 0 2px rgba(56, 153, 236, 0.8); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2dyZXNzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixxQ0FBNkI7RUFBN0IsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLDhCQUE4QjtFQUM5QixvQkFBb0I7RUFDcEIsd0JBQXdCO0VBQ3hCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixzQkFBc0IsRUFBRTtFQUUxQjtFQUNFLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsWUFBWTtFQUNaLFlBQVk7RUFDWiwwQkFBa0I7S0FBbEIsdUJBQWtCO01BQWxCLHNCQUFrQjtVQUFsQixrQkFBa0I7RUFDbEIsZ0RBQXdDO0VBQXhDLHdDQUF3QztFQUN4Qyx1QkFBbUI7TUFBbkIsbUJBQW1CLEVBQUU7RUFDckI7SUFDRSxZQUFZLEVBQUU7RUFDaEI7SUFDRSwwQkFBMEIsRUFBRTtFQUM5QjtJQUNFLHlDQUF5QyxFQUFFO0VBQzdDO0lBQ0UsaUJBQWlCLEVBQUU7RUFDckI7SUFDRSw2QkFBcUI7WUFBckIscUJBQXFCLEVBQUU7RUFDdkI7TUFDRSw2QkFBcUI7Y0FBckIscUJBQXFCLEVBQUU7RUFDekI7TUFDRSxXQUFXLEVBQUU7RUFDZjtNQUNFLDRCQUFvQjtjQUFwQixvQkFBb0IsRUFBRTtFQUMxQjtJQUNFLDRCQUFvQjtZQUFwQixvQkFBb0IsRUFBRTtFQUN4QjtJQUNFLDhCQUFzQjtZQUF0QixzQkFBc0IsRUFBRTtFQUN4QjtNQUNFLCtCQUF1QjtjQUF2Qix1QkFBdUIsRUFBRTtFQUMzQjtNQUNFLHVCQUF1QixFQUFFO0VBRS9CO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxVQUFVO0VBQ1YsUUFBUTtFQUNSLFlBQVk7RUFDWixhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsc0VBQXNEO0VBQXRELDhEQUFzRDtFQUF0RCxzREFBc0Q7RUFBdEQseUdBQXNEO0VBQ3RELDRCQUFvQjtVQUFwQixvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLHVCQUF1QixFQUFFO0VBQ3pCO0lBQ0UsVUFBVTtJQUNWLFFBQVE7SUFDUixZQUFZO0lBQ1osYUFBYTtJQUNiLGtCQUFrQixFQUFFO0VBRXhCO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxVQUFVO0VBQ1YsWUFBWTtFQUNaLGNBQWM7RUFDZCxXQUFXO0VBQ1gsWUFBWTtFQUNaLGdCQUFnQjtFQUNoQixzRUFBc0Q7RUFBdEQsOERBQXNEO0VBQXRELHNEQUFzRDtFQUF0RCx5R0FBc0Q7RUFDdEQsMEJBQTBCO0VBQzFCLG1CQUFtQjtFQUNuQiwwQkFBMEIsRUFBRTtFQUM1QjtJQUNFLFVBQVU7SUFDVixZQUFZO0lBQ1osV0FBVztJQUNYLFlBQVksRUFBRTtFQUNoQjtJQUNFLHVCQUF1QixFQUFFO0VBQzNCO0lBQ0UsY0FBYyxFQUFFO0VBRXBCO0VBQ0UsWUFBWTtFQUNaLHNFQUFzRDtFQUF0RCw4REFBc0Q7RUFBdEQsc0RBQXNEO0VBQXRELHlHQUFzRDtFQUN0RCxnQ0FBd0I7VUFBeEIsd0JBQXdCLEVBQUU7RUFDMUI7SUFDRSxZQUFZO0lBQ1osZ0NBQXdCO1lBQXhCLHdCQUF3QixFQUFFO0VBRTlCO0VBQ0UsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixXQUFXLEVBQUU7RUFDYjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLHVCQUF1QixFQUFFO0VBRTNCO0VBQ0UsbUNBQTJCO0VBQTNCLDJCQUEyQjtFQUMzQiw0Q0FBNEMsRUFBRTtFQUVoRDtFQUNFLFlBQVksRUFBRTtFQUVoQjtFQUNFLGdDQUF3QjtFQUF4Qix3QkFBd0I7RUFDeEIsMkNBQTJDLEVBQUU7RUFFL0M7RUFDRSxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixhQUFhO0VBQ2IsOEJBQThCLEVBQUU7RUFFbEM7RUFDRSxtQkFBbUIsRUFBRTtFQUNyQjtJQUNFLG1CQUFtQjtJQUNuQixZQUFZO0lBQ1osV0FBVztJQUNYLFlBQVk7SUFDWixZQUFZO0lBQ1osc0VBQXNEO0lBQXRELDhEQUFzRDtJQUF0RCxzREFBc0Q7SUFBdEQseUdBQXNEO0lBQ3RELDRCQUFvQjtZQUFwQixvQkFBb0I7SUFDcEIsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQix1QkFBdUIsRUFBRTtFQUN6QjtNQUNFLFlBQVk7TUFDWixXQUFXO01BQ1gsWUFBWSxFQUFFO0VBQ2hCO01BQ0UsV0FBVyxFQUFFO0VBRW5CO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxXQUFXO0VBQ1gsZUFBZTtFQUNmLFlBQVk7RUFDWixhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLFdBQVcsRUFBRTtFQUVmOztFQUVFLFdBQVc7RUFDWCxzREFBOEM7VUFBOUMsOENBQThDLEVBQUUiLCJmaWxlIjoicHJvZ3Jlc3Muc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250cm9sQnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAuMnM7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG4gIG9wYWNpdHk6IDE7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4gIC5jb250cm9sQnV0dG9uOmhvdmVyIHtcbiAgICBvcGFjaXR5OiAuNzsgfVxuXG4uaGlkZGVuIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuICFpbXBvcnRhbnQ7XG4gIHdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWluLWhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICBvcGFjaXR5OiAwICFpbXBvcnRhbnQ7IH1cblxuLnNlZWtCbG9jayB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDZweDtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzLCB2aXNpYmlsaXR5IC4ycztcbiAgdG91Y2gtYWN0aW9uOiBub25lOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnNlZWtCbG9jayB7XG4gICAgaGVpZ2h0OiA4cHg7IH1cbiAgLnNlZWtCbG9jay5pbkxpdmUgLnBsYXllZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VhNDkyZTsgfVxuICAuc2Vla0Jsb2NrLmluTGl2ZSAuc2Vla1RvIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzNCwgNzMsIDQ2LCAwLjUpOyB9XG4gIC5zZWVrQmxvY2suaW5MaXZlIC5zeW5jQnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbml0aWFsOyB9XG4gIC5zZWVrQmxvY2s6aG92ZXIgLnByb2dyZXNzQmFyc1dyYXBwZXIsIC5zZWVrQmxvY2suaXNEcmFnZ2luZyAucHJvZ3Jlc3NCYXJzV3JhcHBlciB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7IH1cbiAgICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5zZWVrQmxvY2s6aG92ZXIgLnByb2dyZXNzQmFyc1dyYXBwZXIsIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnNlZWtCbG9jay5pc0RyYWdnaW5nIC5wcm9ncmVzc0JhcnNXcmFwcGVyIHtcbiAgICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpOyB9XG4gICAgLnNlZWtCbG9jazpob3ZlciAucHJvZ3Jlc3NCYXJzV3JhcHBlciAuc2Vla1RvLCAuc2Vla0Jsb2NrLmlzRHJhZ2dpbmcgLnByb2dyZXNzQmFyc1dyYXBwZXIgLnNlZWtUbyB7XG4gICAgICBvcGFjaXR5OiAxOyB9XG4gICAgLnNlZWtCbG9jazpob3ZlciAucHJvZ3Jlc3NCYXJzV3JhcHBlciAudGltZUluZGljYXRvcjphZnRlciwgLnNlZWtCbG9jay5pc0RyYWdnaW5nIC5wcm9ncmVzc0JhcnNXcmFwcGVyIC50aW1lSW5kaWNhdG9yOmFmdGVyIHtcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7IH1cbiAgLnNlZWtCbG9jazpob3ZlciAuc2Vla0J1dHRvbiwgLnNlZWtCbG9jay5pc0RyYWdnaW5nIC5zZWVrQnV0dG9uIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpOyB9XG4gIC5zZWVrQmxvY2s6aG92ZXIgLnN5bmNCdXR0b24sIC5zZWVrQmxvY2suaXNEcmFnZ2luZyAuc3luY0J1dHRvbiB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjQpOyB9XG4gICAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAuc2Vla0Jsb2NrOmhvdmVyIC5zeW5jQnV0dG9uLCBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5zZWVrQmxvY2suaXNEcmFnZ2luZyAuc3luY0J1dHRvbiB7XG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMzMpOyB9XG4gICAgLnNlZWtCbG9jazpob3ZlciAuc3luY0J1dHRvbi5saXZlU3luYywgLnNlZWtCbG9jay5pc0RyYWdnaW5nIC5zeW5jQnV0dG9uLmxpdmVTeW5jIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7IH1cblxuLnNlZWtCdXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDc7XG4gIHRvcDogLTNweDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEycHg7XG4gIGhlaWdodDogMTJweDtcbiAgbWFyZ2luLWxlZnQ6IC02cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xuICB0cmFuc2Zvcm06IHNjYWxlKDApO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAuc2Vla0J1dHRvbiB7XG4gICAgdG9wOiAtNHB4O1xuICAgIGxlZnQ6IDA7XG4gICAgd2lkdGg6IDE2cHg7XG4gICAgaGVpZ2h0OiAxNnB4O1xuICAgIG1hcmdpbi1sZWZ0OiAtOHB4OyB9XG5cbi5zeW5jQnV0dG9uIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA2O1xuICB0b3A6IC0ycHg7XG4gIHJpZ2h0OiAtNXB4O1xuICBkaXNwbGF5OiBub25lO1xuICB3aWR0aDogNnB4O1xuICBoZWlnaHQ6IDZweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcbiAgYm9yZGVyOiAycHggc29saWQgI2JhYmFiYTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWE0OTJlOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnN5bmNCdXR0b24ge1xuICAgIHRvcDogLTJweDtcbiAgICByaWdodDogLTZweDtcbiAgICB3aWR0aDogOHB4O1xuICAgIGhlaWdodDogOHB4OyB9XG4gIC5zeW5jQnV0dG9uOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOyB9XG4gIC5zeW5jQnV0dG9uLmhpZGRlbiB7XG4gICAgZGlzcGxheTogbm9uZTsgfVxuXG4ucHJvZ3Jlc3NCYXJzV3JhcHBlciB7XG4gIGhlaWdodDogNnB4O1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcbiAgdHJhbnNmb3JtOiBzY2FsZVkoMC4zNCk7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAucHJvZ3Jlc3NCYXJzV3JhcHBlciB7XG4gICAgaGVpZ2h0OiA4cHg7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC4yNSk7IH1cblxuLnByb2dyZXNzQmFyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBoZWlnaHQ6IDZweDtcbiAgcGFkZGluZzogMDsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5wcm9ncmVzc0JhciB7XG4gICAgaGVpZ2h0OiA4cHg7IH1cblxuLnBsYXllZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7IH1cblxuLmJ1ZmZlcmVkIHtcbiAgdHJhbnNpdGlvbjogd2lkdGggLjJzIGVhc2U7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yNSk7IH1cblxuLmJhY2tncm91bmQge1xuICB3aWR0aDogMTAwJTsgfVxuXG4uc2Vla1RvIHtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMnM7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTsgfVxuXG4udGltZUluZGljYXRvcnMge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IH1cblxuLnRpbWVJbmRpY2F0b3Ige1xuICBwb3NpdGlvbjogYWJzb2x1dGU7IH1cbiAgLnRpbWVJbmRpY2F0b3I6YWZ0ZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogLTNweDtcbiAgICB3aWR0aDogNnB4O1xuICAgIGhlaWdodDogNnB4O1xuICAgIGNvbnRlbnQ6ICcnO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XG4gICAgb3BhY2l0eTogLjY7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7IH1cbiAgICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC50aW1lSW5kaWNhdG9yOmFmdGVyIHtcbiAgICAgIHJpZ2h0OiAtNHB4O1xuICAgICAgd2lkdGg6IDhweDtcbiAgICAgIGhlaWdodDogOHB4OyB9XG4gICAgLnRpbWVJbmRpY2F0b3I6YWZ0ZXI6aG92ZXIge1xuICAgICAgb3BhY2l0eTogMTsgfVxuXG4uaGl0Ym94IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiA1O1xuICB0b3A6IC0xMXB4O1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTZweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBvcGFjaXR5OiAwOyB9XG5cbjpnbG9iYWwgW2RhdGEtZm9jdXMtc291cmNlPSdrZXknXSBbZGF0YS1ob29rPSdwcm9ncmVzcy1jb250cm9sJ10uZm9jdXMtd2l0aGluLFxuOmdsb2JhbCBbZGF0YS1mb2N1cy1zb3VyY2U9J3NjcmlwdCddIFtkYXRhLWhvb2s9J3Byb2dyZXNzLWNvbnRyb2wnXS5mb2N1cy13aXRoaW4ge1xuICBvcGFjaXR5OiAxO1xuICBib3gtc2hhZG93OiAwIDAgMCAycHggcmdiYSg1NiwgMTUzLCAyMzYsIDAuOCk7IH1cbiJdfQ== */";
    var styles$13 = {"controlButton":"progress__controlButton___2pi4V","hidden":"progress__hidden___3Rjqh","seekBlock":"progress__seekBlock___V4YqW","inLive":"progress__inLive___3324R","played":"progress__played___1dShL","seekTo":"progress__seekTo___T0D_O","syncButton":"progress__syncButton___3N1QN","progressBarsWrapper":"progress__progressBarsWrapper___1SSlL","isDragging":"progress__isDragging___2Tcb5","timeIndicator":"progress__timeIndicator___2wltB","seekButton":"progress__seekButton___3UtgF","liveSync":"progress__liveSync___PIvwF","progressBar":"progress__progressBar___210E8","buffered":"progress__buffered___2LiZB","background":"progress__background___lqeL2","timeIndicators":"progress__timeIndicators___c6h-a","hitbox":"progress__hitbox___xqdFP"};
    styleInject(css$13);

    var DATA_PLAYED = 'data-played-percent';
    var getPercentBasedOnXPosition = function (event, element) {
        var boundingRect = element.getBoundingClientRect();
        var positionX = event.clientX;
        if (positionX < boundingRect.left) {
            return 0;
        }
        if (positionX > boundingRect.left + boundingRect.width) {
            return 100;
        }
        return (event.clientX - boundingRect.left) / boundingRect.width * 100;
    };
    var ProgressView = /** @class */ (function (_super) {
        __extends(ProgressView, _super);
        function ProgressView(config) {
            var _this = this;
            var callbacks = config.callbacks, textMap = config.textMap, tooltipService = config.tooltipService, theme = config.theme, thumbnails = config.thumbnails;
            _this = _super.call(this, theme) || this;
            _this._callbacks = callbacks;
            _this._textMap = textMap;
            _this._tooltipService = tooltipService;
            _this._thumbnails = thumbnails;
            _this._initDOM();
            _this._bindCallbacks();
            _this._bindEvents();
            _this._setPlayedDOMAttributes(0);
            _this._setBufferedDOMAttributes(0);
            _this.setUsualMode();
            return _this;
        }
        ProgressView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$20({
                styles: this.styleNames,
                themeStyles: this.themeStyles,
            }));
            this._$played = getElementByHook(this._$node, 'progress-played');
            this._$buffered = getElementByHook(this._$node, 'progress-buffered');
            this._$seekTo = getElementByHook(this._$node, 'progress-seek-to');
            this._$timeIndicators = getElementByHook(this._$node, 'progress-time-indicators');
            this._$seekButton = getElementByHook(this._$node, 'progress-seek-button');
            this._$syncButton = getElementByHook(this._$node, 'progress-sync-button');
            this._syncButtonTooltipReference = this._tooltipService.createReference(this._$syncButton, {
                text: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
            });
            this._$hitbox = getElementByHook(this._$node, 'progress-hitbox');
        };
        ProgressView.prototype._bindCallbacks = function () {
            this._setPlayedByDrag = this._setPlayedByDrag.bind(this);
            this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
            this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
            this._startSeekToByMouse = this._startSeekToByMouse.bind(this);
            this._stopSeekToByMouse = this._stopSeekToByMouse.bind(this);
            this._syncWithLive = this._syncWithLive.bind(this);
        };
        ProgressView.prototype._bindEvents = function () {
            this._$seekButton.addEventListener('mousedown', this._startDragOnMouseDown);
            this._$seekButton.addEventListener('mousemove', this._startSeekToByMouse);
            this._$seekButton.addEventListener('mouseout', this._stopSeekToByMouse);
            this._$hitbox.addEventListener('mousedown', this._startDragOnMouseDown);
            this._$hitbox.addEventListener('mousemove', this._startSeekToByMouse);
            this._$hitbox.addEventListener('mouseout', this._stopSeekToByMouse);
            window.addEventListener('mousemove', this._setPlayedByDrag);
            window.addEventListener('mouseup', this._stopDragOnMouseUp);
            this._$syncButton.addEventListener('click', this._syncWithLive);
            this._$syncButton.addEventListener('mouseenter', this._callbacks.onSyncWithLiveMouseEnter);
            this._$syncButton.addEventListener('mouseleave', this._callbacks.onSyncWithLiveMouseLeave);
        };
        ProgressView.prototype._unbindEvents = function () {
            this._$seekButton.removeEventListener('mousedown', this._startDragOnMouseDown);
            this._$seekButton.removeEventListener('mousemove', this._startSeekToByMouse);
            this._$seekButton.removeEventListener('mouseout', this._stopSeekToByMouse);
            this._$hitbox.removeEventListener('mousedown', this._startDragOnMouseDown);
            this._$hitbox.removeEventListener('mousemove', this._startSeekToByMouse);
            this._$hitbox.removeEventListener('mouseout', this._stopSeekToByMouse);
            window.removeEventListener('mousemove', this._setPlayedByDrag);
            window.removeEventListener('mouseup', this._stopDragOnMouseUp);
            this._$syncButton.removeEventListener('click', this._syncWithLive);
            this._$syncButton.removeEventListener('mouseenter', this._callbacks.onSyncWithLiveMouseEnter);
            this._$syncButton.removeEventListener('mouseleave', this._callbacks.onSyncWithLiveMouseLeave);
        };
        ProgressView.prototype._startDragOnMouseDown = function (event) {
            if (event.button > 1) {
                return;
            }
            var percent = getPercentBasedOnXPosition(event, this._$hitbox);
            this._setPlayedDOMAttributes(percent);
            this._callbacks.onChangePlayedProgress(percent);
            this._startDrag();
        };
        ProgressView.prototype._stopDragOnMouseUp = function (event) {
            if (event.button > 1) {
                return;
            }
            this._stopDrag();
        };
        ProgressView.prototype._startSeekToByMouse = function (event) {
            var percent = getPercentBasedOnXPosition(event, this._$hitbox);
            this._setSeekToDOMAttributes(percent);
            this._thumbnails.showAtPercent(percent);
            this._callbacks.onSeekToByMouseStart(percent);
        };
        ProgressView.prototype._stopSeekToByMouse = function () {
            this._setSeekToDOMAttributes(0);
            this._thumbnails.clear();
            this._callbacks.onSeekToByMouseEnd();
        };
        ProgressView.prototype._setPlayedByDrag = function (event) {
            if (this._isDragging) {
                var percent = getPercentBasedOnXPosition(event, this._$hitbox);
                this._setPlayedDOMAttributes(percent);
                this._callbacks.onChangePlayedProgress(percent);
            }
        };
        ProgressView.prototype._startDrag = function () {
            this._isDragging = true;
            this._callbacks.onDragStart();
            this._$node.classList.add(this.styleNames.isDragging);
        };
        ProgressView.prototype._stopDrag = function () {
            if (this._isDragging) {
                this._isDragging = false;
                this._callbacks.onDragEnd();
                this._$node.classList.remove(this.styleNames.isDragging);
            }
        };
        ProgressView.prototype._setSeekToDOMAttributes = function (percent) {
            this._$seekTo.setAttribute('style', "width:" + percent + "%;");
        };
        ProgressView.prototype._setPlayedDOMAttributes = function (percent) {
            this._$node.setAttribute('aria-valuetext', this._textMap.get(TEXT_LABELS.PROGRESS_CONTROL_VALUE, { percent: percent }));
            this._$node.setAttribute('aria-valuenow', String(percent));
            this._$node.setAttribute(DATA_PLAYED, String(percent));
            this._$played.setAttribute('style', "width:" + percent + "%;");
            this._$seekButton.setAttribute('style', "left:" + percent + "%;");
        };
        ProgressView.prototype._setBufferedDOMAttributes = function (percent) {
            this._$buffered.setAttribute('style', "width:" + percent + "%;");
        };
        ProgressView.prototype._syncWithLive = function () {
            this._callbacks.onSyncWithLiveClick();
        };
        ProgressView.prototype.showSyncWithLive = function () {
            this._$syncButton.classList.remove(this.styleNames.hidden);
        };
        ProgressView.prototype.hideSyncWithLive = function () {
            this._$syncButton.classList.add(this.styleNames.hidden);
        };
        ProgressView.prototype.setLiveSyncStatus = function (isSync) {
            toggleNodeClass(this._$syncButton, this.styleNames.liveSync, isSync);
            if (isSync) {
                this._syncButtonTooltipReference.disable();
                this._$played.setAttribute('style', "width:100%;");
                this._$seekButton.setAttribute('style', "left:100%;");
            }
            else {
                this._syncButtonTooltipReference.enable();
            }
        };
        ProgressView.prototype.showProgressTimeTooltip = function (_a) {
            var _this = this;
            var time = _a.time, percent = _a.percent;
            this._thumbnails.setTime(formatTime(time));
            this._tooltipService.show({
                //text: formatTime(time),
                element: this._thumbnails.node,
                position: function (tooltipContainerNode) {
                    return getProgressTimeTooltipPosition(percent, _this._$hitbox, tooltipContainerNode);
                },
            });
        };
        ProgressView.prototype.hideProgressTimeTooltip = function () {
            this._tooltipService.hide();
        };
        ProgressView.prototype.setLiveMode = function () {
            this._$node.classList.add(this.styleNames.inLive);
            this.showSyncWithLive();
        };
        ProgressView.prototype.setUsualMode = function () {
            this._$node.classList.remove(this.styleNames.inLive);
            this.hideSyncWithLive();
        };
        ProgressView.prototype.setPlayed = function (percent) {
            this._setPlayedDOMAttributes(percent);
        };
        ProgressView.prototype.setBuffered = function (percent) {
            this._setBufferedDOMAttributes(percent);
        };
        ProgressView.prototype.addTimeIndicator = function (percent) {
            this._$timeIndicators.appendChild(htmlToElement(anonymous$21({
                percent: percent,
                styles: this.styleNames,
            })));
        };
        ProgressView.prototype.clearTimeIndicators = function () {
            this._$timeIndicators.innerHTML = '';
        };
        ProgressView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        ProgressView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        ProgressView.prototype.getNode = function () {
            return this._$node;
        };
        ProgressView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            this._syncButtonTooltipReference.destroy();
            this._syncButtonTooltipReference = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$buffered = null;
            this._$hitbox = null;
            this._$played = null;
            this._$seekTo = null;
            this._$seekButton = null;
            this._$syncButton = null;
            this._$timeIndicators = null;
            this._textMap = null;
        };
        return ProgressView;
    }(View));
    ProgressView.setTheme(progressViewTheme);
    ProgressView.extendStyleNames(styles$13);

    function getTimePercent(time, durationTime) {
        if (!durationTime) {
            return 0;
        }
        return parseFloat((time / durationTime * 100).toFixed(1));
    }
    function getOverallBufferedPercent(buffered, currentTime, duration) {
        if (currentTime === void 0) { currentTime = 0; }
        if (duration === void 0) { duration = 0; }
        if (!buffered || !buffered.length || !duration) {
            return 0;
        }
        var info = getNearestBufferSegmentInfo(buffered, currentTime);
        return getTimePercent(info.end, duration);
    }
    function getOverallPlayedPercent(currentTime, duration) {
        if (currentTime === void 0) { currentTime = 0; }
        if (duration === void 0) { duration = 0; }
        return getTimePercent(currentTime, duration);
    }
    function geOverallBufferLength(buffered) {
        var size = 0;
        if (!buffered || !buffered.length) {
            return size;
        }
        for (var i = 0; i < buffered.length; i += 1) {
            size += buffered.end(i) - buffered.start(i);
        }
        return size;
    }
    function getNearestBufferSegmentInfo(buffered, currentTime) {
        var i = 0;
        if (!buffered || !buffered.length) {
            return null;
        }
        while (i < buffered.length - 1 &&
            !(buffered.start(i) <= currentTime && currentTime <= buffered.end(i))) {
            i += 1;
        }
        return {
            start: buffered.start(i),
            end: buffered.end(i),
        };
    }

    var UPDATE_INTERVAL_DELAY = 1000 / 60;
    var ProgressControl = /** @class */ (function () {
        function ProgressControl(_a) {
            var engine = _a.engine, liveStateEngine = _a.liveStateEngine, eventEmitter = _a.eventEmitter, textMap = _a.textMap, tooltipService = _a.tooltipService, theme = _a.theme, thumbnails = _a.thumbnails;
            this._engine = engine;
            this._liveStateEngine = liveStateEngine;
            this._eventEmitter = eventEmitter;
            this._textMap = textMap;
            this._tooltipService = tooltipService;
            this._thumbnails = thumbnails;
            this._isUserInteracting = false;
            this._currentProgress = 0;
            this._theme = theme;
            this._timeIndicatorsToAdd = [];
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
            this.view.setPlayed(0);
            this.view.setBuffered(0);
            this._initInterceptor();
        }
        Object.defineProperty(ProgressControl.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        ProgressControl.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.STATE_CHANGED, this._processStateChange],
                [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processLiveStateChange],
                [VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator],
                [VIDEO_EVENTS.DURATION_UPDATED, this._updateAllIndicators],
            ], this);
        };
        ProgressControl.prototype._initUI = function () {
            var config = {
                callbacks: {
                    onSyncWithLiveClick: this._syncWithLive,
                    onSyncWithLiveMouseEnter: this._onSyncWithLiveMouseEnter,
                    onSyncWithLiveMouseLeave: this._onSyncWithLiveMouseLeave,
                    onChangePlayedProgress: this._changePlayedProgress,
                    onSeekToByMouseStart: this._onSeekToByMouseStart,
                    onSeekToByMouseEnd: this._onSeekToByMouseEnd,
                    onDragStart: this._onUserInteractionStarts,
                    onDragEnd: this._onUserInteractionEnds,
                },
                thumbnails: this._thumbnails,
                theme: this._theme,
                textMap: this._textMap,
                tooltipService: this._tooltipService,
            };
            this.view = new ProgressControl.View(config);
        };
        ProgressControl.prototype._initInterceptor = function () {
            var _this = this;
            this._interceptor = new KeyboardInterceptorCore(this.view.getNode(), (_a = {}, _a[KEYCODES.UP_ARROW] = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
                }, _a[KEYCODES.DOWN_ARROW] = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
                }, _a[KEYCODES.RIGHT_ARROW] = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
                }, _a[KEYCODES.LEFT_ARROW] = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
                }, _a));
            var _a;
        };
        ProgressControl.prototype._destroyInterceptor = function () {
            this._interceptor.destroy();
        };
        ProgressControl.prototype._bindCallbacks = function () {
            this._syncWithLive = this._syncWithLive.bind(this);
            this._onSyncWithLiveMouseEnter = this._onSyncWithLiveMouseEnter.bind(this);
            this._onSyncWithLiveMouseLeave = this._onSyncWithLiveMouseLeave.bind(this);
            this._updateControlOnInterval = this._updateControlOnInterval.bind(this);
            this._changePlayedProgress = this._changePlayedProgress.bind(this);
            this._onSeekToByMouseStart = this._onSeekToByMouseStart.bind(this);
            this._onSeekToByMouseEnd = this._onSeekToByMouseEnd.bind(this);
            this._onUserInteractionStarts = this._onUserInteractionStarts.bind(this);
            this._onUserInteractionEnds = this._onUserInteractionEnds.bind(this);
            this._processStateChange = this._processStateChange.bind(this);
            this._playVideoOnProgressManipulationEnd = this._playVideoOnProgressManipulationEnd.bind(this);
        };
        ProgressControl.prototype._changePlayedProgress = function (value) {
            if (this._currentProgress === value) {
                return;
            }
            this._currentProgress = value;
            this._changeCurrentTimeOfVideo(value / 100);
        };
        ProgressControl.prototype._startIntervalUpdates = function () {
            if (this._updateControlInterval) {
                this._stopIntervalUpdates();
            }
            this._updateControlOnInterval();
            this._updateControlInterval = window.setInterval(this._updateControlOnInterval, UPDATE_INTERVAL_DELAY);
        };
        ProgressControl.prototype._onSeekToByMouseStart = function (percent) {
            var durationTime = this._engine.getDurationTime();
            var seekTime = durationTime * percent / 100;
            var time = this._engine.isDynamicContent
                ? seekTime - durationTime
                : seekTime;
            this.view.showProgressTimeTooltip({ time: time, percent: percent });
        };
        ProgressControl.prototype._onSeekToByMouseEnd = function () {
            this.view.hideProgressTimeTooltip();
        };
        ProgressControl.prototype._stopIntervalUpdates = function () {
            window.clearInterval(this._updateControlInterval);
            this._updateControlInterval = null;
        };
        ProgressControl.prototype._onUserInteractionStarts = function () {
            if (!this._isUserInteracting) {
                this._isUserInteracting = true;
                this._pauseVideoOnProgressManipulationStart();
            }
            this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_START);
        };
        ProgressControl.prototype._onUserInteractionEnds = function () {
            if (this._isUserInteracting) {
                this._isUserInteracting = false;
                this._playVideoOnProgressManipulationEnd();
            }
            this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_END);
        };
        ProgressControl.prototype._updateControlOnInterval = function () {
            this._updatePlayedIndicator();
            this._updateBufferIndicator();
        };
        ProgressControl.prototype._processStateChange = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case EngineState$1.SRC_SET:
                    this.reset();
                    break;
                case EngineState$1.METADATA_LOADED:
                    this._initTimeIndicators();
                    if (this._engine.isSeekAvailable) {
                        this.show();
                    }
                    else {
                        this.hide();
                    }
                    break;
                case EngineState$1.PLAYING:
                    if (this._liveStateEngine.state === LiveState$1.SYNC) {
                        this.view.setPlayed(100);
                    }
                    else {
                        this._startIntervalUpdates();
                    }
                    break;
                case EngineState$1.SEEK_IN_PROGRESS:
                    this._updatePlayedIndicator();
                    this._updateBufferIndicator();
                    break;
                default:
                    this._stopIntervalUpdates();
                    break;
            }
        };
        ProgressControl.prototype._processLiveStateChange = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case LiveState$1.NONE:
                    this.view.setLiveSyncStatus(false);
                    this.view.setUsualMode();
                    break;
                case LiveState$1.INITIAL:
                    this.view.setLiveMode();
                    break;
                case LiveState$1.SYNC:
                    this.view.setLiveSyncStatus(true);
                    break;
                case LiveState$1.NOT_SYNC:
                    this.view.setLiveSyncStatus(false);
                    break;
                case LiveState$1.ENDED:
                    this.view.setLiveSyncStatus(false);
                    this.view.hideSyncWithLive();
                    // ensure progress indicators show latest info
                    if (this._engine.getCurrentState() === EngineState$1.PLAYING) {
                        this._startIntervalUpdates();
                    }
                    else {
                        this._updatePlayedIndicator();
                        this._updateBufferIndicator();
                    }
                    break;
                default:
                    break;
            }
        };
        ProgressControl.prototype._changeCurrentTimeOfVideo = function (percent) {
            var duration = this._engine.getDurationTime();
            if (this._engine.isDynamicContent && percent === 1) {
                this._engine.syncWithLive();
            }
            else {
                this._engine.setCurrentTime(duration * percent);
            }
            this._eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent);
        };
        ProgressControl.prototype._pauseVideoOnProgressManipulationStart = function () {
            var currentState = this._engine.getCurrentState();
            if (currentState === EngineState$1.PLAYING ||
                currentState === EngineState$1.PLAY_REQUESTED) {
                this._shouldPlayAfterManipulationEnd = true;
                this._engine.pause();
            }
            this._eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_STARTED);
        };
        ProgressControl.prototype._playVideoOnProgressManipulationEnd = function () {
            if (this._shouldPlayAfterManipulationEnd) {
                this._engine.play();
                this._shouldPlayAfterManipulationEnd = false;
            }
            this._eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_ENDED);
        };
        ProgressControl.prototype._updateBufferIndicator = function () {
            var currentTime = this._engine.getCurrentTime();
            var buffered = this._engine.getBuffered();
            var duration = this._engine.getDurationTime();
            this.updateBuffered(getOverallBufferedPercent(buffered, currentTime, duration));
        };
        ProgressControl.prototype._updatePlayedIndicator = function () {
            if (this._liveStateEngine.state === LiveState$1.SYNC) {
                // TODO: mb use this.updatePlayed(100) here?
                return;
            }
            var currentTime = this._engine.getCurrentTime();
            var duration = this._engine.getDurationTime();
            this.updatePlayed(getOverallPlayedPercent(currentTime, duration));
        };
        ProgressControl.prototype._updateAllIndicators = function () {
            this._updatePlayedIndicator();
            this._updateBufferIndicator();
        };
        ProgressControl.prototype._initTimeIndicators = function () {
            var _this = this;
            this._timeIndicatorsToAdd.forEach(function (time) {
                _this._addTimeIndicator(time);
            });
            this._timeIndicatorsToAdd = [];
        };
        ProgressControl.prototype._addTimeIndicator = function (time) {
            var durationTime = this._engine.getDurationTime();
            if (time > durationTime) {
                // TODO: log error for developers
                return;
            }
            this.view.addTimeIndicator(getTimePercent(time, durationTime));
        };
        ProgressControl.prototype._syncWithLive = function () {
            this._engine.syncWithLive();
        };
        ProgressControl.prototype._onSyncWithLiveMouseEnter = function () {
            this._eventEmitter.emit(UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_ENTER_TRIGGERED);
        };
        ProgressControl.prototype._onSyncWithLiveMouseLeave = function () {
            this._eventEmitter.emit(UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_LEAVE_TRIGGERED);
        };
        /**
         * Add time indicator to progress bar
         */
        ProgressControl.prototype.addTimeIndicator = function (time) {
            this.addTimeIndicators([time]);
        };
        /**
         * Add time indicators to progress bar
         */
        ProgressControl.prototype.addTimeIndicators = function (times) {
            var _this = this;
            if (!this._engine.isMetadataLoaded) {
                // NOTE: Add indicator after metadata loaded
                (_a = this._timeIndicatorsToAdd).push.apply(_a, times);
                return;
            }
            times.forEach(function (time) {
                _this._addTimeIndicator(time);
            });
            var _a;
        };
        /**
         * Delete all time indicators from progress bar
         */
        ProgressControl.prototype.clearTimeIndicators = function () {
            this.view.clearTimeIndicators();
        };
        ProgressControl.prototype.updatePlayed = function (percent) {
            this._currentProgress = percent;
            this.view.setPlayed(this._currentProgress);
        };
        ProgressControl.prototype.updateBuffered = function (percent) {
            this.view.setBuffered(percent);
        };
        ProgressControl.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        ProgressControl.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        ProgressControl.prototype.reset = function () {
            this.updatePlayed(0);
            this.updateBuffered(0);
            this.clearTimeIndicators();
        };
        ProgressControl.prototype.destroy = function () {
            this._destroyInterceptor();
            this._stopIntervalUpdates();
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
            this._liveStateEngine = null;
            this._timeIndicatorsToAdd = null;
            this._textMap = null;
        };
        ProgressControl.moduleName = 'progressControl';
        ProgressControl.View = ProgressView;
        ProgressControl.dependencies = [
            'engine',
            'liveStateEngine',
            'eventEmitter',
            'textMap',
            'tooltipService',
            'theme',
            'thumbnails',
        ];
        __decorate([
            playerAPI()
        ], ProgressControl.prototype, "addTimeIndicator", null);
        __decorate([
            playerAPI()
        ], ProgressControl.prototype, "addTimeIndicators", null);
        __decorate([
            playerAPI()
        ], ProgressControl.prototype, "clearTimeIndicators", null);
        return ProgressControl;
    }());

    function anonymous$22(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 127%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <path class="'+(props.themeStyles.playSvgFill)+'" d="M.079 0L0 14l10.5-7.181z"/> </svg></div>';return out;
    }

    function anonymous$23(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 140%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <path class="'+(props.themeStyles.playSvgFill)+'" d="M7 0h3v14H7V0zM0 0h3v14H0V0z"/> </svg></div>';return out;
    }

    function anonymous$24(props
    /*``*/) {
    var out='<div class="'+(props.styles.playControl)+'" data-hook="playback-control" data-is-playing="false"> <button class="'+(props.styles.playbackToggle)+' '+(props.styles.controlButton)+'" data-hook="playback-control" aria-label="'+(props.texts.label)+'" type="button" tabindex="0"/></div>';return out;
    }

    var playViewTheme = {
        playSvgFill: {
            fill: function (data) { return data.color; },
        },
    };

    var css$14 = ".play__controlButton___3PoOY {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .play__controlButton___3PoOY:hover {\n    opacity: .7; }\n  .play__hidden___1tNO8 {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .play__playControl___1AgWy {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start; }\n  .play__playbackToggle___3tzyO {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  min-height: 26px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .play__playbackToggle___3tzyO {\n    width: 35px;\n    min-width: 35px;\n    height: 35px;\n    min-height: 35px;\n    background-size: 15px 21px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .play__playbackToggle___3tzyO .play__icon___1z40F {\n      width: 15px;\n      height: 21px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .play__playbackToggle___3tzyO.play__paused___2fI5f {\n      background-size: 16px 21px; }\n  .play__playbackToggle___3tzyO .play__icon___1z40F {\n    width: 11px;\n    height: 14px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsYXkuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixpQ0FBeUI7VUFBekIseUJBQXlCO0VBQ3pCLHFDQUE2QjtFQUE3Qiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLFVBQVU7RUFDVixpQkFBaUI7RUFDakIsY0FBYztFQUNkLDhCQUE4QjtFQUM5Qix5QkFBd0I7TUFBeEIsc0JBQXdCO1VBQXhCLHdCQUF3QjtFQUN4QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO0lBQ0UsWUFBWSxFQUFFO0VBRWxCO0VBQ0UsOEJBQThCO0VBQzlCLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIscUJBQXFCO0VBQ3JCLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsc0JBQXNCO0VBQ3RCLHNCQUFzQixFQUFFO0VBRTFCO0VBQ0UsbUJBQW1CO0VBQ25CLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsK0JBQXVCO1VBQXZCLHVCQUF1QjtFQUN2QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQjtFQUNwQix3QkFBNEI7TUFBNUIscUJBQTRCO1VBQTVCLDRCQUE0QixFQUFFO0VBRWhDO0VBQ0UsWUFBWTtFQUNaLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsaUJBQWlCLEVBQUU7RUFDbkI7SUFDRSxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsMkJBQTJCLEVBQUU7RUFDN0I7TUFDRSxZQUFZO01BQ1osYUFBYSxFQUFFO0VBQ2pCO01BQ0UsMkJBQTJCLEVBQUU7RUFDakM7SUFDRSxZQUFZO0lBQ1osYUFBYSxFQUFFIiwiZmlsZSI6InBsYXkuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250cm9sQnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAuMnM7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG4gIG9wYWNpdHk6IDE7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4gIC5jb250cm9sQnV0dG9uOmhvdmVyIHtcbiAgICBvcGFjaXR5OiAuNzsgfVxuXG4uaGlkZGVuIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuICFpbXBvcnRhbnQ7XG4gIHdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWluLWhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICBvcGFjaXR5OiAwICFpbXBvcnRhbnQ7IH1cblxuLnBsYXlDb250cm9sIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7IH1cblxuLnBsYXliYWNrVG9nZ2xlIHtcbiAgd2lkdGg6IDI2cHg7XG4gIG1pbi13aWR0aDogMjZweDtcbiAgaGVpZ2h0OiAyNnB4O1xuICBtaW4taGVpZ2h0OiAyNnB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnBsYXliYWNrVG9nZ2xlIHtcbiAgICB3aWR0aDogMzVweDtcbiAgICBtaW4td2lkdGg6IDM1cHg7XG4gICAgaGVpZ2h0OiAzNXB4O1xuICAgIG1pbi1oZWlnaHQ6IDM1cHg7XG4gICAgYmFja2dyb3VuZC1zaXplOiAxNXB4IDIxcHg7IH1cbiAgICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5wbGF5YmFja1RvZ2dsZSAuaWNvbiB7XG4gICAgICB3aWR0aDogMTVweDtcbiAgICAgIGhlaWdodDogMjFweDsgfVxuICAgIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLnBsYXliYWNrVG9nZ2xlLnBhdXNlZCB7XG4gICAgICBiYWNrZ3JvdW5kLXNpemU6IDE2cHggMjFweDsgfVxuICAucGxheWJhY2tUb2dnbGUgLmljb24ge1xuICAgIHdpZHRoOiAxMXB4O1xuICAgIGhlaWdodDogMTRweDsgfVxuIl19 */";
    var styles$14 = {"controlButton":"play__controlButton___3PoOY","hidden":"play__hidden___1tNO8","playControl":"play__playControl___1AgWy","playbackToggle":"play__playbackToggle___3tzyO","icon":"play__icon___1z40F","paused":"play__paused___2fI5f"};
    styleInject(css$14);

    var DATA_IS_PLAYING = 'data-is-playing';
    var PlayView = /** @class */ (function (_super) {
        __extends(PlayView, _super);
        function PlayView(config) {
            var _this = this;
            var callbacks = config.callbacks, textMap = config.textMap, theme = config.theme;
            _this = _super.call(this, theme) || this;
            _this._callbacks = callbacks;
            _this._textMap = textMap;
            _this._$node = htmlToElement(anonymous$24({
                styles: _this.styleNames,
                texts: {
                    label: _this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
                },
            }));
            _this._$playbackControl = getElementByHook(_this._$node, 'playback-control');
            _this.setState({ isPlaying: false });
            _this._bindEvents();
            return _this;
        }
        PlayView.prototype._bindEvents = function () {
            this._onButtonClick = this._onButtonClick.bind(this);
            this._$playbackControl.addEventListener('click', this._onButtonClick);
        };
        PlayView.prototype._unbindEvents = function () {
            this._$playbackControl.removeEventListener('click', this._onButtonClick);
        };
        PlayView.prototype._onButtonClick = function () {
            this._$playbackControl.focus();
            this._callbacks.onButtonClick();
        };
        PlayView.prototype.setState = function (_a) {
            var isPlaying = _a.isPlaying;
            if (isPlaying) {
                this._$playbackControl.classList.remove(this.styleNames.paused);
                this._$playbackControl.innerHTML = anonymous$23({
                    styles: this.styleNames,
                    themeStyles: this.themeStyles,
                });
                this._$playbackControl.setAttribute('aria-label', this._textMap.get(TEXT_LABELS.PAUSE_CONTROL_LABEL));
            }
            else {
                this._$playbackControl.classList.add(this.styleNames.paused);
                this._$playbackControl.innerHTML = anonymous$22({
                    styles: this.styleNames,
                    themeStyles: this.themeStyles,
                });
                this._$playbackControl.setAttribute('aria-label', this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL));
            }
            this._$node.setAttribute(DATA_IS_PLAYING, String(isPlaying));
        };
        PlayView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        PlayView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        PlayView.prototype.getNode = function () {
            return this._$node;
        };
        PlayView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$playbackControl = null;
            this._$node = null;
            this._textMap = null;
        };
        return PlayView;
    }(View));
    PlayView.setTheme(playViewTheme);
    PlayView.extendStyleNames(styles$14);

    var PlayControl = /** @class */ (function () {
        function PlayControl(_a) {
            var engine = _a.engine, eventEmitter = _a.eventEmitter, textMap = _a.textMap, theme = _a.theme;
            this._engine = engine;
            this._eventEmitter = eventEmitter;
            this._textMap = textMap;
            this._theme = theme;
            this._isPlaying = null;
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
            this.setControlStatus(false);
            this._initInterceptor();
        }
        Object.defineProperty(PlayControl.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        PlayControl.prototype._initInterceptor = function () {
            var _this = this;
            this._interceptor = new KeyboardInterceptorCore(this.node, (_a = {}, _a[KEYCODES.SPACE_BAR] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED);
                }, _a[KEYCODES.ENTER] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED);
                }, _a));
            var _a;
        };
        PlayControl.prototype._destroyInterceptor = function () {
            this._interceptor.destroy();
        };
        PlayControl.prototype._bindCallbacks = function () {
            this._togglePlayback = this._togglePlayback.bind(this);
        };
        PlayControl.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([[VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus]], this);
        };
        PlayControl.prototype._togglePlayback = function () {
            if (this._isPlaying) {
                this._pauseVideo();
            }
            else {
                this._playVideo();
            }
        };
        PlayControl.prototype._playVideo = function () {
            this._engine.play();
            this._eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
        };
        PlayControl.prototype._pauseVideo = function () {
            this._engine.pause();
            this._eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
        };
        PlayControl.prototype._updatePlayingStatus = function (_a) {
            var nextState = _a.nextState;
            if (nextState === EngineState$1.SRC_SET) {
                this.reset();
            }
            else if (nextState === EngineState$1.PLAYING) {
                this.setControlStatus(true);
            }
            else if (nextState === EngineState$1.PAUSED ||
                nextState === EngineState$1.ENDED ||
                nextState === EngineState$1.SEEK_IN_PROGRESS) {
                this.setControlStatus(false);
            }
        };
        PlayControl.prototype._initUI = function () {
            var config = {
                callbacks: {
                    onButtonClick: this._togglePlayback,
                },
                theme: this._theme,
                textMap: this._textMap,
            };
            this.view = new PlayControl.View(config);
        };
        PlayControl.prototype.setControlStatus = function (isPlaying) {
            this._isPlaying = isPlaying;
            this.view.setState({ isPlaying: this._isPlaying });
        };
        PlayControl.prototype.reset = function () {
            this.setControlStatus(false);
        };
        PlayControl.prototype.destroy = function () {
            this._destroyInterceptor();
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
            this._textMap = null;
        };
        PlayControl.moduleName = 'playControl';
        PlayControl.View = PlayView;
        PlayControl.dependencies = ['engine', 'eventEmitter', 'textMap', 'theme'];
        return PlayControl;
    }());

    function anonymous$25(props
    /*``*/) {
    var out='<div data-hook="time-control" class="'+(props.styles.timeWrapper)+' '+(props.themeStyles.timeText)+'"> <span data-hook="current-time-indicator" class="'+(props.styles.time)+'"> </span> <span data-hook="duration-time-indicator" class="'+(props.styles.time)+' '+(props.styles.duration)+'"> </span></div>';return out;
    }

    var timeViewTheme = {
        timeText: {
            color: function (data) { return data.color; },
        },
    };

    var css$15 = ".time__controlButton___mpXuO {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .time__controlButton___mpXuO:hover {\n    opacity: .7; }\n  .time__hidden___3xnRl {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .time__timeWrapper___1r8hO {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  height: 25px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .time__time___10Maj {\n  font-size: 12px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .time__time___10Maj {\n    font-size: 14px; }\n  .time__duration___3gaxd {\n  margin-left: 5px; }\n  .time__duration___3gaxd:before {\n    margin-right: 4px;\n    content: '/'; }\n  .time__liveMode___2Nolg .time__separator___hIpG9 {\n  display: none; }\n  .time__liveMode___2Nolg .time__duration___3gaxd {\n  display: none; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixpQ0FBeUI7VUFBekIseUJBQXlCO0VBQ3pCLHFDQUE2QjtFQUE3Qiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLFVBQVU7RUFDVixpQkFBaUI7RUFDakIsY0FBYztFQUNkLDhCQUE4QjtFQUM5Qix5QkFBd0I7TUFBeEIsc0JBQXdCO1VBQXhCLHdCQUF3QjtFQUN4QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO0lBQ0UsWUFBWSxFQUFFO0VBRWxCO0VBQ0UsOEJBQThCO0VBQzlCLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIscUJBQXFCO0VBQ3JCLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsc0JBQXNCO0VBQ3RCLHNCQUFzQixFQUFFO0VBRTFCO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxvQkFBZTtNQUFmLG1CQUFlO1VBQWYsZUFBZTtFQUNmLGFBQWE7RUFDYiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBRXhCO0VBQ0UsZ0JBQWdCLEVBQUU7RUFDbEI7SUFDRSxnQkFBZ0IsRUFBRTtFQUV0QjtFQUNFLGlCQUFpQixFQUFFO0VBQ25CO0lBQ0Usa0JBQWtCO0lBQ2xCLGFBQWEsRUFBRTtFQUVuQjtFQUNFLGNBQWMsRUFBRTtFQUVsQjtFQUNFLGNBQWMsRUFBRSIsImZpbGUiOiJ0aW1lLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udHJvbEJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjJzO1xuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5O1xuICBvcGFjaXR5OiAxO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAuY29udHJvbEJ1dHRvbjpob3ZlciB7XG4gICAgb3BhY2l0eTogLjc7IH1cblxuLmhpZGRlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB3aWR0aDogMCAhaW1wb3J0YW50O1xuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1pbi1oZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgb3BhY2l0eTogMCAhaW1wb3J0YW50OyB9XG5cbi50aW1lV3JhcHBlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICBoZWlnaHQ6IDI1cHg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cblxuLnRpbWUge1xuICBmb250LXNpemU6IDEycHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAudGltZSB7XG4gICAgZm9udC1zaXplOiAxNHB4OyB9XG5cbi5kdXJhdGlvbiB7XG4gIG1hcmdpbi1sZWZ0OiA1cHg7IH1cbiAgLmR1cmF0aW9uOmJlZm9yZSB7XG4gICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gICAgY29udGVudDogJy8nOyB9XG5cbi5saXZlTW9kZSAuc2VwYXJhdG9yIHtcbiAgZGlzcGxheTogbm9uZTsgfVxuXG4ubGl2ZU1vZGUgLmR1cmF0aW9uIHtcbiAgZGlzcGxheTogbm9uZTsgfVxuIl19 */";
    var styles$15 = {"controlButton":"time__controlButton___mpXuO","hidden":"time__hidden___3xnRl","timeWrapper":"time__timeWrapper___1r8hO","time":"time__time___10Maj","duration":"time__duration___3gaxd","liveMode":"time__liveMode___2Nolg","separator":"time__separator___hIpG9"};
    styleInject(css$15);

    var TimeView = /** @class */ (function (_super) {
        __extends(TimeView, _super);
        function TimeView(config) {
            var _this = this;
            var theme = config.theme;
            _this = _super.call(this, theme) || this;
            _this._initDOM();
            return _this;
        }
        TimeView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$25({ styles: this.styleNames, themeStyles: this.themeStyles }));
            this._$currentTime = getElementByHook(this._$node, 'current-time-indicator');
            this._$durationTime = getElementByHook(this._$node, 'duration-time-indicator');
        };
        TimeView.prototype.setDurationTime = function (duration) {
            if (duration !== this._duration) {
                this._duration = duration;
                this._updateDurationTime();
            }
        };
        TimeView.prototype.setCurrentTime = function (current) {
            if (current !== this._current) {
                this._current = current;
                this._updateCurrentTime();
            }
        };
        TimeView.prototype.setCurrentTimeBackward = function (_isBackward) {
            this._isBackward = _isBackward;
            this._updateCurrentTime();
        };
        TimeView.prototype._updateDurationTime = function () {
            this._$durationTime.innerHTML = formatTime(this._duration);
        };
        TimeView.prototype._updateCurrentTime = function () {
            if (this._isBackward) {
                this._$currentTime.innerHTML = formatTime(this._current - this._duration);
            }
            else {
                this._$currentTime.innerHTML = formatTime(this._current);
            }
        };
        TimeView.prototype.showDuration = function () {
            this._$durationTime.classList.remove(this.styleNames.hidden);
        };
        TimeView.prototype.hideDuration = function () {
            this._$durationTime.classList.add(this.styleNames.hidden);
        };
        TimeView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        TimeView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        TimeView.prototype.getNode = function () {
            return this._$node;
        };
        TimeView.prototype.destroy = function () {
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$currentTime = null;
            this._$durationTime = null;
            this._$node = null;
        };
        return TimeView;
    }(View));
    TimeView.setTheme(timeViewTheme);
    TimeView.extendStyleNames(styles$15);

    var UPDATE_INTERVAL_DELAY$1 = 1000 / 60;
    var TimeControl = /** @class */ (function () {
        function TimeControl(_a) {
            var eventEmitter = _a.eventEmitter, engine = _a.engine, theme = _a.theme;
            this._eventEmitter = eventEmitter;
            this._engine = engine;
            this._theme = theme;
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
            this.setCurrentTime(0);
            this.setDurationTime(0);
        }
        Object.defineProperty(TimeControl.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        TimeControl.prototype._bindCallbacks = function () {
            this._updateCurrentTime = this._updateCurrentTime.bind(this);
            this._updateDurationTime = this._updateDurationTime.bind(this);
        };
        TimeControl.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([
                [VIDEO_EVENTS.STATE_CHANGED, this._toggleIntervalUpdates],
                [VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime],
                [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processLiveStateChange],
            ], this);
        };
        TimeControl.prototype._initUI = function () {
            var config = {
                theme: this._theme,
            };
            this.view = new TimeControl.View(config);
        };
        TimeControl.prototype._startIntervalUpdates = function () {
            if (this._updateControlInterval) {
                this._stopIntervalUpdates();
            }
            this._updateControlInterval = window.setInterval(this._updateCurrentTime, UPDATE_INTERVAL_DELAY$1);
        };
        TimeControl.prototype._stopIntervalUpdates = function () {
            window.clearInterval(this._updateControlInterval);
            this._updateControlInterval = null;
        };
        TimeControl.prototype._processLiveStateChange = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case LiveState$1.NONE:
                    this.show();
                    break;
                case LiveState$1.INITIAL:
                    this.hide();
                    break;
                case LiveState$1.ENDED:
                    this.show();
                    break;
                default:
                    break;
            }
        };
        TimeControl.prototype._toggleIntervalUpdates = function (_a) {
            var nextState = _a.nextState;
            switch (nextState) {
                case EngineState$1.SRC_SET:
                    this.reset();
                    break;
                case EngineState$1.PLAYING:
                    this._startIntervalUpdates();
                    break;
                case EngineState$1.SEEK_IN_PROGRESS:
                    this._updateCurrentTime();
                    break;
                default:
                    this._stopIntervalUpdates();
                    break;
            }
        };
        TimeControl.prototype._updateDurationTime = function () {
            this.setDurationTime(this._engine.getDurationTime());
        };
        TimeControl.prototype._updateCurrentTime = function () {
            this.setCurrentTime(this._engine.getCurrentTime());
        };
        TimeControl.prototype.setDurationTime = function (time) {
            this.view.setDurationTime(time);
        };
        TimeControl.prototype.setCurrentTime = function (time) {
            this.view.setCurrentTime(time);
        };
        TimeControl.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        TimeControl.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        TimeControl.prototype.reset = function () {
            this.setDurationTime(0);
            this.setCurrentTime(0);
            this.view.showDuration();
            this.view.setCurrentTimeBackward(false);
            this.show();
        };
        TimeControl.prototype.destroy = function () {
            this._stopIntervalUpdates();
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
        };
        TimeControl.moduleName = 'timeControl';
        TimeControl.View = TimeView;
        TimeControl.dependencies = ['engine', 'eventEmitter', 'theme'];
        return TimeControl;
    }());

    function anonymous$26(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 82%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <!--width="16"--> <!--height="13"--> <g class="'+(props.themeStyles.volumeSvgFill)+'"> <path d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/> <path fill-rule="nonzero" d="M13 6.257l-2.05-2.05-.743.743L12.257 7l-2.05 2.05.743.743L13 7.743l2.05 2.05.743-.743L13.743 7l2.05-2.05-.743-.743L13 6.257z"/> </g> </svg></div>';return out;
    }

    function anonymous$27(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 82%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <g fill="none" fill-rule="evenodd"> <path class="'+(props.themeStyles.volumeSvgFill)+'" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/> <path class="'+(props.themeStyles.volumeSvgStroke)+'" d="M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/> </g> </svg></div>';return out;
    }

    function anonymous$28(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 82%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <g fill="none" fill-rule="evenodd"> <path class="'+(props.themeStyles.volumeSvgFill)+'" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/> <path class="'+(props.themeStyles.volumeSvgStroke)+'" d="M12.793 13.716a9.607 9.607 0 0 0 0-13.586M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/> </g> </svg></div>';return out;
    }

    function anonymous$29(props
    /*``*/) {
    var out='<div class="'+(props.styles.volumeControl)+'" data-hook="volume-control" data-volume-percent="100" data-is-muted="false"> <button class="'+(props.styles.muteButton)+' '+(props.styles.controlButton)+'" data-hook="mute-button" aria-label="'+(props.texts.muteLabel)+'" type="button" tabindex="0"> </button> <div class="'+(props.styles.volumeInputBlock)+'" data-hook="volume-input-block" aria-label="'+(props.texts.volumeLabel)+'" aria-valuemin="0" aria-valuenow="0" aria-valuemax="100" tabindex="0"> <div class="'+(props.styles.progressBar)+' '+(props.styles.background)+' '+(props.themeStyles.volumeProgressBackground)+'"> </div> <div class="'+(props.styles.progressBar)+' '+(props.styles.volume)+' '+(props.themeStyles.volumeProgress)+'" data-hook="volume-input"> </div> <div class="'+(props.styles.hitbox)+'" data-hook="volume-hitbox"> </div> </div></div>';return out;
    }

    var volumeViewTheme = {
        volumeSvgFill: {
            fill: function (data) { return data.color; },
        },
        volumeSvgStroke: {
            stroke: function (data) { return data.color; },
        },
        volumeProgress: {
            backgroundColor: function (data) { return data.color; },
            '&:after': {
                backgroundColor: function (data) { return data.color; },
            },
        },
        volumeProgressBackground: {
            backgroundColor: function (data) { return transperentizeColor(data.color, 0.25); },
        },
    };

    var css$16 = ".volume__controlButton___1XXXG {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .volume__controlButton___1XXXG:hover {\n    opacity: .7; }\n  .volume__hidden___504PW {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .volume__volumeControl___1f_-O {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: width .2s;\n  transition: width .2s;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .volume__volumeControl___1f_-O {\n    height: 35px; }\n  .volume__volumeControl___1f_-O:hover .volume__volumeInputBlock___EzZei, .volume__volumeControl___1f_-O.volume__isDragging___3mlpX .volume__volumeInputBlock___EzZei {\n    width: 50px;\n    margin-right: 5px;\n    opacity: 1; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .volume__volumeControl___1f_-O:hover .volume__volumeInputBlock___EzZei, div[data-hook='player-container'][data-in-full-screen='true'] .volume__volumeControl___1f_-O.volume__isDragging___3mlpX .volume__volumeInputBlock___EzZei {\n      width: 90px;\n      margin-right: 10px; }\n  .volume__muteButton___1d1Ei {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  min-height: 26px;\n  padding: 0; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .volume__muteButton___1d1Ei {\n    width: 35px;\n    min-width: 35px;\n    height: 35px;\n    min-height: 35px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .volume__muteButton___1d1Ei .volume__icon___38qX4 {\n      width: 25px;\n      height: 21px; }\n  .volume__muteButton___1d1Ei .volume__icon___38qX4 {\n    width: 17px;\n    height: 14px; }\n  .volume__volumeInputBlock___EzZei {\n  position: relative;\n  display: block;\n  width: 0;\n  height: 25px;\n  margin-left: 2px;\n  -webkit-transition: opacity .2s, width .2s;\n  transition: opacity .2s, width .2s;\n  opacity: 0; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .volume__volumeInputBlock___EzZei {\n    margin-left: 5px; }\n  .volume__progressBar___1JJYW {\n  position: absolute;\n  top: 11.5px;\n  height: 2px;\n  padding: 0; }\n  .volume__volume___1XvBT:after {\n  position: absolute;\n  top: -3px;\n  right: -4px;\n  width: 8px;\n  height: 8px;\n  content: '';\n  -webkit-transition: opacity .2s;\n  transition: opacity .2s;\n  border-radius: 50%; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .volume__volume___1XvBT:after {\n    top: -4px;\n    right: -5px;\n    width: 10px;\n    height: 10px; }\n  .volume__background___2Mafo {\n  width: 100%; }\n  .volume__hitbox___1jBrF {\n  position: relative;\n  z-index: 5;\n  display: block;\n  width: 100%;\n  height: 25px;\n  cursor: pointer;\n  opacity: 0; }\n  [data-focus-source='key'] [data-hook='volume-control'] .focus-within.volume__volumeInputBlock___EzZei,\n[data-focus-source='script'] [data-hook='volume-control'] .focus-within.volume__volumeInputBlock___EzZei {\n  width: 50px;\n  margin-right: 5px;\n  opacity: 1;\n  -webkit-box-shadow: 0 0 0 2px rgba(56, 153, 236, 0.8);\n          box-shadow: 0 0 0 2px rgba(56, 153, 236, 0.8); }\n  div[data-hook='player-container'][data-in-full-screen='true'] [data-focus-source='key'] [data-hook='volume-control'] .focus-within.volume__volumeInputBlock___EzZei, div[data-hook='player-container'][data-in-full-screen='true']\n  [data-focus-source='script'] [data-hook='volume-control'] .focus-within.volume__volumeInputBlock___EzZei {\n    width: 90px;\n    margin-right: 10px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZvbHVtZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCxXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGlDQUF5QjtVQUF6Qix5QkFBeUI7RUFDekIscUNBQTZCO0VBQTdCLDZCQUE2QjtFQUM3QixXQUFXO0VBQ1gsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixjQUFjO0VBQ2QsOEJBQThCO0VBQzlCLHlCQUF3QjtNQUF4QixzQkFBd0I7VUFBeEIsd0JBQXdCO0VBQ3hCLDBCQUFvQjtNQUFwQix1QkFBb0I7VUFBcEIsb0JBQW9CLEVBQUU7RUFDdEI7SUFDRSxZQUFZLEVBQUU7RUFFbEI7RUFDRSw4QkFBOEI7RUFDOUIsb0JBQW9CO0VBQ3BCLHdCQUF3QjtFQUN4QixxQkFBcUI7RUFDckIseUJBQXlCO0VBQ3pCLHFCQUFxQjtFQUNyQixzQkFBc0I7RUFDdEIsc0JBQXNCLEVBQUU7RUFFMUI7RUFDRSxtQkFBbUI7RUFDbkIscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCwwQkFBa0I7S0FBbEIsdUJBQWtCO01BQWxCLHNCQUFrQjtVQUFsQixrQkFBa0I7RUFDbEIsOEJBQXNCO0VBQXRCLHNCQUFzQjtFQUN0Qix3QkFBNEI7TUFBNUIscUJBQTRCO1VBQTVCLDRCQUE0QjtFQUM1QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO0lBQ0UsYUFBYSxFQUFFO0VBQ2pCO0lBQ0UsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixXQUFXLEVBQUU7RUFDYjtNQUNFLFlBQVk7TUFDWixtQkFBbUIsRUFBRTtFQUUzQjtFQUNFLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLGlCQUFpQjtFQUNqQixXQUFXLEVBQUU7RUFDYjtJQUNFLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLGlCQUFpQixFQUFFO0VBQ25CO01BQ0UsWUFBWTtNQUNaLGFBQWEsRUFBRTtFQUNuQjtJQUNFLFlBQVk7SUFDWixhQUFhLEVBQUU7RUFFbkI7RUFDRSxtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLFNBQVM7RUFDVCxhQUFhO0VBQ2IsaUJBQWlCO0VBQ2pCLDJDQUFtQztFQUFuQyxtQ0FBbUM7RUFDbkMsV0FBVyxFQUFFO0VBQ2I7SUFDRSxpQkFBaUIsRUFBRTtFQUV2QjtFQUNFLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osWUFBWTtFQUNaLFdBQVcsRUFBRTtFQUVmO0VBQ0UsbUJBQW1CO0VBQ25CLFVBQVU7RUFDVixZQUFZO0VBQ1osV0FBVztFQUNYLFlBQVk7RUFDWixZQUFZO0VBQ1osZ0NBQXdCO0VBQXhCLHdCQUF3QjtFQUN4QixtQkFBbUIsRUFBRTtFQUNyQjtJQUNFLFVBQVU7SUFDVixZQUFZO0lBQ1osWUFBWTtJQUNaLGFBQWEsRUFBRTtFQUVuQjtFQUNFLFlBQVksRUFBRTtFQUVoQjtFQUNFLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsZUFBZTtFQUNmLFlBQVk7RUFDWixhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLFdBQVcsRUFBRTtFQUVmOztFQUVFLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsV0FBVztFQUNYLHNEQUE4QztVQUE5Qyw4Q0FBOEMsRUFBRTtFQUNoRDs7SUFFRSxZQUFZO0lBQ1osbUJBQW1CLEVBQUUiLCJmaWxlIjoidm9sdW1lLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udHJvbEJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjJzO1xuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5O1xuICBvcGFjaXR5OiAxO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAuY29udHJvbEJ1dHRvbjpob3ZlciB7XG4gICAgb3BhY2l0eTogLjc7IH1cblxuLmhpZGRlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB3aWR0aDogMCAhaW1wb3J0YW50O1xuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1pbi1oZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgb3BhY2l0eTogMCAhaW1wb3J0YW50OyB9XG5cbi52b2x1bWVDb250cm9sIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgdHJhbnNpdGlvbjogd2lkdGggLjJzO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAudm9sdW1lQ29udHJvbCB7XG4gICAgaGVpZ2h0OiAzNXB4OyB9XG4gIC52b2x1bWVDb250cm9sOmhvdmVyIC52b2x1bWVJbnB1dEJsb2NrLCAudm9sdW1lQ29udHJvbC5pc0RyYWdnaW5nIC52b2x1bWVJbnB1dEJsb2NrIHtcbiAgICB3aWR0aDogNTBweDtcbiAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICBvcGFjaXR5OiAxOyB9XG4gICAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAudm9sdW1lQ29udHJvbDpob3ZlciAudm9sdW1lSW5wdXRCbG9jaywgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAudm9sdW1lQ29udHJvbC5pc0RyYWdnaW5nIC52b2x1bWVJbnB1dEJsb2NrIHtcbiAgICAgIHdpZHRoOiA5MHB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4OyB9XG5cbi5tdXRlQnV0dG9uIHtcbiAgd2lkdGg6IDI2cHg7XG4gIG1pbi13aWR0aDogMjZweDtcbiAgaGVpZ2h0OiAyNnB4O1xuICBtaW4taGVpZ2h0OiAyNnB4O1xuICBwYWRkaW5nOiAwOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLm11dGVCdXR0b24ge1xuICAgIHdpZHRoOiAzNXB4O1xuICAgIG1pbi13aWR0aDogMzVweDtcbiAgICBoZWlnaHQ6IDM1cHg7XG4gICAgbWluLWhlaWdodDogMzVweDsgfVxuICAgIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLm11dGVCdXR0b24gLmljb24ge1xuICAgICAgd2lkdGg6IDI1cHg7XG4gICAgICBoZWlnaHQ6IDIxcHg7IH1cbiAgLm11dGVCdXR0b24gLmljb24ge1xuICAgIHdpZHRoOiAxN3B4O1xuICAgIGhlaWdodDogMTRweDsgfVxuXG4udm9sdW1lSW5wdXRCbG9jayB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAwO1xuICBoZWlnaHQ6IDI1cHg7XG4gIG1hcmdpbi1sZWZ0OiAycHg7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzLCB3aWR0aCAuMnM7XG4gIG9wYWNpdHk6IDA7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAudm9sdW1lSW5wdXRCbG9jayB7XG4gICAgbWFyZ2luLWxlZnQ6IDVweDsgfVxuXG4ucHJvZ3Jlc3NCYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTEuNXB4O1xuICBoZWlnaHQ6IDJweDtcbiAgcGFkZGluZzogMDsgfVxuXG4udm9sdW1lOmFmdGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IC0zcHg7XG4gIHJpZ2h0OiAtNHB4O1xuICB3aWR0aDogOHB4O1xuICBoZWlnaHQ6IDhweDtcbiAgY29udGVudDogJyc7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzO1xuICBib3JkZXItcmFkaXVzOiA1MCU7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXSAudm9sdW1lOmFmdGVyIHtcbiAgICB0b3A6IC00cHg7XG4gICAgcmlnaHQ6IC01cHg7XG4gICAgd2lkdGg6IDEwcHg7XG4gICAgaGVpZ2h0OiAxMHB4OyB9XG5cbi5iYWNrZ3JvdW5kIHtcbiAgd2lkdGg6IDEwMCU7IH1cblxuLmhpdGJveCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogNTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDI1cHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgb3BhY2l0eTogMDsgfVxuXG46Z2xvYmFsIFtkYXRhLWZvY3VzLXNvdXJjZT0na2V5J10gW2RhdGEtaG9vaz0ndm9sdW1lLWNvbnRyb2wnXSAuZm9jdXMtd2l0aGluOmxvY2FsLnZvbHVtZUlucHV0QmxvY2ssXG46Z2xvYmFsIFtkYXRhLWZvY3VzLXNvdXJjZT0nc2NyaXB0J10gW2RhdGEtaG9vaz0ndm9sdW1lLWNvbnRyb2wnXSAuZm9jdXMtd2l0aGluOmxvY2FsLnZvbHVtZUlucHV0QmxvY2sge1xuICB3aWR0aDogNTBweDtcbiAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gIG9wYWNpdHk6IDE7XG4gIGJveC1zaGFkb3c6IDAgMCAwIDJweCByZ2JhKDU2LCAxNTMsIDIzNiwgMC44KTsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIDpnbG9iYWwgW2RhdGEtZm9jdXMtc291cmNlPSdrZXknXSBbZGF0YS1ob29rPSd2b2x1bWUtY29udHJvbCddIC5mb2N1cy13aXRoaW46bG9jYWwudm9sdW1lSW5wdXRCbG9jaywgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW2RhdGEtaW4tZnVsbC1zY3JlZW49J3RydWUnXVxuICA6Z2xvYmFsIFtkYXRhLWZvY3VzLXNvdXJjZT0nc2NyaXB0J10gW2RhdGEtaG9vaz0ndm9sdW1lLWNvbnRyb2wnXSAuZm9jdXMtd2l0aGluOmxvY2FsLnZvbHVtZUlucHV0QmxvY2sge1xuICAgIHdpZHRoOiA5MHB4O1xuICAgIG1hcmdpbi1yaWdodDogMTBweDsgfVxuIl19 */";
    var styles$16 = {"controlButton":"volume__controlButton___1XXXG","hidden":"volume__hidden___504PW","volumeControl":"volume__volumeControl___1f_-O","volumeInputBlock":"volume__volumeInputBlock___EzZei","isDragging":"volume__isDragging___3mlpX","muteButton":"volume__muteButton___1d1Ei","icon":"volume__icon___38qX4","progressBar":"volume__progressBar___1JJYW","volume":"volume__volume___1XvBT","background":"volume__background___2Mafo","hitbox":"volume__hitbox___1jBrF"};
    styleInject(css$16);

    var DATA_IS_MUTED = 'data-is-muted';
    var DATA_VOLUME = 'data-volume-percent';
    var MAX_VOLUME_ICON_RANGE = 50;
    var getPercentBasedOnXPosition$1 = function (event, element) {
        var boundingRect = element.getBoundingClientRect();
        var positionX = event.clientX;
        if (positionX < boundingRect.left) {
            return 0;
        }
        if (positionX > boundingRect.left + boundingRect.width) {
            return 100;
        }
        return (event.clientX - boundingRect.left) / boundingRect.width * 100;
    };
    var VolumeView = /** @class */ (function (_super) {
        __extends(VolumeView, _super);
        function VolumeView(config) {
            var _this = this;
            var callbacks = config.callbacks, textMap = config.textMap, tooltipService = config.tooltipService, theme = config.theme;
            _this = _super.call(this, theme) || this;
            _this._callbacks = callbacks;
            _this._textMap = textMap;
            _this._tooltipService = tooltipService;
            _this._bindCallbacks();
            _this._initDOM();
            _this._bindEvents();
            return _this;
        }
        VolumeView.prototype._initDOM = function () {
            this._$node = htmlToElement(anonymous$29({
                styles: this.styleNames,
                themeStyles: this.themeStyles,
                texts: {
                    muteLabel: this._textMap.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
                    volumeLabel: this._textMap.get(TEXT_LABELS.VOLUME_CONTROL_LABEL),
                },
            }));
            this._$muteButton = getElementByHook(this._$node, 'mute-button');
            this._$volumeNode = getElementByHook(this._$node, 'volume-input-block');
            this._$hitbox = getElementByHook(this._$node, 'volume-hitbox');
            this._$volume = getElementByHook(this._$node, 'volume-input');
            this._muteButtonTooltipReference = this._tooltipService.createReference(this._$muteButton, {
                text: this._textMap.get(TEXT_LABELS.MUTE_CONTROL_TOOLTIP),
            });
        };
        VolumeView.prototype._bindCallbacks = function () {
            this._onButtonClick = this._onButtonClick.bind(this);
            this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
            this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
            this._setVolumeByWheel = this._setVolumeByWheel.bind(this);
            this._setVolumeByClick = this._setVolumeByClick.bind(this);
            this._setVolumeByDrag = this._setVolumeByDrag.bind(this);
        };
        VolumeView.prototype._bindEvents = function () {
            this._$hitbox.addEventListener('wheel', this._setVolumeByWheel);
            this._$hitbox.addEventListener('mousedown', this._startDragOnMouseDown);
            window.addEventListener('mousemove', this._setVolumeByDrag);
            window.addEventListener('mouseup', this._stopDragOnMouseUp);
            this._$muteButton.addEventListener('click', this._onButtonClick);
        };
        VolumeView.prototype._unbindEvents = function () {
            this._$hitbox.removeEventListener('wheel', this._setVolumeByWheel);
            this._$hitbox.removeEventListener('mousedown', this._startDragOnMouseDown);
            window.removeEventListener('mousemove', this._setVolumeByDrag);
            window.removeEventListener('mouseup', this._stopDragOnMouseUp);
            this._$muteButton.removeEventListener('click', this._onButtonClick);
        };
        VolumeView.prototype._startDragOnMouseDown = function (event) {
            if (event.button > 1) {
                return;
            }
            this._setVolumeByClick(event);
            this._startDrag();
        };
        VolumeView.prototype._stopDragOnMouseUp = function (event) {
            if (event.button > 1) {
                return;
            }
            this._stopDrag();
        };
        VolumeView.prototype._setVolumeByClick = function (event) {
            this._$volumeNode.focus();
            var percent = getPercentBasedOnXPosition$1(event, this._$hitbox);
            this._callbacks.onVolumeLevelChangeFromInput(percent);
        };
        VolumeView.prototype._setVolumeByDrag = function (event) {
            var percent = getPercentBasedOnXPosition$1(event, this._$hitbox);
            if (this._isDragging) {
                this._callbacks.onVolumeLevelChangeFromInput(percent);
            }
        };
        VolumeView.prototype._setVolumeByWheel = function (e) {
            e.preventDefault();
            var value = e.deltaX || e.deltaY * -1;
            if (!value) {
                return;
            }
            this._callbacks.onVolumeLevelChangeFromWheel(value);
        };
        VolumeView.prototype._startDrag = function () {
            this._isDragging = true;
            this._$node.classList.add(this.styleNames.isDragging);
            this._callbacks.onDragStart();
        };
        VolumeView.prototype._stopDrag = function () {
            if (this._isDragging) {
                this._isDragging = false;
                this._$node.classList.remove(this.styleNames.isDragging);
                this._callbacks.onDragEnd();
            }
        };
        VolumeView.prototype._setVolumeDOMAttributes = function (percent) {
            this._$volumeNode.setAttribute('value', String(percent));
            this._$volumeNode.setAttribute('aria-valuetext', this._textMap.get(TEXT_LABELS.VOLUME_CONTROL_VALUE, { percent: percent }));
            this._$volumeNode.setAttribute('aria-valuenow', String(percent));
            this._$volumeNode.setAttribute(DATA_VOLUME, String(percent));
            this._$volume.setAttribute('style', "width:" + percent + "%;");
            this._$node.setAttribute(DATA_VOLUME, String(percent));
            var iconTemplateProps = {
                styles: this.styleNames,
                themeStyles: this.themeStyles,
            };
            if (percent >= MAX_VOLUME_ICON_RANGE) {
                this._$muteButton.innerHTML = anonymous$28(iconTemplateProps);
            }
            else if (percent > 0) {
                this._$muteButton.innerHTML = anonymous$27(iconTemplateProps);
            }
            else {
                this._$muteButton.innerHTML = anonymous$26(iconTemplateProps);
            }
        };
        VolumeView.prototype._onButtonClick = function () {
            this._$muteButton.focus();
            this._callbacks.onToggleMuteClick();
        };
        VolumeView.prototype.setVolume = function (volume) {
            this._setVolumeDOMAttributes(volume);
        };
        VolumeView.prototype.setMute = function (isMuted) {
            this._setMuteDOMAttributes(isMuted);
        };
        VolumeView.prototype._setMuteDOMAttributes = function (isMuted) {
            if (isMuted) {
                this._$muteButton.innerHTML = anonymous$26({
                    styles: this.styleNames,
                    themeStyles: this.themeStyles,
                });
            }
            this._$node.setAttribute(DATA_IS_MUTED, String(isMuted));
            this._$muteButton.setAttribute('aria-label', isMuted
                ? this._textMap.get(TEXT_LABELS.UNMUTE_CONTROL_LABEL)
                : this._textMap.get(TEXT_LABELS.MUTE_CONTROL_LABEL));
            this._muteButtonTooltipReference.setText(isMuted
                ? this._textMap.get(TEXT_LABELS.UNMUTE_CONTROL_TOOLTIP)
                : this._textMap.get(TEXT_LABELS.MUTE_CONTROL_TOOLTIP));
        };
        VolumeView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        VolumeView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        VolumeView.prototype.getNode = function () {
            return this._$node;
        };
        VolumeView.prototype.getButtonNode = function () {
            return this._$muteButton;
        };
        VolumeView.prototype.getInputNode = function () {
            return this._$volumeNode;
        };
        VolumeView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            this._muteButtonTooltipReference.destroy();
            this._muteButtonTooltipReference = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$muteButton = null;
            this._$node = null;
            this._textMap = null;
        };
        return VolumeView;
    }(View));
    VolumeView.setTheme(volumeViewTheme);
    VolumeView.extendStyleNames(styles$16);

    var VolumeControl = /** @class */ (function () {
        function VolumeControl(_a) {
            var engine = _a.engine, eventEmitter = _a.eventEmitter, textMap = _a.textMap, tooltipService = _a.tooltipService, theme = _a.theme;
            this._engine = engine;
            this._eventEmitter = eventEmitter;
            this._textMap = textMap;
            this._tooltipService = tooltipService;
            this._theme = theme;
            this._isMuted = this._engine.getMute();
            this._volume = this._engine.getVolume();
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
            this.view.setVolume(this._volume);
            this.view.setMute(this._isMuted);
            this._initInterceptor();
        }
        Object.defineProperty(VolumeControl.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        VolumeControl.prototype._initUI = function () {
            var config = {
                callbacks: {
                    onDragStart: this._broadcastDragStart,
                    onDragEnd: this._broadcastDragEnd,
                    onVolumeLevelChangeFromInput: this._getVolumeLevelFromInput,
                    onVolumeLevelChangeFromWheel: this._getVolumeLevelFromWheel,
                    onToggleMuteClick: this._toggleMuteStatus,
                },
                theme: this._theme,
                textMap: this._textMap,
                tooltipService: this._tooltipService,
            };
            this.view = new VolumeControl.View(config);
        };
        VolumeControl.prototype._initInterceptor = function () {
            var _this = this;
            this._buttonInterceptor = new KeyboardInterceptorCore(this.view.getButtonNode(), (_a = {}, _a[KEYCODES.SPACE_BAR] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(_this._isMuted
                        ? UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED
                        : UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED);
                }, _a[KEYCODES.ENTER] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(_this._isMuted
                        ? UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED
                        : UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED);
                }, _a));
            this._inputInterceptor = new KeyboardInterceptorCore(this.view.getInputNode(), (_b = {}, _b[KEYCODES.RIGHT_ARROW] = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.setMute(false);
                    _this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
                }, _b[KEYCODES.LEFT_ARROW] = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._eventEmitter.emit(UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
                    _this._engine.setMute(false);
                    _this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
                }, _b));
            var _a, _b;
        };
        VolumeControl.prototype._destroyInterceptor = function () {
            this._buttonInterceptor.destroy();
            this._inputInterceptor.destroy();
        };
        VolumeControl.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([[VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus]], this);
        };
        VolumeControl.prototype._bindCallbacks = function () {
            this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
            this._toggleMuteStatus = this._toggleMuteStatus.bind(this);
            this._getVolumeLevelFromWheel = this._getVolumeLevelFromWheel.bind(this);
            this._broadcastDragStart = this._broadcastDragStart.bind(this);
            this._broadcastDragEnd = this._broadcastDragEnd.bind(this);
        };
        VolumeControl.prototype._broadcastDragStart = function () {
            this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_START);
        };
        VolumeControl.prototype._broadcastDragEnd = function () {
            this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_END);
        };
        VolumeControl.prototype._changeVolumeLevel = function (level) {
            this._engine.setVolume(level);
            this._eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE_TRIGGERED, level);
        };
        VolumeControl.prototype._toggleMuteStatus = function () {
            this._engine.setMute(!this._isMuted);
            this._eventEmitter.emit(UI_EVENTS.MUTE_STATUS_TRIGGERED, !this._isMuted);
        };
        VolumeControl.prototype._getVolumeLevelFromWheel = function (delta) {
            var adjustedVolume = this._volume + delta / 10;
            var validatedVolume = Math.min(100, Math.max(0, adjustedVolume));
            this._changeVolumeStatus(validatedVolume);
        };
        VolumeControl.prototype._getVolumeLevelFromInput = function (level) {
            this._changeVolumeStatus(level);
        };
        VolumeControl.prototype._changeVolumeStatus = function (level) {
            this._changeVolumeLevel(level);
            if (this._isMuted) {
                this._toggleMuteStatus();
            }
        };
        VolumeControl.prototype._updateVolumeStatus = function () {
            this.setVolumeLevel(this._engine.getVolume());
            this.setMuteStatus(this._engine.getMute());
        };
        VolumeControl.prototype.setVolumeLevel = function (level) {
            if (level === this._volume) {
                return;
            }
            this._volume = level;
            this.view.setVolume(this._volume);
            this.view.setMute(Boolean(!this._volume));
        };
        VolumeControl.prototype.setMuteStatus = function (isMuted) {
            if (isMuted === this._isMuted) {
                return;
            }
            this._isMuted = isMuted;
            this.view.setVolume(this._isMuted ? 0 : this._volume);
            this.view.setMute(this._isMuted || Boolean(!this._volume));
        };
        VolumeControl.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        VolumeControl.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        VolumeControl.prototype.destroy = function () {
            this._destroyInterceptor();
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._engine = null;
            this._textMap = null;
        };
        VolumeControl.moduleName = 'volumeControl';
        VolumeControl.View = VolumeView;
        VolumeControl.dependencies = [
            'engine',
            'eventEmitter',
            'textMap',
            'tooltipService',
            'theme',
        ];
        return VolumeControl;
    }());

    function anonymous$30(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 100%; height: 1px; overflow: visible"> <!-- padding-bottom: 100% * height/width --> <path class="'+(props.themeStyles.fullScreenSvgFill)+'" fill-rule="evenodd" d="M2 10H0v4h4v-2H2v-2zM0 1v3h2V2h2V0H0v1zm14-1h-4v2h2v2h2V0zm-2 12h-2v2h4v-4h-2v2z"/> </svg></div>';return out;
    }

    function anonymous$31(props
    /*``*/) {
    var out='<div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 100%; height: 1px; overflow: visible" > <!-- padding-bottom: 100% * height/width --> <path class="'+(props.themeStyles.fullScreenSvgFill)+'" fill-rule="evenodd" d="M4 21h2v-6H0v2h4v4zM6 0H4v4H0v2h6V0zm9 6h6V4h-4V0h-2v6zm2 11h4v-2h-6v6h2v-4z"/> </svg></div>';return out;
    }

    function anonymous$32(props
    /*``*/) {
    var out='<div class="'+(props.styles.fullScreenControl)+'" data-hook="full-screen-control" data-is-in-full-screen="false"> <button class="'+(props.styles.fullScreenToggle)+' '+(props.styles.controlButton)+'" data-hook="full-screen-button" aria-label="'+(props.texts.label)+'" type="button" tabindex="0"/></div>';return out;
    }

    var fullScreenViewTheme = {
        fullScreenSvgFill: {
            fill: function (data) { return data.color; },
        },
    };

    var css$17 = ".full-screen__controlButton___3i-tz {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .full-screen__controlButton___3i-tz:hover {\n    opacity: .7; }\n  .full-screen__hidden___3BgVZ {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .full-screen__fullScreenControl___ng08Y {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center; }\n  .full-screen__fullScreenToggle___2T_-2 {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  min-height: 26px;\n  -webkit-transition: -webkit-transform .2s;\n  transition: -webkit-transform .2s;\n  transition: transform .2s;\n  transition: transform .2s, -webkit-transform .2s; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .full-screen__fullScreenToggle___2T_-2 {\n    width: 35px;\n    min-width: 35px;\n    height: 35px;\n    min-height: 21px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .full-screen__fullScreenToggle___2T_-2 .full-screen__icon___3x8Mv {\n      width: 21px;\n      height: 21px; }\n  .full-screen__fullScreenToggle___2T_-2 .full-screen__icon___3x8Mv {\n    width: 14px;\n    min-width: 14px;\n    height: 14px;\n    min-height: 14px; }\n  .full-screen__fullScreenToggle___2T_-2:hover {\n    -webkit-transform: scale(1.18);\n            transform: scale(1.18); }\n  .full-screen__fullScreenToggle___2T_-2.full-screen__inFullScreen___3F0AO:hover {\n    -webkit-transform: scale(0.8);\n            transform: scale(0.8); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZ1bGwtc2NyZWVuLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixxQ0FBNkI7RUFBN0IsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLFlBQVksRUFBRTtFQUVsQjtFQUNFLDhCQUE4QjtFQUM5QixvQkFBb0I7RUFDcEIsd0JBQXdCO0VBQ3hCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixzQkFBc0IsRUFBRTtFQUUxQjtFQUNFLG1CQUFtQjtFQUNuQixxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLDBCQUFvQjtNQUFwQix1QkFBb0I7VUFBcEIsb0JBQW9CO0VBQ3BCLHlCQUF3QjtNQUF4QixzQkFBd0I7VUFBeEIsd0JBQXdCLEVBQUU7RUFFNUI7RUFDRSxZQUFZO0VBQ1osZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYixpQkFBaUI7RUFDakIsMENBQTBCO0VBQTFCLGtDQUEwQjtFQUExQiwwQkFBMEI7RUFBMUIsaURBQTBCLEVBQUU7RUFDNUI7SUFDRSxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixpQkFBaUIsRUFBRTtFQUNuQjtNQUNFLFlBQVk7TUFDWixhQUFhLEVBQUU7RUFDbkI7SUFDRSxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixpQkFBaUIsRUFBRTtFQUNyQjtJQUNFLCtCQUF1QjtZQUF2Qix1QkFBdUIsRUFBRTtFQUMzQjtJQUNFLDhCQUFzQjtZQUF0QixzQkFBc0IsRUFBRSIsImZpbGUiOiJmdWxsLXNjcmVlbi5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRyb2xCdXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eTtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmNvbnRyb2xCdXR0b246aG92ZXIge1xuICAgIG9wYWNpdHk6IC43OyB9XG5cbi5oaWRkZW4ge1xuICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDAgIWltcG9ydGFudDsgfVxuXG4uZnVsbFNjcmVlbkNvbnRyb2wge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyOyB9XG5cbi5mdWxsU2NyZWVuVG9nZ2xlIHtcbiAgd2lkdGg6IDI2cHg7XG4gIG1pbi13aWR0aDogMjZweDtcbiAgaGVpZ2h0OiAyNnB4O1xuICBtaW4taGVpZ2h0OiAyNnB4O1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjJzOyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLmZ1bGxTY3JlZW5Ub2dnbGUge1xuICAgIHdpZHRoOiAzNXB4O1xuICAgIG1pbi13aWR0aDogMzVweDtcbiAgICBoZWlnaHQ6IDM1cHg7XG4gICAgbWluLWhlaWdodDogMjFweDsgfVxuICAgIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLmZ1bGxTY3JlZW5Ub2dnbGUgLmljb24ge1xuICAgICAgd2lkdGg6IDIxcHg7XG4gICAgICBoZWlnaHQ6IDIxcHg7IH1cbiAgLmZ1bGxTY3JlZW5Ub2dnbGUgLmljb24ge1xuICAgIHdpZHRoOiAxNHB4O1xuICAgIG1pbi13aWR0aDogMTRweDtcbiAgICBoZWlnaHQ6IDE0cHg7XG4gICAgbWluLWhlaWdodDogMTRweDsgfVxuICAuZnVsbFNjcmVlblRvZ2dsZTpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjE4KTsgfVxuICAuZnVsbFNjcmVlblRvZ2dsZS5pbkZ1bGxTY3JlZW46aG92ZXIge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44KTsgfVxuIl19 */";
    var styles$17 = {"controlButton":"full-screen__controlButton___3i-tz","hidden":"full-screen__hidden___3BgVZ","fullScreenControl":"full-screen__fullScreenControl___ng08Y","fullScreenToggle":"full-screen__fullScreenToggle___2T_-2","icon":"full-screen__icon___3x8Mv","inFullScreen":"full-screen__inFullScreen___3F0AO"};
    styleInject(css$17);

    var DATA_IS_IN_FULL_SCREEN = 'data-is-in-full-screen';
    var FullScreenView = /** @class */ (function (_super) {
        __extends(FullScreenView, _super);
        function FullScreenView(config) {
            var _this = this;
            var callbacks = config.callbacks, textMap = config.textMap, tooltipService = config.tooltipService, theme = config.theme;
            _this = _super.call(this, theme) || this;
            _this._callbacks = callbacks;
            _this._textMap = textMap;
            _this._$node = htmlToElement(anonymous$32({
                styles: _this.styleNames,
                texts: {
                    label: _this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_LABEL),
                },
            }));
            _this._$toggleFullScreenControl = getElementByHook(_this._$node, 'full-screen-button');
            _this._tooltipReference = tooltipService.createReference(_this._$toggleFullScreenControl, {
                text: _this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP),
            });
            _this.setState({ isInFullScreen: false });
            _this._bindEvents();
            return _this;
        }
        FullScreenView.prototype._bindEvents = function () {
            this._onButtonClick = this._onButtonClick.bind(this);
            this._$toggleFullScreenControl.addEventListener('click', this._onButtonClick);
        };
        FullScreenView.prototype._unbindEvents = function () {
            this._$toggleFullScreenControl.removeEventListener('click', this._onButtonClick);
        };
        FullScreenView.prototype._onButtonClick = function () {
            this._$toggleFullScreenControl.focus();
            this._callbacks.onButtonClick();
        };
        FullScreenView.prototype.setState = function (_a) {
            var isInFullScreen = _a.isInFullScreen;
            if (isInFullScreen) {
                this._$toggleFullScreenControl.classList.add(this.styleNames.inFullScreen);
                this._$toggleFullScreenControl.innerHTML = anonymous$31({
                    styles: this.styleNames,
                    themeStyles: this.themeStyles,
                });
                this._$toggleFullScreenControl.setAttribute('aria-label', this._textMap.get(TEXT_LABELS.EXIT_FULL_SCREEN_LABEL));
                this._tooltipReference.setText(this._textMap.get(TEXT_LABELS.EXIT_FULL_SCREEN_TOOLTIP));
            }
            else {
                this._$toggleFullScreenControl.classList.remove(this.styleNames.inFullScreen);
                this._$toggleFullScreenControl.innerHTML = anonymous$30({
                    styles: this.styleNames,
                    themeStyles: this.themeStyles,
                });
                this._$toggleFullScreenControl.setAttribute('aria-label', this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_LABEL));
                this._tooltipReference.setText(this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP));
            }
            this._$node.setAttribute(DATA_IS_IN_FULL_SCREEN, String(isInFullScreen));
        };
        FullScreenView.prototype.hide = function () {
            this._$node.classList.add(this.styleNames.hidden);
        };
        FullScreenView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        FullScreenView.prototype.getNode = function () {
            return this._$node;
        };
        FullScreenView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            this._tooltipReference.destroy();
            this._tooltipReference = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$toggleFullScreenControl = null;
            this._$node = null;
            this._textMap = null;
        };
        return FullScreenView;
    }(View));
    FullScreenView.setTheme(fullScreenViewTheme);
    FullScreenView.extendStyleNames(styles$17);

    var FullScreenControl = /** @class */ (function () {
        function FullScreenControl(_a) {
            var eventEmitter = _a.eventEmitter, fullScreenManager = _a.fullScreenManager, textMap = _a.textMap, tooltipService = _a.tooltipService, theme = _a.theme;
            this._eventEmitter = eventEmitter;
            this._fullScreenManager = fullScreenManager;
            this._textMap = textMap;
            this._theme = theme;
            this._tooltipService = tooltipService;
            this._isInFullScreen = null;
            this._bindCallbacks();
            this._initUI();
            this._bindEvents();
            this.setControlStatus(false);
            if (!this._fullScreenManager.isEnabled) {
                this.hide();
            }
            this._initInterceptor();
        }
        Object.defineProperty(FullScreenControl.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        FullScreenControl.prototype._bindCallbacks = function () {
            this._toggleFullScreen = this._toggleFullScreen.bind(this);
        };
        FullScreenControl.prototype._bindEvents = function () {
            this._unbindEvents = this._eventEmitter.bindEvents([[UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.setControlStatus]], this);
        };
        FullScreenControl.prototype._initUI = function () {
            var config = {
                callbacks: {
                    onButtonClick: this._toggleFullScreen,
                },
                textMap: this._textMap,
                tooltipService: this._tooltipService,
                theme: this._theme,
            };
            this.view = new FullScreenControl.View(config);
        };
        FullScreenControl.prototype._initInterceptor = function () {
            var _this = this;
            this._interceptor = new KeyboardInterceptorCore(this.node, (_a = {}, _a[KEYCODES.SPACE_BAR] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                }, _a[KEYCODES.ENTER] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                }, _a));
            var _a;
        };
        FullScreenControl.prototype._destroyInterceptor = function () {
            this._interceptor.destroy();
        };
        FullScreenControl.prototype._toggleFullScreen = function () {
            if (this._isInFullScreen) {
                this._exitFullScreen();
            }
            else {
                this._enterFullScreen();
            }
        };
        FullScreenControl.prototype._enterFullScreen = function () {
            this._fullScreenManager.enterFullScreen();
        };
        FullScreenControl.prototype._exitFullScreen = function () {
            this._fullScreenManager.exitFullScreen();
        };
        FullScreenControl.prototype.setControlStatus = function (isInFullScreen) {
            this._isInFullScreen = isInFullScreen;
            this.view.setState({ isInFullScreen: this._isInFullScreen });
        };
        FullScreenControl.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        FullScreenControl.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        FullScreenControl.prototype.destroy = function () {
            this._destroyInterceptor();
            this._unbindEvents();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._fullScreenManager = null;
            this._textMap = null;
        };
        FullScreenControl.moduleName = 'fullScreenControl';
        FullScreenControl.View = FullScreenView;
        FullScreenControl.dependencies = [
            'eventEmitter',
            'fullScreenManager',
            'textMap',
            'tooltipService',
            'theme',
        ];
        return FullScreenControl;
    }());

    function anonymous$33(props
    /*``*/) {
    var out='<div class="'+(props.styles.logoWrapper)+'"> <img class="'+(props.styles.companyLogo)+'" data-hook="company-logo" aria-label="'+(props.texts.label)+'" role="button" tabindex="0" /> <button class="'+(props.styles.logoPlaceholder)+' '+(props.styles.controlButton)+'" data-hook="logo-placeholder" type="button" tabindex="0"> <div class="'+(props.styles.icon)+'"> <svg xmlns="http://www.w3.org/2000/svg" tabindex="0" viewBox="0 0 14 14" preserveAspectRatio="xMidYMin slice" width="100%" style="padding-bottom: 127%; height: 1px; overflow: visible"> <path fill="#FFF" fill-rule="evenodd" d="M2 12h10v-2h2v4H0V0h4v2H2v10zm10-8.515L7.414 8.071 6 6.657 10.657 2H9.004V0H14v5.005h-2v-1.52z"/> </svg> </div> </button></div>';return out;
    }

    var css$18 = ".logo__controlButton___owdbK {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  cursor: pointer;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n  opacity: 1;\n  border: 0;\n  border-radius: 0;\n  outline: none;\n  background-color: transparent;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .logo__controlButton___owdbK:hover {\n    opacity: .7; }\n  .logo__hidden___Pm6t6 {\n  visibility: hidden !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  opacity: 0 !important; }\n  .logo__logoWrapper___2HWRo {\n  position: relative;\n  z-index: 3;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s;\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  opacity: 1;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .logo__logoWrapper___2HWRo.logo__link___2XuNd {\n    cursor: pointer; }\n  .logo__logoWrapper___2HWRo.logo__link___2XuNd:hover .logo__logoPlaceholder___14fTk,\n    .logo__logoWrapper___2HWRo.logo__link___2XuNd:hover img {\n      opacity: .7; }\n  .logo__companyLogo___2YJGv {\n  max-width: 125px;\n  max-height: 26px;\n  -webkit-transition: opacity .2s, visibility .2s;\n  transition: opacity .2s, visibility .2s; }\n  div[data-hook='player-container'][max-width~=\"550px\"] .logo__companyLogo___2YJGv {\n    max-width: 90px;\n    max-height: 20px; }\n  div[data-hook='player-container'][max-width~=\"350px\"] .logo__companyLogo___2YJGv {\n    max-width: 70px;\n    max-height: 18px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .logo__companyLogo___2YJGv {\n    max-width: 450px;\n    max-height: 36px; }\n  .logo__logoPlaceholder___14fTk {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  min-height: 26px;\n  -webkit-transition: -webkit-transform .2s;\n  transition: -webkit-transform .2s;\n  transition: transform .2s;\n  transition: transform .2s, -webkit-transform .2s; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .logo__logoPlaceholder___14fTk {\n    width: 35px;\n    min-width: 35px;\n    height: 35px;\n    min-height: 35px; }\n  div[data-hook='player-container'][data-in-full-screen='true'] .logo__logoPlaceholder___14fTk .logo__icon___39sTd {\n      width: 21px;\n      min-width: 21px;\n      height: 21px;\n      min-height: 21px; }\n  .logo__logoPlaceholder___14fTk .logo__icon___39sTd {\n    width: 14px;\n    min-width: 14px;\n    height: 14px;\n    min-height: 14px; }\n  .logo__logoPlaceholder___14fTk:hover {\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ28uc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixpQ0FBeUI7VUFBekIseUJBQXlCO0VBQ3pCLHFDQUE2QjtFQUE3Qiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLFVBQVU7RUFDVixpQkFBaUI7RUFDakIsY0FBYztFQUNkLDhCQUE4QjtFQUM5Qix5QkFBd0I7TUFBeEIsc0JBQXdCO1VBQXhCLHdCQUF3QjtFQUN4QiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQixFQUFFO0VBQ3RCO0lBQ0UsWUFBWSxFQUFFO0VBRWxCO0VBQ0UsOEJBQThCO0VBQzlCLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIscUJBQXFCO0VBQ3JCLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsc0JBQXNCO0VBQ3RCLHNCQUFzQixFQUFFO0VBRTFCO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLGdEQUF3QztFQUF4Qyx3Q0FBd0M7RUFDeEMsaUNBQXlCO1VBQXpCLHlCQUF5QjtFQUN6QixXQUFXO0VBQ1gseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTtFQUN0QjtJQUNFLGdCQUFnQixFQUFFO0VBQ2xCOztNQUVFLFlBQVksRUFBRTtFQUVwQjtFQUNFLGlCQUFpQjtFQUNqQixpQkFBaUI7RUFDakIsZ0RBQXdDO0VBQXhDLHdDQUF3QyxFQUFFO0VBQzFDO0lBQ0UsZ0JBQWdCO0lBQ2hCLGlCQUFpQixFQUFFO0VBQ3JCO0lBQ0UsZ0JBQWdCO0lBQ2hCLGlCQUFpQixFQUFFO0VBQ3JCO0lBQ0UsaUJBQWlCO0lBQ2pCLGlCQUFpQixFQUFFO0VBRXZCO0VBQ0UsWUFBWTtFQUNaLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsaUJBQWlCO0VBQ2pCLDBDQUEwQjtFQUExQixrQ0FBMEI7RUFBMUIsMEJBQTBCO0VBQTFCLGlEQUEwQixFQUFFO0VBQzVCO0lBQ0UsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsaUJBQWlCLEVBQUU7RUFDbkI7TUFDRSxZQUFZO01BQ1osZ0JBQWdCO01BQ2hCLGFBQWE7TUFDYixpQkFBaUIsRUFBRTtFQUN2QjtJQUNFLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLGlCQUFpQixFQUFFO0VBQ3JCO0lBQ0UsOEJBQXNCO1lBQXRCLHNCQUFzQixFQUFFIiwiZmlsZSI6ImxvZ28uc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250cm9sQnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAuMnM7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG4gIG9wYWNpdHk6IDE7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4gIC5jb250cm9sQnV0dG9uOmhvdmVyIHtcbiAgICBvcGFjaXR5OiAuNzsgfVxuXG4uaGlkZGVuIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuICFpbXBvcnRhbnQ7XG4gIHdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbWluLWhlaWdodDogMCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICBvcGFjaXR5OiAwICFpbXBvcnRhbnQ7IH1cblxuLmxvZ29XcmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAzO1xuICBkaXNwbGF5OiBmbGV4O1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4ycywgdmlzaWJpbGl0eSAuMnM7XG4gIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcbiAgb3BhY2l0eTogMTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH1cbiAgLmxvZ29XcmFwcGVyLmxpbmsge1xuICAgIGN1cnNvcjogcG9pbnRlcjsgfVxuICAgIC5sb2dvV3JhcHBlci5saW5rOmhvdmVyIC5sb2dvUGxhY2Vob2xkZXIsXG4gICAgLmxvZ29XcmFwcGVyLmxpbms6aG92ZXIgaW1nIHtcbiAgICAgIG9wYWNpdHk6IC43OyB9XG5cbi5jb21wYW55TG9nbyB7XG4gIG1heC13aWR0aDogMTI1cHg7XG4gIG1heC1oZWlnaHQ6IDI2cHg7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzLCB2aXNpYmlsaXR5IC4yczsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bbWF4LXdpZHRofj1cIjU1MHB4XCJdIC5jb21wYW55TG9nbyB7XG4gICAgbWF4LXdpZHRoOiA5MHB4O1xuICAgIG1heC1oZWlnaHQ6IDIwcHg7IH1cbiAgZGl2W2RhdGEtaG9vaz0ncGxheWVyLWNvbnRhaW5lciddW21heC13aWR0aH49XCIzNTBweFwiXSAuY29tcGFueUxvZ28ge1xuICAgIG1heC13aWR0aDogNzBweDtcbiAgICBtYXgtaGVpZ2h0OiAxOHB4OyB9XG4gIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLmNvbXBhbnlMb2dvIHtcbiAgICBtYXgtd2lkdGg6IDQ1MHB4O1xuICAgIG1heC1oZWlnaHQ6IDM2cHg7IH1cblxuLmxvZ29QbGFjZWhvbGRlciB7XG4gIHdpZHRoOiAyNnB4O1xuICBtaW4td2lkdGg6IDI2cHg7XG4gIGhlaWdodDogMjZweDtcbiAgbWluLWhlaWdodDogMjZweDtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC4yczsgfVxuICBkaXZbZGF0YS1ob29rPSdwbGF5ZXItY29udGFpbmVyJ11bZGF0YS1pbi1mdWxsLXNjcmVlbj0ndHJ1ZSddIC5sb2dvUGxhY2Vob2xkZXIge1xuICAgIHdpZHRoOiAzNXB4O1xuICAgIG1pbi13aWR0aDogMzVweDtcbiAgICBoZWlnaHQ6IDM1cHg7XG4gICAgbWluLWhlaWdodDogMzVweDsgfVxuICAgIGRpdltkYXRhLWhvb2s9J3BsYXllci1jb250YWluZXInXVtkYXRhLWluLWZ1bGwtc2NyZWVuPSd0cnVlJ10gLmxvZ29QbGFjZWhvbGRlciAuaWNvbiB7XG4gICAgICB3aWR0aDogMjFweDtcbiAgICAgIG1pbi13aWR0aDogMjFweDtcbiAgICAgIGhlaWdodDogMjFweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDIxcHg7IH1cbiAgLmxvZ29QbGFjZWhvbGRlciAuaWNvbiB7XG4gICAgd2lkdGg6IDE0cHg7XG4gICAgbWluLXdpZHRoOiAxNHB4O1xuICAgIGhlaWdodDogMTRweDtcbiAgICBtaW4taGVpZ2h0OiAxNHB4OyB9XG4gIC5sb2dvUGxhY2Vob2xkZXI6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMS4yKTsgfVxuIl19 */";
    var styles$18 = {"controlButton":"logo__controlButton___owdbK","hidden":"logo__hidden___Pm6t6","logoWrapper":"logo__logoWrapper___2HWRo","link":"logo__link___2XuNd","logoPlaceholder":"logo__logoPlaceholder___14fTk","companyLogo":"logo__companyLogo___2YJGv","icon":"logo__icon___39sTd"};
    styleInject(css$18);

    var LogoView = /** @class */ (function (_super) {
        __extends(LogoView, _super);
        function LogoView(config) {
            var _this = _super.call(this) || this;
            var callbacks = config.callbacks, textMap = config.textMap, tooltipService = config.tooltipService;
            _this._callbacks = callbacks;
            _this._textMap = textMap;
            _this._$node = htmlToElement(anonymous$33({
                styles: _this.styleNames,
                texts: {
                    label: _this._textMap.get(TEXT_LABELS.LOGO_LABEL),
                },
            }));
            _this._$logo = getElementByHook(_this._$node, 'company-logo');
            _this._$placeholder = getElementByHook(_this._$node, 'logo-placeholder');
            _this._tooltipReference = tooltipService.createReference(_this._$node, {
                text: _this._textMap.get(TEXT_LABELS.LOGO_TOOLTIP),
            });
            _this.setLogo(config.logo);
            _this._bindCallbacks();
            _this._bindEvents();
            return _this;
        }
        LogoView.prototype.setLogo = function (url) {
            if (url) {
                this._$logo.classList.remove(this.styleNames.hidden);
                this._$placeholder.classList.add(this.styleNames.hidden);
                this._$logo.setAttribute('src', url);
            }
            else {
                this._$logo.classList.add(this.styleNames.hidden);
                this._$placeholder.classList.remove(this.styleNames.hidden);
                this._$logo.removeAttribute('src');
            }
        };
        LogoView.prototype.setDisplayAsLink = function (flag) {
            if (flag) {
                this._$node.classList.add(this.styleNames.link);
                this._tooltipReference.enable();
            }
            else {
                this._$node.classList.remove(this.styleNames.link);
                this._tooltipReference.disable();
            }
        };
        LogoView.prototype._bindCallbacks = function () {
            this._onNodeClick = this._onNodeClick.bind(this);
        };
        LogoView.prototype._bindEvents = function () {
            this._$node.addEventListener('click', this._onNodeClick);
        };
        LogoView.prototype._unbindEvents = function () {
            this._$node.removeEventListener('click', this._onNodeClick);
        };
        LogoView.prototype._onNodeClick = function () {
            this._$node.focus();
            this._callbacks.onLogoClick();
        };
        LogoView.prototype.show = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        LogoView.prototype.hide = function () {
            this._$node.classList.remove(this.styleNames.hidden);
        };
        LogoView.prototype.getNode = function () {
            return this._$node;
        };
        LogoView.prototype.destroy = function () {
            this._unbindEvents();
            this._callbacks = null;
            this._tooltipReference.destroy();
            this._tooltipReference = null;
            if (this._$node.parentNode) {
                this._$node.parentNode.removeChild(this._$node);
            }
            this._$node = null;
            this._$logo = null;
            this._$placeholder = null;
            this._tooltipReference = null;
            this._textMap = null;
        };
        return LogoView;
    }(View));
    LogoView.extendStyleNames(styles$18);

    var Logo = /** @class */ (function () {
        function Logo(_a) {
            var eventEmitter = _a.eventEmitter, config = _a.config, textMap = _a.textMap, tooltipService = _a.tooltipService;
            this._eventEmitter = eventEmitter;
            this._textMap = textMap;
            this._tooltipService = tooltipService;
            this._bindCallbacks();
            this._initUI();
            this._initInterceptor();
            var logoConfig = __assign({}, (typeof config.logo === 'object' ? config.logo : {}));
            this.setLogo(logoConfig.src);
            this.setLogoClickCallback(logoConfig.callback);
        }
        Object.defineProperty(Logo.prototype, "node", {
            get: function () {
                return this.view.getNode();
            },
            enumerable: true,
            configurable: true
        });
        Logo.prototype._bindCallbacks = function () {
            this._triggerCallback = this._triggerCallback.bind(this);
        };
        Logo.prototype._initUI = function () {
            var config = {
                callbacks: {
                    onLogoClick: this._triggerCallback,
                },
                textMap: this._textMap,
                tooltipService: this._tooltipService,
            };
            this.view = new Logo.View(config);
        };
        Logo.prototype._initInterceptor = function () {
            var _this = this;
            this._interceptor = new KeyboardInterceptorCore(this.node, (_a = {}, _a[KEYCODES.SPACE_BAR] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._triggerCallback();
                }, _a[KEYCODES.ENTER] = function (e) {
                    e.stopPropagation();
                    _this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
                    _this._triggerCallback();
                }, _a));
            var _a;
        };
        Logo.prototype._destroyInterceptor = function () {
            this._interceptor.destroy();
        };
        Logo.prototype._triggerCallback = function () {
            if (this._callback) {
                this._callback();
            }
        };
        /**
         * Method for setting source of image, that would be used as logo
         * @param src - Source of logo
         * @example
         * player.setLogo('https://example.com/logo.png');
         *
         */
        Logo.prototype.setLogo = function (src) {
            this.view.setLogo(src);
        };
        /**
         * Method for attaching callback for click on logo
         *
         * @param callback - Your function
         *
         * @example
         * const callback = () => {
         *   console.log('Click on title);
         * }
         * player.setLogoClickCallback(callback);
         *
         */
        Logo.prototype.setLogoClickCallback = function (callback) {
            this._callback = callback;
            this.view.setDisplayAsLink(Boolean(this._callback));
        };
        Logo.prototype.hide = function () {
            this.isHidden = true;
            this.view.hide();
        };
        Logo.prototype.show = function () {
            this.isHidden = false;
            this.view.show();
        };
        Logo.prototype.destroy = function () {
            this._destroyInterceptor();
            this.view.destroy();
            this.view = null;
            this._eventEmitter = null;
            this._textMap = null;
        };
        Logo.moduleName = 'logo';
        Logo.View = LogoView;
        Logo.dependencies = ['config', 'eventEmitter', 'textMap', 'tooltipService'];
        __decorate([
            playerAPI()
        ], Logo.prototype, "setLogo", null);
        __decorate([
            playerAPI()
        ], Logo.prototype, "setLogoClickCallback", null);
        return Logo;
    }());

    function anonymous$34(props
    /*``*/) {
    var out='<div class="'+(props.styles.container)+'"> <div class="'+(props.styles.highQualityThumb)+'" data-hook="high-quality-thumb" > </div> <div class="'+(props.styles.lowQualityThumb)+'" data-hook="low-quality-thumb"> </div> <img class="'+(props.styles.highQualityLoader)+'" data-hook="high-quality-loader" /> <img class="'+(props.styles.lowQualityLoader)+'" data-hook="low-quality-loader" /> <div class="'+(props.styles.thumbText)+'" data-hook="thumb-text-block"> </div></div>';return out;
    }

    var css$19 = ".thumbnails__container___3b5xi {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: reverse;\n      -ms-flex-direction: column-reverse;\n          flex-direction: column-reverse;\n  width: 180px;\n  height: 90px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.thumbnails__highQualityThumb___3lKoJ {\n  position: absolute;\n  z-index: 2;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n\n.thumbnails__lowQualityThumb___2w2SL {\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n\n.thumbnails__highQualityLoader___3MIiC {\n  width: 1px;\n  height: 1px;\n  opacity: .1; }\n\n.thumbnails__lowQualityLoader___2BIpo {\n  width: 1px;\n  height: 1px;\n  opacity: .1; }\n\n.thumbnails__thumbText___2uKEQ {\n  position: relative;\n  z-index: 3;\n  bottom: -5px;\n  padding: 2px 5px;\n  background-color: rgba(0, 0, 0, 0.8); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRodW1ibmFpbHMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsNkJBQStCO0VBQS9CLCtCQUErQjtNQUEvQixtQ0FBK0I7VUFBL0IsK0JBQStCO0VBQy9CLGFBQWE7RUFDYixhQUFhO0VBQ2IsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0IsRUFBRTs7QUFFeEI7RUFDRSxtQkFBbUI7RUFDbkIsV0FBVztFQUNYLE9BQU87RUFDUCxTQUFTO0VBQ1QsVUFBVTtFQUNWLFFBQVEsRUFBRTs7QUFFWjtFQUNFLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsT0FBTztFQUNQLFNBQVM7RUFDVCxVQUFVO0VBQ1YsUUFBUSxFQUFFOztBQUVaO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixZQUFZLEVBQUU7O0FBRWhCO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixZQUFZLEVBQUU7O0FBRWhCO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxhQUFhO0VBQ2IsaUJBQWlCO0VBQ2pCLHFDQUFxQyxFQUFFIiwiZmlsZSI6InRodW1ibmFpbHMuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XG4gIHdpZHRoOiAxODBweDtcbiAgaGVpZ2h0OiA5MHB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG5cbi5oaWdoUXVhbGl0eVRodW1iIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAyO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7IH1cblxuLmxvd1F1YWxpdHlUaHVtYiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwOyB9XG5cbi5oaWdoUXVhbGl0eUxvYWRlciB7XG4gIHdpZHRoOiAxcHg7XG4gIGhlaWdodDogMXB4O1xuICBvcGFjaXR5OiAuMTsgfVxuXG4ubG93UXVhbGl0eUxvYWRlciB7XG4gIHdpZHRoOiAxcHg7XG4gIGhlaWdodDogMXB4O1xuICBvcGFjaXR5OiAuMTsgfVxuXG4udGh1bWJUZXh0IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAzO1xuICBib3R0b206IC01cHg7XG4gIHBhZGRpbmc6IDJweCA1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTsgfVxuIl19 */";
    var styleNames = {"container":"thumbnails__container___3b5xi","highQualityThumb":"thumbnails__highQualityThumb___3lKoJ","lowQualityThumb":"thumbnails__lowQualityThumb___2w2SL","highQualityLoader":"thumbnails__highQualityLoader___3MIiC","lowQualityLoader":"thumbnails__lowQualityLoader___2BIpo","thumbText":"thumbnails__thumbText___2uKEQ"};
    styleInject(css$19);

    var Thumbnails = /** @class */ (function () {
        function Thumbnails(_a) {
            var rootContainer = _a.rootContainer, engine = _a.engine;
            this._engine = engine;
            this._bindCallbacks();
            this._initUI();
            rootContainer.appendComponentNode(this.node);
        }
        Thumbnails.prototype._initUI = function () {
            this._node = htmlToElement(anonymous$34({
                styles: styleNames,
            }));
            this._lowLoader = getElementByHook(this._node, 'low-quality-loader');
            this._highLoader = getElementByHook(this._node, 'high-quality-loader');
            this._textBlock = getElementByHook(this._node, 'thumb-text-block');
            this._node_high = getElementByHook(this._node, 'high-quality-thumb');
            this._node_low = getElementByHook(this._node, 'low-quality-thumb');
        };
        Thumbnails.prototype._bindCallbacks = function () {
            this._onLowQualityLoad = this._onLowQualityLoad.bind(this);
            this._onHighQualityLoad = this._onHighQualityLoad.bind(this);
        };
        Object.defineProperty(Thumbnails.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        Thumbnails.prototype.setConfig = function (config) {
            this._config = config;
        };
        Thumbnails.prototype.getAt = function (second) {
            var duration = this._engine.getDurationTime();
            if (!duration) {
                return;
            }
            var playedPercent = second / duration;
            var framesCount = this._config.framesCount;
            var neededFrame = Math.round(framesCount * playedPercent);
            return this._config.qualities.map(function (quality) {
                var framesInSprite = quality.framesInSprite.vert * quality.framesInSprite.horz;
                var frameNumberInSprite = neededFrame % framesInSprite;
                var spriteNumber = Math.floor(neededFrame / framesInSprite);
                var horzPositionInSprite = frameNumberInSprite % quality.framesInSprite.horz;
                var vertPositionInSprite = Math.floor(frameNumberInSprite / quality.framesInSprite.vert);
                var url = "https://storage.googleapis.com/video-player-media-server-static/thumbnails/" + quality.spriteNameMask.replace('%d', spriteNumber);
                return {
                    frameSize: quality.frameSize,
                    framesInSprite: (spriteNumber + 1) * framesInSprite <= framesCount
                        ? quality.framesInSprite
                        : {
                            horz: Math.min(framesCount % framesInSprite, quality.framesInSprite.horz),
                            vert: Math.ceil((framesCount % framesInSprite) / quality.framesInSprite.vert),
                        },
                    framePositionInSprite: {
                        vert: vertPositionInSprite,
                        horz: horzPositionInSprite,
                    },
                    spriteUrl: url,
                };
            });
        };
        Thumbnails.prototype.showAt = function (second) {
            var config = this.getAt(second);
            if (!config) {
                return;
            }
            this._currentConfig = config;
            this._checkHighQuality();
            this._checkLowQuality();
        };
        Thumbnails.prototype._checkLowQuality = function () {
            if (this._lowLoader.src === this._currentConfig[0].spriteUrl) {
                if (!this._lowQualityLoading) {
                    this._applyLowQuality();
                }
            }
            else {
                this._node_low.style.background = '';
                this._loadLowQuality();
            }
        };
        Thumbnails.prototype._checkHighQuality = function () {
            if (this._highLoader.src === this._currentConfig[1].spriteUrl) {
                if (!this._highQualityLoading) {
                    this._applyHighQuality();
                }
            }
            else {
                this._node_high.style.background = '';
                this._loadHighQuality();
            }
        };
        Thumbnails.prototype._onLowQualityLoad = function () {
            this._lowQualityLoading = false;
            this._applyLowQuality();
        };
        Thumbnails.prototype._onHighQualityLoad = function () {
            this._highQualityLoading = false;
            this._applyHighQuality();
        };
        Thumbnails.prototype._loadLowQuality = function () {
            this._lowLoader.onload = this._onLowQualityLoad;
            this._lowLoader.src = this._currentConfig[0].spriteUrl;
            this._lowQualityLoading = true;
        };
        Thumbnails.prototype._loadHighQuality = function () {
            this._highLoader.onload = this._onHighQualityLoad;
            this._highLoader.src = this._currentConfig[1].spriteUrl;
            this._highQualityLoading = true;
        };
        Thumbnails.prototype._applyLowQuality = function () {
            this._applyQualityToNode(this._node_low, this._currentConfig[0]);
        };
        Thumbnails.prototype._applyHighQuality = function () {
            this._applyQualityToNode(this._node_high, this._currentConfig[1]);
        };
        Thumbnails.prototype._applyQualityToNode = function (node, quality) {
            var viewWidth = node.offsetWidth;
            var viewHeight = node.offsetHeight;
            var backgroudWidth = viewWidth * quality.framesInSprite.horz;
            var backgroundHeight = viewHeight * quality.framesInSprite.vert;
            node.style.background = "url('" + quality.spriteUrl + "') -" + viewWidth *
                quality.framePositionInSprite.horz + "px -" + viewHeight *
                quality.framePositionInSprite
                    .vert + "px / " + backgroudWidth + "px " + backgroundHeight + "px";
        };
        Thumbnails.prototype.setTime = function (time) {
            this._textBlock.innerText = time;
        };
        Thumbnails.prototype.showAtPercent = function (percent) {
            this.showAt(percent / 100 * this._engine.getDurationTime());
        };
        Thumbnails.prototype.clear = function () {
            this._node.style.background = '';
        };
        Thumbnails.prototype.destroy = function () {
            this._engine = null;
        };
        Thumbnails.moduleName = 'thumbnails';
        Thumbnails.dependencies = ['rootContainer', 'engine'];
        __decorate([
            playerAPI()
        ], Thumbnails.prototype, "setConfig", null);
        __decorate([
            playerAPI()
        ], Thumbnails.prototype, "getAt", null);
        __decorate([
            playerAPI()
        ], Thumbnails.prototype, "showAt", null);
        return Thumbnails;
    }());

    var asClass$1 = DependencyContainer.asClass;
    var modules = {
        RootContainer: RootContainer,
        EventEmitter: EventEmitterModule,
        Engine: Engine,
        ThemeService: ThemeService,
        TextMap: TextMap,
        FullScreenManager: FullScreenManager,
        LiveStateEngine: LiveStateEngine,
        KeyboardControls: KeyboardControl,
        DebugPanel: DebugPanel,
        Screen: Screen,
        InteractionIndicator: InteractionIndicator,
        Overlay: Overlay,
        Loader: Loader,
        MainUIBlock: MainUIBlock,
        TopBlock: TopBlock,
        LiveIndicator: LiveIndicator,
        Title: TitleControl,
        BottomBlock: BottomBlock,
        ProgressControl: ProgressControl,
        PlayControl: PlayControl,
        TimeControl: TimeControl,
        VolumeControl: VolumeControl,
        FullScreenControl: FullScreenControl,
        Logo: Logo,
        Thumbnails: Thumbnails,
        TooltipService: TooltipService,
    };
    var DIModules = Object.keys(modules).reduce(function (DIModules, key) {
        var module = modules[key];
        if (!module.moduleName) {
            throw new Error("No moduleName in module: " + key);
        }
        DIModules[module.moduleName] = asClass$1(module).scoped();
        return DIModules;
    }, {});

    /**
     * `true` if we are running inside a web browser, `false` otherwise (e.g. running inside Node.js).
     */
    var isBrowser$1 = typeof window !== 'undefined';
    /**
     * This is a map which lists native support of formats and APIs.
     * It gets filled during runtime with the relevant values to the current environment.
     */
    var NativeEnvironmentSupport = {
        MSE: false,
        HLS: false,
        DASH: false,
        MP4: false,
        WEBM: false,
        OGG: false,
        MOV: false,
        MKV: false,
    };
    /* ignore coverage */
    function detectEnvironment() {
        if (!isBrowser$1) {
            return; // Not in a browser
        }
        NativeEnvironmentSupport.MSE =
            'WebKitMediaSource' in window || 'MediaSource' in window;
        var video = document.createElement('video');
        if (typeof video.canPlayType !== 'function') {
            return; // env doesn't support HTMLMediaElement (e.g PhantomJS)
        }
        if (video.canPlayType('application/x-mpegURL') ||
            video.canPlayType('application/vnd.apple.mpegURL')) {
            NativeEnvironmentSupport.HLS = true;
        }
        if (video.canPlayType('application/dash+xml')) {
            NativeEnvironmentSupport.DASH = true;
        }
        if (video.canPlayType('video/mp4')) {
            NativeEnvironmentSupport.MP4 = true;
        }
        if (video.canPlayType('video/webm')) {
            NativeEnvironmentSupport.WEBM = true;
        }
        if (video.canPlayType('video/ogg')) {
            NativeEnvironmentSupport.OGG = true;
        }
        if (video.canPlayType('video/quicktime')) {
            NativeEnvironmentSupport.MOV = true;
        }
        if (video.canPlayType('video/x-matroska')) {
            NativeEnvironmentSupport.MKV = true;
        }
    }
    detectEnvironment(); // Run once

    var NATIVE_ERROR_CODES = {
        ABORTED: 1,
        NETWORK: 2,
        DECODE: 3,
        SRC_NOT_SUPPORTED: 4,
    };
    function getNativeAdapterCreator(streamType, deliveryPriority) {
        var NativeAdapter = /** @class */ (function () {
            function NativeAdapter(eventEmitter) {
                this.mediaStreams = null;
                this.eventEmitter = eventEmitter;
                this.currentLevel = 0;
                this._bindCallbacks();
            }
            NativeAdapter.isSupported = function () {
                return NativeEnvironmentSupport[streamType];
            };
            Object.defineProperty(NativeAdapter.prototype, "currentUrl", {
                get: function () {
                    return this.mediaStreams[this.currentLevel].url;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "syncWithLiveTime", {
                //@ts-ignore
                get: function () {
                    // TODO: implement syncWithLiveTime for `native`
                    return undefined;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "isDynamicContent", {
                get: function () {
                    return !isFinite(this.videoElement.duration);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "isDynamicContentEnded", {
                get: function () {
                    // TODO: implement isDynamicContentEnded
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "isSyncWithLive", {
                get: function () {
                    // TODO: implement isSyncWithLive for `native`
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "isSeekAvailable", {
                get: function () {
                    return true;
                    //Need to find better solution
                    /*
                    if (this.isDynamicContent) {
                      return false;
                    }
              
                    return Boolean(this.videoElement.seekable.length);
                    */
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "mediaStreamDeliveryPriority", {
                get: function () {
                    return deliveryPriority;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "mediaStreamType", {
                get: function () {
                    return streamType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeAdapter.prototype, "debugInfo", {
                get: function () {
                    if (this.videoElement) {
                        var _a = this.videoElement, buffered = _a.buffered, currentTime = _a.currentTime;
                        var overallBufferLength = geOverallBufferLength(buffered);
                        var nearestBufferSegInfo = getNearestBufferSegmentInfo(buffered, currentTime);
                        return __assign({}, this.mediaStreams[0], { deliveryPriority: this.mediaStreamDeliveryPriority, overallBufferLength: overallBufferLength,
                            nearestBufferSegInfo: nearestBufferSegInfo });
                    }
                    return {};
                },
                enumerable: true,
                configurable: true
            });
            NativeAdapter.prototype._bindCallbacks = function () {
                this._broadcastError = this._broadcastError.bind(this);
            };
            NativeAdapter.prototype.canPlay = function (mediaType) {
                return mediaType === streamType;
            };
            NativeAdapter.prototype.setMediaStreams = function (mediaStreams) {
                this.mediaStreams = mediaStreams;
            };
            NativeAdapter.prototype._logError = function (error, errorEvent) {
                this.eventEmitter.emit(VIDEO_EVENTS.ERROR, {
                    errorType: error,
                    streamType: streamType,
                    streamProvider: 'native',
                    errorInstance: errorEvent,
                });
            };
            NativeAdapter.prototype._broadcastError = function () {
                var error = this.videoElement.error;
                if (!error) {
                    this._logError(Errors.UNKNOWN, null);
                    return;
                }
                switch (error.code) {
                    case NATIVE_ERROR_CODES.ABORTED:
                        //No need for broadcasting
                        break;
                    case NATIVE_ERROR_CODES.NETWORK:
                        this._logError(Errors.CONTENT_LOAD, error);
                        break;
                    case NATIVE_ERROR_CODES.DECODE:
                        this._logError(Errors.MEDIA, error);
                        break;
                    case NATIVE_ERROR_CODES.SRC_NOT_SUPPORTED:
                        /*
                          Our url checks would not allow not supported formats, so only case would be
                           when video tag couldn't retriev any info from endpoit
                        */
                        this._logError(Errors.CONTENT_LOAD, error);
                        break;
                    default:
                        this._logError(Errors.UNKNOWN, error);
                        break;
                }
            };
            NativeAdapter.prototype.attach = function (videoElement) {
                this.videoElement = videoElement;
                this.videoElement.addEventListener('error', this._broadcastError);
                this.videoElement.src = this.mediaStreams[this.currentLevel].url;
            };
            NativeAdapter.prototype.detach = function () {
                this.videoElement.removeEventListener('error', this._broadcastError);
                this.videoElement.removeAttribute('src');
                this.videoElement = null;
            };
            return NativeAdapter;
        }());
        return NativeAdapter;
    }

    var defaultPlaybackAdapters = [
        getNativeAdapterCreator(MediaStreamTypes.DASH, MediaStreamDeliveryPriority.NATIVE_ADAPTIVE),
        getNativeAdapterCreator(MediaStreamTypes.HLS, MediaStreamDeliveryPriority.NATIVE_ADAPTIVE),
        getNativeAdapterCreator(MediaStreamTypes.MP4, MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE),
        getNativeAdapterCreator(MediaStreamTypes.WEBM, MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE),
        getNativeAdapterCreator(MediaStreamTypes.OGG, MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE),
        getNativeAdapterCreator(MediaStreamTypes.MOV, MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE),
        getNativeAdapterCreator(MediaStreamTypes.MKV, MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE),
    ];

    var additionalModules = {};
    var playbackAdapters = defaultPlaybackAdapters.slice();
    var container = DependencyContainer.createContainer();
    container.register(DIModules);
    var defaultModulesNames = Object.keys(DIModules);
    function registerModule(id, module) {
        additionalModules[id] = module;
    }
    function registerPlaybackAdapter(adapter) {
        playbackAdapters.push(adapter);
    }
    function clearAdditionalModules() {
        additionalModules = {};
    }
    function clearPlaybackAdapters() {
        playbackAdapters = defaultPlaybackAdapters.slice();
    }
    function create(params, themeConfig) {
        if (params === void 0) { params = {}; }
        var scope = container.createScope();
        var additionalModuleNames = Object.keys(additionalModules);
        if (additionalModuleNames.length) {
            additionalModuleNames.forEach(function (moduleName) {
                return scope.registerClass(moduleName, additionalModules[moduleName], {
                    lifetime: DependencyContainer.Lifetime.Scoped,
                });
            });
        }
        scope.registerValue('availablePlaybackAdapters', playbackAdapters);
        return new Player(params, scope, defaultModulesNames, additionalModuleNames, themeConfig);
    }

    var playerFactoryMethods = /*#__PURE__*/Object.freeze({
        container: container,
        registerModule: registerModule,
        registerPlaybackAdapter: registerPlaybackAdapter,
        clearAdditionalModules: clearAdditionalModules,
        clearPlaybackAdapters: clearPlaybackAdapters,
        create: create
    });

    var Playable = __assign({}, playerFactoryMethods, { UI_EVENTS: UI_EVENTS,
        VIDEO_EVENTS: VIDEO_EVENTS,
        TEXT_LABELS: TEXT_LABELS,
        MEDIA_STREAM_TYPES: MediaStreamTypes,
        MEDIA_STREAM_DELIVERY_PRIORITY: MediaStreamDeliveryPriority,
        ENGINE_STATES: EngineState$1,
        LIVE_STATES: LiveState$1,
        VIDEO_VIEW_MODES: VideoViewMode,
        Tooltip: Tooltip,
        playerAPIDecorator: playerAPI,
        DefaultModules: modules });

    var PreloadTypes;
    (function (PreloadTypes) {
        PreloadTypes["NONE"] = "none";
        PreloadTypes["METADATA"] = "metadata";
        PreloadTypes["AUTO"] = "auto";
    })(PreloadTypes || (PreloadTypes = {}));

    /* ignore coverage */
    describe('Playback e2e test', function () {
        this.timeout(10000);
        var node = document.createElement('div');
        var formatsToTest = [
            {
                type: 'MP4',
                url: 'https://storage.googleapis.com/video-player-media-server-static/sample.mp4',
                supportedByEnv: NativeEnvironmentSupport.MP4,
            },
            {
                type: 'WEBM',
                url: 'https://storage.googleapis.com/video-player-media-server-static/sample.webm',
                supportedByEnv: NativeEnvironmentSupport.WEBM,
            },
        ];
        formatsToTest.forEach(function (formatToTest) {
            if (formatToTest.supportedByEnv) {
                it("allows playback of " + formatToTest.type, function (done) {
                    // TODO: describe `@playerApi` methods in `Player` with TS
                    var player = Playable.create();
                    player.attachToElement(node);
                    player.on(VIDEO_EVENTS.STATE_CHANGED, function (_a) {
                        var nextState = _a.nextState;
                        if (nextState === EngineState$1.PLAYING) {
                            player.off(VIDEO_EVENTS.STATE_CHANGED);
                            player.destroy();
                            done();
                        }
                    });
                    player.setSrc(formatToTest.url);
                    player.play();
                });
                it("allows playback of " + formatToTest.type + " when preload = none", function (done) {
                    var player = Playable.create({
                        preload: PreloadTypes.NONE,
                    });
                    player.attachToElement(node);
                    player.on(VIDEO_EVENTS.STATE_CHANGED, function (_a) {
                        var nextState = _a.nextState;
                        if (nextState === EngineState$1.PLAYING) {
                            player.off(VIDEO_EVENTS.STATE_CHANGED);
                            player.destroy();
                            done();
                        }
                    });
                    player.setSrc(formatToTest.url);
                    player.play();
                });
            }
        });
    });

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=playable-test.bundle.js.map
