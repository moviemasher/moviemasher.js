import type { ServerMashAsset } from '../type/ServerMashTypes.js'

import { isMashAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { isServerAsset } from '../runtime.js'
import { errorThrow } from '@moviemasher/shared-lib/runtime.js'

export const isServerMashAsset = (value: any): value is ServerMashAsset => (
  isMashAsset(value) && isServerAsset(value)
)

export function assertServerMashAsset(value: any, message?: string): asserts value is ServerMashAsset {
  if (!isServerMashAsset(value)) errorThrow(value, 'ServerMashAsset', message)
}