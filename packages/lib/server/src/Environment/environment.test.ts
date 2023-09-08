import { describe, test } from 'node:test'
import assert from 'node:assert'

import { RuntimeEnvironment } from './Environment.js'


describe('RuntimeEnvironment', () => {
  test('get MOVIEMASHER_FOO returns bar', () => {
    assert(RuntimeEnvironment.get('MOVIEMASHER_FOO') === 'bar')
  })
})