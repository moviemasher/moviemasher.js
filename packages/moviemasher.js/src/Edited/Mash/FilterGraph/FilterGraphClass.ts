import { Dimensions } from "../../../Setup/Dimensions"
import { GraphFiles, CommandFilters, GraphFile, GraphFileOptions, CommandFilter } from "../../../MoveMe"
import { FilterChainArgs, FilterChains } from "../FilterChain/FilterChain"
import { FilterGraph, FilterGraphArgs } from "./FilterGraph"
import { CommandInput, CommandInputs } from "../../../Api/Rendering"
import { Loader } from "../../../Loader/Loader"
import { assertMash, Mash } from "../Mash"
import { Time } from "../../../Helpers/Time/Time"
import { assertTrue, isAboveZero } from "../../../Utility/Is"
import { AVType } from "../../../Setup/Enums"
import { FilterChainClass } from "../FilterChain/FilterChainClass"
import { sortByTrack } from "../../../Utility/Sort"
import { colorTransparent } from "../../../Utility/Color"
import { Errors } from "../../../Setup/Errors"

export const FilterGraphInput = 'COLORBACK'

export class FilterGraphClass implements FilterGraph {
  constructor(args: FilterGraphArgs) {
    const { mash, backcolor, size, time, streaming, videoRate } = args
    assertMash(mash)

    this.mash = mash
    this.time = time
    this.videoRate = videoRate 
    this.backcolor = backcolor
    this.size = size
    if (streaming) this.streaming = true
    this.graphFilesById = new Map<string, GraphFile>()
    assertTrue(isAboveZero(this.videoRate), 'videoRate')
    assertTrue(this.time.fps === this.quantize, 'time is in mash rate')
  }

  audible = false
  
  backcolor: string 

  static backgroundOutput = 'COLORBACK'

  get commandInputs(): CommandInputs {
    return this.inputGraphFiles.map(graphFile => {
      const { file, options } = graphFile
      const input: CommandInput = { source: file, options }
      return input
    })
  }

  get commandFilters(): CommandFilters { 
    const commandFilters: CommandFilters = []
    const { duration, videoRate: rate, backcolor, size } = this
    const color = backcolor || colorTransparent
    const colorCommandFilter: CommandFilter = {
      ffmpegFilter: 'color',
      options: { rate, color, size: `${size.width}x${size.height}` },
      outputs: [FilterGraphInput]
    }

    if (duration) colorCommandFilter.options.duration = duration
    commandFilters.push(colorCommandFilter)

    let prevOutput = ''

    this.filterChains.forEach(chain => {
      const { filterChainPhases } = chain
      filterChainPhases.forEach(filterChainPhase => {
        const { link, values } = filterChainPhase
        const commands = link.filterChainServerFilters(chain, values || {})
        let prevCommandFilter: CommandFilter | undefined = undefined

        const { length } = commands
        commands.forEach((commandFilter, index) => {
          const { inputs, ffmpegFilter } = commandFilter
          commandFilter.outputs ||= [`${ffmpegFilter}${index}`]

          if (inputs && !inputs.length) {
            if (prevCommandFilter?.outputs?.length) inputs.push(...prevCommandFilter.outputs)
            else {
              const { inputCount } = this
              if (inputCount) {
                const inputName = `${inputCount - 1}:v`
                // console.log(this.constructor.name, "commandFilters setting inputs", ffmpegFilter, inputName)
                commandFilter.inputs = [inputName]
              }
            }
          }
          commandFilters.push(commandFilter)
          if (index === length - 1) {
            if (!commandFilter.inputs?.length && prevCommandFilter && prevOutput) {
              const { outputs: lastOutputs } = prevCommandFilter
              if (!lastOutputs?.length) throw new Error(Errors.internal + 'lastOutputs')

              const lastOutput = lastOutputs[lastOutputs.length - 1]
              commandFilter.inputs = [prevOutput, lastOutput]
            }
          }
          prevOutput = commandFilter.outputs[commandFilter.outputs.length - 1]
          prevCommandFilter = commandFilter
        })
      })
    })
    return commandFilters
  }

  get duration(): number { return this.time.lengthSeconds }

  editing = false
  
  private _filterChains?: FilterChains
  get filterChains() { return this._filterChains ||= this.filterChainsInitialize }
  private get filterChainsInitialize(): FilterChains {
    const filterChains: FilterChains = []
    const { time, quantize, mash } = this
    const tweenTime = time.isRange ? undefined : time.scale(quantize)
    const clips = mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack)
    const { length } = clips
    clips.forEach((clip, index) => {
      const clipTimeRange = clip.timeRange(quantize)
      const range = clipTimeRange.scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      const timeRange = range.withFrame(frame)
      const filterChainArgs: FilterChainArgs = {
        clip, filterGraph: this, tweenTime, timeRange, 
        input: FilterGraphInput, track: index, lastTrack: index === length - 1
      }
      const filterChain = new FilterChainClass(filterChainArgs)
      filterChains.push(filterChain)
    })
    return filterChains
  }
  
  get graphFiles() {  
    const { editing, visible, time } = this
    const graphFileArgs: GraphFileOptions = { editing, visible, time }
    return this.mash.graphFiles(graphFileArgs) 
  }

  private graphFilesById: Map<string, GraphFile>

  get inputCount(): number { return this.inputGraphFiles.length }

  get inputGraphFiles(): GraphFiles { return this.graphFiles.filter(file => file.input) }
  
  mash: Mash

  get preloader(): Loader { return this.mash.preloader }

  get quantize() { return this.mash.quantize }

  size: Dimensions 

  streaming = false

  time: Time 

  visible = true

  videoRate: number 
}
