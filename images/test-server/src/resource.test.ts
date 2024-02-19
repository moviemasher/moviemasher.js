import type { Resource } from '@moviemasher/shared-lib/types.js'


import assert from 'node:assert'
import path from 'path'
import { describe, test } from 'node:test'


import { $RETRIEVE, MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'

import '@moviemasher/server-lib/runtime.js'

await MOVIEMASHER.importPromise()


describe('MOVIEMASHER', () => {
  test.skip('promise fetch', () => {
    const resource: Resource = { type: 'type', request: { endpoint: 'test' } }
    const promise = MOVIEMASHER.promise($RETRIEVE, resource)
    
    assert(promise)
    assert.throws(async () => await promise)
  })
  test('path.relative', () => {
    assert.strictEqual('', path.relative('/app/temporary/server-express', '/app/temporary/server-express/path/to/file.jpg'))
  })
})

