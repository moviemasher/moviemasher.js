import { Any, Scalar, UnknownObject } from "../../declarations"
import { Merger } from "../../Media/Merger/Merger"
import { Effect } from "../../Media/Effect/Effect"
import { Scaler } from "../../Media/Scaler/Scaler"
import { VisibleClass } from "../Visible/Visible"
import { Definition } from "../../Base/Definition"
import { TransformableClass, TransformableObject } from "./Transformable"
import { mergerFromId, mergerInstance } from "../../Media/Merger/MergerFactory"
import { effectInstance } from "../../Media/Effect/EffectFactory"
import { scalerFromId, scalerInstance } from "../../Media/Scaler/ScalerFactory"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

export function TransformableMixin<T extends VisibleClass>(Base: T): TransformableClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args
      const { effects, merger, scaler } = object as TransformableObject

      // these Object properties were not set in Instance constructor
      if (merger) this.merger = mergerInstance(merger)
      if (scaler) this.scaler = scalerInstance(scaler)
      if (effects) this.effects.push(...effects.map(effect => effectInstance(effect)))
    }

    // get definitions(): Definition[] {
    //   return [
    //     ...super.definitions,
    //     ...this.merger.definitions,
    //     ...this.scaler.definitions,
    //     ...this.effects.flatMap(effect => effect.definitions)
    //   ]
    // }

    effects: Effect[] = []

    filterChain(filterChain: FilterChain): void {
      this.scaler.definition.populateFilterChain(filterChain, this.scaler)
      const effects = [...this.effects].reverse()
      effects.forEach(effect => (
        effect.definition.populateFilterChain(filterChain, effect)
      ))
      this.merger.definition.populateFilterChain(filterChain, this.merger)
    }

    merger!: Merger

    setValue(value: Scalar, key: string): void {
      switch (key) {
        case 'scaler': {
          this.scaler = scalerFromId(String(value))
          return
        }
        case 'merger': {
          this.merger = mergerFromId(String(value))
          return
        }
      }
      super.setValue(value, key)
    }

    scaler!: Scaler

    transformable = true

    value(key: string): Scalar {
      switch (key) {
        case 'scaler': return this.scaler.definitionId
        case 'merger': return this.merger.definitionId
      }
      return super.value(key)
    }

    toJSON(): UnknownObject {
      const object = super.toJSON()
      object.scaler = this.scaler
      object.merger = this.merger
      object.effects = this.effects
      return object
    }
  }
}
