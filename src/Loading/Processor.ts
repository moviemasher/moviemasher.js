import { Any } from "../declarations"

class Processor {
  process(_url : string, _buffer : ArrayBuffer) : Promise<Any> {
    return Promise.resolve()
  }
}

export { Processor }
