import { describe, test } from 'node:test'
import path from 'path'
import assert from 'assert'

import { urlBaseInitialize, MediaDefaults, AUDIO, IMAGE } from '@moviemasher/shared-lib'
import { Environment, environment } from '@moviemasher/server-lib'
import { renderingProcessInput } from "../../../../images/tester/Utilities/renderingProcessInput.mjs"

describe("MediaDefaults", () => {
  urlBaseInitialize('file://' + path.resolve(environment(Environment.API_DIR_FILE_PREFIX), 'user'))

  test("mediaObject", () => {
   
    assert.equal(MediaDefaults[AUDIO].length, 0)
    assert.notEqual(MediaDefaults[IMAGE].length, 0)
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