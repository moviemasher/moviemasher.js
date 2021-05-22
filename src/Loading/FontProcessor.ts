import { Cache } from "./Cache"
import { Processor } from "./Processor"

class FontProcessor extends Processor {
  process(url, buffer) {
    const family = Cache.key(url)
    const face = new FontFace(family, buffer)
    const promise = face.load()
    promise.then(() => {
      document.fonts.add(face)
      return { family }
    })
    return promise
  }
}

export { FontProcessor }
