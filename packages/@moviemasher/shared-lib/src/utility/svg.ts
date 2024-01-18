import type { NumberRecord, Point, Rect, RectOptions, Size, SvgFilters, SvgItem, SvgItems, Transparency, Value } from '../types.js'

import { CURRENT_COLOR, HEIGHT, MOVIEMASHER, NAMESPACE_SVG, NAMESPACE_XLINK, NONE, SHORTEST, WIDTH, arrayFromOneOrMore, idGenerateString, isArray, isPopulatedString } from '../runtime.js'
import { assertPopulatedString, isPoint, isPositive, isSize } from './guards.js'
import { assertSizeAboveZero, pointValueString, rectTransformAttribute, sizeAboveZero, sizeCopy } from './rect.js'

export const svgSet = (element: SvgItem, value = '', name = 'id') => {
  if (isPopulatedString(value)) element.setAttribute(name, value)
  return element
}

export const svgSetDimensions = <T=SvgItem>(element: SvgItem & T, dimensions: any): T => {
  if (isSize(dimensions)) {
    const { width, height } = dimensions
    if (isPositive(width)) svgSet(element, String(width), WIDTH)
    if (isPositive(height)) svgSet(element, String(height), HEIGHT)
  }
  if (isPoint(dimensions)) {
    const { x, y } = dimensions
    svgSet(element, String(x), 'x')
    svgSet(element, String(y), 'y')
  }
  return element
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

export const svgAddClass = <T=Element>(element: T & Element, className?: string | string[]): T => {
  if (!className) return element
  const array = isArray(className) ? className : className.split(' ')
  element.classList.add(...array)
  return element
}

export const svgPolygonElement = (dimensions: any, className?: string | string[], fill = '', id?: string): SVGPolygonElement => {
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'polygon')
  const rectPoints = svgRectPoints(dimensions)
  const points = rectPoints.map(point => pointValueString(point)).join(' ') 
  svgSet(element, points, 'points')
  svgSet(element, fill, 'fill')
  svgAddClass(element, className)
  svgSet(element, id)
  return element
}

export const svgDefsElement = (svgItems?: SvgItems): SVGDefsElement => {
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'defs') 
  svgAppend(element, svgItems)
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

export const svgSetBox = (element: SvgItem, boxSize: Size) => {
  assertSizeAboveZero(boxSize, 'svgSetBox')

  const justSize = sizeCopy(boxSize)
  const { width, height } = justSize
  svgSetDimensions(element, justSize)
  const viewBox = `0 0 ${width} ${height}`
  svgSet(element, viewBox, 'viewBox')
}

export const svgAppend = (element: Element, items?: SvgItem | SvgItems) => {
  if (!items) return

  const kids = isArray(items) ? items : [items]
  kids.forEach(kid => element.appendChild(kid))
}

export const svgSvgElement = (size?: Size, svgItems?: SvgItem | SvgItems, needsLink?: boolean): SVGSVGElement => {
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'svg')
  svgSet(element, NAMESPACE_SVG, 'xmlns')
  if (needsLink) {
  svgSet(element, '1.1', 'version')
   svgSet(element, NAMESPACE_XLINK, 'xmlns:xlink')
  }
  svgAppend(element, svgItems)
  if (!sizeAboveZero(size)) return element

  svgSetBox(element, size)
  return element
}

export const svgGroupElement = (dimensions?: any, id = ''): SVGGElement => {
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'g')
  svgSet(element, id)
  svgSetDimensions(element, dimensions)
  return element
}

export const svgViewElement = (dimensions?: any, id = ''): SVGViewElement => {
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'view')
  element.setAttribute('type', 'matrix')
  svgSetDimensions(element, dimensions)
  return element
}

export const svgColorMatrix = (values: string): SVGFEColorMatrixElement => {
  const filterElement = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'feColorMatrix')
  filterElement.setAttribute('type', 'matrix')
  svgSet(filterElement, values, 'values')
  return filterElement
}

export const svgFilterElement = (filters?: SvgFilters, filtered?: SvgItem | SvgItems, id?: string): SVGFilterElement => {
  const filterElement = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'filter')
  svgSet(filterElement, 'userSpaceOnUse', 'filterUnits')
  svgSet(filterElement, 'sRGB', 'color-interpolation-filters')
  svgAppend(filterElement, filters)
  if (filtered) {
    const filterId = id || idGenerateString()
    svgSet(filterElement, filterId)
    const array = arrayFromOneOrMore(filtered)
    array.forEach(filtered => {
      svgSet(filtered, svgUrl(filterId), 'filter')
      svgAddClass(filtered, 'filtered')
    })
  }
  return filterElement
}

export const svgId = (id: string): string =>  `#${id}`

export const svgUrl = (id: string): string =>  `url(${svgId(id)})`

export const svgMaskElement = (contentItem?: SvgItem, transparency?: Transparency, id?: string): SVGMaskElement => {
  const maskElement = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'mask')
  const elementId = id || idGenerateString()
  svgSet(maskElement, elementId)   
  if (transparency) {
    svgSet(maskElement, `mask-type:${transparency}`, 'style')
    svgSet(maskElement, transparency, 'mask-type')
  }
  if (contentItem) {
    svgSet(contentItem, svgUrl(elementId), 'mask')
  }
  return maskElement
}

export const svgClipPathElement = (contentItem?: SvgItem, id?: string): SVGClipPathElement => {
  const elementId = id || idGenerateString()
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'clipPath')
  svgSet(element, elementId)
  svgSet(element, 'userSpaceOnUse', 'clipPathUnits')
  if (contentItem) svgSet(contentItem, svgUrl(elementId), 'clip-path')
  return element
}

export const svgImageElement = (url: string = '') => {
  const element = MOVIEMASHER.document.createElementNS(NAMESPACE_SVG, 'image')
  svgSet(element, NONE, 'preserveAspectRatio')
  if (url) {
    const key = url.startsWith('file:') ? 'xlink:href' : 'href'
    svgSet(element, url, key)
  }
  return element
}

export const svgImageWithOptions = (url:string, options: RectOptions): SVGImageElement => {
  const { shortest, lock = NONE, ...rect } = options
  assertSizeAboveZero(rect)
  const svgRect: NumberRecord = { ...rect }
  const element = svgImageElement(url)

  switch (lock) {
    case HEIGHT: {
      svgRect.height = -1 
      break
    }
    case WIDTH: {
      svgRect.width = -1
      break
    }
    case NONE: {
      svgSet(element, NONE, 'preserveAspectRatio')
      break
    }
    default: {
      assertPopulatedString(shortest, SHORTEST)
      svgRect[shortest] = -1
      break
    }
  }
  // console.debug('svgImagePromiseWithOptions', { url, options, svgRect })
  svgSetDimensions(element, svgRect)
  return element
}

export const svgPathElement = (path: string, fill = CURRENT_COLOR) => {
  const { document } = MOVIEMASHER
  const element = document.createElementNS(NAMESPACE_SVG, 'path')
  svgSet(element, path, 'd')
  svgSet(element, fill, 'fill')
  return element
}

export const svgSetTransform = (element: SvgItem, transform?: string, origin = 'top left') => {
  if (transform) {
    svgSet(element, transform, 'transform')
    svgSet(element, origin, 'transform-origin')
  }
  return element
}

export const svgSetTransformRects = (element: SvgItem, dimensions: Rect | Size, rect: Rect) => {
  svgSetTransform(element, rectTransformAttribute(dimensions, rect))
}

export const svgPatternElement = (dimensions: Size, id: string, items?: SvgItem | SvgItems): SVGPatternElement => {
  const { document } = MOVIEMASHER
  const element = document.createElementNS(NAMESPACE_SVG, 'pattern')
  svgSet(element, id)
  svgSetDimensions(element, dimensions)
  svgAppend(element, items)
  return element
}

export const svgText = (string: Value, color?: string, size?: number, family?: string, transform?: string) => {
  const { document } = MOVIEMASHER
  const svgItem = document.createElementNS(NAMESPACE_SVG, 'text')
  svgSet(svgItem, family, 'font-family')
  svgSet(svgItem, String(size), 'font-size')
  svgSet(svgItem, color, 'fill')

  svgItem.append(String(string))
  svgSetTransform(svgItem, transform)
  return svgItem
}

export const svgStyle = (css?: string): SVGStyleElement => {
  const { document } = MOVIEMASHER
  const element = document.createElementNS(NAMESPACE_SVG, 'style')
  if (css) element.append(css)
  return element
}