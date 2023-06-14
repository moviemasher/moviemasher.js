import type { ContainerAsset, ContainerInstance } from '@moviemasher/runtime-shared'

import { isContainingType } from '../../Setup/EnumConstantsAndFunctions.js'
import { errorThrow } from '@moviemasher/runtime-shared'
import { isInstance } from "../../Shared/Instance/InstanceGuards.js"
import { isAsset } from '@moviemasher/runtime-shared'


export const isContainerAsset = (value?: any): value is ContainerAsset => {
  return isAsset(value) && isContainingType(value.type)
}

export const isContainerInstance = (value?: any): value is ContainerInstance => {
  return isInstance(value) && isContainerAsset(value.asset)
}

export function assertContainerInstance(value?: any, name?: string): asserts value is ContainerInstance {
  if (!isContainerInstance(value)) errorThrow(value, 'ContainerInstance', name)
}
