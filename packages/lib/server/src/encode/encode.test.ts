import type { OutputOptions } from '@moviemasher/runtime-shared'

import { EventServerEncode, MovieMasher } from '@moviemasher/runtime-server'
import { VIDEO, isDefiniteError } from '@moviemasher/runtime-shared'
import {  outputOptions } from '@moviemasher/lib-shared'
import assert from 'node:assert'
import { describe, test } from 'node:test'
import { ServerEventDispatcherModule } from '../Utility/ServerEventDispatcherModule.js'
import { filePathExists } from '../Utility/File.js'

import { pathResolvedToPrefix } from '../Utility/Request.js'

MovieMasher.eventDispatcher = new ServerEventDispatcherModule()
await MovieMasher.importPromise

describe('EventServerEncode', () => {
  test.skip('correctly encodes color mash', async () => {
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `encoding-color-id-${Date.now()}`
    const inputPath = pathResolvedToPrefix('../shared/mash/mash_color.json')
    const outputPath = `/app/temporary/${encodingId}.mp4`
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
    const outputPath = `/app/temporary/${encodingId}.mp4`
    const event = new EventServerEncode(VIDEO, inputPath, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })
  
  test('correctly encodes text mash', async () => {
    const options: OutputOptions = outputOptions(VIDEO)
    const encodingId = `encoding-text-id-${Date.now()}`
    const inputPath = pathResolvedToPrefix('../shared/mash/mash_text.json')
    const outputPath = `/app/temporary/${encodingId}.mp4`
    const event = new EventServerEncode(VIDEO, inputPath, outputPath, options, encodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assert(promise)
    const result = await promise

    console.log('result', result)
    assert(!isDefiniteError(result))
    assert(filePathExists(outputPath))
  })
})
