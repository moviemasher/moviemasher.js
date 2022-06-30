import { UnknownObject } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { ClipClass } from "../Clip/Clip"
import { Visible, VisibleClass, VisibleDefinition, VisibleObject } from "./Visible"
import { Effects } from "../../Media/Effect/Effect"
import { effectInstance } from "../../Media/Effect/EffectFactory"


export function VisibleMixin<T extends ClipClass>(Base: T) : VisibleClass & T {
  return class extends Base implements Visible {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { effects } = object as VisibleObject

      if (effects) this.effects.push(...effects.map(effect => effectInstance(effect)))

    }

    declare definition: VisibleDefinition

    definitionIds(): string[] {
      const ids = [...super.definitionIds()]
      ids.push(...this.effects.flatMap(effect => effect.definitionIds()))
      return ids
    }

    effects: Effects = []

    trackType = TrackType.Video

    toJSON(): UnknownObject {
      const json = super.toJSON()
      json.effects = this.effects
      return json
    }
    visible = true
  }
}
