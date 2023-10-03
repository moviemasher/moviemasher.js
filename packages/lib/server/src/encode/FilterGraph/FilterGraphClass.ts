import type { Size, Time, } from '@moviemasher/runtime-shared'
import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, CommandInput, CommandInputs } from '@moviemasher/runtime-server'
import type { ServerClips, ServerMashAsset } from '../../Types/ServerMashTypes.js'
import type { FilterGraph, FilterGraphArgs } from './FilterGraph.js'

import { AVTypeAudio, AVTypeVideo, arrayLast, assertMashAsset, assertTrue, colorTransparent, idGenerate, isAboveZero, sortByTrack, timeRangeFromTime, } from '@moviemasher/lib-shared'
import { assertAsset, errorThrow } from '@moviemasher/runtime-shared'


export const FilterGraphInputVisible = 'BACKCOLOR'
export const FilterGraphInputAudible = 'SILENCE'

export class FilterGraphClass implements FilterGraph {
  constructor(args: FilterGraphArgs) {
    const { mash, background, size, time, streaming, videoRate, visible } = args
    // console.log('FilterGraphClass', this.id, visible, time)
    assertMashAsset(mash)

    this.mash = mash
    this.time = time
    this.videoRate = videoRate 
    this.background = background

    this.size = size
    // console.log(this.constructor.name, this.id, 'size', size)
    // console.log(this.constructor.name, this.id, 'visible', visible)
    if (visible) this.visible = true
    if (streaming) this.streaming = true
    assertTrue(isAboveZero(this.videoRate), 'videoRate')
    assertTrue(this.time.fps === this.quantize, 'time is in mash rate')
  }

  _id?: string
  get id() { return this._id ||= idGenerate('filtergraph')}
  get avType() { return this.visible ? AVTypeVideo : AVTypeAudio }

  background: string 

  private get commandFilterVisible(): CommandFilter {
    const { duration, videoRate: rate, background, size } = this
    // console.log(this.constructor.name, this.id, 'commandFilterVisible size', size)
    const color = background || colorTransparent
    const commandFilter: CommandFilter = {
      ffmpegFilter: 'color',
      options: { color, rate, size: `${size.width}x${size.height}` },
      inputs: [], outputs: [FilterGraphInputVisible]
    }
    if (duration) commandFilter.options.duration = duration
    return commandFilter
  }

  private get commandFilterAudible(): CommandFilter {
    const { duration } = this
    const silenceCommandFilter: CommandFilter = {
      ffmpegFilter: 'aevalsrc',
      options: { exprs: 0, duration },
      inputs: [], outputs: [FilterGraphInputAudible]
    }
    if (duration) silenceCommandFilter.options.duration = duration
    return silenceCommandFilter
  }

  private _clips?: ServerClips
  private get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { time, mash, avType } = this
    const clips = mash.clipsInTimeOfType(time, avType).sort(sortByTrack)
    // if (!clips.length) console.log(this.constructor.name, this.id, 'clipsInitialize', time, avType)
    // console.log(this.constructor.name, this.id, 'clipsInitialize', clips.length, time, avType) 
    return clips
  }

  private commandFileKey(commandFile: CommandFile): string {
    const { definition } = commandFile
    assertAsset(definition)

    return commandFile.file
  }

  get commandInputs(): CommandInputs {
    // console.log(this.constructor.name, 'commandInputs')
    return this.inputCommandFiles.map(commandFile => {
      const { options, definition } = commandFile
      assertAsset(definition)

      const input: CommandInput = { 
        source: this.commandFileKey(commandFile), 
        options 
      }
      return input
    })
  }

  private _filterGraphCommandFiles?: CommandFiles
  get filterGraphCommandFiles(): CommandFiles {
    return this._filterGraphCommandFiles ||= this.filterGraphCommandFilesInitialize
  }
  get filterGraphCommandFilesInitialize(): CommandFiles {
    const { time, videoRate, quantize, size: outputSize, clips, visible } = this
    
    // console.log(this.constructor.name, this.id, 'filterGraphCommandFilesInitialize', clips.length)
    const commandFiles = clips.flatMap(clip => {
      const clipTime = clip.timeRange
      const chainArgs: CommandFileArgs = { 
        time, quantize, visible, outputSize, videoRate, clipTime
      }
      return clip.clipCommandFiles(chainArgs)
    })

    commandFiles.forEach(commandFile => {
      // const { resolved } = commandFile
      commandFile.resolved ||= this.commandFileKey(commandFile)
      // console.log(this.constructor.name, this.id, 'filterGraphCommandFilesInitialize', resolved, '->', commandFile.resolved)

    })
    // console.log(this.constructor.name, this.id, 'filterGraphCommandFilesInitialize', commandFiles.length)

    return commandFiles
  }

  get commandFilters(): CommandFilters { 
    const filters: CommandFilters = []
    const { 
      time, quantize, size: outputSize, clips, 
      visible, videoRate, filterGraphCommandFiles: commandFiles
    } = this

    // console.log(this.constructor.name, this.id, 'commandFilters', commandFiles.length)

    const chainArgs: CommandFilterArgs = { 
      commandFiles,
      videoRate, time, quantize, visible, outputSize, 
      chainInput: '', clipTime: timeRangeFromTime(time), track: 0
    }
    
    if (visible) {
      filters.push(this.commandFilterVisible)
      chainArgs.chainInput = FilterGraphInputVisible
    } else {
      filters.push(this.commandFilterAudible)
      chainArgs.chainInput = FilterGraphInputAudible
    }
    
    const { length } = clips
    clips.forEach((clip, index) => {
      chainArgs.clipTime = clip.timeRange
      chainArgs.track = index
      // console.log(this.constructor.name, this.id, 'commandFilters', commandFiles.length, index)
      filters.push(...clip.clipCommandFilters(chainArgs))
    
      const lastFilter = arrayLast(filters)
      if (index < length - 1 ) {
        if (!lastFilter.outputs.length) lastFilter.outputs.push(idGenerate('clip'))
      }
      chainArgs.chainInput = arrayLast(lastFilter.outputs)
    })
    return filters
  }

  get duration(): number { return this.time.lengthSeconds }

  get inputCommandFiles(): CommandFiles { 
    return this.filterGraphCommandFiles.filter(file => file.input) 
  }
  
  mash: ServerMashAsset

  get quantize() { return this.mash.quantize }

  size: Size 

  streaming = false

  time: Time 

  visible = false

  videoRate: number 
}
