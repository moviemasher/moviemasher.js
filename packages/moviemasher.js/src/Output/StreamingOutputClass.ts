import {
  ValueObject} from "../declarations"
import { Size } from "../Utility/Size"
import { GraphFiles, CommandFilters, GraphFileOptions } from "../MoveMe"
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
      return mash.preloader.loadFilesPromise(mash.editedGraphFiles(options))
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
        files.push(...filterGraphs.fileUrls.filter(graphFile => graphFile.input))
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
