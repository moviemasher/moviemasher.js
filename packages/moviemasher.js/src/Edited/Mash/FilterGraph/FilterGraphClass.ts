import { CommandInput, CommandInputs } from "../../../Api"
import { ContextFactory } from "../../../Context/ContextFactory"
import { GraphFile, GraphFiles, GraphFilter, GraphFilters, Size } from "../../../declarations"
import { Evaluator, EvaluatorArgs } from "../../../Helpers/Evaluator"
import { Time } from "../../../Helpers/Time/Time"
import { TransitionFilterChainArgs } from "../../../Media/Transition/Transition"
import { Preloader } from "../../../Preloader/Preloader"
import { Errors } from "../../../Setup"
import { AVType, GraphType, LoadType, LoadTypes } from "../../../Setup/Enums"
import { FilterChain, FilterChains } from "../FilterChain/FilterChain"
import { FilterChainClass, FilterChainConstructorArgs } from "../FilterChain/FilterChainClass"
import { FilterGraphsInstance } from "../FilterGraphs/FilterGraphs"
import { Contents, Mash } from "../Mash"
import { FilterGraphInstance, FilterGraphOptions } from "./FilterGraph"

export interface FilterGraphArgs extends Required<FilterGraphOptions> {
  backcolor?: string
  contents?: Contents
  label?: string
  filterChain?: FilterChain
  mash: Mash
  filterGraphs: FilterGraphsInstance
}

export class FilterGraphClass implements FilterGraphInstance {
  constructor(public args: FilterGraphArgs) {}

  addGraphFile(graphFile: GraphFile): string {
    const { graphFiles, avType } = this
    const { input, type } = graphFile
    graphFiles.push(graphFile)
    // console.log(this.constructor.name, "addGraphFile", graphFile.file, graphFiles.length)
    if (!input) return ''

    const { inputCount } = this
    const av = type === LoadType.Audio || avType === AVType.Audio ? 'a' : 'v'
    return `${inputCount - 1}:${av}`
  }

  get avType(): AVType { return this.args.avType }

  get backcolor(): string { return this.args.backcolor || this.mash.backcolor }

  get commandInputs(): CommandInputs {
    return this.inputGraphFiles.map(graphFile => this.graphFileCommandInput(graphFile))
  }

  private contentIndex = 0

  private contentLength = 0

  private _contents?: Contents
  get contents() { return this._contents ||= this.contentsInitialize }
  get contentsInitialize(): Contents {
    const { args, mash, time, avType } = this
    const contents = args.contents || mash.contents(time, avType)
    // console.log(this.constructor.name, "contentsInitialize", avType, time, contents.length)
    return contents
  }

  _duration?: number
  get duration(): number { return this.time.lengthSeconds }

  private _evaluator?: Evaluator
  get evaluator() { return this._evaluator ||= this.evaluatorInitialize }
  get evaluatorInitialize(): Evaluator {
    const { args, preloading, avType, size: outputSize, graphType, preloader } = this
    const evaluatorArgs: EvaluatorArgs = {
      preloading, avType, outputSize, graphType, preloader
    }
    return new Evaluator(evaluatorArgs)
  }
  _filterChain?: FilterChain


  private get filterChain() { return this._filterChain ||= this.filterChainInitialize }

  get filterChainInitialize(): FilterChain {
    const { args, duration } = this
    const { filterChain: supplied } = args
    if (supplied) {
      // console.log(this.constructor.name, 'filterChainInitialize', this.mash.label, 'supplied', supplied)
      return supplied
    }
    const { videoRate, backcolor, size, graphType, preloading } = this

    // console.log(this.constructor.name, 'filterChainInitialize', this.mash.label, 'size', size)
    const outputs = ['COLORBACK']
    const colorFilter: GraphFilter = {
      filter: 'color',
      options: { rate: videoRate, color: backcolor, size: `${size.width}x${size.height}` },
      outputs
    }
    if (duration) colorFilter.options.duration = duration
    const filterChainConstructorArgs: FilterChainConstructorArgs = {
      filterGraph: this, graphFilters: [colorFilter]
    }
    const filterChain: FilterChain = new FilterChainClass(filterChainConstructorArgs)
    if (graphType === GraphType.Canvas && !preloading) {
      const visibleContext = ContextFactory.visible({ size, label: `${this.constructor.name} ${backcolor}`})
      if (backcolor) visibleContext.drawFill(backcolor)
      filterChain.visibleContext = visibleContext
    }
    return filterChain
  }

  filterChains: FilterChains = []
  filterChainsInitialize(): FilterChains {
    const { filterChains, backcolor, time, quantize, avType } = this
    const { contents } = this
    const audibleContents = contents.filter(content => content.audible)
    const visibleContents = contents.filter(content => content.transformable)
    const orderedContents = [...visibleContents, ...audibleContents]
    this.contentIndex = 0
    this.contentLength = orderedContents.length

    // console.log(this.constructor.name, 'filterChainsInitialize contents', avType, visibleContents.length, audibleContents.length)

    orderedContents.forEach(content => {
      const { audible, transformable } = content
      const clip = audible || transformable
      if (!clip) throw Errors.internal + 'content clip'

      const clipTimeRange = clip!.timeRange(quantize)
      const range = clipTimeRange.scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      this.evaluator.timeRange = range.withFrame(frame)

      if (avType !== AVType.Video && (audible || clip.audible)) {
        const { filterGraphAudible } = this.filterGraphs
        const audibleChainArgs: FilterChainConstructorArgs = {
          filterGraph: filterGraphAudible
        }
        const filterChainAudible = new FilterChainClass(audibleChainArgs)
        clip.filterChainInitialize(filterChainAudible)

        // TODO: support gain as audio filter
        // clip.filterChain(filterChainAudible)

        // filterGraphAudible.filterChains.push(filterChainAudible)
      }
      if (transformable && avType !== AVType.Audio) {
        const filterChainArgs: FilterChainConstructorArgs = { filterGraph: this }
        const filterChain: FilterChain = new FilterChainClass(filterChainArgs)
        transformable.filterChainInitialize(filterChain)
        // console.log(this.constructor.name, "filterChainsInitialize", transformable.type, transformable.definitionId)
        transformable.filterChainPopulate(filterChain)
        const { transition, from } = content
        if (transition) {
          const transitionFilterChainArgs: TransitionFilterChainArgs = {
            filterChain, transition, from, backcolor
          }
          transition.definition.transitionFilterChain(transitionFilterChainArgs)
        }
        filterChains.push(filterChain)
      }
      this.contentIndex++
    })
    return filterChains
  }

  get filterGraphs(): FilterGraphsInstance { return this.args.filterGraphs }

  private graphFileCommandInput(graphFile: GraphFile): CommandInput {
    const { type, file, options } = graphFile
    switch (type) {
      case LoadType.Audio:
      case LoadType.Video:
      case LoadType.Image:
      // TODO: handle graph file types
      default: {
        const input: CommandInput = { source: file, options }
        return input
      }
    }
  }

  graphFiles: GraphFiles = []

  get graphFilterOutput(): string {
    const { filterChain, filterChains, contentIndex } = this
    const chain = contentIndex ? filterChains[contentIndex - 1] : filterChain

    const { graphFilters, graphFilter } = chain
    const last = graphFilter || graphFilters[graphFilters.length - 1]
    if (!last) {
      console.trace(this.constructor.name, "graphFilterOutput with no last", graphFilters.length, chain)
      throw Errors.internal + 'last'
    }
    const { outputs } = last
    if (!outputs) throw Errors.internal + 'outputs'

    const prevOutput = outputs[outputs.length - 1]
    if (!prevOutput) throw Errors.internal + 'prevOutput'

    return prevOutput
  }

  graphFilterOutputs(graphFilter: GraphFilter): string[] {
    const outputs: string[] = []
    const { filter } = graphFilter
    if (this.contentIndex < this.contentLength - 1) {
      outputs.push(`${filter.toUpperCase()}${this.contentIndex}`)
    }
    return outputs
  }

  get graphFilters(): GraphFilters {
    const chains: FilterChains = []
    const { avType } = this
    if (avType !== AVType.Audio) chains.push(this.filterChain)
    chains.push(...this.filterChains)
    return chains.flatMap(chain => {
      const { graphFilter, graphFilters } = chain
      const filters = [...graphFilters]
      if (graphFilter) filters.push(graphFilter)
      return filters
    })
  }

  get graphType(): GraphType { return this.args.graphType || GraphType.Canvas }


  get inputCount(): number {
    return this.inputGraphFiles.length
  }

  get inputGraphFiles(): GraphFiles { return this.graphFiles.filter(file => file.input) }

  get preloading(): boolean { return !!this.args.preloading }

  get loadableGraphFiles(): GraphFiles {
    const stringLoadTypes = LoadTypes.map(String)
    return this.graphFiles.filter(file => stringLoadTypes.includes(file.type))
  }

  get mash(): Mash { return this.args.mash! }

  get preloader(): Preloader { return this.mash.preloader }

  get quantize(): number { return this.mash.quantize }

  get size(): Size { return this.args.size || this.mash.imageSize }

  get time(): Time { return this.args.time || this.mash.time }

  get videoRate(): number { return this.args.videoRate || this.time.fps }
}
