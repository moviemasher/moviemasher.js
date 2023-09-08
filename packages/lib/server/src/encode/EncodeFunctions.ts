import type { EncodingType, OutputOptions, StringDataOrError, Strings, } from '@moviemasher/runtime-shared'
import type { EncodeOutput } from './EncodeTypes.js'
import type { EncodeRequest } from './Encode.js'

import { assertPopulatedString } from '@moviemasher/lib-shared'
import { EventServerEncode } from '@moviemasher/runtime-server'
import { ERROR, assertAssetType, errorPromise, errorThrow } from '@moviemasher/runtime-shared'
import { isIdentifiedRequest } from '../Media/MediaFunctions.js'

export const isEncodeRequest = (value: any): value is EncodeRequest => {
  return isIdentifiedRequest(value) 
} 
export function assertEncodeRequest(value: any): asserts value is EncodeRequest {
  if (!isEncodeRequest(value)) errorThrow(value, 'EncodeRequest')
}

export const encode = (localPath: string, output: EncodeOutput): Promise<StringDataOrError>  => {
  const { type, options } = output
  assertAssetType(type)

  return errorPromise(ERROR.Unimplemented, EventServerEncode.Type)

}

export const renderingOutputFile = (outputOptions: OutputOptions, encodingType: EncodingType, extension?: string): string => {
  const { format, extension: outputExtension } = outputOptions

  const ext = extension || outputExtension || format
  assertPopulatedString(ext, 'extension')

  const components: Strings = [encodingType]
  // if (index && !basename) components.push(String(index))
  components.push(ext)
  return components.join('.')
}
