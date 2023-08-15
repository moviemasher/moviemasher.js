import type { SvgFilter, SvgFilters, SvgItem, SvgItems } from '@moviemasher/runtime-client'
import type { NumberRecord, Point, Rect, RectOptions, Size, StringRecord } from '@moviemasher/runtime-shared'

import { LockHeight, LockNone, LockWidth, NamespaceSvg, assertDefined, assertPoint, assertPopulatedString, assertSizeAboveZero, assertTrue, colorCurrent, idGenerateString, isPoint, isPositive, isSize, pointValueString, rectTransformAttribute, sizeAboveZero, sizeCopy } from '@moviemasher/lib-shared'
import { POINT_ZERO, isArray, isPopulatedString } from '@moviemasher/runtime-shared'

let PatchSvgElement: SVGSVGElement
let SupportsSvgLoad = false

export const PatchSvgInitialize = (): SVGSVGElement => {
  const { document } = globalThis
  assertDefined(document)
  
  const element = svgSvgElement()
  element.setAttribute('style', 'display:none')

  const elements = document.getElementsByTagName('body')
  const body = elements.item(0)
  assertTrue(!!body, 'body')

  if (body) body.appendChild(element)
  return element
}

export const svgPatch = (value?: SVGSVGElement): SVGSVGElement => {
  console.trace('svgPatch', value)
  if (value) return PatchSvgElement = value
  
  return PatchSvgElement ||= PatchSvgInitialize()
}

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
  const points = rectPoints.map(point => pointValueString(point)).join(' ') 
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

export const svgSvgElement = (size?: Size, svgItems?: SvgItem | SvgItems): SVGSVGElement => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  svgSet(element, '1.1', 'version')
  svgSet(element, NamespaceSvg, 'xmlns')

  svgAppend(element, svgItems)
  if (!sizeAboveZero(size)) return element

  svgSetBox(element, size)
  return element
}


export const svgImageElement = () => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'image')
  svgSet(element, 'none', 'preserveAspectRatio')
  return element
}

export const svgPathElement = (path: string, fill = colorCurrent) => {
  const element = globalThis.document.createElementNS(NamespaceSvg, 'path')
  svgSet(element, path, 'd')
  svgSet(element, fill, 'fill')
  return element
}

export const svgMaskElement = (size?: Size, contentItem?: SvgItem, luminance?: boolean): SVGMaskElement => {
  const id = idGenerateString()
  const element = globalThis.document.createElementNS(NamespaceSvg, 'mask')
  svgSet(element, id)
  if (sizeAboveZero(size)) {

    // svgSetDimensions(maskElement, size)
    const color = luminance ? 'black' : 'none'
    svgAppend(element, svgPolygonElement(size, '', color))
  }
  
  if (contentItem) {
    const maskUrl = svgUrl(id)
    svgSet(contentItem, maskUrl, 'mask')
    svgSet(contentItem, maskUrl, 'fill')
    if (luminance) svgSet(contentItem, 'luminance', 'mask-mode')
  }
  return element
}


export const svgClipPathElement = (size?: Size, contentItem?: SvgItem): SVGClipPathElement => {
  const id = idGenerateString()
  const element = globalThis.document.createElementNS(NamespaceSvg, 'clipPath')
  svgSet(element, id)
  if (sizeAboveZero(size)) {

    // svgSetDimensions(maskElement, size)
    // const color = luminance ? 'black' : 'none'
    // svgAppend(element, svgPolygonElement(size, '', color))
  }
  svgSet(element, 'userSpaceOnUse', 'clipPathUnits')

  if (contentItem) {
    svgSet(contentItem, svgUrl(id), 'clip-path')
    // svgSet(contentItem, maskUrl, 'fill')
    // if (luminance) svgSet(contentItem, 'luminance', 'mask-mode')
  }
  return element
}


export const svgFilter = (values: StringRecord, dimensions?: any): SvgFilter => {
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
  const filter = svgFilterElement([image, differenceFilter], filtered, POINT_ZERO)

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


export const svgSetTransformRects = (element: SvgItem, dimensions: Rect | Size, rect: Rect) => {
  svgSetTransform(element, rectTransformAttribute(dimensions, rect))
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

export const svgImagePromise = (url: string, dontPatch?: boolean): Promise<SVGImageElement> => {
  const patch = !(dontPatch || SupportsSvgLoad)
  return new Promise<SVGImageElement>((resolve, reject) => {
    const element = svgImageElement()
    const completed = () => {
      element.removeEventListener('error', failed)
      element.removeEventListener('load', passed)
      if (patch) svgPatch().removeChild(element) 
    }
    const failed = (error: any) => {
      completed()
      reject(error)
    }

    const passed = () => {
      completed()
      resolve(element)
    }

    element.addEventListener('error', failed, { once: true })
    element.addEventListener('load', passed, { once: true })
    if (patch) svgPatch().appendChild(element)
    
    svgSet(element, url, 'href')
  })
}

export const svgText = (string: string, family: string, size: number, transform: string, color?: string) => {
  const svgItem = globalThis.document.createElementNS(NamespaceSvg, 'text')
  svgSet(svgItem, family, 'font-family')
  svgSet(svgItem, String(size), 'font-size')
  svgSet(svgItem, color, 'fill')

  svgItem.append(string)
  svgSetTransform(svgItem, transform)
  return svgItem
}

export const svgImagePromiseWithOptions = (url:string, options: RectOptions): Promise<SVGImageElement> => {
  return svgImagePromise(url).then(element => {
    const { shortest, lock = LockNone, ...rect } = options
    assertSizeAboveZero(rect)
    const svgRect: NumberRecord = { ...rect }

    switch (lock) {
      case LockHeight: {
        svgRect.height = -1 
        break
      }
      case LockWidth: {
        svgRect.width = -1
        break
      }
      case LockNone: {
        svgSet(element, 'none', 'preserveAspectRatio')
        break
      }
      default: {
        assertPopulatedString(shortest, 'shortest')
        svgRect[shortest] = -1
        break
      }
    }
    // console.debug('svgImagePromiseWithOptions', { url, options, svgRect })
    svgSetDimensions(element, svgRect)
    return element
  })
}

// test for support for load events from svg images
(() => {
  const { document } = globalThis
  if (document) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d')
    if (context) {
      context.fillRect(0, 0, 1, 1)
      svgImagePromise(canvas.toDataURL(), true).then(() => {
        SupportsSvgLoad = true
      })
    }
  }
})()


