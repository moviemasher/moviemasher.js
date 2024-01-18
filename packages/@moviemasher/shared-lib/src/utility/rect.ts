import type { Point, PointTuple, PropertySize, Rect, RectTuple, Rounding, SideDirectionRecord, Size, SizeTuple } from '../types.js'

import { CEIL, COMMA, EQUALS, HEIGHT, POINT_ZERO, SEMICOLON, WIDTH, errorThrow, roundWithMethod } from '../runtime.js'
import { assertNumber, assertSize, isAboveZero, isPoint, isRect, isSize } from './guards.js'

export const rectsEqual = (rect: Rect, rectEnd: any): boolean => {
  if (!isRect(rectEnd))
    return false

  return pointsEqual(rect, rectEnd) && sizesEqual(rect, rectEnd)
}

export const rectFromSize = (size: Size, point?: Point): Rect => {
  const definedPoint = point || POINT_ZERO
  const { width, height } = size
  return {
    x: definedPoint.x, y: definedPoint.y, width, height,
  }
}

export const rectsFromSizes = (sizes: SizeTuple, points?: PointTuple): RectTuple => {
  const definedPoints = points || [POINT_ZERO, POINT_ZERO]
  const [size, sizeEnd] = sizes
  const [point, pointEnd] = definedPoints
  return [rectFromSize(size, point), rectFromSize(sizeEnd, pointEnd)]
}

export const rectCopy = (rect: any) => {
  return { ...pointCopy(rect), ...sizeCopy(rect) }
}

export const rectRound = (rect: Rect): Rect => {
  return { ...sizeRound(rect), ...pointRound(rect) }
}

export const centerPoint = (size: Size, inSize: Size): Point => {
  return {
    x: Math.round((size.width - inSize.width) / 2),
    y: Math.round((size.height - inSize.height) / 2)
  }
}

export const rectString = (dimensions: any): string => {
  const bits: string[] = []
  if (isSize(dimensions))
    bits.push(sizeString(dimensions))
  if (isPoint(dimensions))
    bits.push(pointString(dimensions))
  return bits.join(SEMICOLON)
}

export const rectTransformAttribute = (dimensions: Rect | Size, rect: Rect): string => {
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

export const sizesEqual = (size: Size, sizeEnd?: any) => {
  if (!isSize(sizeEnd))
    return false

  return size.width === sizeEnd.width && size.height === sizeEnd.height
}

export const sizedEven = (number: number, rounding?: Rounding): number => {

  return 2 * Math.max(1, roundWithMethod(number / 2, rounding))
}

export const sizeEven = (size: Size, rounding?: Rounding): Size => {
  const { width, height } = size
  return {
    ...size,
    width: sizedEven(width, rounding), height: sizedEven(height, rounding)
  }
}

const sizeRound = (point: Size): Size => {
  const { width, height } = point
  return { width: Math.round(width), height: Math.round(height) }
}

const sizeCeil = (size: Size): Size => {
  const { width, height } = size
  return sizeMin({ width: Math.ceil(width), height: Math.ceil(height) })
}

export const MIN_DIMENSION = 2
const sizeMin = (size: Size): Size => {
  return {
    width: Math.max(MIN_DIMENSION, size.width),
    height: Math.max(MIN_DIMENSION, size.height),
  }
}

export const sizeScale = (size: Size, horizontally: number | Size, vertically: number): Size => {
  const h = isSize(horizontally) ? horizontally.width : horizontally
  const v = isSize(horizontally) ? horizontally.height : vertically
  assertNumber(v, 'sizeScale.vertically')
  return { width: size.width * h, height: size.height * v }
}

export const pointScale = (point: Point, horizontally: number | Point, vertically?: number): Point => {
  const h = isPoint(horizontally) ? horizontally.x : horizontally
  const v = isPoint(horizontally) ? horizontally.y : vertically
  assertNumber(v, 'pointScale.vertically')
  return { x: point.x * h, y: point.y * v }
}

export const sizeCover = (inSize: Size, outSize: Size, contain = false): Size => {
  assertSizeAboveZero(inSize, 'sizeCover.inSize')
  assertSize(outSize, 'sizeCover.outSize')
  
  const resultSize = sizeCopy(outSize)
  const { width: inWidth, height: inHeight } = inSize
  const { width: outWidth, height: outHeight } = outSize
  const scaleWidth = outWidth / inWidth
  const scaleHeight = outHeight / inHeight

  const useWidth = contain ? scaleWidth < scaleHeight : scaleWidth > scaleHeight
  if (useWidth) resultSize.height = inHeight * scaleWidth
  else resultSize.width = inWidth * scaleHeight
  return sizeCeil(resultSize)
}

export const sizeContain = (inSize: Size, outSize: Size | number): Size => {
  const size = isSize(outSize) ? outSize : { width: outSize, height: outSize }
  return sizeCover(inSize, size, true)
}

export const sizeAboveZero = (size: any): size is Size => {
  if (!isSize(size)) return false

  const { width, height } = size
  return isAboveZero(width) && isAboveZero(height)
}

export function assertSizeAboveZero(size: any, name?: string): asserts size is Size {
  if (!sizeAboveZero(size))
    errorThrow(size, 'SizeAboveZero', name)
}

export const sizeCopy = (size: any) => {
  const { width = 0, height = 0 } = size
  return { width, height }
}

export const sizeString = (size: Size) => {
  const { width, height } = size
  return [
    [WIDTH, width].join(EQUALS), [HEIGHT, height].join(EQUALS)
  ].join(SEMICOLON)
}

export const sizeFromElement = (element: Element): Size => {
  const size = {
    width: Number(element.getAttribute(WIDTH)),
    height: Number(element.getAttribute(HEIGHT))
  }
  assertSizeAboveZero(size, 'sizeFromElement')
  return size
}

export const sizeSvgD = (size: Size): string => {
  const { width, height } = size
  return rectSvgD({ x: 0, y: 0, width, height })
}

const rectSvgD = (rect: Rect): string => {
  const { x, y, width, height } = rect
  const x2 = x + width
  const y2 = y + height
  return `M${x},${y}L${x2},${y}L${x2},${y2}L${x},${y2}Z`
}

export const sizeAspect = (aspectWidth: number, aspectHeight: number, shortest: number): Size => {
  const shortestKey = aspectHeight > aspectWidth ? WIDTH : HEIGHT
  const longestKey = shortestKey === WIDTH ? HEIGHT : WIDTH
  const max = Math.max(aspectWidth, aspectHeight)
  const min = Math.min(aspectWidth, aspectHeight)
  const ratio = max / min
  const size: Size = { width: 0, height: 0 }
  size[shortestKey] = shortest
  size[longestKey] = shortest * ratio
  return size
}

export const sizeFlip = (size: any): any => {
  const { width, height } = size
  return { width: height, height: width }
}



export const sizeLock = (size: any, propertySize?: PropertySize): any => {
  if (!propertySize) return size

  const copy = sizeCopy(size)
  copy[propertySize === WIDTH ? HEIGHT : WIDTH] = copy[propertySize]
  return copy
}


export const pointAboveZero = (point: any): point is Point => {
  if (!isPoint(point)) return false

  const { x, y } = point
  return isAboveZero(x) && isAboveZero(y)
}

export const pointsEqual = (point: Point, pointEnd?: any) => {
  if (!isPoint(pointEnd)) return false

  return point.x === pointEnd.x && point.y === pointEnd.y
}

export const pointCopy = (point: any) => {
  const { x = 0, y = 0 } = point
  return { x, y }
}

export const pointRound = (point: Point, rounding?: Rounding): Point => {
  const { x, y } = point
  return { x: roundWithMethod(x, rounding), y: roundWithMethod(y, rounding) }
}

export const pointString = (point: Point): string => {
  const { x, y } = point
  return [
    ['x', x].join(EQUALS), ['y', y].join(EQUALS)
  ].join(SEMICOLON)
}

export const pointValueString = (point: Point): string => {
  const { x, y } = point
  return [x, y].join(COMMA)
}

export const pointNegate = (point: Point): Point => {
  const { x, y } = point
  return { x: -x, y: -y }
}

export const pointFlip = (point: any): any => {
  const { x, y } = point
  return { x: y, y: x }
}

export const sideDirectionRecordFlip = (sideDirections: SideDirectionRecord): SideDirectionRecord => {
  const { top, bottom, left, right } = sideDirections
  return {
    top: left,
    bottom: right,
    left: top,
    right: bottom
  }
}

export const pointTranslate = (point: Point, translate: Point, negate = false): Point => {
  const { x, y } = point
  const negator = negate ? -1 : 1
  const { x: tx, y: ty } = translate
  return { x: x + tx * negator, y: y + ty * negator }
}
