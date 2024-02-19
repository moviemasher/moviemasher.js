import type { AbsolutePath, ProbingOptions, RawAsset, VideoInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerAudibleAsset, ServerVisibleAsset } from '../type/ServerAssetTypes.js'
import type { ServerMashAsset } from '../type/ServerMashTypes.js'
import type { ServerRawVideoInstance } from '../type/ServerTypes.js'
import type { ServerAsset, ServerAudibleInstance, ServerContainerInstance, ServerContentInstance, ServerVisibleInstance } from '../types.js'

import { $RAW, errorThrow, isAbsolutePath, isAsset } from '@moviemasher/shared-lib/runtime.js'
import { isAudibleAsset, isInstance, isMashAsset, isVideoAsset, isVisibleAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { isObject } from '@moviemasher/shared-lib/utility/guard.js'

export const isServerAudibleAsset = (value: any): value is ServerAudibleAsset => {
  return isServerAsset(value) && isAudibleAsset(value)
}

export const isServerVisibleAsset = (value: any): value is ServerVisibleAsset => {
  return isServerAsset(value) && isVisibleAsset(value)
}

export const isServerAudibleInstance = (value: any): value is ServerAudibleInstance => {
  return isInstance(value) && isServerAudibleAsset(value.asset)
}

export const isServerVisibleInstance = (value: any): value is ServerVisibleInstance => {
  return isInstance(value) && isServerVisibleAsset(value.asset)
}

export function assertServerAudibleInstance(value: any, name?: string): asserts value is ServerAudibleInstance {
  if (!isServerAudibleInstance(value)) errorThrow(value, 'AbsolutePath', name)
}

export function assertServerVisibleInstance(value: any, name?: string): asserts value is ServerVisibleInstance {
  if (!isServerVisibleInstance(value)) errorThrow(value, 'AbsolutePath', name)
}

export const isServerContainerInstance = (value: any): value is ServerContainerInstance => {
  return isServerVisibleInstance(value) && value.container
}

export const isServerContentInstance = (value: any): value is ServerContentInstance => {
  return isServerVisibleInstance(value) && !value.container
}

export function assertServerContainerInstance(value: any, name?: string): asserts value is ServerContainerInstance {
  if (!isServerContainerInstance(value)) errorThrow(value, 'ServerContainerInstance', name)
}

export function assertServerContentInstance(value: any, name?: string): asserts value is ServerContentInstance {
  if (!isServerContentInstance(value)) errorThrow(value, 'ServerContentInstance', name)
}

export const isVideoInstance = (value: any): value is VideoInstance => {
  return isInstance(value) && isVideoAsset(value.asset)
}

export const isRawAsset = (value: any): value is RawAsset => {
  return isAsset(value) && value.source === $RAW
}

export const isServerRawVideoInstance = (value: any): value is ServerRawVideoInstance => {
  return isVideoInstance(value) && isRawAsset(value.asset)
}

export const isServerAsset = (value: any): value is ServerAsset => {
  return isAsset(value) && 'assetFiles' in value
}

export const isServerMashAsset = (value: any): value is ServerMashAsset => (
  isMashAsset(value) && isServerAsset(value)
)

export function assertServerMashAsset(value: any, message?: string): asserts value is ServerMashAsset {
  if (!isServerMashAsset(value)) errorThrow(value, 'ServerMashAsset', message)
}

export function assertAbsolutePath(value: any, name?: string): asserts value is AbsolutePath {
  if (!isAbsolutePath(value)) errorThrow(value, 'AbsolutePath', name)
}

export const isProbingOptions = (value: any): value is ProbingOptions => {
  return isObject(value)
}

export function assertProbingOptions(value: any): asserts value is ProbingOptions {
  if (!isProbingOptions(value)) errorThrow(value, 'ProbingOptions')
}

