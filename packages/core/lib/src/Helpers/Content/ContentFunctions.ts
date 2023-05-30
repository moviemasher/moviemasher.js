import type { Content, ContentDefinition } from './Content.js'

import { isContentingType } from '../../Setup/EnumConstantsAndFunctions.js'
import { errorThrow } from '../Error/ErrorFunctions.js'
import { isInstance } from '../../Shared/Instance/InstanceGuards.js'
import { isAsset } from '../../Shared/Asset/AssetGuards.js'

export const isContentInstance = (value?: any): value is Content => {
  return isInstance(value) && isContentAsset(value.asset)
}
export function assertContentInstance(value?: any, name?: string): asserts value is Content {
  if (!isContentInstance(value))
    errorThrow(value, 'Content', name)
}
export const isContentAsset = (value?: any): value is ContentDefinition => {
  return isAsset(value) && isContentingType(value.type)
}
