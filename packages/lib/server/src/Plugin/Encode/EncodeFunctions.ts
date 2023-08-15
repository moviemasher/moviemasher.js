import type { EncodeOutput, } from '@moviemasher/lib-shared'
import type { StringDataOrError, } from '@moviemasher/runtime-shared'
import type { EncodeRequest } from './Encode.js'

import { TypeEncode, pluginDataOrErrorPromise, } from '@moviemasher/lib-shared'
import { assertAssetType, errorThrow, isDefiniteError, } from '@moviemasher/runtime-shared'
import { isMediaRequest } from '../../Media/MediaFunctions.js'

export const isEncodeRequest = (value: any): value is EncodeRequest => {
  return isMediaRequest(value) 
} 
export function assertEncodeRequest(value: any): asserts value is EncodeRequest {
  if (!isEncodeRequest(value)) errorThrow(value, 'EncodeRequest')
}



export const encode = (localPath: string, output: EncodeOutput): Promise<StringDataOrError>  => {
  const { type, options } = output
  assertAssetType(type)

  return pluginDataOrErrorPromise(type, TypeEncode).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { data: plugin } = orError
    return plugin.encode(localPath, options)
  })
}
