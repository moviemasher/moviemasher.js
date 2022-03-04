import { CommandArgs, CommandInput, CommandInputs, RenderingResult } from "../Api/Rendering"
import { FilterChain, FilterChains, FilterGraph, FilterGraphArgs, GraphFile, GraphFilter, GraphFilters, GraphInput, LoadPromise, Size, ValueObject } from "../declarations"
import { Mash } from "../Edited/Mash/Mash"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, GraphType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { CommandOutput, StreamingOutput, StreamingOutputArgs } from "./Output"



class StreamingOutputClass implements StreamingOutput {
  constructor(args: StreamingOutputArgs) {
    this.args = args
  }

  args: StreamingOutputArgs

  commandArgs(filterGraph: FilterGraph): CommandArgs {
    const { filterChains, duration, avType } = filterGraph
    const commandInputs: CommandInputs = []
    const graphFilters: GraphFilters = []
    if (!duration) throw 'duration'

    const options: ValueObject = { ...this.args.commandOutput.options }
    const commandOutput: CommandOutput = { ...this.args.commandOutput, options }

    if (avType === AVType.Audio) {
      delete commandOutput.videoCodec
      delete commandOutput.videoRate
    } else if (avType === AVType.Video) {
      delete commandOutput.audioCodec
      delete commandOutput.audioBitrate
      delete commandOutput.audioChannels
      delete commandOutput.audioRate
    }

    filterChains.forEach((filterChain: FilterChain) => {
      const { graphFilter: merger, graphFilters: filters, graphFiles: files } = filterChain
      files.forEach(graphFile => {
        const { type, file, input, options } = graphFile
        if (!input) return

        switch (type) {
          case LoadType.Video:
          case LoadType.Image: {
            const input: GraphInput = { source: file, options }
            commandInputs.push(input)
            break
          }
        }
      })
      graphFilters.push(...filters)
      if (merger) graphFilters.push(merger)
    })
    const commandOptions: CommandArgs = {
      inputs: commandInputs, graphFilters, output: commandOutput
    }
    return commandOptions
  }

  commandArgPromise(renderingResults?: RenderingResult[]): Promise<CommandArgs> {
    const { mashes } = this.args
    const promises: LoadPromise[] = mashes.map(mash => {
      const filterGraphArgs: FilterGraphArgs = {
        justGraphFiles: true,
        graphType: GraphType.Cast, timeRange: mash.timeRange,
        avType: AVType.Both, size: this.outputSize,
        videoRate: Number(this.args.commandOutput.videoBitrate)
      }
      const filterGraphs = mash.filterGraphs(filterGraphArgs)
      const graphFiles = filterGraphs.flatMap(filterGraph => filterGraph.filterChains.flatMap(filterChain => filterChain.graphFiles))
      return mash.preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
    })

    let promise = Promise.all(promises).then(() => {
      const filterChains: FilterChains = []
      const avTypes = new Set<AVType>()

      const combinedFilterGraph: FilterGraph = {
        filterChains,
        avType: AVType.Both,
      }
      mashes.forEach(mash => {
        const args: FilterGraphArgs = {
          justGraphFiles: false,
          size: this.outputSize, videoRate: this.args.commandOutput.videoRate!,
          timeRange: mash.timeRange,
          graphType: GraphType.Cast,
          avType: AVType.Both
        }
        const filterGraph = mash.filterGraphs(args).pop()
        if (!filterGraph) throw Errors.internal
        filterChains.push(...filterGraph.filterChains)
        avTypes.add(filterGraph.avType)
      })
      if (avTypes.size === 1) combinedFilterGraph.avType = [...avTypes][0]
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
