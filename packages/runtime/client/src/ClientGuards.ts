import type { ClientAsset } from './ClientAsset.js'
import { isAsset } from '@moviemasher/runtime-shared'

export const isClientAsset = (value: any): value is ClientAsset => {
  return isAsset(value) && 'assetIcon' in value
}
