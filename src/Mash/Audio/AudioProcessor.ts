// import { AudibleContext, ContextFactory } from "../../Playing"
// import { Any, LoadPromise, UnknownObject } from "../../declarations"
import { Processor } from "../../Loading/Processor"
import { Cache } from "../../Loading/Cache"

class AudioProcessor extends Processor {
  // constructor(object? : UnknownObject | undefined) {
  //   super()
  //   if (object && object.audibleContext) {
  //     this._audibleContext = <AudibleContext> object.audibleContext
  //   }
  //   else {
  //     console.log(this.constructor.name, "constructor initializing audibleContext")
  //     this._audibleContext = ContextFactory.audible()
  //   }
  // }

  // get audibleContext() : AudibleContext { return this._audibleContext }

  // set audibleContext(value : AudibleContext) { this._audibleContext = value }

  process(_url : string, buffer : ArrayBuffer) : Promise<AudioBuffer> {
    return Cache.audibleContext.decode(buffer)
  }

  // _audibleContext : AudibleContext
}

export { AudioProcessor }
