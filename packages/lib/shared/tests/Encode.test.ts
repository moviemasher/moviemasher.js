import { EnvironmentKeyApiDirFilePrefix, RuntimeEnvironment } from '@moviemasher/lib-server'
import assert from 'assert'
import { describe, test } from 'node:test'
import path from 'path'
import { renderingProcessInput } from '../../../../images/test-server/dev/renderingProcessInput.mjs'

describe('Encode', () => {
  
  test('RuntimeEnvironment', async () => {
    // const { env } = process
    // console.log('env', env)
    
    const originalPrefix = RuntimeEnvironment.get(EnvironmentKeyApiDirFilePrefix)
    assert.equal(originalPrefix, './examples/express/public/assets')

    const filePrefix = 'file://' + path.resolve(originalPrefix, 'user')
    RuntimeEnvironment.set(EnvironmentKeyApiDirFilePrefix, filePrefix)
 
    const newPrefix: string = RuntimeEnvironment.get(EnvironmentKeyApiDirFilePrefix)
    assert.equal(newPrefix, filePrefix)

    const input = renderingProcessInput()
    console.log('input', input)
    assert(input)
  })
})
