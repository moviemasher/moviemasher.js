import { AudibleContext, ContextFactory } from "../Playing"
import { Any, LoadPromise, UnknownObject } from "../Setup/declarations"
import { Processor } from "./Processor"

class AudioProcessor extends Processor {
  constructor(object? : UnknownObject | undefined) {
    super()
    if (object && object.audibleContext) {
      this._audibleContext = <AudibleContext> object.audibleContext
    }
    else this._audibleContext = ContextFactory.audible()
  }

  get audibleContext() : AudibleContext { return this._audibleContext }

  set audibleContext(value : AudibleContext) { this._audibleContext = value }

  process(_url : string, buffer : ArrayBuffer) : Promise<AudioBuffer> {
    return this.audibleContext.decode(buffer)
  }

  _audibleContext : AudibleContext
}

export { AudioProcessor }
