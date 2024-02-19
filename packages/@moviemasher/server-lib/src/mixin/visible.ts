import type { Constrained, VisibleAsset, VisibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerVisibleAsset } from '../type/ServerAssetTypes.js'
import type { CommandFiles, ServerAsset, ServerInstance, ServerVisibleInstance, VisibleCommandFileArgs } from '../types.js'

import { VisibleContentInstance } from '@moviemasher/shared-lib/types.js'
import { isServerVisibleInstance } from '../utility/guard.js'

export function ServerVisibleAssetMixin<T extends Constrained<ServerAsset & VisibleAsset>>(Base: T):
T & Constrained<ServerVisibleAsset> {
  return class extends Base implements ServerVisibleAsset {}
}

export function ServerVisibleInstanceMixin<T extends Constrained<ServerInstance & VisibleInstance>>(Base: T):
  T & Constrained<ServerVisibleInstance> {
  return class extends Base implements ServerVisibleInstance {
    visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles {
      const commandFiles = this.commandFiles({ ...args, audible: false, visible: true })
      if (isServerVisibleInstance(content)) commandFiles.push(...content.visibleCommandFiles(args))
      return commandFiles
    }
  }
}
