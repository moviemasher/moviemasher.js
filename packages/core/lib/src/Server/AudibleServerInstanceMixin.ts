import type { Constrained } from '../Base/Constrained.js'
import type { AudibleInstance } from '../Shared/Instance/Instance.js'
import type { ServerAudibleInstance, ServerInstance } from './ServerInstance.js'
import type { AudibleServerAsset } from './ServerAsset.js'

export function AudibleServerInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: AudibleServerAsset
  }
}
