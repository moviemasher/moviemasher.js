import type { AssetFileType, AudibleAsset, AudibleInstance, CacheArgs, Constrained } from '@moviemasher/shared-lib/types.js'
import type { ServerAudibleAsset } from '../type/ServerAssetTypes.js'
import type { AudioCommandFileArgs, CommandFileArgs, CommandFiles, ServerAsset, ServerAudibleInstance, ServerInstance } from '../types.js'
import { AUDIO, SVGS, VIDEO } from '@moviemasher/shared-lib/runtime.js'


export function ServerAudibleAssetMixin<T extends Constrained<ServerAsset & AudibleAsset>>(Base: T):
T & Constrained<ServerAudibleAsset> {
  return class extends Base implements ServerAudibleAsset {}
}

export function ServerAudibleInstanceMixin<T extends Constrained<ServerInstance & AudibleInstance>>(Base: T):
  T & Constrained<ServerAudibleInstance> {
  return class extends Base implements ServerAudibleInstance {
    declare asset: ServerAudibleAsset

    // private amixCommandFilters(args: CommandFilterArgs): CommandFilters {
    //   const { chainInput, filterInput } = args
    //   assertPopulatedString(chainInput)
    //   assertPopulatedString(filterInput)

    //   const commandFilter: CommandFilter = {
    //     ffmpegFilter: 'amix',
    //     inputs: [chainInput, filterInput],
    //     options: { normalize: 0 }, outputs: []
    //   }
    //   return [commandFilter]
    // }

    audibleCommandFiles(args: AudioCommandFileArgs): CommandFiles {
      return this.fileCommandFiles({ ...args, visible: false, audible: true })
    }

    override fileCommandFiles(args: CommandFileArgs): CommandFiles {
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

      const files = super.fileCommandFiles(args)
      const types: AssetFileType[] = [AUDIO, VIDEO]
      files.forEach(file => {
        const { type, avType } = file
        if (!types.includes(type)) return

        file.inputOptions ||= {}
        const { inputOptions } = file
        if (startSeconds) {
          inputOptions.ss = startSeconds
          // if (avType === VIDEO) inputOptions.c = 'h264'
        }
        if (offset > 0 && avType === VIDEO) inputOptions.itsoffset = `${offset}s`
        if (duration) inputOptions.t = duration / speed
      })
      return files
    }
    // audibleCommandFilters(args: AudibleCommandFilterArgs): CommandFilters {
    //   const commandFilters: CommandFilters = []
    //   const { time, clipTime } = args
    //   assertTimeRange(time)
    //   assertTimeRange(clipTime)

    //   const { fps } = time

    //   const intersection = time.intersection(clipTime)
    //   if (!intersection) return commandFilters

    //   const { id, speed } = this


    //   const [_, startTrimFrame] = this.assetFrames(fps)
    //   // const durationTime = timeFromArgs(durationFrames - (startTrimFrame - endTrimFrame), fps)
    //   const duration = intersection.lengthSeconds * speed // Math.min(time.seconds, durationTime.seconds, clipTime.lengthSeconds)


    //   let filterInput = [id, 'a'].join(COLON)

    //   const trimFilter = 'atrim'
    //   const trimId = idGenerate(trimFilter)

    //   // const assetTime = this.assetTime(time)
    //   // const { frame } = assetTime
    //   // console.log(this.constructor.name, 'audibleCommandFilters', {time, clipTime, assetTime})
    //   const trimOptions: ValueRecord = { duration }
    //   if (startTrimFrame) trimOptions.start = startTrimFrame / fps

    //   const commandFilter: CommandFilter = {
    //     inputs: [filterInput],
    //     ffmpegFilter: trimFilter,
    //     options: trimOptions,
    //     outputs: [trimId]
    //   }
    //   commandFilters.push(commandFilter)
    //   filterInput = trimId

    //   if (speed !== 1) {
    //     const atempoFilter = 'atempo'
    //     const atempoId = idGenerate(atempoFilter)
    //     const atempoCommandFilter: CommandFilter = {
    //       inputs: [filterInput],
    //       ffmpegFilter: atempoFilter,
    //       options: { tempo: speed },
    //       outputs: [atempoId]
    //     }
    //     commandFilters.push(atempoCommandFilter)
    //     filterInput = atempoId
    //   }


    //   const delays = (clipTime.seconds - time.seconds) * 1000
    //   if (delays) {
    //     const adelayFilter = 'adelay'
    //     const adelayId = idGenerate(adelayFilter)
    //     const adelayCommandFilter: CommandFilter = {
    //       ffmpegFilter: adelayFilter,
    //       options: { delays, all: 1 },
    //       inputs: [filterInput], outputs: [adelayId]
    //     }
    //     commandFilters.push(adelayCommandFilter)
    //     filterInput = adelayId
    //   }
    //   commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }))
    //   return commandFilters
    // }

    // initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    //   const { time, videoRate, duration } = args
    //   if (!container) return super.initialCommandFilters(args, tweening, container)

    //   const commandFilters: CommandFilters = []
    //   const { fps } = time
    //   const [_, startTrimFrame] = this.assetFrames(fps)
    //   const { id, speed } = this
    //   let filterInput = [id, 'v'].join(COLON)
    //   assertPopulatedString(filterInput, 'filterInput')

    //   const trimFilter = 'trim'
    //   const trimId = idGenerate(trimFilter)
    //   const trimOptions: ValueRecord = {}
    //   if (startTrimFrame) trimOptions.start = startTrimFrame / fps
    //   if (duration) trimOptions.duration = duration
    //   const commandFilter: CommandFilter = {
    //     inputs: [filterInput],
    //     ffmpegFilter: trimFilter,
    //     options: trimOptions,
    //     outputs: [trimId]
    //   }
    //   commandFilters.push(commandFilter)
    //   filterInput = trimId
    //   if (duration) {
    //     const fpsFilter = 'fps'
    //     const fpsId = idGenerate(fpsFilter)
    //     const fpsCommandFilter: CommandFilter = {
    //       ffmpegFilter: fpsFilter,
    //       options: { fps: videoRate },
    //       inputs: [filterInput], outputs: [fpsId]
    //     }
    //     commandFilters.push(fpsCommandFilter)
    //     filterInput = fpsId
    //   }
    //   const setptsFilter = 'setpts'
    //   const setptsId = idGenerate(setptsFilter)
    //   const setptsCommandFilter: CommandFilter = {
    //     ffmpegFilter: setptsFilter,
    //     options: { expr: `(${1 / speed} * PTS)-STARTPTS` },
    //     inputs: [filterInput], outputs: [setptsId]
    //   }
    //   commandFilters.push(setptsCommandFilter)
    //   return commandFilters
    // }
  }
}

