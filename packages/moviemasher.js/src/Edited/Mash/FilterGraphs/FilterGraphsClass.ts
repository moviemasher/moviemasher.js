import { GraphFiles } from "../../../MoveMe"
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
        ...rest, time: this.time, mash
      }
      // TODO make new audio-only graph...
      this.filterGraphAudible = new FilterGraphClass(filterGraphArgs)
    }
    this.filterGraphsVisible.push(...times.map(time => {
      const filterGraphArgs: FilterGraphArgs = { 
        ...rest, time, mash, visible: true 
      }
      const filterGraph = new FilterGraphClass(filterGraphArgs)
      return filterGraph
    }))
  }

  get duration(): number { return this.time.lengthSeconds }

  filterGraphsVisible: FilterGraph[] = []

  filterGraphAudible?: FilterGraph

  get filterGraphVisible(): FilterGraph { return this.filterGraphsVisible[0] }

  _graphFiles?: GraphFiles
  get graphFiles(): GraphFiles {
    const graphs = [...this.filterGraphsVisible]
    if (this.filterGraphAudible) graphs.push(this.filterGraphAudible)
    return this._graphFiles ||= graphs.flatMap(graph => graph.commandFiles)
  }

  get graphFilesInput(): GraphFiles {
    return this.graphFiles.filter(graphFile => graphFile.input)
  }
  get loadPromise(): Promise<void> {
    return this.args.mash.preloader.loadFilesPromise(this.graphFiles).then(EmptyMethod)
  }
  time: Time
}
