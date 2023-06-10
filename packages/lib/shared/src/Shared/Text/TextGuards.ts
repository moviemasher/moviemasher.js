import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { TextAsset, TextInstance } from './TextTypes.js'
import { isInstance } from '../Instance/InstanceGuards.js'
import { isImageAsset } from '../Image/ImageGuards.js'

export const isTextAsset = (value: any): value is TextAsset => {
  return isImageAsset(value) && 'family' in value
}
export function assertTextAsset(value: any, name?: string): asserts value is TextAsset {
  if (!isTextAsset(value)) errorThrow(value, 'TextAsset', name)
}

export const isTextInstance = (value: any): value is TextInstance => {
  return isInstance(value) && 'asset' in value && isTextAsset(value.asset) 
}
export function assertTextInstance(value: any, name?: string): asserts value is TextInstance {
  if (!isTextInstance(value)) errorThrow(value, 'TextInstance', name)
}

