import { Any, JsonObject } from "../../../declarations"
import { AudibleClass } from "../Audible/Audible"
import { StreamableClass, StreamableDefinition, StreamableObject } from "./Streamable"


function StreamableMixin<T extends AudibleClass>(Base: T): StreamableClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args
      const { something } = <StreamableObject>object

      if (something) this.something = something
    }

    declare definition : StreamableDefinition


    something?: string

    maxFrames(_quantize : number, _trim? : number) : number { return 0 }


    toJSON() : JsonObject {
      const object = super.toJSON()
      if (this.something) object.something = this.something
      return object
    }
  }
}
export { StreamableMixin }
