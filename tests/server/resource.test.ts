import type { Resource } from '@moviemasher/shared-lib/types.js'


import assert from 'node:assert'

import { describe, test } from 'node:test'


import { $RETRIEVE, MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'

import '@moviemasher/server-lib/runtime.js'

await MOVIE_MASHER.importPromise()


describe('MOVIE_MASHER', () => {
  test.skip('promise fetch', () => {
    const resource: Resource = { type: 'type', request: { endpoint: 'test' } }
    const promise = MOVIE_MASHER.promise(resource, $RETRIEVE)
  
    assert(promise)
    assert.throws(async () => await promise)
  })
})
