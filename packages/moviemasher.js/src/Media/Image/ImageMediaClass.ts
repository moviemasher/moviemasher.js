import { ClientImage } from "../../ClientMedia/ClientMedia"
import { ImageType } from "../../Setup/Enums"
import { Image, ImageMedia, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { assertSizeAboveZero, Size, sizeCover } from "../../Utility/Size"
import { MediaBase } from "../MediaBase"
import { PreloadArgs } from "../../Base/Code"
import { requestImagePromise } from "../../Helpers/Request/RequestFunctions"
import { centerPoint, RectOptions } from "../../Utility/Rect"
import { svgImagePromiseWithOptions, svgSvgElement } from "../../Helpers/Svg/SvgFunctions"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { isDefiniteError } from "../../Utility/Is"

const ImageMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const ImageMediaWithContainer = ContainerDefinitionMixin(ImageMediaWithTweenable)
const ImageMediaWithContent = ContentDefinitionMixin(ImageMediaWithContainer)
const ImageMediaWithUpdatable = UpdatableSizeDefinitionMixin(ImageMediaWithContent)
export class ImageMediaClass extends ImageMediaWithUpdatable implements ImageMedia {
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const transcoding = this.preferredTranscoding(ImageType) 

    return requestImagePromise(transcoding.request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      assertSizeAboveZero(clientImage)

      const { width, height, src } = clientImage
      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = { ...outRect }
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
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      this.loadedImage = clientImage
    })
  }
  
  loadedImage?: ClientImage 
  
  type = ImageType 
}
