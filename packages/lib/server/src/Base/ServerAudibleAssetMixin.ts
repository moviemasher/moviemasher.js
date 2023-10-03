import type { ServerAsset } from '@moviemasher/runtime-server'
import type { AudibleAsset, Constrained } from '@moviemasher/runtime-shared'
import type { ServerAudibleAsset } from '../Types/ServerAssetTypes.js'

export function ServerAudibleAssetMixin<T extends Constrained<ServerAsset & AudibleAsset>>(Base: T):
T & Constrained<ServerAudibleAsset> {
  return class extends Base implements ServerAudibleAsset {}
}
