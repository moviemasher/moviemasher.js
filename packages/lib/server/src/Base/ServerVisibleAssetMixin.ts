import type { ServerAsset } from '@moviemasher/runtime-server'
import type { Constrained, VisibleAsset } from '@moviemasher/runtime-shared'
import type { ServerVisibleAsset } from '../Types/ServerAssetTypes.js'

export function ServerVisibleAssetMixin<T extends Constrained<ServerAsset & VisibleAsset>>(Base: T):
T & Constrained<ServerVisibleAsset> {
  return class extends Base implements ServerVisibleAsset {}
}
