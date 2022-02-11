import { Any, UnknownObject } from "../../declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { sortByFrame } from "../../Utility/Sort"
import { ContextFactory, VisibleContext } from "../../Context"
import { TransitionClass } from "./TransitionInstance"
import { Transition, TransitionDefinition, TransitionObject } from "./Transition"
import { DefinitionBase } from "../../Base/Definition"
import { Filter } from "../Filter/Filter"
import { Visible } from "../../Mixin/Visible/Visible"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { Definitions } from "../../Definitions/Definitions"
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
    Definitions.install(this)
  }

  drawVisibleFilters(preloader: Preloader, clips : Visible[], transition : Transition, time : Time, quantize: number, context : VisibleContext, color? : string) : void {
    const { size: outputSize } = context
    const sorted = [...clips].sort(sortByFrame)
    let fromClip : Visible | undefined = sorted[0]
    let toClip : Visible | undefined = sorted[1]

    if (!toClip && fromClip.frame >= transition.frame) {
      toClip = fromClip
      fromClip = undefined
    }

    let fromDrawing = ContextFactory.toSize(outputSize)
    let toDrawing = ContextFactory.toSize(outputSize)
    if (color) {
      fromDrawing.drawFill(color)
      toDrawing.drawFill(color)
    }

    const range = transition.timeRangeRelative(time, quantize)

    const clipRange = transition.timeRange(quantize)
    if (fromClip) fromClip.mergeContextAtTime(preloader, time, quantize, fromDrawing)
    this.filters = this.fromFilters
    fromDrawing = this.drawFilters(preloader, transition, range, clipRange, fromDrawing, outputSize)

    if (toClip) toClip.mergeContextAtTime(preloader, time, quantize, toDrawing)
    this.filters = this.toFilters
    toDrawing = this.drawFilters(preloader, transition, range, clipRange, toDrawing, outputSize)

    fromDrawing = this.fromScaler.definition.drawFilters(preloader, this.fromScaler, range, clipRange, fromDrawing, outputSize)
    this.fromMerger.definition.drawFilters(preloader, this.fromMerger, range, clipRange, fromDrawing, outputSize, context)
    toDrawing = this.toScaler.definition.drawFilters(preloader, this.toScaler, range, clipRange, toDrawing, outputSize)
    this.toMerger.definition.drawFilters(preloader, this.toMerger, range, clipRange, toDrawing, outputSize, context)
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
