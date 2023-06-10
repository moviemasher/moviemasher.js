import type { Instance, InstanceObject } from './Instance.js'

import { isAssetType } from '@moviemasher/runtime-shared'

import { isObject } from '../SharedGuards.js'
import { isIdentified } from '../../Base/IdentifiedGuards.js'
import { isTyped } from '../../Base/TypedGuards.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'

export const isInstance = (value?: any): value is Instance => {
  return isObject(value) && 'assetIds' in value
}

export const isInstanceObject = (value: any): value is InstanceObject => (
  isIdentified(value) && isTyped(value) && isAssetType(value.type)
)

export function assertInstanceObject(value: any, name?: string): asserts value is InstanceObject {
  if (!isInstanceObject(value)) errorThrow(value, 'InstanceObject', name)
}

