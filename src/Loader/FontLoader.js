import { LoadType } from "../Types"
import { ProcessorFactory } from "../Factory/ProcessorFactory"
import { Loader } from "./Loader"

class FontLoader extends Loader {
  constructor(object) {
    super(object)
    this.object.type ||= LoadType.font
  }

  async requestUrl(url) {
    // console.log("FontLoader.requestUrl", url)
    
    return fetch(url).then(response => {
      // console.log("FontLoader.requestUrl fetch", url, response.constructor.name)
      return response.arrayBuffer()
    }).then(loaded => {
      // console.log("FontLoader.requestUrl arrayBuffer", url, loaded.constructor.name)
      const processor = ProcessorFactory.create(this.type)
      return processor.process(url, loaded)
    })
  }
}

export { FontLoader }