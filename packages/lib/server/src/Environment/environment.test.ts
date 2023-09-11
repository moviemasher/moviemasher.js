import { describe, test } from 'node:test'
import assert from 'node:assert'

import { ENV, ENVIRONMENT } from './EnvironmentConstants.js'


describe('ENVIRONMENT', () => {
  test('get MOVIEMASHER_FOO returns foo from docker-compose.yml', () => {
    assert.equal(ENVIRONMENT.get('MOVIEMASHER_FOO'), 'foo')
  })
  test('get ENV.DirRoot returns /app/ from local.env', () => {
    assert.equal(ENVIRONMENT.get(ENV.DirRoot), '/app/')
  })
})