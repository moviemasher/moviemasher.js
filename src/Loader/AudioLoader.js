
import { ProcessorFactory } from "../Factory/ProcessorFactory";
import { LoadType } from "../Types";
import { Loader } from "./Loader";

class AudioLoader extends Loader {
  constructor(object) {
    super(object)
    this.object.type ||= LoadType.audio
  }

  get audioContext() { return this.object.audioContext }
  set audioContext(value) { this.object.audioContext = value }

  async requestUrl(url) {
    return fetch(url).then(response => {
      console.log("AudioLoader.requestUrl fetch", url, response.constructor.name)
      return response.arrayBuffer()
    }).then(loaded => {
      console.log("AudioLoader.requestUrl arrayBuffer", url, loaded.constructor.name)
      const options = { type: this.type, audioContext: this.audioContext }
      const processor = ProcessorFactory.createFromObject(options)
      return processor.process(url, loaded)
    })
  }
}

export { AudioLoader }