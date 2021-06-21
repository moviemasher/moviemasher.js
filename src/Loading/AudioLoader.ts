import { ProcessorFactory } from "./ProcessorFactory"
import { AudibleContext, ContextFactory } from "../Playing"
import { Loader } from "./Loader"

import { Any, LoadPromise, UnknownObject } from "../Setup/declarations"
import { LoadType} from "../Setup/Enums"

class AudioLoader extends Loader {
  constructor(object? : UnknownObject | undefined) {
    super()
    if (object && object.audibleContext) {
      this._audibleContext = <AudibleContext> object.audibleContext
    }
    else this._audibleContext = ContextFactory.audible()
  }

  type = LoadType.Audio

  get audibleContext() : AudibleContext { return this._audibleContext }

  set audibleContext(value : AudibleContext) { this._audibleContext = value }

  async requestUrl(url : string) : Promise<AudioBuffer> {
    return fetch(url).then(response => {
      return response.arrayBuffer()
    }).then(loaded => {
      const options = { audibleContext: this.audibleContext }
      const processor = ProcessorFactory.audio(options)
      return processor.process(url, loaded)
    })
  }

  _audibleContext : AudibleContext
}

export { AudioLoader }
