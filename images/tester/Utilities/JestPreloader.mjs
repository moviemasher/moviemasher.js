import path from 'path'
import { registerFont, loadImage } from "canvas"
import { TestFilePrefix } from "../Setup/Constants.mjs"

import { BrowserLoaderClass } from "@moviemasher/moviemasher.js"

export class JestPreloader extends BrowserLoaderClass {
  requestFont(file) {
    const { urlOrLoaderPath: url } = file
    const family = this.fontFamily(url)
    const info = { family }
    this.updateLoaderFile(file, info)
    const { document } = globalThis
    const baseURI = document?.baseURI || 'http://localhost/'
    const fileUrl = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, fileUrl)
    // console.log(this.constructor.name, "requestFont", url, pathResolved, family)
    const object = { family }
    registerFont(pathResolved, object)
    return Promise.resolve(object )
  }

  requestImage(file){
    const { urlOrLoaderPath: url } = file
    const { document } = globalThis
    const baseURI = document?.baseURI || 'http://localhost/'
    
    const fileUrl = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, fileUrl)
    // console.log(this.constructor.name, "requestImage", url, pathResolved)
    const loadImageResult = loadImage(pathResolved).then((image) => {
      const { width, height } = image
      // console.log(this.constructor.name, "requestImage -> loadImage", url, pathResolved, width, height)

      const info = { width, height }
      this.updateLoaderFile(file, info)
      
      return image
    })
    return loadImageResult
  }

  server = false
}
