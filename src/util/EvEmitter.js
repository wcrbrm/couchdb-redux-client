// Event emitter library
// https://github.com/metafizzy/ev-emitter/blob/master/ev-emitter.js

/* eslint-disable */
function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function(eventName, listener) {
  if (!eventName || !listener) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[eventName] = events[eventName] || [];
  // only add once
  if (listeners.indexOf(listener) === -1) {
    listeners.push(listener);
  }
  return this;
};

proto.once = function(eventName, listener) {
  if (!eventName || !listener) {
    return;
  }
  // add event
  this.on(eventName, listener);
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
  // set flag
  onceListeners[listener] = true;
  return this;
};

proto.off = function(eventName, listener) {
  var listeners = this._events && this._events[eventName];
  if (!listeners || !listeners.length) {
    return;
  }
  var index = listeners.indexOf(listener);
  if ( index !== -1 ) {
    listeners.splice(index, 1);
  }
  return this;
};

proto.emitEvent = function(eventName, args) {
  var listeners = this._events && this._events[eventName];
  //if (eventName === 'always') {
  //   console.info('emitting event', eventName, ' listeners:', listeners && listeners.length);
  //}
  if (!listeners || !listeners.length) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[eventName];
  while ( listener ) {
    var isOnce = onceListeners && onceListeners[listener];
    if (isOnce) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off(eventName, listener);
      // unset once flag
      delete onceListeners[listener];
    }
    // trigger listener
    listener.apply(this, args);
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }
  return this;
};

export default new EvEmitter();
