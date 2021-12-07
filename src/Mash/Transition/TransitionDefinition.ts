import { Any, JsonObject } from "../../declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Time } from "../../Utilities/Time"
import { sortByFrame } from "../../Utilities/Sort"
import { ContextFactory, VisibleContext } from "../../Playing"
import { TransitionClass } from "./TransitionInstance"
import { Transition, TransitionObject } from "./Transition"
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

const TransitionDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
const TransitionDefinitionWithClip = ClipDefinitionMixin(TransitionDefinitionWithModular)
const TransitionDefinitionWithVisible = VisibleDefinitionMixin(TransitionDefinitionWithClip)
class TransitionDefinitionClass extends TransitionDefinitionWithVisible {
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

  drawVisibleFilters(clips : Visible[], transition : Transition, time : Time, quantize: number, context : VisibleContext, color? : string) : void {
    // console.log(this.constructor.name, "drawVisibleFilters", clips.length, transition.id)
    const { size } = context
    const sorted = [...clips].sort(sortByFrame)
    let fromClip : Visible | undefined = sorted[0]
    let toClip : Visible | undefined = sorted[1]

    if (!toClip && fromClip.frame >= transition.frame) {
      toClip = fromClip
      fromClip = undefined
    }

    let fromDrawing = ContextFactory.toSize(size)
    let toDrawing = ContextFactory.toSize(size)
    if (color) {
      fromDrawing.drawFill(color)
      toDrawing.drawFill(color)
    }

    const range = transition.timeRangeRelative(time, quantize)

    if (fromClip) fromClip.mergeContextAtTime(time, quantize, fromDrawing)
    this.filters = this.fromFilters
    fromDrawing = this.drawFilters(transition, range, fromDrawing, size)

    if (toClip) toClip.mergeContextAtTime(time, quantize, toDrawing)
    this.filters = this.toFilters
    toDrawing = this.drawFilters(transition, range, toDrawing, size)

    fromDrawing = this.fromScaler.definition.drawFilters(this.fromScaler, range, fromDrawing, size)
    this.fromMerger.definition.drawFilters(this.fromMerger, range, fromDrawing, size, context)
    toDrawing = this.toScaler.definition.drawFilters(this.toScaler, range, toDrawing, size)
    this.toMerger.definition.drawFilters(this.toMerger, range, toDrawing, size, context)
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

  toJSON() : JsonObject {
    return {
      ...super.toJSON(),
      to: { filters: this.toFilters },
      from: { filters: this.fromFilters },
    }
  }

  type = DefinitionType.Transition
}

export { TransitionDefinitionClass }
