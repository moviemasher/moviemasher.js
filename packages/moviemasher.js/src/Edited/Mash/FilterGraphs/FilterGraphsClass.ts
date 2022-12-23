import { CommandFiles, GraphFiles } from "../../../MoveMe"
import { Errors } from "../../../Setup/Errors"
import { AVType } from "../../../Setup/Enums"
import { FilterGraphArgs, FilterGraph } from "../FilterGraph/FilterGraph"
import { FilterGraphClass } from "../FilterGraph/FilterGraphClass"
import { FilterGraphsArgs, FilterGraphs } from "./FilterGraphs"
import { timeFromArgs, timeRangeFromArgs } from "../../../Helpers/Time/TimeUtilities"
import { Time } from "../../../Helpers/Time/Time"
import { assertTrue } from "../../../Utility/Is"
import { EmptyMethod } from "../../../Setup/Constants"

export class FilterGraphsClass implements FilterGraphs {
  constructor(public args: FilterGraphsArgs) {
    const { avType, times, mash, ...rest } = args
    // console.log(this.constructor.name, "upload", args.upload)

    const { length } = times
    if (!length) { // no clips in timeline
      this.time = timeFromArgs()
      return
    }
    const [time] = times
    const startFrames: number[] = []
    const endFrames: number[] = []
    const rates: number[] = []
    times.forEach(time => {
      rates.push(time.fps)
      startFrames.push(time.frame)
      if (time.isRange) endFrames.push(time.timeRange.end)
    })
    if (endFrames.length) {
      const rate = Math.max(...rates)
      if (rate !== Math.min(...rates)) throw Errors.internal + 'timeranges fps'

      const startFrame = Math.min(...startFrames)
      const endFrame = Math.max(...endFrames)
      this.time = timeRangeFromArgs(startFrame, rate, endFrame)
    } else {
      assertTrue(length === 1, 'just one time')
      this.time = time
    }

    if (avType !== AVType.Video) {
      assertTrue(length === 1 || avType !== AVType.Audio, 'single time for avtype audio')

      const filterGraphArgs: FilterGraphArgs = {
        ...rest, time: this.time, mash, visible: false,
      }
      this.filterGraphAudible = new FilterGraphClass(filterGraphArgs)
    }
    if (avType !== AVType.Audio) {
      this.filterGraphsVisible.push(...times.map(time => {
        const filterGraphArgs: FilterGraphArgs = { 
          ...rest, time, mash, visible: true 
        }
        const filterGraph = new FilterGraphClass(filterGraphArgs)
        return filterGraph
      }))
    }
  }

  private _commandFiles?: CommandFiles
  get commandFiles(): CommandFiles {
    const graphs = [...this.filterGraphsVisible]
    if (this.filterGraphAudible) graphs.push(this.filterGraphAudible)
    return this._commandFiles ||= graphs.flatMap(graph => graph.filterGraphCommandFiles)
  }
  
  get duration(): number { return this.time.lengthSeconds }

  filterGraphsVisible: FilterGraph[] = []

  filterGraphAudible?: FilterGraph

  get filterGraphVisible(): FilterGraph { return this.filterGraphsVisible[0] }

  get inputCommandFiles(): CommandFiles {
    return this.commandFiles.filter(graphFile => graphFile.input)
  }

  get loadCommandFilesPromise(): Promise<void> {
    return this.args.mash.preloader.loadFilesPromise(this.commandFiles)
  }

  time: Time
}
