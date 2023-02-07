import { LoadedImage } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isLoadedImage } from "../../Loader/Loader"
import { assertSizeAboveZero, Size, sizeCover } from "../../Utility/Size"
import { MediaBase } from "../MediaBase"
import { PreloadArgs } from "../../MoveMe"
import { requestImagePromise } from "../../Utility/Request"
import { centerPoint, RectOptions } from "../../Utility/Rect"
import { svgImagePromiseWithOptions, svgSvgElement } from "../../Utility/Svg"

const ImageDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const ImageDefinitionWithContainer = ContainerDefinitionMixin(ImageDefinitionWithTweenable)
const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer)
const ImageDefinitionWithPreloadable = PreloadableDefinitionMixin(ImageDefinitionWithContent)
const ImageDefinitionWithUpdatable = UpdatableSizeDefinitionMixin(ImageDefinitionWithPreloadable)
export class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
  constructor(object: ImageDefinitionObject) {
    super(object)
    const { loadedMedia } = this
    if (isLoadedImage(loadedMedia)) this.loadedImage = loadedMedia
    console.log(this.constructor.name, object)
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const transcoding = this.preferredTranscoding(DefinitionType.Image) 

    return transcoding.loadedMediaPromise.then(image => {
      assertSizeAboveZero(image)

      const { width, height, src } = image
      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = {
        ...outRect
      }
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
        return svgSvgElement(size, svgImage)
      })
    })
  }

  instanceFromObject(object: ImageObject = {}) : Image {
    return new ImageClass(this.instanceArgs(object))
  }


  loadPromise(args: PreloadArgs): Promise<void> {
    const { editing, visible } = args
    if (!visible) return Promise.resolve()

    const { loadedImage } = this
    if (loadedImage) return Promise.resolve()

    const transcoding = editing ? this.preferredTranscoding(DefinitionType.Image) : this
    
    const { request } = transcoding
    return requestImagePromise(request).then(image => {
      this.loadedImage = image
    })
  }
  
  loadedImage?: LoadedImage 
  
  type = DefinitionType.Image 
}
