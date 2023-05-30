import { Size } from '@moviemasher/runtime-shared'

import type { ImageAsset, ImageAssetObject } from "../../Shared/Image/ImageAsset.js"
import type { RectOptions } from '@moviemasher/runtime-shared'
import type { AssetCacheArgs, PreloadArgs } from '../../Base/Code.js'
import type { ClientImage } from '../../Helpers/ClientMedia/ClientMedia.js'

import { TypeImage } from '@moviemasher/runtime-shared'

import { assertImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js"
import { assertSizeAboveZero, sizeCover } from '../../Utility/SizeFunctions.js'
import { centerPoint } from '../../Utility/RectFunctions.js'
import { ImportedClientAssetClass } from "./ImportedClientAssetClass.js"
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { ClientVisibleAssetMixin } from "../Visible/ClientVisibleAssetMixin.js"
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isDefiniteError } from '../../Shared/SharedGuards.js'
import { svgImagePromiseWithOptions, svgSvgElement } from '../../Helpers/Svg/SvgFunctions.js'
import { ImageAssetMixin } from '../../Shared/Image/ImageAssetMixin.js'
import { clientMediaImagePromise } from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import { isClientImportedAssetObject } from '../Asset/ClientAssetGuards.js'


const WithVisibleAsset = VisibleAssetMixin(ImportedClientAssetClass)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithVisibleAsset)
const WithImage = ImageAssetMixin(WithClientVisibleAsset)

export class ImportedClientImageAssetClass extends WithImage implements ImageAsset {
  constructor(object: ImageAssetObject) {
    assertImportedAssetObject(object)
    super(object)
    if (isClientImportedAssetObject(object)) {
      const { loadedImage } = object
      if (loadedImage) this.loadedImage = loadedImage
    }
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const transcoding = this.preferredAsset(TypeImage) 
    if (!transcoding) return undefined

    return clientMediaImagePromise(transcoding.request).then(orError => {
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

  assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { visible } = args
    if (!visible) return Promise.resolve()

    const { loadedImage } = this
    if (loadedImage) return Promise.resolve()

    const transcoding = this.preferredAsset(TypeImage) 
    if (!transcoding) return Promise.resolve()
    
    const { request } = transcoding
    return clientMediaImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      this.loadedImage = clientImage
    })
  }
  
  loadedImage?: ClientImage 
}



