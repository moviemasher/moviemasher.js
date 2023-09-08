import type { Tweening } from '@moviemasher/lib-shared'
import type { AudibleInstance, Constrained, ValueRecord } from '@moviemasher/runtime-shared'
import type { CommandFilter, CommandFilters, VisibleCommandFilterArgs } from '../Types/CommandTypes.js'
import type { ServerAudibleAsset } from '../Types/ServerAssetTypes.js'
import type { ServerAudibleInstance, ServerInstance } from '../Types/ServerInstanceTypes.js'

import { assertPopulatedString, idGenerate, timeFromArgs } from '@moviemasher/lib-shared'
import { commandFilesInput } from '../Utility/CommandFilesFunctions.js'

export function ServerAudibleInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: ServerAudibleAsset


    initialCommandFilters(args: VisibleCommandFilterArgs, _tweening: Tweening, _container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        time, quantize, commandFiles, clipTime, videoRate, duration 
      } = args

      const { id } = this
      // console.log(this.constructor.name, 'initialCommandFilters calling commandFilesInput', id)
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
