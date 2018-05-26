import ExtendableError from './ExtendableError';

export default class NotAFunctionError extends ExtendableError {
  constructor(functionName: string, expectedType: string, givenType: string) {
    super(
      `The function ${functionName} expected a ${expectedType}, ${givenType} given.`,
    );
  }
}
