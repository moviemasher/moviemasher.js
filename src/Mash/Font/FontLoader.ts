import { LoadFontPromise } from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Loader } from "../../Loading/Loader"
import { Cache } from "../../Loading/Cache"

class FontLoader extends Loader {
  type = LoadType.Font

  requestUrl(url: string): LoadFontPromise {
    const promise : LoadFontPromise = new Promise((resolve, reject) => {
      const family = Cache.key(url)
      this.arrayBufferPromiseFromUrl(url)
        .then(buffer => {
          const face = new FontFace(family, buffer)
          return face.load()
        }).then(face => {
          document.fonts.add(face)
          resolve(face)
        }).catch(reason => reject(reason))
    })
    return promise
  }
}

export { FontLoader }
