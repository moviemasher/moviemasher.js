import { isObject } from "@moviemasher/runtime-shared"
import { errorThrow } from '@moviemasher/runtime-shared'
import { Track } from '@moviemasher/runtime-shared'

export const isTrack = (value?: any): value is Track => {
  return isObject(value) && 'frameForClipNearFrame' in value
}
export function assertTrack(value: any, name?: string): asserts value is Track {
  if (!isTrack(value))
    errorThrow(value, 'Track', name)
}
