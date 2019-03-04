import { ListenerFn } from 'eventemitter3';

interface IEventMap extends Array<any> {
  [0]: string;
  [1]: ListenerFn;
  [2]?: any;
}

interface IEventEmitter {
  on(event: string, fn: ListenerFn, context?: any): this;
  off(event: string, fn?: ListenerFn, context?: any, once?: boolean): this;
  emitAsync(event: string | symbol, ...args: any[]): Promise<boolean> | void;
  bindEvents(eventsMap: IEventMap[], defaultFnContext?: any): () => void;
  destroy(): void;
}

interface IEventEmitterAPI {
  on?(event: string, fn: ListenerFn, context?: any): this;
  off?(event: string, fn?: ListenerFn, context?: any, once?: boolean): this;
}

export { IEventEmitterAPI, IEventEmitter, IEventMap };
