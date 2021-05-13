import { Cache } from "../Cache"

class FontProcessor {
  process(url, buffer) {
    const family = Cache.key(url)
    const font_face = new FontFace(family, buffer)
    const promise = font_face.load()
    promise.then(() => {
      document.fonts.add(font_face)
      return { family }
    })
    return promise
  }
}

export { FontProcessor }