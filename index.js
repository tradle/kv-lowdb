
const low = require('lowdb')
const wrap = require('@tradle/kv').wrap

module.exports = function persistWithLowDB ({ path }) {
  const db = low(path)
  db.defaults({
      data: {}
    })
    .value()

  function get (key) {
    const value = db.get(getKey(key)).value()
    if (value === undefined) {
      throw new Error('not found')
    }

    return value
  }

  function put (key, value) {
    db.set(getKey(key), value).value()
  }

  function del (key) {
    db.unset(getKey(key)).value()
  }

  function clear () {
    db.unset('data').value()
  }

  function getKey (key) {
    return 'data.' + key
  }

  function list () {
    const obj = db.get('data').value()
    return Object.keys(obj || {})
      .map(key => {
        return { key, value: obj[key] }
      })
  }

  function batch (ops) {
    ops.forEach(op => {
      const { type, key, value } = op
      if (type === 'put') {
        put(key, value)
      } else {
        del(key)
      }
    })
  }

  function close () {}

  const store = {
    get,
    put,
    del,
    list,
    batch,
    clear,
    close
  }

  return wrap({ store })
}
