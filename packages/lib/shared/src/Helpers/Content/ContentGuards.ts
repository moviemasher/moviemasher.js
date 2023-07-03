import type { ContentInstance, ContentAsset } from '@moviemasher/runtime-shared'

import { errorThrow, isAsset } from '@moviemasher/runtime-shared'
import { isInstance } from '../../Shared/Instance/InstanceGuards.js'

export const isContentAsset = (value?: any): value is ContentAsset => {
  return isAsset(value) && value.canBeContent
}

export const isContentInstance = (value?: any): value is ContentInstance => {
  return isInstance(value) && isContentAsset(value.asset)
}

export function assertContentInstance(value?: any, name?: string): asserts value is ContentInstance {
  if (!isContentInstance(value)) errorThrow(value, 'ContentInstance', name)
}
