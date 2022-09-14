import { assertSizeAboveZero, isSize, sizeCopy, Size, sizeAboveZero, sizeLockNegative, assertSize } from "./Size"
import { NamespaceSvg } from "../Setup/Constants"
import { assertPopulatedString, isArray, isPopulatedArray, isPopulatedString, isPositive } from "./Is"
import { Orientation } from "../Setup/Enums"
import { StringObject, SvgFilter, SvgFilters, SvgItem, SvgItems } from "../declarations"
import { idGenerateString } from "./Id"
import { assertPoint, isPoint, Point, pointCopy, PointZero } from "./Point"
import { Rect } from "./Rect"


export const svgId = (id: string): string => {
  return `#${id}`
}
export const svgUrl = (id: string): string => {
  return `url(${svgId(id)})`
}

export const svgGroupElement = (dimensions?: any, id = ''): SVGGElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'g')
  svgSet(element, id)
  svgSetDimensions(element, dimensions)
  return element
}

export const svgSetDimensions = (element: SvgItem, dimensions: any) => {
  if (isSize(dimensions)) {
    const { width, height } = dimensions
    if (isPositive(width)) svgSet(element, String(width), 'width')
    if (isPositive(height)) svgSet(element, String(height), 'height')
  }
  if (isPoint(dimensions)) {
    const { x, y } = dimensions
    svgSet(element, String(x), 'x')
    svgSet(element, String(y), 'y')
  }
}

export const svgSetTransformPoint = (element: SvgItem, point: Point | any) => {
  assertPoint(point)

  const { x, y } = point
  if (!(x || y)) return 

  svgSetTransform(element, `translate(${x}, ${y})`)
}

export const svgRectPoints = (dimensions: any): Point[] => {
  const { width, height, x = 0, y = 0 } = dimensions
  const startEndPoint = { x, y }
  const points: Point[] = []
  points.push(startEndPoint)
  points.push({ x: x + width, y })
  points.push({ x: x + width, y: y + height })
  points.push({ x, y: y + height })
  points.push(startEndPoint)
  return points
}

export const svgPolygonElement = (dimensions: any, className = '', fill = '', id?: string): SVGPolygonElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'polygon')
  const rectPoints = svgRectPoints(dimensions)
  const points = rectPoints.map(point => [point.x, point.y].join(',')).join(' ') 
  svgSet(element, points, 'points')
  svgSet(element, fill, 'fill')
  svgAddClass(element, className)
  svgSet(element, id)
  return element
}

export const svgSetBox = (element: SvgItem, boxSize: Size) => {
  assertSizeAboveZero(boxSize)

  const justSize = sizeCopy(boxSize)
  const { width, height } = justSize
  svgSetDimensions(element, justSize)
  const viewBox = `0 0 ${width} ${height}`
  svgSet(element, viewBox, 'viewBox')
}

export const svgElement = (size?: Size, svgItems?: SvgItem | SvgItems): SVGSVGElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  svgAppend(element, svgItems)
  if (!sizeAboveZero(size)) return element

  svgSetBox(element, size)
  return element
}

export const svgSetDimensionsLock = (element: SvgItem, dimensions: any, lock?: Orientation) => {
  assertSizeAboveZero(dimensions)
  if (!lock) svgSet(element, 'none', 'preserveAspectRatio')

  const rect = { 
    ...sizeLockNegative(dimensions, lock), 
    ...pointCopy(dimensions) 
  }
  svgSetDimensions(element, rect)
}

export const svgImageElement = (href?: string, dimensions?: any, lock?: Orientation) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, "image")
  if (isPopulatedString(href)) svgSet(element, href, 'href')
  if (isSize(dimensions)) svgSetDimensionsLock(element, dimensions, lock)
  return element
}

export const svgPathElement = (path: string, fill = 'currentColor') => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'path')
  svgSet(element, path, 'd')
  svgSet(element, fill, 'fill')
  return element
}

export const svgMaskElement = (size?: Size, contentItem?: SvgItem, luminance?: boolean): SVGMaskElement => {
  const maskId = idGenerateString()
  const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask')
  svgSet(maskElement, maskId)
  if (sizeAboveZero(size)) {
    svgSetDimensions(maskElement, size)
    const color = luminance ? 'black' : 'none'
    svgAppend(maskElement, svgPolygonElement(size, '', color))
  }
  
  if (contentItem) {
    svgSet(contentItem, svgUrl(maskId), 'mask')
    if (luminance) svgSet(contentItem, 'luminance', 'mask-mode')
  }
  return maskElement
}

export const svgFilter = (values: StringObject, dimensions?: any): SvgFilter => {
  const { type, ...rest } = values
  assertPopulatedString(type)

  const filter = globalThis.document.createElementNS(NamespaceSvg, type) 
  svgSetDimensions(filter, dimensions)
  Object.entries(rest).forEach(([key, value]) => {
    svgSet(filter, String(value), key)
  })
  return filter as SvgFilter
}

export const svgAppend = (element: SvgItem, items?: SvgItem | SvgItems) => {
  if (!items) return

  const kids = isArray(items) ? items : [items]
  kids.forEach(kid => element.appendChild(kid))
}

export const svgPatternElement = (dimensions: Size, id: string, items?: SvgItem | SvgItems): SVGPatternElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'pattern')
  svgSet(element, id)
  svgSetBox(element, dimensions)
  svgSet(element, 'userSpaceOnUse', 'patternUnits')
  svgAppend(element, items)
  return element
}

export const svgDefsElement = (svgItems?: SvgItems): SVGDefsElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'defs') 
  svgAppend(element, svgItems)
  return element
}

export const svgFeImageElement = (id?: string, result?: string): SVGFEImageElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'feImage') 
  if (isPopulatedString(id)) svgSet(element, svgId(id), 'href')
  svgSet(element, result, 'result')
  return element
}

export const svgFilterElement = (filters?: SvgFilters, filtered?: SvgItem | SvgItems, rect?: any, id?: string): SVGFilterElement => {
  const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')
  svgSet(filterElement, 'userSpaceOnUse', 'filterUnits')
  svgAppend(filterElement, filters)

  if (filtered || isPopulatedString(id)) {
    const filterId = id || idGenerateString()
    svgSet(filterElement, filterId)
    if (filtered) {
      const array = isArray(filtered) ? filtered : [filtered]
      array.forEach(filtered => {
        svgSet(filtered, svgUrl(filterId), 'filter')
        svgAddClass(filtered, 'filtered')
      })
    }
  }
  svgSetDimensions(filterElement, rect)
  return filterElement
}

export const svgDifferenceDefs = (overlayId: string, filtered: SvgItem | SvgItems) => {
  const filterObject = { type: 'feBlend' }
  const resultId = idGenerateString()

  const differenceFilter = svgFilter({ ...filterObject, mode: 'difference'})
  svgSet(differenceFilter, resultId, 'in')
  svgSet(differenceFilter, 'SourceGraphic', 'in2')

  const image = svgFeImageElement(overlayId, resultId)
  const filter = svgFilterElement([image, differenceFilter], filtered, PointZero)

  svgSet(filter, '100%', 'width')
  svgSet(filter, '100%', 'height')
  return filter
}

export const svgSet = (element: SvgItem, value?: string, name = 'id') => {
  if (isPopulatedString(value)) element.setAttribute(name, value)
}

export const svgAddClass = (element: SvgItem, className?: string) => {
  if (isPopulatedString(className)) element.classList.add(...className.split(' '))
}

export const svgUseElement = (href?: string, className?: string, id?: string) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'use')
  
  if (isPopulatedString(href)) svgSet(element, svgId(href), 'href')
  svgSet(element, id)
  svgAddClass(element, className)
  return element
}

export const svgSetTransform = (element: SvgItem, transform: string) => {
  svgSet(element, transform, 'transform')
  svgSet(element, 'top left', 'transform-origin')
}


export const svgTransform = (dimensions: Size, rect: Rect | Size): string => {
  assertSize(dimensions)
  assertSize(rect)

  const { width: outWidth, height: outHeight } = dimensions
  const { width, height } = rect
  const words: string[] = []
  const scaleWidth = width / outWidth 
  const scaleHeight = height / outHeight 
  if (isPoint(rect)) {
    const { x, y } = rect
    if (!(x === 0 && y === 0)) words.push(`translate(${x},${y})`)
  }
  if (!(scaleWidth === 1 && scaleHeight === 1)) {
    words.push(`scale(${scaleWidth},${scaleHeight})`)
  }
  return words.join(' ')
}

export const svgSetTransformRects = (element: SvgItem, dimensions: Size, rect: Rect | Size) => {
  svgSetTransform(element, svgTransform(dimensions, rect))
}
