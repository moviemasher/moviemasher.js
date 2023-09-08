import type { StringDataOrError } from '@moviemasher/runtime-shared'
import type { TranscodeOutput } from './TranscodeTypes.js'
import type { TranscodeRequest } from './TranscodeInput.js'

import { assertTranscodingType, } from '@moviemasher/lib-shared'
import { ERROR, errorPromise, errorThrow } from '@moviemasher/runtime-shared'
import { isIdentifiedRequest } from '../Media/MediaFunctions.js'
import { isTranscodeOutput } from './TranscodeFunctions.js'
import { EventServerTranscode } from '@moviemasher/runtime-server'

export const isTranscodeRequest = (value: any): value is TranscodeRequest => {
  return isIdentifiedRequest(value) && 'output' in value && isTranscodeOutput(value.output)
}

export function assertTranscodeRequest(value: any): asserts value is TranscodeRequest {
  if (!isTranscodeRequest(value))
    errorThrow(value, 'TranscodeRequest')
}

export const transcode = (localPath: string, output: TranscodeOutput): Promise<StringDataOrError>  => {
  const { type, options } = output
  assertTranscodingType(type)


  // const event = new EventServerTranscode(type, localPath, options)
  // MovieMasher.eventDispatcher.dispatch(event)
  // const { promise } = event.detail
  // if (promise) return promise

  return errorPromise(ERROR.Unimplemented, EventServerTranscode.Type)

 
}

