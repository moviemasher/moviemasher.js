import type { CommandFilter, CommandFilters, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { AudibleInstance, Constrained, ValueRecord } from '@moviemasher/runtime-shared'
import type { ServerAudibleAsset } from '../Types/ServerAssetTypes.js'
import type { ServerAudibleInstance, ServerInstance } from '../Types/ServerInstanceTypes.js'
import type { Tweening } from '../Types/ServerTypes.js'

import { assertPopulatedString } from '@moviemasher/lib-shared/utility/guards.js'
import { commandFilesInput } from '../Utility/CommandFilesFunctions.js'
import { idGenerate } from '@moviemasher/runtime-shared'
import { timeFromArgs } from '@moviemasher/lib-shared/utility/time.js'

export function ServerAudibleInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: ServerAudibleAsset

    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { time, quantize, commandFiles, videoRate, duration, visible } = args
      if (!(visible || container)) return super.initialCommandFilters(args, tweening, container)

      const { id } = this
      let filterInput = commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'filterInput')
    
      const trimFilter = 'trim' 
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueRecord = {}
      if (duration) trimOptions.duration = duration
      const { frame } = this.assetTime(time)
      if (frame) trimOptions.start = timeFromArgs(frame, quantize).seconds
      const commandFilter: CommandFilter = { 
        inputs: [filterInput], 
        ffmpegFilter: trimFilter, 
        options: trimOptions, 
        outputs: [trimId]
      }
      commandFilters.push(commandFilter)
      filterInput = trimId
      if (duration) {
        const fpsFilter = 'fps'
        const fpsId = idGenerate(fpsFilter)
        const fpsCommandFilter: CommandFilter = { 
          ffmpegFilter: fpsFilter, 
          options: { fps: videoRate }, 
          inputs: [filterInput], outputs: [fpsId]
        }
        commandFilters.push(fpsCommandFilter)
        filterInput = fpsId
      } 
      const setptsFilter = 'setpts'
      const setptsId = idGenerate(setptsFilter)
      const setptsCommandFilter: CommandFilter = { 
        ffmpegFilter: setptsFilter, 
        options: { expr: 'PTS-STARTPTS' }, 
        inputs: [filterInput], outputs: [setptsId]
      }
      commandFilters.push(setptsCommandFilter) 
      return commandFilters
    }
  }
}
