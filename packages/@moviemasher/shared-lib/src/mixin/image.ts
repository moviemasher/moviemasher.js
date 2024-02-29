import type { Constrained, ContainerSvgItemArgs, ContentSvgItemArgs, DataOrError, ImageAsset, ImageInstance, MaybeComplexSvgItem, Rect, Scalar, SvgItem, VisibleAsset, VisibleInstance } from '../types.js'

import { $IMAGE, ERROR, namedError } from '../runtime.js'
import { isRequestable } from '../utility/guards.js'
import { requestUrl } from '../utility/request.js'
import { svgImageWithOptions, svgOpacity } from '../utility/svg.js'

export function ImageAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ImageAsset> {
  return class extends Base implements ImageAsset {
    override canBeContainer = true
    override canBeContent = true
    override canBeFill = true
    override hasIntrinsicSizing = true
    override type = $IMAGE
  }
}

export function ImageInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ImageInstance> {
  return class extends Base implements ImageInstance {
    declare asset: ImageAsset

    override containerSvgItem(args: ContainerSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const { opacity } = args
      return this.svgItem(args.containerRect, opacity)
    }

    override contentSvgItem(args: ContentSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const { opacity } = args
      return this.svgItem(args.contentRect, opacity)
    }

    private svgItem(rect: Rect, opacity?: Scalar): DataOrError<SvgItem> {
      const { asset } = this
      if (!isRequestable(asset)) return namedError(ERROR.Unavailable, 'svgItem')
      
      const { request } = asset
      const { path, objectUrl } = request
      const url = path || objectUrl || requestUrl(request)
      const image = svgImageWithOptions(url, rect)
      const data = svgOpacity(image, opacity)
      return { data }
    }
  }
}
