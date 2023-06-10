import { describe, test } from 'node:test'
import assert from 'assert'
import { Environment, environment } from '@moviemasher/lib-server'

describe("Environment", () => {
  test("environment", async () => {
    const { env } = process
    console.log('env', env)
    const dirFilePrefix = environment(Environment.API_DIR_FILE_PREFIX)
    assert.equal(dirFilePrefix, 'dev')
    
  })
})