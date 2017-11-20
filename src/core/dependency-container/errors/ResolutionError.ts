import ExtendableError from './ExtendableError';

const createErrorMessage = (name, resolutionStack, message?) => {
  resolutionStack = resolutionStack.slice();
  resolutionStack.push(name);
  const resolutionPathString = resolutionStack.join(' -> ');
  let msg = `Could not resolve '${name}'.`;
  if (message) {
    msg += ` ${message} \n\n Resolution path: ${resolutionPathString}`;
  }

  return msg;
};

export default class ResolutionError extends ExtendableError {
  constructor(name, resolutionStack, message?) {
    super(createErrorMessage(name, resolutionStack, message));
  }
}
