import path from 'path'
import { registerFont, loadImage } from "canvas"

import { LoadedFont, LoadedImage } from "../../../packages/moviemasher.js/src/declarations"
import { BrowserLoaderClass } from "../../../packages/moviemasher.js/src/Loader/BrowserLoaderClass"
import { TestFilePrefix } from "../Setup/Constants"
import { LoadedInfo, LoaderFile, Size } from '@moviemasher/moviemasher.js'

export class JestPreloader extends BrowserLoaderClass {
  protected override requestFont(file: LoaderFile): Promise<LoadedFont> {
    const { urlOrLoaderPath: url } = file
    const family = this.fontFamily(url)
    const info: LoadedInfo = { family }
    this.updateLoaderFile(file, info)
      
    const { baseURI } = document
    const fileUrl = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, fileUrl)
    // console.log(this.constructor.name, "requestFont", url, pathResolved, family)
    const object = { family }
    registerFont(pathResolved, object)
    return Promise.resolve(object as LoadedFont)
  }

  protected override requestImage(file: LoaderFile): Promise<LoadedImage> {
    const { urlOrLoaderPath: url } = file
    const { baseURI } = document
    
    const fileUrl = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, fileUrl)
    // console.log(this.constructor.name, "requestImage", url, pathResolved)
    const loadImageResult = loadImage(pathResolved).then((image: Size) => {
      const { width, height } = image
      // console.log(this.constructor.name, "requestImage -> loadImage", url, pathResolved, width, height)

      const info: LoadedInfo = { width, height }
      this.updateLoaderFile(file, info)
      

      return image as LoadedImage
    })
    return loadImageResult
  }

  server = false
}
