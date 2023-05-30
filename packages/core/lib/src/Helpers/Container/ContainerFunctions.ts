import type { ContainerAsset, ContainerInstance } from './Container.js'

import { isContainingType } from '../../Setup/EnumConstantsAndFunctions.js'
import { errorThrow } from '../Error/ErrorFunctions.js'
import { isInstance } from "../../Shared/Instance/InstanceGuards.js"
import { isAsset } from '../../Shared/Asset/AssetGuards.js'


export const isContainerAsset = (value?: any): value is ContainerAsset => {
  return isAsset(value) && isContainingType(value.type)
}

export const isContainerInstance = (value?: any): value is ContainerInstance => {
  return isInstance(value) && isContainerAsset(value.asset)
}

export function assertContainerInstance(value?: any, name?: string): asserts value is ContainerInstance {
  if (!isContainerInstance(value)) errorThrow(value, 'ContainerInstance', name)
}
