import { Any } from "../Setup/declarations"
import { Processor } from "./Processor"

class ModuleProcessor extends Processor {
  process(_url : string, _buffer : ArrayBuffer) : Promise<Any> {
    return Promise.resolve()
  }
}

export { ModuleProcessor }
