import type { TranscodeRequest } from './Transcode.js'
import type { 
  TranscodeOutput, StringDataOrError 
} from '@moviemasher/lib-shared'

import { 
  isTranscodeOutput, pluginDataOrErrorPromise, 
  TypeTranscode, assertTranscodingType
} from '@moviemasher/lib-shared'
import { isMediaRequest } from '../../Media/MediaFunctions.js'
import { isDefiniteError, errorThrow } from '@moviemasher/runtime-shared'

export const isTranscodeRequest = (value: any): value is TranscodeRequest => {
  return isMediaRequest(value) && 'output' in value && isTranscodeOutput(value.output)
}

export function assertTranscodeRequest(value: any): asserts value is TranscodeRequest {
  if (!isTranscodeRequest(value))
    errorThrow(value, 'TranscodeRequest')
}

export const transcode = (localPath: string, output: TranscodeOutput): Promise<StringDataOrError>  => {
  const { type, options } = output
  assertTranscodingType(type)

  return pluginDataOrErrorPromise(type, TypeTranscode).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { data: plugin } = orError
    return plugin.transcode(localPath, options)
  })
}

