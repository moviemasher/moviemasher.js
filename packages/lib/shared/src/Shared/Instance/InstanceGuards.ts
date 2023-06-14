import type { Instance, InstanceObject } from '@moviemasher/runtime-shared'

import { isAssetType } from '@moviemasher/runtime-shared'

import { isObject } from "@moviemasher/runtime-shared"
import { isIdentified } from '@moviemasher/runtime-shared'
import { isTyped } from '@moviemasher/runtime-shared'
import { errorThrow } from '@moviemasher/runtime-shared'

export const isInstance = (value?: any): value is Instance => {
  return isObject(value) && 'assetIds' in value
}

export const isInstanceObject = (value: any): value is InstanceObject => (
  isIdentified(value) && isTyped(value) && isAssetType(value.type)
)

export function assertInstanceObject(value: any, name?: string): asserts value is InstanceObject {
  if (!isInstanceObject(value)) errorThrow(value, 'InstanceObject', name)
}

