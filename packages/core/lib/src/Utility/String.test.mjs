import { describe, test } from 'node:test'
import assert from 'assert'

import { stringSeconds } from '@moviemasher/lib-core'

describe('stringSeconds', () => {
  test('returns expected response', () => {
    assert.equal(stringSeconds(0.5, 30, 3), '00.50')
    assert.equal(stringSeconds(0.9, 30, 3), '00.90')
    assert.equal(stringSeconds(0.12324, 30, 3), '00.12')
    assert.equal(stringSeconds(0.126, 30, 3), '00.13')
    assert.equal(stringSeconds(0.5, 10, 3), '00.5')
    assert.equal(stringSeconds(5.51, 10, 100), '00:05.5')
    assert.equal(stringSeconds(5.57, 10, 100), '00:05.6')
    assert.equal(stringSeconds(65.57, 10, 100), '01:05.6')
  })
})