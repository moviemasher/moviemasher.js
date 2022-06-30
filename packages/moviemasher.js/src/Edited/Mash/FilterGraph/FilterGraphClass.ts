import { Dimensions } from "../../../Setup/Dimensions"
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

export const FilterGraphInput = 'COLORBACK'

export class FilterGraphClass implements FilterGraph {
  constructor(args: FilterGraphArgs) {
    const { mash, backcolor, size, time, streaming, videoRate, visible } = args
    assertMash(mash)

    this.mash = mash
    this.time = time
    this.videoRate = videoRate 
    this.backcolor = backcolor
    this.size = size
    if (visible) this.visible = true
    if (streaming) this.streaming = true
    assertTrue(isAboveZero(this.videoRate), 'videoRate')
    assertTrue(this.time.fps === this.quantize, 'time is in mash rate')
  }
  
  backcolor: string 

  private get backCommandFilter(): CommandFilter {
    const { duration, videoRate: rate, backcolor, size } = this
    const color = backcolor || colorTransparent
    const colorCommandFilter: CommandFilter = {
      ffmpegFilter: 'color',
      options: { color, rate, size: `${size.width}x${size.height}` },
      inputs: [], outputs: [FilterGraphInput]
    }
    if (duration) colorCommandFilter.options.duration = duration
    return colorCommandFilter
  }

  private _clips?: VisibleClip[]
  private get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { time, mash } = this
    return mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack)
  }

  get commandInputs(): CommandInputs {
    return this.inputCommandFiles.map(commandFile => {
      const { file, options } = commandFile
      const input: CommandInput = { source: this.preloader.key(commandFile), options }
      return input
    })
  }

  private _commandFiles?: CommandFiles
  get commandFiles(): CommandFiles {
    return this._commandFiles ||= this.commandFilesInitialize
  }
  get commandFilesInitialize(): CommandFiles {
    const commandFiles: CommandFiles = []
    const { time, videoRate, quantize, size: outputDimensions, clips, visible, preloader } = this
    const chainArgs: CommandFileArgs = { 
      time, quantize, visible, outputDimensions, videoRate
    }
    commandFiles.push(...clips.flatMap(clip => clip.commandFiles(chainArgs)))
    commandFiles.forEach(commandFile => {
      commandFile.resolved = preloader.key(commandFile)
    })
    return commandFiles
  }

  get commandFilters(): CommandFilters { 
    const commandFilters: CommandFilters = []
    const { 
      time, quantize, size: outputDimensions, clips, 
      visible, videoRate, commandFiles 
    } = this
    if (visible) commandFilters.push(this.backCommandFilter)
    const chainArgs: CommandFilterArgs = { 
      videoRate, time, quantize, visible, outputDimensions, commandFiles, 
      chainInput: FilterGraphInput,
    }

    const { length } = clips
    clips.forEach((clip, index) => {
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

  size: Dimensions 

  streaming = false

  time: Time 

  visible = false

  videoRate: number 
}
