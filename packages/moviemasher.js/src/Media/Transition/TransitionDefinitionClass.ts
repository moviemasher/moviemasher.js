import { Any, FilterChain, FilterChainArgs, GraphFiles, GraphFilters, UnknownObject } from "../../declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { ContextFactory, VisibleContext } from "../../Context"
import { TransitionClass } from "./TransitionClass"
import { Transition, TransitionDefinition, TransitionObject } from "./Transition"
import { DefinitionBase } from "../../Base/Definition"
import { Filter } from "../Filter/Filter"
import { Visible } from "../../Mixin/Visible/Visible"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { TransitionDefinitionObject } from "./Transition"
import { filterInstance } from "../Filter"
import { mergerInstance } from "../Merger/MergerFactory"
import { scalerInstance } from "../Scaler/ScalerFactory"
import { Property } from "../../Setup/Property"
import { Preloader } from "../../Preloader/Preloader"

const TransitionDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
const TransitionDefinitionWithClip = ClipDefinitionMixin(TransitionDefinitionWithModular)
const TransitionDefinitionWithVisible = VisibleDefinitionMixin(TransitionDefinitionWithClip)
class TransitionDefinitionClass extends TransitionDefinitionWithVisible implements TransitionDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args

    const { to, from } = <TransitionDefinitionObject> object

    if (to) {
      const { filters, merger, scaler } = to
      if (filters) {
        this.toFilters.push(...filters.map(filter => filterInstance(filter)))
      }
      if (merger) this.toMerger = mergerInstance(merger)
      if (scaler) this.toScaler = scalerInstance(scaler)
    }

    if (from) {
      const { filters, merger, scaler } = from
      if (filters) {
        this.fromFilters.push(...filters.map(filter => filterInstance(filter)))
      }
      if (merger) this.fromMerger = mergerInstance(merger)
      if (scaler) this.fromScaler = scalerInstance(scaler)
    }
    this.properties.push(
      new Property({ name: "fromTrack", type: DataType.Number, value: 0 }),
      new Property({ name: "toTrack", type: DataType.Number, value: 1 }),
    )
  }

  mergeFilterChain(transition: Transition, args: FilterChainArgs, from?: Visible, to?: Visible, backcolor?: string): FilterChain {
    const graphFiles: GraphFiles = []
    const graphFilters: GraphFilters = []
    const filterChain: FilterChain = { graphFiles, graphFilters }

    // TODO: add color to match mergeClips
    if (from) {
      const fromFilterChain = from.filterChain(args)
      graphFiles.push(...fromFilterChain.graphFiles)
      graphFilters.push(...fromFilterChain.graphFilters)
      if (fromFilterChain.graphFilter) graphFilters.push(fromFilterChain.graphFilter)
      this.filters = this.fromFilters
      this.filtrateFilterChain(filterChain, transition, args)
      this.fromScaler.definition.filtrateFilterChain(filterChain, this.fromScaler, args)
      this.fromMerger.definition.filtrateFilterChain(filterChain, this.fromMerger, args)

    }
    if (to) {
      const toFilterChain = to.filterChain(args)
      graphFiles.push(...toFilterChain.graphFiles)
      graphFilters.push(...toFilterChain.graphFilters)
      if (toFilterChain.graphFilter) graphFilters.push(toFilterChain.graphFilter)
      this.filters = this.toFilters
      this.filtrateFilterChain(filterChain, transition, args)
      this.toScaler.definition.filtrateFilterChain(filterChain, this.toScaler, args)
      this.toMerger.definition.filtrateFilterChain(filterChain, this.toMerger, args)
    }

    return filterChain
  }

  mergeClips(transition: Transition, preloader: Preloader, time: Time, quantize: number, context: VisibleContext, fromClip?: Visible, toClip?: Visible, color? : string) : void {
    const { size: outputSize } = context
    // const sorted = [...clips].sort(sortByFrame)
    // let fromClip : Visible | undefined = sorted[0]
    // let toClip : Visible | undefined = sorted[1]

    // if (!toClip && fromClip && (fromClip.frame >= transition.frame)) {
    //   toClip = fromClip
    //   fromClip = undefined
    // }

    let fromDrawing = ContextFactory.toSize(outputSize)
    let toDrawing = ContextFactory.toSize(outputSize)
    if (color) {
      fromDrawing.drawFill(color)
      toDrawing.drawFill(color)
    }

    const range = transition.timeRangeRelative(time, quantize)

    if (fromClip) fromClip.mergeContextAtTime(preloader, time, quantize, fromDrawing)
    this.filters = this.fromFilters
    fromDrawing = this.drawFilters(preloader, transition, range, fromDrawing, outputSize)

    if (toClip) toClip.mergeContextAtTime(preloader, time, quantize, toDrawing)
    this.filters = this.toFilters
    toDrawing = this.drawFilters(preloader, transition, range, toDrawing, outputSize)

    fromDrawing = this.fromScaler.definition.drawFilters(preloader, this.fromScaler, range, fromDrawing, outputSize)
    this.fromMerger.definition.drawFilters(preloader, this.fromMerger, range, fromDrawing, outputSize, context)
    toDrawing = this.toScaler.definition.drawFilters(preloader, this.toScaler, range, toDrawing, outputSize)
    this.toMerger.definition.drawFilters(preloader, this.toMerger, range, toDrawing, outputSize, context)
  }

  private fromFilters : Filter[] = []

  private fromMerger = mergerInstance({})

  private fromScaler = scalerInstance({})

  get instance() : Transition { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : TransitionObject) : Transition {
    return new TransitionClass({ ...this.instanceObject, ...object })
  }

  private toFilters : Filter[] = []

  private toMerger = mergerInstance({})

  private toScaler = scalerInstance({})

  toJSON() : UnknownObject {
    return {
      ...super.toJSON(),
      to: { filters: this.toFilters },
      from: { filters: this.fromFilters },
    }
  }

  type = DefinitionType.Transition
}

export { TransitionDefinitionClass }
