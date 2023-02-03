
import { RenderingResult, StreamingDescription, PreloadOptions, GraphFiles, CommandFilters, CommandInputs, AVType, FilterGraphsOptions, GraphType, ValueObject, CommandOutput, Mashes, Size } from "@moviemasher/moviemasher.js"
import { StreamingOutput, StreamingOutputArgs } from "./StreamingCommandOutput"

export class StreamingOutputClass implements StreamingOutput {
  constructor(args: StreamingOutputArgs) {
    this.args = args
  }

  args: StreamingOutputArgs

  streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription> {
    const { mashes } = this.args
    const promises: Promise<void>[] = mashes.map(mash => {
      const options: PreloadOptions = {
        audible: true, visible: true, streaming: true,
      }

      return mash.loadPromise(options)
    })

    let promise = Promise.all(promises).then(() => {
      const files: GraphFiles = []
      const commandFilters: CommandFilters = []
      const commandInputs: CommandInputs = []

      const avType = AVType.Both
      mashes.forEach(mash => {
        const args: FilterGraphsOptions = {
          size: this.outputSize,
          videoRate: this.args.commandOutput.videoRate!,
          graphType: GraphType.Cast,
          avType
        }
        const filterGraphs = mash.filterGraphs(args)
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
