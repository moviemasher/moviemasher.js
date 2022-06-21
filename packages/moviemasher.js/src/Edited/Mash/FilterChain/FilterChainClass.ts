import { Dimensions } from "../../../Setup/Dimensions"
import { Evaluator, EvaluatorArgs } from "../../../Helpers/Evaluator"
import { Clip } from "../../../Mixin/Clip/Clip"
import { FilterGraph } from "../FilterGraph/FilterGraph"
import { FilterChain, FilterChainArgs } from "./FilterChain"
import { Phase } from "../../../Setup/Enums"
import { ChainLink, ChainLinks, FilterChainPhases } from "../../../Filter/Filter"
import { CommandFilter, CommandFilters, GraphFileArgs, GraphFiles } from "../../../MoveMe"
import { Errors } from "../../../Setup/Errors"

export class FilterChainClass implements FilterChain {
  constructor(public args: FilterChainArgs) {
  }

  _chainLinks?: ChainLinks
  get chainLinks() { return this._chainLinks ||= this.clip.chainLinks() }

  get clip(): Clip { return this.args.clip }


  get commandFilters(): CommandFilters {
    const commandFilters: CommandFilters = []

    return commandFilters

    // const { duration, videoRate: rate, backcolor, size } = this
    // const color = backcolor || colorTransparent
    // const colorCommandFilter: CommandFilter = {
    //   ffmpegFilter: 'color',
    //   options: { rate, color, size: `${size.width}x${size.height}` },
    //   outputs: [FilterGraphInput]
    // }

    // if (duration) colorCommandFilter.options.duration = duration
    // commandFilters.push(colorCommandFilter)

    // let prevOutput = ''

    //   const { filterChainPhases } = this
    //   filterChainPhases.forEach(filterChainPhase => {
    //     const { link, values } = filterChainPhase
    //     const commands = link.filterChainServerFilters(this, values || {})
    //     let prevCommandFilter: CommandFilter | undefined = undefined

    //     const { length } = commands
    //     commands.forEach((commandFilter, index) => {
    //       const { inputs, ffmpegFilter } = commandFilter
    //       commandFilter.outputs ||= [`${ffmpegFilter}${index}`]

    //       if (inputs && !inputs.length) {
    //         if (prevCommandFilter?.outputs?.length) inputs.push(...prevCommandFilter.outputs)
    //         else {
    //           const { inputCount } = this.filterGraph
    //           if (inputCount) {
    //             const inputName = `${inputCount - 1}:v`
    //             // console.log(this.constructor.name, "commandFilters setting inputs", ffmpegFilter, inputName)
    //             commandFilter.inputs = [inputName]
    //           }
    //         }
    //       }
    //       commandFilters.push(commandFilter)
    //       if (index === length - 1) {
    //         if (!commandFilter.inputs?.length && prevCommandFilter && prevOutput) {
    //           const { outputs: lastOutputs } = prevCommandFilter
    //           if (!lastOutputs?.length) throw new Error(Errors.internal + 'lastOutputs')

    //           const lastOutput = lastOutputs[lastOutputs.length - 1]
    //           commandFilter.inputs = [prevOutput, lastOutput]
    //         }
    //       }
    //       prevOutput = commandFilter.outputs[commandFilter.outputs.length - 1]
    //       prevCommandFilter = commandFilter
    //     })
    //   })

    // return commandFilters
  }


  private _evaluator?: Evaluator
  get evaluator() { return this._evaluator ||= this.evaluatorInitialize }
  get evaluatorInitialize(): Evaluator {
    const { filterGraph, args } = this
    const { timeRange, tweenTime } = args
    const { size } = filterGraph
    const evaluatorArgs: EvaluatorArgs = {
      instance: this.clip, outputDimensions: size, timeRange, tweenTime
    }
    return new Evaluator(evaluatorArgs)
  }

  get filterGraph(): FilterGraph { return this.args.filterGraph }

  _filterChainPhases?: FilterChainPhases
  get filterChainPhases() {
    return this._filterChainPhases ||= this.phasesFromLinks(this.chainLinks)
  }
  private phasesFromLinks(chainLinks: ChainLinks): FilterChainPhases {
    const chainPhases: FilterChainPhases = []
    // const { chainLinks } = this
    const filterAdd = (chainLink: ChainLink, phase: Phase): void => {
      const result = chainLink.filterChainPhase(this, phase)
      if (!result) return

      chainPhases.push(result)
    }
    chainLinks.forEach(filter => {
      filterAdd(filter, Phase.Initialize)
      filterAdd(filter, Phase.Populate)
      filterAdd(filter, Phase.Finalize)
    })
    return chainPhases
  }

  // graphFile(localId: string): GraphFile {
  //   return this.filterGraph.graphFilesById.get(this.filterGraph.graphFileId(localId))!
  // }


  private _graphFiles?: GraphFiles
  get graphFiles() { return this._graphFiles ||= this.graphFilesInitialize }
  get graphFilesInitialize():GraphFiles {
    const graphFiles: GraphFiles = []
    const { quantize, visible, streaming, time } = this.args.filterGraph
    const graphFileArgs: GraphFileArgs = { quantize, visible, streaming, time }
    return this.clip.graphFiles(graphFileArgs)
  }

  // graphFilters: GraphFilters = []

  // inputId(localId: string): string {
  //   return this.filterGraph.inputIdsByGraphFileId.get(this.filterGraph.graphFileId(localId))!
  // }

  get size(): Dimensions { return this.filterGraph.size  }

  // uniqueFilter(filter: string): string {
  //   const { graphFilters } = this
  //   const filters = graphFilters.filter(graphFilter => graphFilter.ffmpegFilter === filter)
  //   const { length } = filters
  //   return `${filter.toUpperCase()}${length}`
  // }
}
