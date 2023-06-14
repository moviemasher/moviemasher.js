import { errorThrow } from '@moviemasher/runtime-shared'
import { isAsset } from '@moviemasher/runtime-shared'
import { isInstance } from '../Shared/Instance/InstanceGuards.js'
import { isVisibleAsset, isVisibleInstance } from '../Shared/Visible/VisibleGuards.js'
import { ClientVisibleAsset } from './Asset/ClientAssetTypes.js'
import { ClientInstance, ClientVisibleInstance } from './ClientTypes.js'
import { ClientAsset } from "@moviemasher/runtime-client"


export const isClientAsset = (value: any): value is ClientAsset => {
  return isAsset(value) && 'definitionIcon' in value
}

export function assertClientAsset(value: any, name?: string): asserts value is ClientAsset {
  if (!isClientAsset(value)) errorThrow(value, 'ClientAsset', name)
}

export const isClientInstance = (value: any): value is ClientInstance => {
  return isInstance(value) && 'asset' in value && isClientAsset(value.asset) 
}

export function assertClientInstance(value: any, name?: string): asserts value is ClientInstance {
  if (!isClientInstance(value)) errorThrow(value, 'ClientInstance', name)
}


export const isClientVisibleAsset = (value: any): value is ClientVisibleAsset => {
  return isClientAsset(value) && isVisibleAsset(value)
}

export function assertClientVisibleAsset(value: any, name?: string): asserts value is ClientVisibleAsset {
  if (!isClientVisibleAsset(value)) errorThrow(value, 'ClientVisibleAsset', name)
}

export const isClientVisibleInstance = (value: any): value is ClientVisibleInstance => {
  return isClientInstance(value) && isVisibleInstance(value) 
}

export function assertClientVisibleInstance(value: any, name?: string): asserts value is ClientVisibleInstance {
  if (!isClientVisibleInstance(value)) errorThrow(value, 'ClientVisibleInstance', name)
}
