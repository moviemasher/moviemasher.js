import type { Tweening } from '../type/ServerTypes.js'
import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilters, ServerAsset, ServerInstance, VisibleCommandFilterArgs } from '../types.js'

import { InstanceClass } from '@moviemasher/shared-lib/base/instance.js'
import { DASH, ERROR, errorThrow } from '@moviemasher/shared-lib/runtime.js'

export class ServerInstanceClass extends InstanceClass implements ServerInstance {
  declare asset: ServerAsset
 
  fileCommandFiles(cacheArgs: CommandFileArgs): CommandFiles {
    const files = this.asset.assetFiles(cacheArgs)
    return files.map((assetFile, index) => {
      const { avType } = assetFile
      const idBits = [this.id, index]
      if (avType) idBits.push(avType)
      const inputId = idBits.join(DASH)
      const commandFile: CommandFile = { ...assetFile, inputId }
      return commandFile
    })
  }

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    return errorThrow(ERROR.Unimplemented)
  }
}
