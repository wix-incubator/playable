// Dom is usually updated on next tick, 4ms standard timeout
const DOM_UPDATE_DELAY = 4;

export const waitForDomUpdate = () => new Promise(resolve => setTimeout(resolve, DOM_UPDATE_DELAY));
