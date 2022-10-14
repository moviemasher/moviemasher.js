import { assertSizeAboveZero, isSize, sizeCopy, Size, sizeAboveZero, sizeLockNegative, assertSize } from "./Size"
import { NamespaceSvg } from "../Setup/Constants"
import { assertPopulatedString, isArray, isPopulatedArray, isPopulatedString, isPositive } from "./Is"
import { Orientation } from "../Setup/Enums"
import { StringObject, SvgFilter, SvgFilters, SvgItem, SvgItems } from "../declarations"
import { idGenerateString } from "./Id"
import { assertPoint, isPoint, Point, pointCopy, pointNegate, pointValueString, PointZero } from "./Point"
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

export const svgPolygonElement = (dimensions: any, className?: string | string[], fill = '', id?: string): SVGPolygonElement => {
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
  assertSizeAboveZero(boxSize, 'svgSetBox')

  const justSize = sizeCopy(boxSize)
  const { width, height } = justSize
  svgSetDimensions(element, justSize)
  const viewBox = `0 0 ${width} ${height}`
  svgSet(element, viewBox, 'viewBox')
}

export const svgElement = (size?: Size, svgItems?: SvgItem | SvgItems): SVGSVGElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  svgSet(element, '1.1', 'version')
  svgSet(element, NamespaceSvg, 'xmlns')

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

export const svgImageElement = () => {
  const element = globalThis.document.createElementNS(NamespaceSvg, "image")
  svgSet(element, 'none', 'preserveAspectRatio')
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

    // svgSetDimensions(maskElement, size)
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
  const { filter, ...rest } = values
  assertPopulatedString(filter)

  const element = globalThis.document.createElementNS(NamespaceSvg, filter) 
  svgSetDimensions(element, dimensions)
  Object.entries(rest).forEach(([key, value]) => {
    svgSet(element, String(value), key)
  })
  return element as SvgFilter
}

export const svgAppend = (element: Element, items?: SvgItem | SvgItems) => {
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

export const svgFilterElement = (filters?: SvgFilters, filtered?: SvgItem | SvgItems, rect?: any, units = 'userSpaceOnUse'): SVGFilterElement => {
  const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')
  if (units) svgSet(filterElement, units, 'filterUnits')

  svgSet(filterElement, 'sRGB', 'color-interpolation-filters')

  svgAppend(filterElement, filters)

  if (filtered) {
    const filterId = idGenerateString()
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
  const filterObject = { filter: 'feBlend' }
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

export const svgAddClass = (element: Element, className?: string | string[]) => {
  if (!className) return
  const array = isArray(className) ? className : className.split(' ')
  element.classList.add(...array)
}

export const svgUseElement = (href?: string, className?: string, id?: string) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'use')
  
  if (isPopulatedString(href)) svgSet(element, svgId(href), 'href')
  svgSet(element, id)
  svgAddClass(element, className)
  return element
}

export const svgSetTransform = (element: SvgItem, transform: string, origin = 'top left') => {
  svgSet(element, transform, 'transform')
  svgSet(element, origin, 'transform-origin')
}


export const svgTransform = (dimensions: Rect | Size, rect: Rect): string => {
  assertSizeAboveZero(dimensions, 'svgTransform.dimensions')
  assertSizeAboveZero(rect, 'svgTransform.rect')

  const { width: inWidth, height: inHeight } = dimensions
  const { width: outWidth, height: outHeight, x: outX, y: outY } = rect
  const scaleWidth = outWidth / inWidth 
  const scaleHeight = outHeight / inHeight 
  const words: string[] = []
  if (!(outX === 0 && outY === 0)) words.push(`translate(${outX},${outY})`)
  
  if (!(scaleWidth === 1 && scaleHeight === 1)) {
    words.push(`scale(${scaleWidth},${scaleHeight})`)
  }
  if (isPoint(dimensions)) {
    const { x: inX, y: inY } = (dimensions)
    if (!(inX === 0 && inY === 0)) words.push(`translate(${inX},${inY})`)
  }
  return words.join(' ')
}

export const svgSetTransformRects = (element: SvgItem, dimensions: Rect | Size, rect: Rect) => {
  svgSetTransform(element, svgTransform(dimensions, rect))
}

export const svgFunc = (type: string, values: string) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, type)
  svgSet(element, values, 'tableValues')
  svgSet(element, 'discrete', 'type')
  return element
}

export const svgSetChildren = (element: Element, svgItems: SvgItems) => {
  if (!element.hasChildNodes()) return svgAppend(element, svgItems)

  const { childNodes } = element
  const nodes: Node[] = []
  childNodes.forEach(node => { 
    if (!svgItems.includes(node as SvgItem)) nodes.push(node)
  })
  nodes.forEach(node => { element.removeChild(node) })
  svgItems.forEach(node => element.appendChild(node))
}



