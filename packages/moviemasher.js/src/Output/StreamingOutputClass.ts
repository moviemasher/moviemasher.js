import {
  ValueObject} from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { GraphFiles, CommandFilters, GraphFileOptions } from "../MoveMe"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, GraphType } from "../Setup/Enums"
import { CommandOutput, StreamingOutput, StreamingOutputArgs } from "./Output"
import { CommandInputs, RenderingResult } from "../Api/Rendering"
import { Mashes } from "../Edited/Mash/Mash"
import { StreamingDescription } from "../Api/Streaming"
import { FilterGraphsOptions } from "../Edited/Mash/FilterGraphs/FilterGraphs"

export class StreamingOutputClass implements StreamingOutput {
  constructor(args: StreamingOutputArgs) {
    this.args = args
  }

  args: StreamingOutputArgs

  streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription> {
    const { mashes } = this.args
    const promises: Promise<void>[] = mashes.map(mash => {
      const options: GraphFileOptions = {
        audible: true, visible: true, streaming: true,
      }
      const graphFiles = mash.graphFiles(options)
      return mash.preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
    })

    let promise = Promise.all(promises).then(() => {
      const graphFiles: GraphFiles = []
      const commandFilters: CommandFilters = []
      const commandInputs: CommandInputs = []
      mashes.forEach(mash => {
        const args: FilterGraphsOptions = {
          size: this.outputDimensions,
          videoRate: this.args.commandOutput.videoRate!,
          graphType: GraphType.Cast,
          avType: AVType.Both
        }
        const filterGraphs = mash.filterGraphs(args)
        const { filterGraphVisible } = filterGraphs
        commandInputs.push(...filterGraphVisible.commandInputs)
        graphFiles.push(...filterGraphs.graphFiles.filter(graphFile => graphFile.input))
        commandFilters.push(...filterGraphVisible.commandFilters)
      })
      const options: ValueObject = { ...this.args.commandOutput.options }
      const commandOutput: CommandOutput = { ...this.args.commandOutput, options }
      const commandOptions: StreamingDescription = { inputs: commandInputs, commandFilters, commandOutput }
      return commandOptions
    })
    return promise
  }

  mashes: Mashes = []

  get outputDimensions(): Dimensions {
    const { width, height } = this.args.commandOutput
    return { width, height }
  }
}
