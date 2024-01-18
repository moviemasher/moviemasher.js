import type { Constrained, DataOrError, ImageAsset, ImageInstance, SvgItem, VisibleAsset, VisibleInstance, SvgItemArgs } from '../types.js'

import { ERROR, IMAGE, namedError } from '../runtime.js'
import { svgImageWithOptions } from '../utility/svg.js'
import { requestUrl } from '../utility/request.js'
import { isClientMediaRequest, isRequestable, isServerMediaRequest } from '../utility/guards.js'

export function ImageInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ImageInstance> {
  return class extends Base implements ImageInstance {
    declare asset: ImageAsset

    override svgItem(args: SvgItemArgs): DataOrError<SvgItem> {
      const { asset } = this
      if (!isRequestable(asset)) return namedError(ERROR.Unavailable, 'svgItem')
      
      const { rect } = args
      const { request } = asset
      let url: string | undefined
      if (isServerMediaRequest(request)) url = request.path
      else if (isClientMediaRequest(request)) url = request.objectUrl
      url ||= requestUrl(request)
      return { data: svgImageWithOptions(url, rect) }
    }
  }
}

export function ImageAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ImageAsset> {
  return class extends Base implements ImageAsset {
    canBeContainer = true
    canBeContent = true
    canBeFill = true
    type = IMAGE
  }
}

// override clippedElement(content: ContentInstance, containerRect: Rect, outputSize: Size, time: Time, context: ClientOrServer = CLIENT): DataOrError<Element> {
//   const { isVector } = this.asset
//   if (isVector) return namedError(ERROR.Internal, 'isVector')

//   // console.log(this.constructor.name, 'clippedElementPromise')
//   const shortest = outputSize.width < outputSize.height ? WIDTH : HEIGHT
//   const fillOrError = content.fill(containerRect, time, shortest)

//   if (isDefiniteError(fillOrError)) {
//     console.log(this.constructor.name, 'clippedElementPromise -> content.fill', fillOrError.error)
//     return fillOrError
//   }

//   const { data: fill } = fillOrError
//   const defs: SvgItems = []



//   const { clip } = this
//   const { timeRange, transparency } = clip
//   const containerId = idGenerateString()
//   const contentId = idGenerateString()
//   const contentItem = isString(fill) ? svgPolygonElement(containerRect, '', fill) : fill

//   svgSet(contentItem, contentId)


//   const itemOrError = this.containerSvgItem(containerRect, time)
//   if (isDefiniteError(itemOrError)) return itemOrError

//   const { data: containerItem } = itemOrError
//   svgSet(containerItem, containerId)
//   const group = svgGroupElement()
//   svgAppend(group, svgPolygonElement(containerRect, '', 'transparent'))
//   svgAppend(group, contentItem)

//   const items: SvgItems = [group]
//   svgAddClass(group, 'contained')
//   const maskElement = this.maskingElement(group, transparency)
//   defs.push(maskElement)

//   if (transparency === LUMINANCE) maskElement.appendChild(svgPolygonElement(outputSize, '', 'black'))
//   maskElement.appendChild(containerItem)
  
//   if (context === CLIENT) containerItem.setAttribute('vector-effect', 'non-scaling-stroke')
  
//   containerItem.setAttribute('fill', RGB_WHITE)
  
//   // const svgFilter = this.containerSvgFilter(containerItem, size, containerRect, time, range)
//   // if (svgFilter) defs.push(svgFilter)
//   // else containerItem.removeAttribute('filter')
//   assertVisibleInstance(content)

//   const contentFilter = this.containerOpacityFilter(contentItem, outputSize, containerRect, time, timeRange)
//   if (contentFilter) defs.push(contentFilter)
//   else contentItem.removeAttribute('filter')

//   const contentIsBitmap = !content.asset.isVector
//   const svg = contentIsBitmap ? this.svgElement : svgSvgElement()
//   svgSetChildren(svg, [svgDefsElement(defs), ...items])
//   // svgSetDimensions(svg, outputSize)
//   svgSetBox(svg, outputSize)

//   return { data: svg }
// }

// private _svgElement?: SVGSVGElement

// private get svgElement() {
//   return this._svgElement ||= svgSvgElement()
// }



// itemContentRect(zeroContainerRect: Rect, shortest: PropertySize, time: Time): Rect {
//   const contentRectArgs: ContentRectArgs = {
//     containerRects: [zeroContainerRect, zeroContainerRect],
//     shortest, time, timeRange: this.clip.timeRange,
//   }
//   const [contentRect] = this.contentRects(contentRectArgs)
//   console.log(this.constructor.name, 'itemContentRect', {zeroContainerRect, contentRect})
//   const translated = pointTranslate(zeroContainerRect, contentRect)
//   return { ...contentRect, ...translated }
// }


// override fill(containerRect: Rect, time: Time, shortest: PropertySize): DataOrError<ContentFill> {
//   console.log(this.constructor.name, 'fill!', containerRect)
//   // const containerRect = { ...containerRect, ...POINT_ZERO }

//   const { timeRange } = this.clip
//   const args: ContentRectArgs = {
//     containerRects: [containerRect, containerRect], shortest, time, timeRange,
//   }
//   const [contentRect] = this.contentRects(args)
//   // const intrinsicScale = {
//   //   width: contentRect.width / intrinsicRect.width,
//   //   height: contentRect.height / intrinsicRect.height,
//   // }

//   const rect = { 
//     x: (-contentRect.x) / containerRect.width, 
//     y: (-contentRect.y)/ containerRect.height,
//     width: contentRect.width / containerRect.width, 
//     height: contentRect.height / containerRect.height
//   }
//   const intrinsicRect = this.intrinsicRect
//   console.log(this.constructor.name, 'fill!', {intrinsicRect, containerRect, contentRect, imageRect: rect})
//   const svgArgs: SvgItemArgs = { rect, time, timeRange, size: ouputSize }
//   const orError = this.svgItem(svgArgs)
//   if (isDefiniteError(orError)) return orError

//   const { data: element } = orError
//   const oneSize = { width: 1, height: 1 }
//   const pattern = svgPatternElement(oneSize, '', element)
//   pattern.setAttribute('patternContentUnits', 'objectBoundingBox')
//   // pattern.setAttribute('patternUnits', 'objectBoundingBox')
//   return { data: pattern }
// }