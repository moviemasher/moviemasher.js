import {
  Any, JsonObject, LoadPromise, SelectionObject, Size, ValueObject
} from "../../../declarations"
import { Merger } from "../../Merger/Merger"
import { Effect } from "../../Effect/Effect"
import { Scaler } from "../../Scaler/Scaler"
import { VisibleClass } from "../Visible/Visible"
import { VisibleContext } from "../../../Playing/VisibleContext"
import { Definition } from "../../Definition/Definition"
import { TransformableClass, TransformableObject } from "./Transformable"
import { mergerInstance } from "../../Merger/MergerFactory"
import { Time } from "../../../Utilities/Time"
import { Is } from "../../../Utilities/Is"
import { effectInstance } from "../../Effect"
import { scalerInstance } from "../../Scaler"

function TransformableMixin<T extends VisibleClass>(Base: T): TransformableClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args

      const { merger, effects, scaler } = <TransformableObject>object

      this.merger = mergerInstance(merger || {})
      this.scaler = scalerInstance(scaler || {})

      if (effects) {
        const effectInstances = effects.map(effect => effectInstance(effect))
        this.effects.push(...effectInstances)
      }
    }

    get definitions(): Definition[] {
      return [
        ...super.definitions,
        ...this.merger.definitions,
        ...this.scaler.definitions,
        ...this.effects.flatMap(effect => effect.definitions)
      ]
    }

    effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined {
      const scaledContext = this.scaledContextAtTimeToSize(mashTime, quantize, dimensions)
      if (!scaledContext) return

      let context = scaledContext
      if (!this.effects) return context

      const clipTimeRange = this.timeRangeRelative(mashTime, quantize)
      if (!clipTimeRange) return

      this.effects.reverse().every(effect => (
        context = effect.definition.drawFilters(effect, clipTimeRange, context, dimensions)
      ))
      return context
    }

    effects: Effect[] = []

    loadClip(quantize: number, start: Time, end?: Time): LoadPromise | void {
      const loads = [
        super.loadClip(quantize, start, end),
        this.loadTransformable(quantize, start, end)
      ]
      const promises = loads.filter(Boolean)
      switch (promises.length) {
        case 0: return
        case 1: return promises[0]
        default: return Promise.all(promises).then()
      }
    }

    loadTransformable(quantize: number, start: Time, end?: Time): LoadPromise | void {
      const loads = [
        this.merger.loadModular(quantize, start, end),
        this.scaler.loadModular(quantize, start, end),
        ...this.effects.map(effect => effect.loadModular(quantize, start, end))
      ]
      const promises = loads.filter(Boolean)
      switch (promises.length) {
        case 0: return
        case 1: return promises[0]
        default: return Promise.all(promises).then()
      }
    }

    mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void {
      const effected = this.effectedContextAtTimeToSize(mashTime, quantize, context.size)
      if (!effected) return

      const range = this.timeRangeRelative(mashTime, quantize)
      this.merger.definition.drawFilters(this.merger, range, effected, context.size, context)
    }

    merger: Merger

    get propertyValues(): SelectionObject {
      const merger = <ValueObject>this.merger.propertyValues
      const scaler = <ValueObject>this.scaler.propertyValues
      const combined = { merger, scaler, ...super.propertyValues }
      // console.log(this.constructor.name, "get propertyValues", combined)
      return combined
    }

    scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined {
      const context = this.contextAtTimeToSize(mashTime, quantize, dimensions)
      if (!context) return

      const clipTimeRange = this.timeRangeRelative(mashTime, quantize)
      if (Is.undefined(clipTimeRange)) return context
      // console.log(this.constructor.name, "scaledContextAtTimeToSize", clipTimeRange)
      return this.scaler.definition.drawFilters(this.scaler, clipTimeRange, context, dimensions)
    }

    scaler: Scaler

    toJSON(): JsonObject {
      const object = super.toJSON() // gets merger and scaler from propertyValues
      if (this.effects.length) object.effects = this.effects
      return object
    }
  }
}

export { TransformableMixin }
