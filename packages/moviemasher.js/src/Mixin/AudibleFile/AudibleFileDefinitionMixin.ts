import { DataType } from "../../Setup/Enums"
import { Any, UnknownObject } from "../../declarations"
import { AudibleFileDefinition, AudibleFileDefinitionClass, AudibleFileDefinitionObject } from "./AudibleFile"
import { Property } from "../../Setup/Property"
import { AudibleDefinitionClass } from "../Audible/Audible"

function AudibleFileDefinitionMixin<T extends AudibleDefinitionClass>(Base: T) : AudibleFileDefinitionClass & T {
  return class extends Base implements AudibleFileDefinition {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { loops, duration } = <AudibleFileDefinitionObject> object
      // if (!duration) throw Errors.invalid.definition.duration

      if (duration) this.duration = Number(duration)

      if (loops) {
        this.properties.push(new Property({ name: "loop", type: DataType.Number, value: 1 }))
        this.loops = true
      }
      this.properties.push(new Property({ name: "trim", type: DataType.Frame, value: 0 }))
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

export { AudibleFileDefinitionMixin }
