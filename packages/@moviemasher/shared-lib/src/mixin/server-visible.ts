import type { ServerVisibleInstance, VisibleCommandFileArgs, ServerVisibleAsset, CommandFiles, Constrained, ServerAsset, ServerInstance, VisibleAsset, VisibleContentInstance, VisibleInstance } from '../types.js'

import { isServerAsset, isVisibleAsset, isVisibleInstance } from '../utility/guards.js'

export const isServerVisibleAsset = (value: any): value is ServerVisibleAsset => {
  return isServerAsset(value) && isVisibleAsset(value)
}
export const isServerVisibleInstance = (value: any): value is ServerVisibleInstance => {
  return isVisibleInstance(value) && isServerVisibleAsset(value.asset)
}
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
