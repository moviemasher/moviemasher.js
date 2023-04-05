
import { 
  timeFromArgs, timeRangeFromArgs, assertTrue, AVType, CommandFiles, 
  ServerPromiseArgs, EmptyFunction, Time, 
  errorThrow, ErrorName, assertMedia, Numbers 
} from "@moviemasher/lib-core"
import { FilterGraphArgs, FilterGraph } from "../FilterGraph/FilterGraph"
import { FilterGraphClass } from "../FilterGraph/FilterGraphClass"
import { FilterGraphsArgs, FilterGraphs } from "./FilterGraphs"

export class FilterGraphsClass implements FilterGraphs {
  constructor(public args: FilterGraphsArgs) {
    const { avType, times, mash, ...rest } = args

    const { length } = times
    if (!length) { // no clips in timeline
      this.time = timeFromArgs()
      return
    }
    const [time] = times
    const startFrames: Numbers = []
    const endFrames: Numbers = []
    const rates: Numbers = []
    times.forEach(time => {
      rates.push(time.fps)
      startFrames.push(time.frame)
      if (time.isRange) endFrames.push(time.timeRange.end)
    })
    if (endFrames.length) {
      const rate = Math.max(...rates)
      if (rate !== Math.min(...rates))  errorThrow(ErrorName.Internal) 

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
    const { commandFiles, time } = this
    const args: ServerPromiseArgs = {
      visible: true, audible: true, time
    }
    const promises = commandFiles.map(commandFile => {
      const { definition } = commandFile
      assertMedia(definition)
      return definition.serverPromise(args)
      
    })
    return Promise.all(promises).then(EmptyFunction)

    
  }

  time: Time
}
