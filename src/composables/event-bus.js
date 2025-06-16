// Ref: https://v3-migration.vuejs.org/breaking-changes/events-api.html#event-bus
// Global event bus - used to get unrelated parts of an application to talk to each other (inform of certain events)

import mitt from 'mitt';
const emitter = mitt();

export const EventBus = {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args),
};
