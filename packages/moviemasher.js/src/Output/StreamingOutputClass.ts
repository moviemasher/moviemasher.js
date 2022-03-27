import {
  GraphFiles, GraphFilters, LoadPromise, Size, ValueObject
} from "../declarations"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, GraphType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { CommandOutput, StreamingOutput, StreamingOutputArgs } from "./Output"
import { CommandInput, CommandInputs, RenderingResult } from "../Api/Rendering"
import { Mash } from "../Edited/Mash/Mash"
import { FilterGraph, FilterGraphOptions } from "../Edited/Mash/FilterGraph/FilterGraph"
import { StreamingDescription } from "../Api/Streaming"
import { timeFromArgs } from "../Helpers"

class StreamingOutputClass implements StreamingOutput {
  constructor(args: StreamingOutputArgs) {
    this.args = args
  }

  args: StreamingOutputArgs

  commandArgs(filterGraph: FilterGraph): StreamingDescription {
    const { graphFilters, commandInputs } = filterGraph
    const options: ValueObject = { ...this.args.commandOutput.options }
    const commandOutput: CommandOutput = { ...this.args.commandOutput, options }
    // if (avType === AVType.Audio) {
    //   delete commandOutput.videoCodec
    //   delete commandOutput.videoRate
    // } else if (avType === AVType.Video) {
    //   delete commandOutput.audioCodec
    //   delete commandOutput.audioBitrate
    //   delete commandOutput.audioChannels
    //   delete commandOutput.audioRate
    // }

    const commandOptions: StreamingDescription = {
      inputs: commandInputs, graphFilters, commandOutput
    }
    return commandOptions
  }

  streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription> {
    const { mashes } = this.args
    const promises: LoadPromise[] = mashes.map(mash => {
      const filterGraphArgs: FilterGraphOptions = {
        preloading: true,
        graphType: GraphType.Cast,
        avType: AVType.Both, size: this.outputSize,
        videoRate: Number(this.args.commandOutput.videoBitrate)
      }
      const filterGraphs = mash.filterGraphs(filterGraphArgs)
      const graphFiles = filterGraphs.graphFiles
      return mash.preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
    })

    let promise = Promise.all(promises).then(() => {
      const avTypes = new Set<AVType>()
      const graphFiles: GraphFiles = []
      const graphFilters: GraphFilters = []
      const commandInputs: CommandInputs = []
      let avType = AVType.Both

      mashes.forEach(mash => {
        const args: FilterGraphOptions = {
          preloading: false,
          size: this.outputSize,
          videoRate: this.args.commandOutput.videoRate!,
          graphType: GraphType.Cast,
          avType: AVType.Both
        }
        const filterGraphs = mash.filterGraphs(args)
        const { filterGraphVisible } = filterGraphs

        commandInputs.push(...filterGraphVisible.commandInputs)
        graphFiles.push(...filterGraphs.graphFiles.filter(graphFile => graphFile.input))
        graphFilters.push(...filterGraphVisible.graphFilters)
        avTypes.add(filterGraphVisible.avType)
      })
      if (avTypes.size === 1) avType = [...avTypes][0]

      const combinedFilterGraph: FilterGraph = {
        duration: 0, time: timeFromArgs(),
        avType, graphFiles, graphFilters, commandInputs
      }
      return this.commandArgs(combinedFilterGraph)
    })
    return promise
  }

  mashes: Mash[] = []

  get outputSize(): Size {
    const { width, height } = this.args.commandOutput
    return { width, height }
  }
}

export { StreamingOutputClass }
