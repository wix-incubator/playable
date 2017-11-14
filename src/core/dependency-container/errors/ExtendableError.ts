export default class ExtendableError extends Error {
  constructor(message) {
    super(message);

    Object.defineProperty(this, 'message', {
      enumerable: false,
      value: message
    });

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: this.constructor.name
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
