import { ListenerFn } from 'eventemitter3';

interface IEventMap extends Array<any> {
  [0]: string;
  [1]: ListenerFn;
  [2]?: any;
}

interface IEventEmitter {
  on(event: string, fn: ListenerFn, context?: any): this;
  off(event: string, fn?: ListenerFn, context?: any, once?: boolean): this;
  emit(event: string | symbol, ...args: any[]): Promise<boolean> | void;
  bindEvents(eventsMap: IEventMap[], defaultFnContext?: any): Function;
  destroy(): void;
}

export { IEventEmitter, IEventMap };
