import type { AssetFileType, AudibleAsset, AudibleInstance, Constrained } from '@moviemasher/shared-lib/types.js'
import type { ServerAudibleAsset } from '../type/ServerAssetTypes.js'
import type { AudioCommandFileArgs, CommandFileArgs, CommandFiles, ServerAsset, ServerAudibleInstance, ServerInstance } from '../types.js'

import { $AUDIO, $VIDEO } from '@moviemasher/shared-lib/runtime.js'

export function ServerAudibleAssetMixin<T extends Constrained<ServerAsset & AudibleAsset>>(Base: T):
T & Constrained<ServerAudibleAsset> {
  return class extends Base implements ServerAudibleAsset {}
}

export function ServerAudibleInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: ServerAudibleAsset

    audibleCommandFiles(args: AudioCommandFileArgs): CommandFiles {
      return this.commandFiles({ ...args, visible: false, audible: true })
    }

    override commandFiles(args: CommandFileArgs): CommandFiles {
      const { time, clipTime } = args
      const offset = clipTime.seconds - time.seconds
      const { speed } = this
      const intersection = clipTime.intersection(time)
      if (!intersection) return []

      const { times } = intersection
      const assetTimes = times.map(time => this.assetTime(time))
      const [startAssetTime, endAssetTime] = assetTimes
      const { seconds: startSeconds } = startAssetTime
      const duration = endAssetTime ? endAssetTime.seconds - startSeconds : 0

      const files = super.commandFiles(args)
      const types: AssetFileType[] = [$AUDIO, $VIDEO]
      files.forEach(file => {
        const { type, avType } = file
        if (!types.includes(type)) return

        file.inputOptions ||= {}
        const { inputOptions } = file
        if (startSeconds)  inputOptions.ss = startSeconds
        if (offset > 0 && avType === $VIDEO) inputOptions.itsoffset = `${offset}s`
        if (duration) inputOptions.t = duration / speed
      })
      return files
    }
  }
}
