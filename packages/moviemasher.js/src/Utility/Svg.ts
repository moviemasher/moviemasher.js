import { assertSizeAboveZero, isSize, sizeCopy, Size, sizeAboveZero } from "./Size"
import { NamespaceSvg } from "../Setup/Constants"
import { assertPopulatedString, isArray, isPopulatedArray, isPopulatedString } from "./Is"
import { Orientation } from "../Setup/Enums"
import { StringObject, SvgFilter, SvgFilters, SvgItem } from "../declarations"
import { idGenerate } from "./Id"
import { assertPoint, isPoint, Point, PointZero } from "./Point"


export const svgId = (id: string): string => {
  return `#${id}`
}
export const svgUrl = (id: string): string => {
  return `url(${svgId(id)})`
}

export const svgGroupElement = (dimensions?: Size, id = ''): SVGGElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'g')
  svgSet(element, id)
  svgSetDimensions(element, dimensions)
  return element
}

export const svgSetDimensions = (element: SVGElement, dimensions: any) => {
  if (isSize(dimensions)) {
    const { width, height } = dimensions
    svgSet(element, String(width), 'width')
    svgSet(element, String(height), 'height')
  }
  if (isPoint(dimensions)) {
    const { x, y } = dimensions
    svgSet(element, String(x), 'x')
    svgSet(element, String(y), 'y')
  }
}

export const svgSetTransformPoint = (element: SVGElement, point: Point | any) => {
  assertPoint(point)

  const { x, y } = point
  if (!(x || y)) return 

  const transform = `translate(${x}, ${y})`
  svgSet(element, transform, 'transform')
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

export const svgSetBox = (element: SVGElement, boxSize: Size) => {
  assertSizeAboveZero(boxSize)

  const justSize = sizeCopy(boxSize)
  const { width, height } = justSize
  svgSetDimensions(element, justSize)
  const viewBox = `0 0 ${width} ${height}`
  svgSet(element, viewBox, 'viewBox')
}

export const svgElement = (size?: Size): SVGSVGElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  if (!sizeAboveZero(size)) return element

  svgSetBox(element, size)
  return element
}

export const svgImageElement = (href: string, dimensions?: any, lock?: Orientation) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, "image")
  svgSet(element, href, 'href')

  if (isSize(dimensions)) {
    const { width, height, ...point } = dimensions
    const size = { width, height }
    if (lock) {
      if (lock === Orientation.V) size.height = -1
      else size.width = -1
    } else svgSet(element, 'none', 'preserveAspectRatio')

    // manually add width/height since svgSetDimensions won't if negative
    svgSetDimensions(element, point)
    svgSet(element, String(size.width), 'width')
    svgSet(element, String(size.height), 'height')
  }
  return element
}

export const svgPathElement = (path: string, fill = 'currentColor') => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'path')
  svgSet(element, path, 'd')
  svgSet(element, fill, 'fill')
  return element
}

export const svgMaskElement = (size?: Size, contentSvgItem?: SvgItem, luminance?: boolean): SVGMaskElement => {
  const maskId = idGenerate('mask')
  const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask')
  svgSet(maskElement, maskId)
  if (sizeAboveZero(size)) {
    svgSetDimensions(maskElement, size)
    const color = luminance ? 'black' : 'none'
    maskElement.appendChild(svgPolygonElement(size, '', color))
  }
  
  if (contentSvgItem) {
    svgSet(contentSvgItem, svgUrl(maskId), 'mask')
    if (luminance) svgSet(contentSvgItem, 'luminance', 'mask-mode')
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
export const svgPatternElement = (dimensions: Size, id: string): SVGPatternElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'pattern')
  svgSet(element, id)
  svgSetBox(element, dimensions)
  return element
}

export const svgDefsElement = (): SVGDefsElement => {
  return globalThis.document.createElementNS(NamespaceSvg, 'defs') 
}

export const svgFeImageElement = (id?: string, result?: string): SVGFEImageElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'feImage') 
  if (isPopulatedString(id)) svgSet(element, svgId(id), 'href')
  svgSet(element, result, 'result')
  return element
}

export const svgFilterElement = (filters?: SvgFilters, filtered?: SvgItem | SvgItem[], rect?: any, id?: string): SVGFilterElement => {
  const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter')
  svgSet(filterElement, 'userSpaceOnUse', 'filterUnits')
  if (isPopulatedArray(filters)) filterElement.append(...filters)

  if (filtered || isPopulatedString(id)) {
    const filterId = id || idGenerate('filter')
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

export const svgDifferenceDefs = (overlayId: string, filtered: SvgItem | SvgItem[]) => {
  const filterObject = { type: 'feBlend' }
  const resultId = idGenerate('result')

  const differenceFilter = svgFilter({ ...filterObject, mode: 'difference'})
  svgSet(differenceFilter, resultId, 'in')
  svgSet(differenceFilter, 'SourceGraphic', 'in2')

  const image = svgFeImageElement(overlayId, resultId)
  const filter = svgFilterElement([image, differenceFilter], filtered, PointZero)

  svgSet(filter, '100%', 'width')
  svgSet(filter, '100%', 'height')
  return filter
}

export const svgSet = (element: SVGElement, value?: string, name = 'id') => {
  if (isPopulatedString(value)) element.setAttribute(name, value)
}

export const svgAddClass = (element: SVGElement, className?: string) => {
  if (isPopulatedString(className)) element.classList.add(...className.split(' '))
}

export const svgUseElement = (href?: string, className?: string, id?: string) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'use')
  
  if (isPopulatedString(href)) svgSet(element, svgId(href), 'href')
  svgSet(element, id)
  svgAddClass(element, className)
  return element
}
