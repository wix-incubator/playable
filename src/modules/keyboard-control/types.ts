interface IKeyboardControl {
  addKeyControl(key: number, callback: EventListener): void;
  destroy(): void;
}

export { IKeyboardControl };
