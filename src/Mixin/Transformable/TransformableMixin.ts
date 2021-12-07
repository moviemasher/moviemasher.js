import { Any, InputCommand, JsonObject, LoadPromise, Size } from "../../declarations"
import { Merger } from "../../Mash/Merger/Merger"
import { Effect } from "../../Mash/Effect/Effect"
import { Scaler } from "../../Mash/Scaler/Scaler"
import { VisibleClass } from "../Visible/Visible"
import { VisibleContext } from "../../Playing/VisibleContext"
import { Definition } from "../../Base/Definition"
import { TransformableClass, TransformableObject } from "./Transformable"
import { mergerInstance } from "../../Mash/Merger/MergerFactory"
import { Time } from "../../Utilities/Time"
import { Is } from "../../Utilities/Is"
import { effectInstance } from "../../Mash/Effect"
import { scalerInstance } from "../../Mash/Scaler"

function TransformableMixin<T extends VisibleClass>(Base: T): TransformableClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args
      // console.log("TransformableMixin", object)
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

    effectedCommandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined {
      const scaledCommand = this.scaledCommandAtTimeToSize(mashTime, quantize, dimensions)
      if (!scaledCommand) {
        // console.log(this.constructor.name, "effectedCommandAtTimeToSize scaledCommandAtTimeToSize falsey")
        return
      }

      if (!this.effects) return scaledCommand

      const clipTimeRange = this.timeRangeRelative(mashTime, quantize)
      if (!clipTimeRange) {
        // console.log(this.constructor.name, "effectedCommandAtTimeToSize timeRangeRelative falsey")
        return
      }

      this.effects.reverse().every(effect => (
        scaledCommand.filters.push(...effect.definition.inputFilters(effect, clipTimeRange, dimensions))
      ))
      return scaledCommand
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


    inputCommandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined {
      const effected = this.effectedCommandAtTimeToSize(mashTime, quantize, dimensions)
      if (!effected) {
        // console.log(this.constructor.name, "inputCommandAtTimeToSize effectedCommandAtTimeToSize falsey")
        return
      }
      const range = this.timeRangeRelative(mashTime, quantize)
      effected.merger = this.merger.definition.inputFilters(this.merger, range, dimensions)[0]

      // console.log(this.constructor.name, "inputCommandAtTimeToSize", effected)
      return effected
    }

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

    scaledCommandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined {
      const command = this.commandAtTimeToSize(mashTime, quantize, dimensions)
      if (!command) {
        // console.log(this.constructor.name, "scaledCommandAtTimeToSize super falsey")
        return
      }

      // console.log(this.constructor.name, "scaledCommandAtTimeToSize command", command)
      const clipTimeRange = this.timeRangeRelative(mashTime, quantize)
      if (Is.undefined(clipTimeRange)) {
        // console.log(this.constructor.name, "scaledCommandAtTimeToSize timeRangeRelative falsey")
        return command
      }
      command.filters.push(...this.scaler.definition.inputFilters(this.scaler, clipTimeRange, dimensions))

      // console.log(this.constructor.name, "scaledCommandAtTimeToSize", command)

      return command
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
      const object = super.toJSON()
      // console.log(this.constructor.name, "toJSON", object)
      object.merger = this.merger
      object.scaler = this.scaler
      object.effects = this.effects
      return object
    }
  }
}

export { TransformableMixin }
