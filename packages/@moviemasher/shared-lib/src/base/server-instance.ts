import type { CommandFile, CommandFileArgs, CommandFiles, ServerAsset, ServerInstance } from '../types.js'

import { InstanceClass } from '../base/instance.js'
import { DASH } from '../runtime.js'

export class ServerInstanceClass extends InstanceClass implements ServerInstance {
  declare asset: ServerAsset
 
  commandFiles(cacheArgs: CommandFileArgs): CommandFiles {
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
}
