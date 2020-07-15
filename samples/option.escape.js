const parse = require('../lib/sync')
const assert = require('assert')

const data = `a,"b""c",d`
const records = parse(data)
console.log(records)
assert.deepEqual(records, [
  [ 'a', 'b"c', 'd' ]
])
