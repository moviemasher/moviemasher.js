import type { Constrained } from '@moviemasher/runtime-shared'
import type { AudibleInstance } from '../../Shared/Instance/Instance.js'
import type { ServerAudibleInstance, ServerInstance } from '../ServerInstance.js'
import type { ServerAudibleAsset } from '../Asset/ServerAsset.js'

export function ServerAudibleInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: ServerAudibleAsset
  }
}
