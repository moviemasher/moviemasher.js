import { describe, test } from 'node:test'
import assert from 'node:assert'

import { ENV_KEY, ENV } from './EnvironmentConstants.js'


describe('ENV', () => {
  test('get MOVIEMASHER_FOO returns foo from docker-compose.yml', () => {
    assert.equal(ENV.get('MOVIEMASHER_FOO'), 'foo')
  })
  test('get ENV_KEY.DirRoot returns /app/ from local.env', () => {
    assert.equal(ENV.get(ENV_KEY.DirRoot), '/app/')
  })
})