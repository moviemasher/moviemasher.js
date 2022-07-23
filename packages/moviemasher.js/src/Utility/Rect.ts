import { throwError } from "./Is";
import { isPoint, Point, pointsEqual, PointTuple, PointZero } from "./Point";
import { isSize, Size, sizesEqual, SizeTuple, SizeZero } from "./Size";

export interface Rect extends Size, Point { }
export const isRect = (value: any): value is Rect => {
  return isSize(value) && isPoint(value) 
}
export function assertRect(value: any, name?: string): asserts value is Rect {
  if (!isRect(value)) throwError(value, 'Rect', name)
}

export type Rects = Rect[]

export type RectTuple = [Rect, Rect]

export const rectsEqual = (rect: Rect, rectEnd: any): boolean => {
  if (!isRect(rectEnd)) return false

  return pointsEqual(rect, rectEnd) && sizesEqual(rect, rectEnd)
}

export const RectZero = { ...PointZero, ...SizeZero }
export const rectFromSize = (size: Size, point?: Point): Rect => {
  const definedPoint = point || PointZero
  return { 
    x: definedPoint.x, y: definedPoint.y,
    width: size.width, height: size.height, 
  }
}

export const rectsFromSizes = (sizes: SizeTuple, points?: PointTuple): RectTuple => {
  const definedPoints = points || [PointZero, PointZero]
  const [size, sizeEnd] = sizes
  const [point, pointEnd] = definedPoints
  return [rectFromSize(size, point), rectFromSize(sizeEnd, pointEnd)]
}