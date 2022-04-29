import { Any, UnknownObject } from "../../declarations"
import { Default } from "../../Setup/Default"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { AudibleDefinitionClass } from "../Audible/Audible"
import {
  AudibleFileDefinition, AudibleFileDefinitionClass, AudibleFileDefinitionObject
} from "./AudibleFile"

export function AudibleFileDefinitionMixin<T extends AudibleDefinitionClass>(Base: T) : AudibleFileDefinitionClass & T {
  return class extends Base implements AudibleFileDefinition {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { loops, duration } = object as AudibleFileDefinitionObject
      if (duration) this.duration = Number(duration)
      if (loops) {
        this.properties.push(propertyInstance({ name: "loop", defaultValue: Default.instance.audio.loop }))
        this.loops = true
      }
      this.properties.push(propertyInstance({ type: DataType.Frame, name: "trim", defaultValue: Default.instance.audio.trim }))
    }

    duration = 0

    loops = false

    toJSON() : UnknownObject {
      const object = super.toJSON()
      object.duration = this.duration
      if (this.loops) object.loops = true
      return object
    }
  }
}
