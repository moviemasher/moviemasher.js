import { Any } from "../Setup/declarations"

class Processor {
  process(_url : string, _buffer : ArrayBuffer) : Promise<Any> {
    return Promise.resolve()
  }
}

export { Processor }
