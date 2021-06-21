import { Any, JsonObject } from "../../Setup/declarations"
import { DefinitionType } from "../../Setup/Enums"
import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { byFrame } from "../../Utilities/Sort"
import { ContextFactory, VisibleContext } from "../../Playing"
import { TransitionClass } from "./TransitionInstance"
import { Transition, TransitionObject } from "./Transition"
import { DefinitionClass } from "../Definition/Definition"
import { Filter } from "../Filter/Filter"
import { Visible } from "../Mixin/Visible/Visible"
import { Modular } from "../Mixin/Modular/Modular"
import { ModularDefinitionMixin } from "../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../Mixin/Visible/VisibleDefinitionMixin"
import { Definitions } from "../Definitions/Definitions"
import { TransitionDefinitionObject } from "./Transition"
import { filterInstance } from "../Filter"

const TransitionDefinitionWithModular = ModularDefinitionMixin(DefinitionClass)
const TransitionDefinitionWithClip = ClipDefinitionMixin(TransitionDefinitionWithModular)
const TransitionDefinitionWithVisible = VisibleDefinitionMixin(TransitionDefinitionWithClip)
class TransitionDefinitionClass extends TransitionDefinitionWithVisible {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args

    const { to, from } = <TransitionDefinitionObject> object

    if (to) {
      const { filters } = to
      if (filters) {
        this.toFilters.push(...filters.map(filter => filterInstance(filter)))
      }
    }

    if (from) {
      const { filters } = from
      if (filters) {
        this.fromFilters.push(...filters.map(filter => filterInstance(filter)))
      }
    }

    Definitions.install(this)
  }

  drawVisibleFilters(clips : Visible[], modular : Modular, time : Time, quantize: number, context : VisibleContext, color? : string) : void {
    const { size } = context
    const sorted = [...clips].sort(byFrame)
    const [fromClip, toClip] = sorted

    const range = TimeRange.fromTime(time)

    const fromRange = fromClip.timeRange(time.fps)

    if (color) context.drawFill(color)

    if (fromRange.intersects(range)) {
      fromClip.mergeContextAtTime(time, quantize, context)
      this.filters = this.fromFilters
      this.drawFilters(modular, range, context, size)
    }
    if (!toClip) return

    const toRange = toClip.timeRangeRelative(time, quantize)
    if (!toRange.intersects(range)) return

    const drawing = ContextFactory.toSize(size)
    if (color) drawing.drawFill(color)
    toClip.mergeContextAtTime(time, quantize, drawing)

    this.filters = this.toFilters

    this.drawFilters(modular, range, drawing, size)

    context.draw(drawing.imageSource)

  }

  private fromFilters : Filter[] = []

  get instance() : Transition { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : TransitionObject) : Transition {
    return new TransitionClass({ ...this.instanceObject, ...object })
  }

  private toFilters : Filter[] = []

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
