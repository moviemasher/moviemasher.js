import { LoadFontPromise } from "../../declarations"
import { Cache } from "../../Loading/Cache"
import { Processor } from "../../Loading/Processor"

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
