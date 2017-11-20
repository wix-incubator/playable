import ExtendableError from './ExtendableError';

export default class NotAFunctionError extends ExtendableError {
  constructor(functionName, expectedType, givenType) {
    super(
      `The function ${functionName} expected a ${expectedType}, ${
        givenType
      } given.`,
    );
  }
}
