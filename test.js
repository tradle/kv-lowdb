
const createStore = require('./')

require('../tradle-kv/test')({
  create: createStore,
  cleanup: function ({ path }) {}
})
