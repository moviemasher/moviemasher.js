import { describe, test } from 'node:test'
import path from 'path'
import assert from 'assert'
import { Runtime } from '@moviemasher/lib-shared'
import { EnvironmentKeyApiDirFilePrefix } from '@moviemasher/lib-server'
import { renderingProcessInput } from "../../../../images/test-server/dev/renderingProcessInput.mjs"

describe("Encode", () => {
  
  test("environment", async () => {
    // const { env } = process
    // console.log('env', env)
    
    const { environment } = Runtime
    const originalPrefix = environment.get(EnvironmentKeyApiDirFilePrefix)
    assert.equal(originalPrefix, './packages/example/standalone/public/media')

    const filePrefix = 'file://' + path.resolve(originalPrefix, 'user')
    environment.set(EnvironmentKeyApiDirFilePrefix, filePrefix)
 
    const newPrefix: string = environment.get(EnvironmentKeyApiDirFilePrefix)
    assert.equal(newPrefix, filePrefix)

    const input = renderingProcessInput()
    console.log('input', input)
    assert(input)
  })
})