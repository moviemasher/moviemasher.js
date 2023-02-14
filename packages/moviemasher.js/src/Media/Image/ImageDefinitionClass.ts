import { ClientImage } from "../../ClientMedia/ClientMedia"
import { ImageType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isClientImage } from "../../ClientMedia/ClientMediaFunctions"
import { assertSizeAboveZero, Size, sizeCover } from "../../Utility/Size"
import { MediaBase } from "../MediaBase"
import { PreloadArgs } from "../../Base/Code"
import { requestImagePromise } from "../../Utility/Request"
import { centerPoint, RectOptions } from "../../Utility/Rect"
import { svgImagePromiseWithOptions, svgSvgElement } from "../../Helpers/Svg/SvgFunctions"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"

const ImageDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const ImageDefinitionWithContainer = ContainerDefinitionMixin(ImageDefinitionWithTweenable)
const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer)
const ImageDefinitionWithUpdatable = UpdatableSizeDefinitionMixin(ImageDefinitionWithContent)
export class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
  constructor(object: ImageDefinitionObject) {
    super(object)
    const { clientMedia } = this
    if (isClientImage(clientMedia)) this.loadedImage = clientMedia
    console.log(this.constructor.name, object)
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const transcoding = this.preferredTranscoding(ImageType) 

    return transcoding.clientMediaPromise.then(orError => {
      const { error, clientMedia: image } = orError
      if (error) return errorThrow(error)

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

    const transcoding = editing ? this.preferredTranscoding(ImageType) : this
    
    const { request } = transcoding
    return requestImagePromise(request).then(orError => {
      const { error, clientImage } = orError
      if (error) return errorThrow(error)
      this.loadedImage = clientImage
    })
  }
  
  loadedImage?: ClientImage 
  
  type = ImageType 
}
