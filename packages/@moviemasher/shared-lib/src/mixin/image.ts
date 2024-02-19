import type { MaybeComplexSvgItem, Constrained, DataOrError, ImageAsset, ImageInstance, SvgItem, VisibleAsset, VisibleInstance, ContainerSvgItemArgs, ContentSvgItemArgs, Rect, Scalar } from '../types.js'

import { ERROR, $IMAGE, namedError } from '../runtime.js'
import { svgImageWithOptions, svgOpacity } from '../utility/svg.js'
import { requestUrl } from '../utility/request.js'
import { isRequestable } from '../utility/guards.js'

export function ImageAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ImageAsset> {
  return class extends Base implements ImageAsset {
    override canBeContainer = true
    override canBeContent = true
    override canBeFill = true
    override type = $IMAGE
    override hasIntrinsicSizing = true
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
