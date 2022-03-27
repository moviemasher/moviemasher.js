import { GraphFiles } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { AVType, LoadTypes } from "../../../Setup/Enums"
import { FilterGraphInstance } from "../FilterGraph/FilterGraph"
import { FilterGraphClass, FilterGraphArgs } from "../FilterGraph/FilterGraphClass"
import { FilterGraphsArgs, FilterGraphsInstance } from "./FilterGraphs"
import { timeFromArgs, timeRangeFromArgs } from "../../../Helpers/Time/TimeUtilities"
import { Time } from "../../../Helpers/Time/Time"

export class FilterGraphsClass implements FilterGraphsInstance {
  constructor(public args: FilterGraphsArgs) {
    const { avType, times, ...rest } = args
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
      if (length > 1) throw Errors.internal + 'multiple times'
      this.time = time
    }

    if (avType !== AVType.Video) {
      if (avType === AVType.Audio && length > 1) throw Errors.internal + 'times audio'

      const filterGraphArgs: FilterGraphArgs = {
        ...rest, time: this.time, avType: AVType.Audio, filterGraphs: this
      }
      this.filterGraphAudible = new FilterGraphClass(filterGraphArgs)
      // this.filterGraphs.push(this.filterGraphAudible)
    }
    this.filterGraphs.push(...times.map(time => {
      const filterGraphArgs: FilterGraphArgs = {
        ...rest, time, avType, filterGraphs: this
      }
      return new FilterGraphClass(filterGraphArgs)
    }))
    this.filterGraphs.forEach(filterGraph => filterGraph.filterChainsInitialize())
  }

  get duration(): number { return this.time.lengthSeconds }

  private filterGraphs: FilterGraphInstance[] = []

  get filterGraphsVisible(): FilterGraphInstance[] {
    return this.filterGraphs.filter(filterGraph => filterGraph.avType !== AVType.Audio)
  }

  _filterGraphAudible?: FilterGraphInstance
  get filterGraphAudible() { return this._filterGraphAudible! }
  set filterGraphAudible(value: FilterGraphInstance) { this._filterGraphAudible = value }

  get filterGraphVisible(): FilterGraphInstance {
    return this.filterGraphsVisible[0]
  }

  _graphFiles?: GraphFiles
  get graphFiles(): GraphFiles {
    const graphs = [...this.filterGraphs]
    if (this._filterGraphAudible) graphs.push(this.filterGraphAudible)
    return this._graphFiles ||= graphs.flatMap(graph => graph.graphFiles)
  }

  get graphFilesInput(): GraphFiles {
    return this.graphFiles.filter(graphFile => graphFile.input)
  }

  get graphFilesLoadable(): GraphFiles {
    return this.graphFiles.filter(graphFile =>
      LoadTypes.map(String).includes(String(graphFile.type))
    )
  }

  time: Time
}
