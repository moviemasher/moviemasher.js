import type { ServerMashAsset } from '../Types/ServerMashTypes.js'

import { isMashAsset } from '@moviemasher/lib-shared'
import { isServerAsset } from '@moviemasher/runtime-server'
import { errorThrow } from '@moviemasher/runtime-shared'

export const isServerMashAsset = (value: any): value is ServerMashAsset => (
  isMashAsset(value) && isServerAsset(value)
)

export function assertServerMashAsset(value: any, message?: string): asserts value is ServerMashAsset {
  if (!isServerMashAsset(value)) errorThrow(value, 'ServerMashAsset', message)
}