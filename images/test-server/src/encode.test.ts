import type { OutputOptions } from '@moviemasher/runtime-shared'

import { EventServerEncode, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, VIDEO, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'
import {  assertArray, assertObject, outputOptions } from '@moviemasher/lib-shared'
import assert from 'node:assert'
import { describe, test } from 'node:test'
import { ServerEventDispatcherModule } from '../../../packages/lib/server/src/Utility/ServerEventDispatcherModule.js'
import { filePathExists } from '../../../packages/lib/server/src/Utility/File.js'
import path from 'path'
import { pathResolvedToPrefix } from '../../../packages/lib/server/src/Utility/Request.js'
import { ENV, ENVIRONMENT } from '../../../packages/lib/server/src/Environment/EnvironmentConstants.js'
import { generateTest } from './test/Generate.js'
MovieMasher.eventDispatcher = new ServerEventDispatcherModule()
await MovieMasher.importPromise

const temporaryDirectory = ENVIRONMENT.get(ENV.ApiDirTemporary)
describe('EventServerEncode', () => {
  test.skip('correctly encodes color mash', async () => {
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `encoding-color-id-${Date.now()}`
    const inputPath = pathResolvedToPrefix('../shared/mash/mash_color.json')
    const outputPath = path.resolve(temporaryDirectory, encodingId, 'output.mp4')
    const event = new EventServerEncode(VIDEO, inputPath, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })

  test.skip('correctly encodes video mash', async () => {
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `encoding-video-id-${Date.now()}`
    const inputPath = pathResolvedToPrefix('../shared/mash/mash_video.json')
    const outputPath = path.resolve(temporaryDirectory, encodingId, 'output.mp4')
    const event = new EventServerEncode(VIDEO, inputPath, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })
  
  test.skip('correctly encodes text mash', async () => {
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `encoding-text-id-${Date.now()}`
    const inputPath = pathResolvedToPrefix('../shared/mash/mash_text.json')
    const outputPath = path.resolve(temporaryDirectory, encodingId, 'output.mp4')
    const event = new EventServerEncode(VIDEO, inputPath, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })  
  test.skip('correctly encodes shape mash', async () => {
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `encoding-shape-id-${Date.now()}`
    const inputPath = pathResolvedToPrefix('../shared/mash/mash_shape.json')
    const outputPath = path.resolve(temporaryDirectory, encodingId, 'output.mp4')
    const event = new EventServerEncode(VIDEO, inputPath, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })
  test('generated', async () => {
    const id = 'P_M_F_in_S_U_M_H_100'
    const [testId, test] = generateTest(id)
    const { tracks } = test
    assertArray(tracks)
    const [track] = tracks
    assertObject(track)
    const { clips } = track

    console.log(test)
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `${id}-${Date.now()}`
    const outputPath = path.resolve(temporaryDirectory, encodingId, 'output.mp4')
    const input = JSON.stringify(test)
    const event = new EventServerEncode(VIDEO, input, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })
})
