import { isObject } from '../../SharedGuards.js'
import { errorThrow } from '../../../Helpers/Error/ErrorFunctions.js'
import { Track } from './Track.js'

export const isTrack = (value?: any): value is Track => {
  return isObject(value) && 'frameForClipNearFrame' in value
}
export function assertTrack(value: any, name?: string): asserts value is Track {
  if (!isTrack(value))
    errorThrow(value, 'Track', name)
}
