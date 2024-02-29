import type { MaybeComplexSvgItem, ComplexSvgItem, NumberRecord, Point, Rect, RectOptions, Scalar, Size, SvgFilters, SvgItem, SvgItems, SvgItemsRecord, Transparency, Value, MaybeComplexSvgItems, SvgStyleElement, SvgElement } from '../types.js'

import { $OPACITY, CURRENT_COLOR, $HEIGHT, MOVIE_MASHER, NAMESPACE_SVG, NAMESPACE_XLINK, $NONE, $SERVER, $SHORTEST, $WIDTH, arrayFromOneOrMore, idGenerateString, svgStringClean, MIME_SVG, $ALPHA } from '../runtime.js'
import { isPopulatedString } from './guard.js'
import { isArray } from './guard.js'
import { assertDefined, assertTrue, isComplexSvgItem, isPoint, isSize } from './guards.js'
import { isPositive } from './guard.js'
import { assertSizeNotZero, pointValueString, rectTransformAttribute, sizeNotZero, copySize } from './rect.js'


export const svgSet = <T extends Element = Element>(element: T, value: Value = '', name = 'id'): T => {
  if (isPopulatedString(value)) element.setAttribute(name, value)
  return element
}

export const svgSetDimensions = <T extends Element = Element>(element: T, dimensions: any): T => {
  if (isSize(dimensions)) {
    const { width, height } = dimensions
    if (isPositive(width)) svgSet(element, String(width), $WIDTH)
    if (isPositive(height)) svgSet(element, String(height), $HEIGHT)
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

export const svgAddClass = <T extends Element = Element>(element: T, className?: string | string[]): T => {
  if (!className) return element
  const array = isArray(className) ? className : className.split(' ')
  element.classList.add(...array)
  return element
}

export const svgPolygonElement = (dimensions: any, className?: string | string[], fill = '', id?: string): SVGPolygonElement => {
  const element = svgThing<SVGPolygonElement>('polygon') 
  const rectPoints = svgRectPoints(dimensions)
  const points = rectPoints.map(point => pointValueString(point)).join(' ') 
  svgSet(element, points, 'points')
  svgSet(element, fill, 'fill')
  svgAddClass(element, className)
  svgSet(element, id)
  return element
}

const svgThing = <T extends SVGElement = SVGElement>(name: string): T => (
  MOVIE_MASHER.window.document.createElementNS(NAMESPACE_SVG, name) as T
)

export const svgDefsElement = (svgItems?: SvgItems): SVGDefsElement => (
  svgAppend(svgThing<SVGDefsElement>('defs'), svgItems)
)

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
  assertSizeNotZero(boxSize, 'svgSetBox')

  const justSize = copySize(boxSize)
  const { width, height } = justSize
  svgSetDimensions(element, justSize)
  const viewBox = `0 0 ${width} ${height}`
  svgSet(element, viewBox, 'viewBox')
}

export const svgAppend = <T extends Element = Element>(element: T, items?: SvgItem | SvgItems): T => {
  if (items) {
    const kids = isArray(items) ? items : [items]
    kids.forEach(kid => element.appendChild(kid))
  }
  return element
}

export const svgSvgElement = (size?: Size, svgItems?: SvgItem | SvgItems): SvgElement => {
  const element = svgThing<SvgElement>('svg') 
  svgSet(element, NAMESPACE_SVG, 'xmlns')
  if (MOVIE_MASHER.context === $SERVER) {
    svgSet(element, '1.1', 'version')
    svgSet(element, NAMESPACE_XLINK, 'xmlns:xlink')
  }
  svgAppend(element, svgItems)
  if (!sizeNotZero(size)) return element

  svgSetBox(element, size)
  return element
}

export const svgGroupElement = (dimensions?: any, id = ''): SVGGElement => (
  svgSetDimensions(svgSet(svgThing<SVGGElement>('g'), id), dimensions)
)

export const svgViewElement = (dimensions?: any, id = ''): SVGViewElement => (
  svgSetDimensions(svgSet(svgThing<SVGViewElement>('view'), id), dimensions)
)

export const svgColorMatrix = (values: string): SVGFEColorMatrixElement => {
  const filterElement = svgThing<SVGFEColorMatrixElement>('feColorMatrix') 
  return svgSet(svgSet(filterElement, values, 'values'), 'matrix', 'type')
}

export const svgFilterElement = (filters?: SvgFilters, filtered?: SvgItem | SvgItems, id?: string): SVGFilterElement => {
  const filterElement = svgThing<SVGFilterElement>('filter') 
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
  const maskElement = svgThing<SVGMaskElement>('mask') 
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
  const element = svgThing<SVGClipPathElement>('clipPath') 
  svgSet(element, elementId)
  svgSet(element, 'userSpaceOnUse', 'clipPathUnits')
  if (contentItem) svgSet(contentItem, svgUrl(elementId), 'clip-path')
  return element
}

export const svgImageElement = (url: string = ''): SVGImageElement => {
  const element = svgThing<SVGImageElement>('image') 
  svgSet(element, $NONE, 'preserveAspectRatio')
  if (url) {
    const key = url.startsWith('file:') ? 'xlink:href' : 'href'
    svgSet(element, url, key)
  }
  return element
}


export const svgPathElement = (path: string, fill: string = CURRENT_COLOR): SVGPathElement => (
  svgSet(svgSet(svgThing<SVGPathElement>('path'), path, 'd'), fill, 'fill')
)

export const svgSetTransform = (element: SvgItem, transform?: string, origin = 'top left') => {
  if (transform) {
    svgSet(element, transform, 'transform')
    // svgSet(element, origin, 'transform-origin')
  }
  return element
}

export const svgSetTransformRects = (element: SvgItem, dimensions: Rect | Size, rect: Rect) => {
  const attribute = rectTransformAttribute(dimensions, rect)
  // if (isPoint(dimensions)) console.log('svgSetTransformRects', element.tagName, dimensions, rect, attribute)
  svgSetTransform(element, attribute)
}


export const svgPatternElement = (dimensions: Size, id: string, items?: SvgItem | SvgItems): SVGPatternElement => {
  const element = svgThing<SVGPatternElement>('pattern') 
  svgSet(element, id)
  svgSetDimensions(element, dimensions)
  svgAppend(element, items)
  return element
}

export const svgText = (string: Value, color?: string, size?: number, family?: string, transform?: string): SVGTextElement => {
  const svgItem = svgThing<SVGTextElement>('text') 
  svgSet(svgItem, family, 'font-family')
  svgSet(svgItem, color, 'fill')
  if (size) svgSet(svgItem, String(size), 'font-size')

  svgItem.append(String(string))
  svgSetTransform(svgItem, transform)
  return svgItem
}

export const svgStyle = (filename: string, family: string): SvgStyleElement => {
  const css = [
    `@font-face { font-family: ${family}; src: url('${filename}'); } `,
    `text { font-family: ${family}; }`
  ].join('')
  const element = svgThing<SvgStyleElement>('style') 
  element.append(css)
  return element
}

export const svgOpacity = <T extends SvgItem>(element: T, opacity?: Scalar): T => {
  if (!(isPositive(opacity) && opacity < 1)) return element

  return svgSet(element, String(opacity), $OPACITY)
}

export const svgSetRectOptions = <T extends Element = Element>(element: T, options?: RectOptions): T => {
  if (!options) return element

  const { shortest, lock = $NONE, ...rect } = options
  assertSizeNotZero(rect)
  const svgRect: NumberRecord = { ...rect }
  switch (lock) {
    case $HEIGHT: {
      svgRect.height = -1 
      break
    }
    case $WIDTH: {
      svgRect.width = -1
      break
    }
    case $NONE: {
      svgSet(element, $NONE, 'preserveAspectRatio')
      break
    }
    default: {
      assertDefined(shortest, $SHORTEST)
      svgRect[shortest] = -1
      break
    }
  }     
  return svgSetDimensions(element, svgRect)

}

export const svgImageWithOptions = (url:string, options?: RectOptions): SVGImageElement => {
  return svgSetRectOptions(svgImageElement(url), options)
}

export const svgImagePromise = (url: string, dontPatch?: boolean): Promise<SVGImageElement> => {
  const patch = !(dontPatch || MOVIE_MASHER.options.supportsSvgLoad) 
  return new Promise<SVGImageElement>((resolve, reject) => {
    const element = svgImageElement()
    const completed = () => {
      element.removeEventListener('error', failed)
      element.removeEventListener('load', passed)
      if (patch) patchSvg().removeChild(element) 
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
    if (patch) patchSvg().appendChild(element)
    
    svgSet(element, url, 'href')
  })
}

export const svgImagePromiseWithOptions = (url:string, options?: RectOptions): Promise<SVGImageElement> => {
  return svgImagePromise(url).then(element => {
    return svgSetRectOptions(element, options)
  })
}

const PatchSvgInitialize = (): SvgElement => {
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

export const patchSvg = (value?: SvgElement): SvgElement => {
  const { options } = MOVIE_MASHER
  // console.trace('svgPatch', value)
  if (value) return options.patchSvg = value
  
  return options.patchSvg ||= PatchSvgInitialize()
}

export const simplifyRecord = (record: SvgItemsRecord, size?: Size, element?: SvgElement): SvgItem => {
  const { defs, styles, items } = record
  const children: SvgItems = [...styles]
  if (defs.length) children.push(svgDefsElement(defs))
  children.push(...items)
  const svg = element ? element : svgSvgElement() 
  if (size) svgSetDimensions(svg, size)
  svgSetChildren(svg, children)

  return svg
}

export const simpleSvgItem = (item: MaybeComplexSvgItem): SvgItem => {
  return isComplexSvgItem(item) ? item.svgItem : item
}

export const simplifySvgItem = (item: MaybeComplexSvgItem | MaybeComplexSvgItems, size?: Size): SvgItem => {
  const items = arrayFromOneOrMore(item)
  if (items.length === 1) {
    const [first] = items
    if (!isComplexSvgItem(first)) return first
  }
  const record: SvgItemsRecord = { items: [], defs: [], styles: [] }
  items.forEach(item => appendSvgItemsRecord(record, item))
  return simplifyRecord(record, size)
}

export const mergeSvgItemsRecords = (...records: SvgItemsRecord[]) => {
  const result = records.shift()!
  records.forEach(record => {
    const { defs, styles, items } = record
    result.defs.push(...defs)
    result.styles.push(...styles)
    result.items.push(...items)
  })
  return result
}

export const appendSvgItemsRecord = (record: SvgItemsRecord, item: MaybeComplexSvgItem | MaybeComplexSvgItems, dontAddToItems?: boolean) => {
  const items = arrayFromOneOrMore(item)
  const svgItems = items.map(item => {
    const complexContainer = isComplexSvgItem(item) ? item : { svgItem: item }
    const { svgItem, defs = [], style } = complexContainer
    if (style) record.styles.push(style)
    record.defs.push(...defs)
    if (!dontAddToItems) record.items.push(svgItem) 
    return svgItem   
  })
  
  return svgItems[0]
}

export const complexifySvgItem = (svgItem: MaybeComplexSvgItem): ComplexSvgItem => {
  return isComplexSvgItem(svgItem) ? svgItem : { svgItem }
}

export const recordFromItems = (items: MaybeComplexSvgItems, dontAddToItems?: boolean): SvgItemsRecord => {
  const record: SvgItemsRecord = { items: [], defs: [], styles: [] }
  items.forEach(item => appendSvgItemsRecord(record, item, dontAddToItems))
  return record
}


export const simplifySvgItems = (first: MaybeComplexSvgItem, second: MaybeComplexSvgItem, size?: Size): SvgItem => {
  const record = recordFromItems([first, second])
  return simplifyRecord(record, size)
}

export const svgColorMask = (svgImage: Element, size: Size, transparency: Transparency = $ALPHA, className = '', rect?: Rect): SvgElement => {
  const defs: SvgItems = []
  const maskedElement =  svgPolygonElement(rect || size, className)
  const maskElement = svgMaskElement(maskedElement, transparency)   
  maskElement.appendChild(svgImage)

  defs.push(maskElement)
  return svgSvgElement(size, [svgDefsElement(defs), maskedElement])
}

export const svgStringElement = (svgString: string) => {
  const cleaned = svgStringClean(svgString)
  if (!cleaned) return

  const parser = new MOVIE_MASHER.window.DOMParser()
  const parsed = parser.parseFromString(cleaned, MIME_SVG)
  const firstChild = parsed.children[0]
  if (!firstChild) return

  return firstChild
}
