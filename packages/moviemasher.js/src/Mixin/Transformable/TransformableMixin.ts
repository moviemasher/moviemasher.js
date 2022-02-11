import { Any, FilterChain, UnknownObject, LoadPromise, FilterChainArgs, GraphFile, FilesArgs } from "../../declarations"
import { Merger } from "../../Media/Merger/Merger"
import { Effect } from "../../Media/Effect/Effect"
import { Scaler } from "../../Media/Scaler/Scaler"
import { VisibleClass } from "../Visible/Visible"
import { VisibleContext } from "../../Context/VisibleContext"
import { Definition } from "../../Base/Definition"
import { TransformableClass, TransformableObject } from "./Transformable"
import { mergerInstance } from "../../Media/Merger/MergerFactory"
import { Time } from "../../Helpers/Time"
import { effectInstance } from "../../Media/Effect"
import { scalerInstance } from "../../Media/Scaler"
import { Preloader } from "../../Preloader/Preloader"

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

    effects: Effect[] = []

    files(args: FilesArgs): GraphFile[] {
      const files = super.files(args)
      files.push(...this.merger.filesModular(args))
      files.push(...this.scaler.filesModular(args))
      files.push(...this.effects.flatMap(effect => effect.filesModular(args)))
      return files
    }

    filterChain(args: FilterChainArgs): FilterChain | undefined {
      const layer = this.filterChainBase(args)
      if (!layer) return
      // console.log(this.constructor.name, "layer", layer)

      this.scaler.modulateFilterChain(layer, args)
      args.prevFilter = layer.filters[layer.filters.length - 1]
      this.effects.reverse().forEach(effect => (effect.modulateFilterChain(layer, args)))
      this.merger.modulateFilterChain(layer, args)
      return layer
    }


    // loadClip(quantize: number, start: Time, end?: Time): LoadPromise | void {
    //   const loads = [
    //     super.loadClip(quantize, start, end),
    //     this.loadTransformable(quantize, start, end)
    //   ]
    //   const promises = loads.filter(Boolean)
    //   switch (promises.length) {
    //     case 0: return
    //     case 1: return promises[0]
    //     default: return Promise.all(promises).then()
    //   }
    // }

    // private loadTransformable(quantize: number, start: Time, end?: Time): LoadPromise | void {
    //   const loads = [
    //     this.merger.loadModular(quantize, start, end),
    //     this.scaler.loadModular(quantize, start, end),
    //     ...this.effects.map(effect => effect.loadModular(quantize, start, end))
    //   ]
    //   const promises = loads.filter(Boolean)
    //   switch (promises.length) {
    //     case 0: return
    //     case 1: return promises[0]
    //     default: return Promise.all(promises).then()
    //   }
    // }

    mergeContextAtTime(preloader: Preloader, mashTime: Time, quantize: number, context: VisibleContext): void {
      const { size: outputSize} = context
      const contextBase = this.contextAtTimeToSize(preloader, mashTime, quantize, outputSize)
      if (!contextBase) return

      const range = this.timeRangeRelative(mashTime, quantize)
      const clipRange = this.timeRange(quantize)
      const scaledContext = this.scaler.definition.drawFilters(preloader, this.scaler, range, clipRange, contextBase, outputSize)

      if (!this.effects) return

      let effected = scaledContext
      this.effects.reverse().every(effect => (
        effected = effect.definition.drawFilters(preloader, effect, range, clipRange, effected, outputSize)
      ))
      this.merger.definition.drawFilters(preloader, this.merger, range, clipRange, effected, outputSize, context)
    }

    merger: Merger

    scaler: Scaler

    toJSON(): UnknownObject {
      const object = super.toJSON()
      return object
    }
  }
}

export { TransformableMixin }
