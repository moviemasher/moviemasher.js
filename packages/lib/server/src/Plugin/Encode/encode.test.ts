import { describe, test } from 'node:test'
import assert from 'assert'

// import { isFilePath, encode } from '@moviemasher/lib-server'
import { TypeVideo } from '@moviemasher/runtime-shared'
import { EncodeOutput, OutputOptions, isDefiniteError } from '@moviemasher/lib-shared'
import { encode, isFilePath } from '../../index.js'


describe('encode', () => {
  test('returns true for valid request', async () => {
    const outputOptions: OutputOptions = {}
    // assert(isEncodeOutput(outputOptions))

    // const object = { 
    //   id: 'encode-test-id',
    //   input: { 
    //     type: TypeVideo, 
    //     request: { endpoint: 'file:///app/dev/shared/image/globe.jpg' }
    //   },
    //   output
    // }
    // assert(isTranscodeRequest(object))
    
    const output: EncodeOutput = { 
      type: TypeVideo, 
      options: outputOptions,
      // encodingType: TypeVideo, outputType: TypeVideo, 
    }
    
    const result = await encode('/app/dev/shared/mash/mash_color.json', output)
    console.log('result', result)
    assert(result)
    assert(!isDefiniteError(result))
    const { data } = result
  
    console.log('data', data)

    assert(isFilePath(data))
  })
  
})
