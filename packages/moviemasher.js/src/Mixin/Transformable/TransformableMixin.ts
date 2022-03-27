import { Any } from "../../declarations"
import { Merger } from "../../Media/Merger/Merger"
import { Effect } from "../../Media/Effect/Effect"
import { Scaler } from "../../Media/Scaler/Scaler"
import { VisibleClass } from "../Visible/Visible"
import { Definition } from "../../Base/Definition"
import { TransformableClass, TransformableObject } from "./Transformable"
import { mergerInstance } from "../../Media/Merger/MergerFactory"
import { effectInstance } from "../../Media/Effect"
import { scalerInstance } from "../../Media/Scaler"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

function TransformableMixin<T extends VisibleClass>(Base: T): TransformableClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args
      const { merger, effects, scaler } = object as TransformableObject
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

    filterChain(filterChain: FilterChain): void {
      this.scaler.definition.populateFilterChain(filterChain, this.scaler)
      this.effects.reverse().forEach(effect => (
        effect.definition.populateFilterChain(filterChain, effect)
      ))
      this.merger.definition.populateFilterChain(filterChain, this.merger)
    }

    merger: Merger

    scaler: Scaler
  }
}

export { TransformableMixin }
