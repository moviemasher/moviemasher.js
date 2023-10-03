import { errorThrow } from '@moviemasher/runtime-shared'
import { MashAsset, MashInstance } from '@moviemasher/runtime-shared'
import { isInstance } from '../Instance/InstanceGuards.js'
import { isSourceAsset } from '@moviemasher/runtime-shared'
import { MASH } from '@moviemasher/runtime-shared'
import { isVideoAsset } from '../Video/VideoGuards.js'

export const isMashAsset = (value: any): value is MashAsset => (
  isVideoAsset(value) 
  && isSourceAsset(value)
  && value.source === MASH 
  && 'trackInstance' in value
)
export function assertMashAsset(value: any, name?: string): asserts value is MashAsset {
  if (!isMashAsset(value)) errorThrow(value, 'MashAsset', name)
}

export const isMashInstance = (value: any): value is MashInstance => {
  return isInstance(value) && 'asset' in value && isMashAsset(value.asset) 
}
export function assertMashInstance(value: any, name?: string): asserts value is MashInstance {
  if (!isMashInstance(value)) errorThrow(value, 'MashInstance', name)
}
