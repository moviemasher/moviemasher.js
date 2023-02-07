
import {  
  PreloadOptions, GraphFiles, CommandFilters, CommandInputs, AVType, 
  GraphType, ValueObject, Mashes, Size, CommandOutput
} from "@moviemasher/moviemasher.js"
import { RenderingResult } from "../Encode/Encode"
import { FilterGraphsOptions } from "../Encode/FilterGraphs/FilterGraphs"
import { filterGraphsArgs, filterGraphsInstance } from "../Encode/FilterGraphs/FilterGraphsFactory"
import { StreamingDescription } from "./Stream"
import { StreamingOutput, StreamingOutputArgs } from "./StreamingCommandOutput"

export class StreamingOutputClass implements StreamingOutput {
  constructor(args: StreamingOutputArgs) {
    this.args = args
  }

  args: StreamingOutputArgs

  streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription> {
    const { mashes } = this.args
    const promises: Promise<void>[] = mashes.map(mash => {
      const preloadOptions: PreloadOptions = {
        audible: true, visible: true, streaming: true,
      }

      return mash.loadPromise(preloadOptions)
    })

    let promise = Promise.all(promises).then(() => {
      const files: GraphFiles = []
      const commandFilters: CommandFilters = []
      const commandInputs: CommandInputs = []

      const avType = AVType.Both
      mashes.forEach(mash => {
        const options: FilterGraphsOptions = {
          size: this.outputSize,
          videoRate: this.args.commandOutput.videoRate!,
          graphType: GraphType.Cast,
          avType
        }
        
        const graphArgs = filterGraphsArgs(mash, options)
      
        const filterGraphs = filterGraphsInstance(graphArgs)
        const { filterGraphVisible } = filterGraphs
        commandInputs.push(...filterGraphVisible.commandInputs)
        files.push(...filterGraphs.commandFiles.filter(graphFile => graphFile.input))
        commandFilters.push(...filterGraphVisible.commandFilters)
      })
      const options: ValueObject = { ...this.args.commandOutput.options }
      const commandOutput: CommandOutput = { ...this.args.commandOutput, options }
      const commandOptions: StreamingDescription = { 
        inputs: commandInputs, commandFilters, commandOutput, avType 
      }
      return commandOptions
    })
    return promise
  }

  mashes: Mashes = []

  get outputSize(): Size {
    const { width, height } = this.args.commandOutput
    return { width, height }
  }
}
