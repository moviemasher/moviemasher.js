import { LoadFontPromise } from "../Setup/declarations"
import { Cache } from "./Cache"
import { Processor } from "./Processor"

class FontProcessor extends Processor {
  process(url : string, buffer : ArrayBuffer) : LoadFontPromise {
    const family = Cache.key(url)
    const face = new FontFace(family, buffer)
    const promise = face.load().then(() => {
      document.fonts.add(face)
      return { family }
    })
    return promise
  }
}

export { FontProcessor }
