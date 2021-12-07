import { Any, JsonObject } from "../../declarations"
import { StreamableDefinitionClass, StreamableDefinitionObject } from "./Streamable"
import { AudibleDefinitionClass } from "../Audible/Audible"
// import { DataType } from "../../../Setup/Enums"
// import { Property } from "../../../Setup/Property"

function StreamableDefinitionMixin<T extends AudibleDefinitionClass>(Base: T) : StreamableDefinitionClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { format } = <StreamableDefinitionObject> object
      if (format) this.format = format

    //  this.properties.push(new Property({ name: "something", type: DataType.String, value: '' }))
    }

    format = 'hls'

    streamable = true

    toJSON() : JsonObject {
      const object = super.toJSON()
      object.format = true
      return object
    }
  }
}

export { StreamableDefinitionMixin }
