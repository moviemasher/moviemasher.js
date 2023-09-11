import { describe, test } from 'node:test'
import assert from 'assert'

import { isFilePath, transcode } from '@moviemasher/lib-server'
import { IMAGE, isPopulatedString, isTranscodeOutput } from '@moviemasher/lib-shared'


describe('transcode', () => {
  test('returns true for valid request', async () => {
    const outputOptions = {
      width: 100, height: 100,
      options: { },
    }
    const output = {
      type: IMAGE, 
      // outputType: IMAGE, encodingType: IMAGE, 
      options: outputOptions
    }


    assert(isTranscodeOutput(output))

    // const object = { 
    //   id: 'transcode-test-id',
    //   input: { 
    //     type: IMAGE, 
    //     request: { endpoint: 'file:///app/dev/shared/image/globe.jpg' }
    //   },
    //   output
    // }
    // assert(isTranscodeRequest(object))
    const result = await transcode('/app/dev/shared/image/globe.jpg', output)
    console.log('result', result)
    assert(result)

    const { data, error } = result
    assert(!error)

    console.log('data', data)

    assert(isFilePath(data))
  })
  
})
