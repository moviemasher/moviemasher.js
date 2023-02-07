import { describe, test } from 'node:test'
import path from 'path'
import assert from 'assert'

import { urlBaseInitialize, MediaDefaults, MediaFactories, DefinitionType } from '@moviemasher/moviemasher.js'
import { Environment, environment } from '@moviemasher/server-core'
import { renderingProcessInput } from "../../../../images/tester/Utilities/renderingProcessInput.mjs"

describe("MediaDefaults", () => {
  urlBaseInitialize('file://' + path.resolve(environment(Environment.API_DIR_FILE_PREFIX), 'user'))

  test("mediaObject", () => {
   
    assert.equal(MediaDefaults[DefinitionType.Audio].length, 0)
    assert.notEqual(MediaDefaults[DefinitionType.Image].length, 0)
    // assert(false)
    // const { env } = process
    // console.log('env', env)
    // const dirFilePrefix = environment(Environment.API_DIR_FILE_PREFIX)
    // assert.equal(dirFilePrefix, 'dev')
    // const input = renderingProcessInput()
    // console.log('input', input)
    // assert(input)
  })
})