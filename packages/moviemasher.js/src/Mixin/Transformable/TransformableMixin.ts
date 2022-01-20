import { Any, Layer, UnknownObject, LoadPromise, Size, LayerArgs } from "../../declarations"
import { Merger } from "../../Media/Merger/Merger"
import { Effect } from "../../Media/Effect/Effect"
import { Scaler } from "../../Media/Scaler/Scaler"
import { VisibleClass } from "../Visible/Visible"
import { VisibleContext } from "../../Context/VisibleContext"
import { Definition } from "../../Base/Definition"
import { TransformableClass, TransformableObject } from "./Transformable"
import { mergerInstance } from "../../Media/Merger/MergerFactory"
import { Time } from "../../Helpers/Time"
import { Is } from "../../Utilities/Is"
import { effectInstance } from "../../Media/Effect"
import { scalerInstance } from "../../Media/Scaler"

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

    private contextEffected(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined {
      const scaledContext = this.contextScaled(mashTime, quantize, dimensions)
      if (!scaledContext) return

      let context = scaledContext
      if (!this.effects) return context

      const range = this.timeRangeRelative(mashTime, quantize)
      if (!range) return

      this.effects.reverse().every(effect => (
        context = effect.definition.drawFilters(effect, range, context, dimensions)
      ))
      return context
    }

    private contextScaled(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined {
      // console.log(this.constructor.name, "contextScaled", dimensions)
      const context = this.contextAtTimeToSize(mashTime, quantize, dimensions)
      if (!context) return

      const range = this.timeRangeRelative(mashTime, quantize)
      if (Is.undefined(range)) return context
      return this.scaler.definition.drawFilters(this.scaler, range, context, dimensions)
    }

    get definitions(): Definition[] {
      return [
        ...super.definitions,
        ...this.merger.definitions,
        ...this.scaler.definitions,
        ...this.effects.flatMap(effect => effect.definitions)
      ]
    }

    effects: Effect[] = []

    layer(args: LayerArgs): Layer | undefined {
      const { timeRange, quantize } = args
      const { startTime } = timeRange

      const effectedLayer = this.layerEffected(args)
      if (!effectedLayer) return

      const range = this.timeRangeRelative(startTime, quantize)
      this.merger.modulateLayer(effectedLayer, { ...args, timeRange: range })
      return effectedLayer
    }

    private layerEffected(args: LayerArgs): Layer | undefined {
      const { timeRange, quantize } = args
      const { startTime } = timeRange

      const scaledLayer = this.layerScaled(args)
      if (!scaledLayer) return

      if (!this.effects.length) return scaledLayer

      const range = this.timeRangeRelative(startTime, quantize)
      if (!range) return

      this.effects.reverse().every(effect => (
        effect.modulateLayer(scaledLayer, { ...args, timeRange: range })
      ))
      return scaledLayer
    }

    private layerScaled(args: LayerArgs): Layer | undefined {
      const layer = this.layerBase(args)
      if (!layer) return

      const { timeRange, quantize } = args
      const { startTime } = timeRange

      const range = this.timeRangeRelative(startTime, quantize)
      if (Is.undefined(range)) {
        // console.log(this.constructor.name, "layerScaled timeRangeRelative falsey")
        return layer
      }
      this.scaler.modulateLayer(layer, { ...args, timeRange: range })

      // console.log(this.constructor.name, "layerScaled", command)

      return layer
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

    private loadTransformable(quantize: number, start: Time, end?: Time): LoadPromise | void {
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
      const effected = this.contextEffected(mashTime, quantize, context.size)
      if (!effected) return

      const range = this.timeRangeRelative(mashTime, quantize)
      this.merger.definition.drawFilters(this.merger, range, effected, context.size, context)
    }

    merger: Merger

    scaler: Scaler

    toJSON(): UnknownObject {
      const object = super.toJSON()
      // object.merger = this.merger
      // object.scaler = this.scaler
      // object.effects = this.effects
      return object
    }
  }
}

export { TransformableMixin }
