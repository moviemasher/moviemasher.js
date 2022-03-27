import { Any, UnknownObject } from "../../declarations"
import { StreamableDefinitionClass, StreamableDefinitionObject } from "./Streamable"
import { AudibleDefinitionClass } from "../Audible/Audible"

function StreamableDefinitionMixin<T extends AudibleDefinitionClass>(Base: T) : StreamableDefinitionClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { format } = <StreamableDefinitionObject> object
      if (format) this.format = format
    }

    format = 'hls'

    streamable = true

    toJSON() : UnknownObject {
      const object = super.toJSON()
      object.format = true
      return object
    }
  }
}

export { StreamableDefinitionMixin }
