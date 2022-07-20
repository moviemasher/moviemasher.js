import { Size } from "../../../Utility/Size"
import { CommandFilters, CommandFilter, CommandFiles, CommandFileArgs, CommandFilterArgs } from "../../../MoveMe"
import { FilterGraph, FilterGraphArgs } from "./FilterGraph"
import { CommandInput, CommandInputs } from "../../../Api/Rendering"
import { Loader } from "../../../Loader/Loader"
import { assertMash, Mash } from "../Mash"
import { Time } from "../../../Helpers/Time/Time"
import { assertTrue, isAboveZero } from "../../../Utility/Is"
import { AVType } from "../../../Setup/Enums"
import { sortByTrack } from "../../../Utility/Sort"
import { colorTransparent } from "../../../Utility/Color"
import { VisibleClip } from "../../../Media/VisibleClip/VisibleClip"
import { idGenerate } from "../../../Utility/Id"
import { arrayLast } from "../../../Utility"
import { timeRangeFromTime } from "../../../Helpers/Time/TimeUtilities"

export const FilterGraphInputVisible = 'BACKCOLOR'
export const FilterGraphInputAudible = 'SILENCE'

export class FilterGraphClass implements FilterGraph {
  constructor(args: FilterGraphArgs) {
    const { mash, backcolor, size, time, streaming, videoRate, visible } = args
    assertMash(mash)

    this.mash = mash
    this.time = time
    this.videoRate = videoRate 
    this.backcolor = backcolor
    this.size = size
    // console.log(this.constructor.name, this.id, "size", size)
    if (visible) this.visible = true
    if (streaming) this.streaming = true
    assertTrue(isAboveZero(this.videoRate), 'videoRate')
    assertTrue(this.time.fps === this.quantize, 'time is in mash rate')
  }

  _id?: string
  get id() { return this._id ||= idGenerate('filtergraph')}
  get avType() { return this.visible ? AVType.Video : AVType.Audio }

  backcolor: string 

  private get commandFilterVisible(): CommandFilter {
    const { duration, videoRate: rate, backcolor, size } = this
    // console.log(this.constructor.name, this.id, "commandFilterVisible size", size)
    const color = backcolor || colorTransparent
    const colorCommandFilter: CommandFilter = {
      ffmpegFilter: 'color',
      options: { color, rate, size: `${size.width}x${size.height}` },
      inputs: [], outputs: [FilterGraphInputVisible]
    }
    if (duration) colorCommandFilter.options.duration = duration
    return colorCommandFilter
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

  private _clips?: VisibleClip[]
  private get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { time, mash, avType } = this
    return mash.clipsInTimeOfType(time, avType).sort(sortByTrack)
  }

  get commandInputs(): CommandInputs {
    return this.inputCommandFiles.map(commandFile => {
      const { options } = commandFile
      const input: CommandInput = { source: this.preloader.key(commandFile), options }
      return input
    })
  }

  private _commandFiles?: CommandFiles
  get commandFiles(): CommandFiles {
    return this._commandFiles ||= this.commandFilesInitialize
  }
  get commandFilesInitialize(): CommandFiles {
    // console.log(this.constructor.name, "commandFilesInitialize")
    const commandFiles: CommandFiles = []
    const { time, videoRate, quantize, size: outputSize, clips, visible, preloader } = this
    
    // console.log(this.constructor.name, this.id, "commandFilesInitialize size", outputSize)
    commandFiles.push(...clips.flatMap(clip => {
      const clipTime = clip.timeRange(quantize)
      const chainArgs: CommandFileArgs = { 
        time, quantize, visible, outputSize: outputSize, videoRate, clipTime
      }
    return clip.commandFiles(chainArgs)
    }))
    commandFiles.forEach(commandFile => {
      commandFile.resolved = preloader.key(commandFile)
    })
    return commandFiles
  }

  get commandFilters(): CommandFilters { 
    const commandFilters: CommandFilters = []
    const { 
      time, quantize, size: outputSize, clips, 
      visible, videoRate, commandFiles 
    } = this

    // console.log(this.constructor.name, this.id, "commandFilters size", outputSize)

    const chainArgs: CommandFilterArgs = { 
      videoRate, time, quantize, visible, outputSize: outputSize, commandFiles, 
      chainInput: '', clipTime: timeRangeFromTime(time), track: 0
    }
    
    if (visible) {
      commandFilters.push(this.commandFilterVisible)
      chainArgs.chainInput = FilterGraphInputVisible
    } else {
      commandFilters.push(this.commandFilterAudible)
      chainArgs.chainInput = FilterGraphInputAudible
    }
    
    const { length } = clips
    clips.forEach((clip, index) => {
      chainArgs.clipTime = clip.timeRange(quantize)
      chainArgs.track = index
      // console.log(this.constructor.name, "commandFilters", chainArgs)
      commandFilters.push(...clip.commandFilters(chainArgs))
    
      const lastFilter = arrayLast(commandFilters)
      if (index < length - 1 ) {
        if (!lastFilter.outputs.length) lastFilter.outputs.push(idGenerate('clip'))
      }
      chainArgs.chainInput = arrayLast(lastFilter.outputs)
    })
    return commandFilters
  }

  get duration(): number { return this.time.lengthSeconds }

  get inputCommandFiles(): CommandFiles { return this.commandFiles.filter(file => file.input) }
  
  mash: Mash

  get preloader(): Loader { return this.mash.preloader }

  get quantize() { return this.mash.quantize }

  size: Size 

  streaming = false

  time: Time 

  visible = false

  videoRate: number 
}
