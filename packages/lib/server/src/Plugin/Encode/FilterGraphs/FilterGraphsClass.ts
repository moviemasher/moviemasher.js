
import { 
  timeFromArgs, timeRangeFromArgs, assertTrue, CommandFiles, EmptyFunction, 
 AVTypeAudio, AVTypeVideo 
} from "@moviemasher/lib-shared"
import { FilterGraphArgs, FilterGraph } from "../FilterGraph/FilterGraph.js"
import { FilterGraphClass } from "../FilterGraph/FilterGraphClass.js"
import { FilterGraphsArgs, FilterGraphs } from "./FilterGraphs.js"
import { ErrorName, Numbers, Time, assertAsset, errorThrow } from "@moviemasher/runtime-shared"
import { ServerPromiseArgs } from "@moviemasher/runtime-server"

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

    if (avType !== AVTypeVideo) {
      assertTrue(length === 1 || avType !== AVTypeAudio, 'single time for avtype audio')

      const filterGraphArgs: FilterGraphArgs = {
        ...rest, time: this.time, mash, visible: false,
      }
      this.filterGraphAudible = new FilterGraphClass(filterGraphArgs)
    }
    if (avType !== AVTypeAudio) {
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
      assertAsset(definition)
      return definition.serverPromise(args)
      
    })
    return Promise.all(promises).then(EmptyFunction)

    
  }

  time: Time
}
