import { LoadFontPromise } from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Loader } from "../../Loader/Loader"
import type { } from "css-font-loading-module"

class FontLoader extends Loader {
  type = LoadType.Font

  protected override requestUrl(url: string): LoadFontPromise {
    const promise : LoadFontPromise = new Promise((resolve, reject) => {
      const family = this.preloader.urlKey(url)
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
