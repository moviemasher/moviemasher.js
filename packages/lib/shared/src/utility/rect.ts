import type { Point, PointTuple, Rect, Size, SizeTuple, RectTuple  } from '@moviemasher/runtime-shared'

import { COMMA, EQUALS, HEIGHT, POINT_ZERO, SEMICOLON, WIDTH, errorThrow } from '@moviemasher/runtime-shared'
import { assertSize, isAboveZero, isPoint, isSize } from "./guards.js"
import { isRect } from './guards.js'

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

export const sizeMax = (size: Size): Size => {
  const { width, height } = size
  const max = Math.max(width, height)
  return { width: max, height: max }
}

const sizedEven = (number: number): number => {
  return 2 * Math.max(1, Math.floor(number / 2))
}

export const sizeEven = (size: Size): Size => {
  const { width, height } = size
  return {
    width: sizedEven(width), height: sizedEven(height),
  }
}

export const sizeRound = (point: Size): Size => {
  const { width, height } = point
  return { width: Math.round(width), height: Math.round(height) }
}

export const sizeCeil = (size: Size): Size => {
  const { width, height } = size
  return {
    width: Math.max(2, Math.ceil(width)),
    height: Math.max(2, Math.ceil(height)),
  }
}

export const sizeFloor = (size: Size): Size => {
  const { width, height } = size
  return {
    width: Math.max(2, Math.floor(width)),
    height: Math.max(2, Math.floor(height)),
  }
}

export const sizeScale = (size: Size, horizontally: number, vertically: number): Size => {
  const { width, height } = size
  return { width: width * horizontally, height: height * vertically }
}

export const sizeCover = (inSize: Size, outSize: Size, contain = false): Size => {
  assertSizeAboveZero(inSize, 'sizeCover.inSize')
  assertSize(outSize, 'sizeCover.outSize')

  const { width: inWidth, height: inHeight } = inSize
  const { width, height } = outSize
  const scaleWidth = width / inWidth
  const scaleHeight = height / inHeight

  const useWidth = contain ? scaleWidth < scaleHeight : scaleWidth > scaleHeight
  if (useWidth) {
    return sizeCeil({ ...outSize, height: inHeight * scaleWidth })
  }

  return sizeCeil({ ...outSize, width: inWidth * scaleHeight })
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

export const sizeFlip = (size: Size): Size => {
  const { width, height } = size
  return { width: height, height: width }
}

export const sizeTranslate = (size: Size, translate: Size, negate = false): Size => {
  const { width, height } = size
  const negator = negate ? -1 : 1
  return {
    width: width + translate.width * negator,
    height: height + translate.height * negator
  }
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

export const pointCopy = (point: any): Point => {
  const { x, y } = point
  return { x, y }
}

export const pointRound = (point: Point): Point => {
  const { x, y } = point
  return { x: Math.round(x), y: Math.round(y) }
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

export const pointFlip = (point: Point): Point => {
  const { x, y } = point
  return { x: y, y: x }
}

export const pointTranslate = (point: Point, translate: Point, negate = false): Point => {
  const { x, y } = point
  const negator = negate ? -1 : 1
  const { x: tx, y: ty } = translate
  return { x: x + tx * negator, y: y + ty * negator }
}
