import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { MashAsset, MashInstance } from './MashTypes.js'
import { isInstance } from '../Instance/InstanceGuards.js'
import { isImageAsset } from '../Image/ImageGuards.js'

export const isMashAsset = (value: any): value is MashAsset => {
  return isImageAsset(value) && 'family' in value
}
export function assertMashAsset(value: any, name?: string): asserts value is MashAsset {
  if (!isMashAsset(value)) errorThrow(value, 'MashAsset', name)
}

export const isMashInstance = (value: any): value is MashInstance => {
  return isInstance(value) && 'asset' in value && isMashAsset(value.asset) 
}
export function assertMashInstance(value: any, name?: string): asserts value is MashInstance {
  if (!isMashInstance(value)) errorThrow(value, 'MashInstance', name)
}
