import path from 'path'
import { registerFont, loadImage } from "canvas"

import { Any, LoadedFont, LoadedImage, LoadFontPromise, LoadImagePromise } from "../../../packages/moviemasher.js/src/declarations"
import { BrowserPreloaderClass } from "../../../packages/moviemasher.js/src/Preloader/BrowserPreloaderClass"
import { TestFilePrefix } from "../Setup/Constants"

class JestPreloader extends BrowserPreloaderClass {
  protected override requestFont(url: string): LoadFontPromise {
    const family = this.fontFamily(url)
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, file)
    // console.log(this.constructor.name, "requestFont", url, pathResolved)
    const object = { family }
    registerFont(pathResolved, object)
    return Promise.resolve(object as LoadedFont)
  }

  protected override requestImage(url: string): LoadImagePromise {
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, file)
    // console.log(this.constructor.name, "requestImage", url, pathResolved)
    const loadImageResult = loadImage(pathResolved).then(image => {
      // console.log(this.constructor.name, "requestImage -> loadImage", url, pathResolved, image)
      return image as Any as LoadedImage
    })
    return loadImageResult
  }
}

export { JestPreloader }
