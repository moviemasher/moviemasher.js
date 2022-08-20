import path from 'path'
import { registerFont, loadImage } from "canvas"

import { LoadedFont, LoadedImage, LoadFontPromise, LoadImagePromise } from "../../../packages/moviemasher.js/src/declarations"
import { BrowserLoaderClass } from "../../../packages/moviemasher.js/src/Loader/BrowserLoaderClass"
import { TestFilePrefix } from "../Setup/Constants"
import { GraphFile } from '../../../packages/moviemasher.js/src/MoveMe'
import { GraphType } from '@moviemasher/moviemasher.js'

export class JestPreloader extends BrowserLoaderClass {
  protected override requestFont(url: string, graphFile: GraphFile): LoadFontPromise {
    const family = this.fontFamily(url)
    const { definition } = graphFile
    this.updateDefinitionFamily(definition, family)
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, file)
    // console.log(this.constructor.name, "requestFont", url, pathResolved, family)
    const object = { family }
    registerFont(pathResolved, object)
    return Promise.resolve(object as LoadedFont)
  }

  protected override requestImage(url: string, graphFile: GraphFile): LoadImagePromise {
    const { baseURI } = document
    const { definition } = graphFile
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const pathResolved = path.resolve(TestFilePrefix, file)
    // console.log(this.constructor.name, "requestImage", url, pathResolved)
    const loadImageResult = loadImage(pathResolved).then(image => {
      const { width, height } = image
      // console.log(this.constructor.name, "requestImage -> loadImage", url, pathResolved, width, height)
      const dimensions = { width, height }
      this.updateDefinitionSize(definition, dimensions, this.server)

      return image as any as LoadedImage
    })
    return loadImageResult
  }

  server = false
}
