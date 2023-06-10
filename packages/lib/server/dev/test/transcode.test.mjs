import { describe, test } from 'node:test'
import assert from 'assert'

import { isFilePath, transcode } from '@moviemasher/lib-server'
import { TypeImage, isPopulatedString, isTranscodeOutput } from '@moviemasher/lib-shared'


describe('transcode', () => {
  test('returns true for valid request', async () => {
    const outputOptions = {
      width: 100, height: 100,
      options: { },
    }
    const output = {
      type: TypeImage, 
      // outputType: TypeImage, encodingType: TypeImage, 
      options: outputOptions
    }


    assert(isTranscodeOutput(output))

    // const object = { 
    //   id: 'transcode-test-id',
    //   input: { 
    //     type: TypeImage, 
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
