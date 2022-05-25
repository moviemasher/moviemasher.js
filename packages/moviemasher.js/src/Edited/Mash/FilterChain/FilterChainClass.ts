import { VisibleContext } from "../../../Context"
import { GraphFile, GraphFilter, GraphFilters, ModularGraphFilter } from "../../../declarations"
import { GraphType } from "../../../Setup"
import { Errors } from "../../../Setup/Errors"
import { FilterGraphInstance } from "../FilterGraph/FilterGraph"
import { FilterChain } from "./FilterChain"

export interface FilterChainConstructorArgs {
  graphFilter?: GraphFilter
  graphFilters?: GraphFilters
  filterGraph: FilterGraphInstance
}

export class FilterChainClass implements FilterChain {
  constructor(public args: FilterChainConstructorArgs) { }

  addGraphFile(graphFile: GraphFile): string {
    return this.filterGraph.addGraphFile(graphFile)
  }

  addGraphFilter(graphFilter: GraphFilter): void {
    this.assureInputsAndOutputs(graphFilter)
    const { graphFilters } = this
    graphFilters.push(graphFilter)
  }

  addModularGraphFilter(modularGraphFilter: ModularGraphFilter): void {
    const { graphFiles } = modularGraphFilter
    graphFiles?.forEach(graphFile => { this.addGraphFile(graphFile) })
    this.addGraphFilter(modularGraphFilter)
  }

  private assureInputsAndOutputs(graphFilter: GraphFilter): void {
    const { graphFilters } = this
    const prevFilter: GraphFilter = graphFilters[graphFilters.length - 1]
    const { inputs, outputs, filter } = graphFilter
    if (!outputs) graphFilter.outputs = [this.uniqueFilter(filter)]
    if (inputs && !inputs.length)  {
      if (prevFilter?.outputs?.length) inputs.push(...prevFilter.outputs)
      else {
        const {inputCount} = this.filterGraph
        if (inputCount) graphFilter.inputs = [`${inputCount - 1}:v`]
      }
    }
  }

  private assureMergerInputsAndOutputs(merger: GraphFilter): void {
    const { filterGraph, graphFilters } = this
    if (!merger.outputs?.length) merger.outputs = filterGraph.graphFilterOutputs(merger)
    if (!merger.inputs?.length) {
      const prevOutput = filterGraph.graphFilterOutput
      if (!prevOutput) throw Errors.internal + 'graphFilterOutput'

      const last = graphFilters[graphFilters.length - 1]
      if (!last) {
        console.trace(this.constructor.name, "graphFilter with no last", graphFilters.length)
        throw Errors.internal + 'last'
      }
      const { outputs: lastOutputs } = last
      if (!lastOutputs?.length) throw Errors.internal + 'lastOutputs'

      const lastOutput = lastOutputs[lastOutputs.length - 1]
      merger.inputs = [prevOutput, lastOutput]
    }
  }

  get filterGraph(): FilterGraphInstance { return this.args.filterGraph }

  private _graphFilter?: GraphFilter
  get graphFilter(): GraphFilter | undefined {
    return this._graphFilter ||= this.args.graphFilter
  }
  set graphFilter(merger: GraphFilter | undefined) {
    if (!merger) throw Errors.invalid.object + 'graphFilter'

    const { filterGraph } = this
    const { preloading, graphType } = filterGraph
    if (!preloading && graphType !== GraphType.Canvas) this.assureMergerInputsAndOutputs(merger)

    this._graphFilter = merger
  }

  private _graphFilters?: GraphFilters
  get graphFilters(): GraphFilters {
    return this._graphFilters ||= this.args.graphFilters || []
  }

  uniqueFilter(filter: string): string {
    const { graphFilters } = this
    const filters = graphFilters.filter(graphFilter => graphFilter.filter === filter)
    const { length } = filters
    return `${filter.toUpperCase()}${length}`
  }

  _visibleContext?: VisibleContext
  get visibleContext(): VisibleContext { return this._visibleContext! }
  set visibleContext(value: VisibleContext) { this._visibleContext = value }
}
