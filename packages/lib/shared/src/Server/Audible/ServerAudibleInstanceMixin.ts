import type { Constrained } from '@moviemasher/runtime-shared'
import type { AudibleInstance } from '@moviemasher/runtime-shared'
import type { ServerAudibleInstance, ServerInstance } from '../ServerInstance.js'
import type { ServerAudibleAsset } from '../Asset/ServerAssetTypes.js'

export function ServerAudibleInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: ServerAudibleAsset
  }
}
