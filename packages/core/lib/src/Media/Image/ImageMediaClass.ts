import type {ClientImage} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {Image, ImageMedia, ImageMediaObject, ImageObject} from './Image.js'
import type {PreloadArgs} from '../../Base/Code.js'
import type {Size} from '../../Utility/Size.js'

import {assertSizeAboveZero, sizeCover} from '../../Utility/Size.js'
import {centerPoint, RectOptions} from '../../Utility/Rect.js'
import {ContainerDefinitionMixin} from '../Container/ContainerDefinitionMixin.js'
import {ContentDefinitionMixin} from '../Content/ContentDefinitionMixin.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {ImageClass} from './ImageClass.js'
import {isDefiniteError} from '../../Utility/Is.js'
import {MediaBase} from '../MediaBase.js'
import {svgImagePromiseWithOptions, svgSvgElement} from '../../Helpers/Svg/SvgFunctions.js'
import {TweenableDefinitionMixin} from '../../Mixin/Tweenable/TweenableDefinitionMixin.js'
import {TypeImage} from '../../Setup/Enums.js'
import {UpdatableSizeDefinitionMixin} from '../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin.js'

const ImageMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const ImageMediaWithContainer = ContainerDefinitionMixin(ImageMediaWithTweenable)
const ImageMediaWithContent = ContentDefinitionMixin(ImageMediaWithContainer)
const ImageMediaWithUpdatable = UpdatableSizeDefinitionMixin(ImageMediaWithContent)
export class ImageMediaClass extends ImageMediaWithUpdatable implements ImageMedia {
  constructor(object: ImageMediaObject) {
    super(object)
    const { loadedImage } = object
    if (loadedImage) this.loadedImage = loadedImage
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const transcoding = this.preferredTranscoding(TypeImage) 

    return this.requestImagePromise(transcoding.request).then(orError => {
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

    const transcoding = editing ? this.preferredTranscoding(TypeImage) : this
    
    const { request } = transcoding
    return this.requestImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      this.loadedImage = clientImage
    })
  }
  
  loadedImage?: ClientImage 
  
  type = TypeImage 
}
