import { DataType } from "../../../Setup/Enums"
import { Any, JsonObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { AudibleFileDefinitionClass, AudibleFileDefinitionObject } from "./AudibleFile"
import { Property } from "../../../Setup/Property"
import { AudibleDefinitionClass } from "../Audible/Audible"

function AudibleFileDefinitionMixin<T extends AudibleDefinitionClass>(Base: T) : AudibleFileDefinitionClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { loops, duration } = <AudibleFileDefinitionObject> object
      if (!duration) throw Errors.invalid.definition.duration

      this.duration = Number(duration)
      if (loops) {
        this.properties.push(new Property({ name: "loop", type: DataType.Integer, value: 1 }))
        this.loops = true
      }
      this.properties.push(new Property({ name: "trim", type: DataType.Integer, value: 0 }))
    }

    duration : number

    loops = false

    toJSON() : JsonObject {
      const object = super.toJSON()
      object.duration = this.duration
      if (this.loops) object.loops = true
      return object
    }
  }
}

export { AudibleFileDefinitionMixin }
