import { ProcessorFactory } from "../../Loading/ProcessorFactory"
// import { AudibleContext } from "../../Playing" // , ContextFactory
import { Loader } from "../../Loading/Loader"

// import { UnknownObject } from "../../declarations"
import { LoadType} from "../../Setup/Enums"

class AudioLoader extends Loader {
  // constructor(object? : UnknownObject | undefined) {
  //   super()
  //   if (object && object.audibleContext) {
  //     this._audibleContext = <AudibleContext> object.audibleContext
  //   }
  //   else this._audibleContext = ContextFactory.audible()
  // }

  type = LoadType.Audio

  // get audibleContext() : AudibleContext { return this._audibleContext }

  // set audibleContext(value : AudibleContext) { this._audibleContext = value }

  async requestUrl(url: string): Promise<AudioBuffer> {
    // console.log(this.constructor.name, "requestUrl", url)
    const promise = new Promise<AudioBuffer>((resolve, reject) => {
      fetch(url).then(response => {
        // console.log(this.constructor.name, "requestUrl.fetch", url)
        return response.arrayBuffer()
      }).then(loaded => {
        // console.log(this.constructor.name, "requestUrl.fetch.arrayBuffer", url)
        const processor = ProcessorFactory.audio() //  options)
        resolve(processor.process(url, loaded))
      }).catch(error => reject(error))
    })

    return promise
  }

  // _audibleContext : AudibleContext
}

export { AudioLoader }
