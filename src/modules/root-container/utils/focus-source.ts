// Code from ally.js
/*
  add data-playable-focus-source attribute to html element containing "key", "pointer" or "script"
  depending on the input method used to change focus.

  USAGE:
    style/focus-source()

    body :focus {
      outline: 1px solid grey;
    }

    html[data-playable-focus-source="key"] body :focus {
      outline: 5px solid red;
    }

    html[data-playable-focus-source="key"] body :focus {
      outline: 1px solid blue;
    }

  NOTE: I don't have a GamePad to test, if you do and you want to
  implement an observer for https://w3c.github.io/gamepad/ - send a PR!

  Alternate implementation: https://github.com/alice/modality
*/

import engageInteractionTypeObserver from './interaction-type';

// preferring focusin/out because they are synchronous in IE10+11
const supportsFocusIn =
  typeof document !== 'undefined' && 'onfocusin' in document;
const focusEventName = supportsFocusIn ? 'focusin' : 'focus';
const blurEventName = supportsFocusIn ? 'focusout' : 'blur';

// interface to read interaction-type-listener state
let interactionTypeHandler: any;
// keep track of last focus source
let current: any = null;
// overwrite focus source for use with the every upcoming focus event
let lock: any = null;
// keep track of ever having used a particular input method to change focus
const used: any = {
  pointer: false,
  key: false,
  script: false,
  initial: false,
};

function handleFocusEvent(event: any) {
  let source = '';
  if (event.type === focusEventName) {
    const interactionType = interactionTypeHandler.get();
    source =
      lock ||
      (interactionType.pointer && 'pointer') ||
      (interactionType.key && 'key') ||
      'script';
  } else if (event.type === 'initial') {
    source = 'initial';
  }

  document.documentElement.setAttribute('data-playable-focus-source', source);

  if (event.type !== blurEventName) {
    used[source] = true;
    current = source;
  }
}

function getCurrentFocusSource() {
  return current;
}

function getUsedFocusSource(source: any) {
  return used[source];
}

function lockFocusSource(source: any) {
  lock = source;
}

function unlockFocusSource() {
  lock = false;
}

function disengage() {
  // clear dom state
  handleFocusEvent({ type: blurEventName });
  current = lock = null;
  Object.keys(used).forEach(function(key) {
    used[key] = false;
  });
  // kill interaction type identification listener
  engageInteractionTypeObserver.disengage();
  document.documentElement.removeEventListener(
    focusEventName,
    handleFocusEvent,
    true,
  );
  document.documentElement.removeEventListener(
    blurEventName,
    handleFocusEvent,
    true,
  );
  document.documentElement.removeAttribute('data-playable-focus-source');
}

function engage() {
  document.documentElement.addEventListener(
    focusEventName,
    handleFocusEvent,
    true,
  );
  document.documentElement.addEventListener(
    blurEventName,
    handleFocusEvent,
    true,
  );
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

export default { engage, disengage };
