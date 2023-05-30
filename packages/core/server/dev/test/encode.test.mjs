import { describe, test } from 'node:test'
import assert from 'assert'

import { isFilePath, encode } from '@moviemasher/server-core'
import { TypeVideo, isPopulatedString } from '@moviemasher/lib-core'


describe('encode', () => {
  test('returns true for valid request', async () => {
    const outputOptions = {
      // width: 100, height: 100,
      options: { },
    }
    // assert(isEncodeOutput(output))

    // const object = { 
    //   id: 'encode-test-id',
    //   input: { 
    //     type: TypeVideo, 
    //     request: { endpoint: 'file:///app/dev/shared/image/globe.jpg' }
    //   },
    //   output
    // }
    // assert(isTranscodeRequest(object))
    
    const output = { 
      type: TypeVideo, 
      options: outputOptions,
      // encodingType: TypeVideo, outputType: TypeVideo, 
    }
    
    const result = await encode('/app/dev/shared/mash/mash_color.json', output)
    console.log('result', result)
    assert(result)
    const { data, error } = result
    assert(!error)
    
    console.log('data', data)

    assert(isFilePath(data))
  })
  
})
