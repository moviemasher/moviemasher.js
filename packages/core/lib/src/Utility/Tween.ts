import { NumberRecord, PopulatedString, Scalar, Value } from "../Types/Core"
import { Point, pointsEqual, PointTuple } from "./Point"
import { assertRect, isRect, Rect, RectTuple } from "./Rect"
import { assertSize, sizeCeil, sizeScale, isSize, Size, sizeCover, sizesEqual, SizeTuple, sizeLock } from "./Size"
import { colorRgbaToHex, colorRgbToHex, colorToRgb, colorToRgba, colorValidHex } from "../Helpers/Color/ColorFunctions"
import { assertNumber, assertPopulatedString, assertPositive, assertString, assertTrue, isArray, isDefined, isNumber, isObject, isPopulatedString } from "./Is"
import { colorMixRbg, colorMixRbga } from "../Helpers/Color/ColorFunctions"
import { DirectionObject, Orientation } from "../Setup/Enums"
import { Tweenable } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { arrayOfNumbers } from "./Array"
import { assertTweenable } from "../Mixin/Tweenable/TweenableFunctions"

export interface Tweening {
  point?: boolean
  size?: boolean
  color?: boolean
  canColor?: boolean
}

export const tweenPad = (outputDistance: number, scaledDistance: number, scale: number, offE = false, offW = false): number => {
  assertPositive(scale)
  assertPositive(scaledDistance)

  const baseDistance = outputDistance - scaledDistance
  const east = offE ? scaledDistance  : 0 
  const west = offW ? scaledDistance : 0
  const distance = baseDistance + east + west
  const scaled = distance * scale
  const x = scaled - east
  return x
}

export const tweenNumberStep = (number: number, numberEnd: number, frame: number, frames: number): number => {
  const unit = (numberEnd - number) / frames
  return number + (unit * frame)
}

export const tweenColorStep = (value: PopulatedString, valueEnd: PopulatedString, frame: number, frames: number): string => {
  assertString(value)
  assertString(valueEnd)
  const offset = frame / frames
  assertTrue(colorValidHex(value), 'hex color')
  if (value.length === 7 || value.length === 4) {
    const result = colorRgbToHex(colorMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset))
    return result
  }
  return colorRgbaToHex(colorMixRbga(colorToRgba(value), colorToRgba(valueEnd), offset))
}

export const tweenRectStep = (rect: Rect, rectEnd: Rect, frame: number, frames: number): Rect => {
  return {
    x: tweenNumberStep(rect.x, rectEnd.x, frame, frames),
    y: tweenNumberStep(rect.y, rectEnd.y, frame, frames),
    width: tweenNumberStep(rect.width, rectEnd.width, frame, frames),
    height: tweenNumberStep(rect.height, rectEnd.height, frame, frames),
  }
}

export const tweenColors = (color: Scalar, colorEnd: Scalar, frames: number): string[] => {
  assertPopulatedString(color)
  const colors:string[] = [color]
  if (isPopulatedString(colorEnd) && frames > 1) {
    arrayOfNumbers(frames - 1, 1).forEach(frame => {
      colors.push(tweenColorStep(color, colorEnd, frame, frames))
    })
  }
  return colors
}


export const tweenRects = (rect: Rect, rectEnd: Rect | undefined, frames: number): Rect[] => {
  const rects = [rect]
  if (rectEnd && frames > 1) {
    arrayOfNumbers(frames - 1, 1).forEach(frame => {
      rects.push(tweenRectStep(rect, rectEnd, frame, frames))
    })
  }
  return rects
}

export const tweenMaxSize = (size: Size, sizeEnd?: any): Size => {
  const { width, height } = size
  if (!isSize(sizeEnd) || sizesEqual(size, sizeEnd)) return { width, height }

  return {
    width: Math.max(width, sizeEnd.width),
    height: Math.max(height, sizeEnd.height),
  }
}

export const tweenMinSize = (size: Size, sizeEnd?: any): Size => {
  const { width, height } = size
  if (!isSize(sizeEnd) || sizesEqual(size, sizeEnd)) return { width, height }
  return {
    width: Math.min(width, sizeEnd.width),
    height: Math.min(height, sizeEnd.height),
  }
}

export const tweenOption = (optionStart: Scalar, optionEnd: Scalar, pos: string, round?: boolean): Value => {
  assertNumber(optionStart)
  const start = round ? Math.round(optionStart) : optionStart
  if (!isNumber(optionEnd)) return start

  const end = round ? Math.round(optionEnd) : optionEnd
  if (start === end) return start
 
  // const nCased = pos.includes('n') ? 'n' : 'N'
  return  `(${start}+(${end - start}*${pos}))` // `(${start}+(${nCased} * 10))` //
}

export const tweenableRects = (rect: Rect, rectEnd?: Rect): rectEnd is Rect => {
  if (!isRect(rectEnd)) return false

  if (rect.x !== rectEnd.x) return true
  if (rect.y !== rectEnd.y) return true
  if (rect.width !== rectEnd.width) return true
  if (rect.height !== rectEnd.height) return true

  return false
}

export const tweenPosition = (videoRate: number, duration: number, frame = 'n') => (
  `(${frame}/${videoRate * duration})`
)

export const tweenNumberObject = (object: any): NumberRecord => {
  if (!isObject(object)) return {}
  const entries = Object.entries(object).filter(([_, value]) => isNumber(value)) 
  return Object.fromEntries(entries) as NumberRecord
}

export const tweenOverRect = (rect: Rect, rectEnd?: any): Rect => {
  return  { ...rect, ...tweenNumberObject(rectEnd) }
}

export const tweenOverPoint = (point: Point, pointEnd: any): Point => {
  return { ...point, ...tweenNumberObject(pointEnd) }
}

export const tweenOverSize = (point: Size, pointEnd: any): Size => {
  if (!isDefined(pointEnd)) return point

  return { ...point, ...tweenNumberObject(pointEnd) }
}

export const tweenScaleSizeToRect = (size: Size | any, rect: Rect | any, offDirections: DirectionObject = {}): Rect => {
  assertSize(size)
  assertRect(rect)
  const { width: outWidth, height: outHeight } = size
  const { x, y, width, height } = rect
  assertPositive(x)
  assertPositive(y)
  assertPositive(width)
  assertPositive(height)

  const scaledSize = sizeScale(size, width, height)
  const evenSize = sizeCeil(scaledSize)
  const result = {
    ...evenSize,
    x: Math.round(tweenPad(outWidth, evenSize.width, x, offDirections.E, offDirections.W)), 
    y: Math.round(tweenPad(outHeight, evenSize.height, y, offDirections.N, offDirections.S))
  }
  return result
}

export const tweenCoverSizes = (inSize: Size, outSize: Size | SizeTuple, scales: SizeTuple): SizeTuple => {
  const outSizes = isArray(outSize) ? outSize : [outSize, outSize]
  const [rect, rectEnd] = outSizes
  const unscaledSize = sizeCover(inSize, rect)
  const unscaledSizeEnd = sizeCover(inSize, rectEnd)
  const [scale, scaleEnd] = scales
  const { width, height } = scale
  const { width: widthEnd, height: heightEnd } = scaleEnd
  const scaledSize = sizeScale(unscaledSize, width, height)
  const scaledSizeEnd = sizeScale(unscaledSizeEnd, widthEnd, heightEnd)
  const coverSize = sizeCeil(scaledSize)
  const coverSizeEnd = sizeCeil(scaledSizeEnd)
  const coverRects: SizeTuple = [coverSize, coverSizeEnd]
  return coverRects
}

export const tweenCoverPoints = (scaledSizes: SizeTuple, outSize: Size | SizeTuple, scales: PointTuple): PointTuple => {
  const outSizes = isArray(outSize) ? outSize : [outSize, outSize]
  const [coverSize, coverSizeEnd] = scaledSizes
  const [rect, rectEnd] = outSizes
  const [scale, scaleEnd] = scales
  const { x, y } = scale
  const { x: xEnd, y: yEnd } = scaleEnd
  const point: Point = {
    x: x * (coverSize.width - rect.width),
    y: y * (coverSize.height - rect.height),
  }
  const pointEnd: Point = {
    x: xEnd * (coverSizeEnd.width - rectEnd.width),
    y: yEnd * (coverSizeEnd.height - rectEnd.height),
  }
  return [point, pointEnd]
}

export const tweenRectLock = (rect: Rect, lock?: Orientation): Rect => ({
  ...rect, ...sizeLock(rect, lock)
})

export const tweenRectsLock = (rects: RectTuple, lock?: Orientation): RectTuple => {
  return rects.map(rect => tweenRectLock(rect, lock)) as RectTuple
}

export const tweenScaleSizeRatioLock = (scale: Rect, outputSize: Size, inRatio: number, lock?: Orientation | string): Rect => {
  if (!lock) return scale

  const { width: outWidth, height: outHeight } = outputSize
  const forcedScale = { ...scale }
  switch(lock){
    case Orientation.H:
      forcedScale.width = ((outHeight * forcedScale.height) * inRatio) / outWidth
      break
    case Orientation.V:
      forcedScale.height = ((outWidth * forcedScale.width) / inRatio) / outHeight
      break
  }
  return forcedScale
}

export const tweeningPoints = (tweenable?: Tweenable): boolean => {
  assertTweenable(tweenable)
  const { clip } = tweenable
  const { track } = clip
  const { mash } = track
  const { quantize } = mash
  const timeRange = clip.timeRange(quantize)
  const tweenPoints = tweenable.tweenPoints(timeRange, timeRange)
  return !pointsEqual(...tweenPoints)
}

export const tweenMinMax = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

export const tweenInputTime = (timeRange: TimeRange, onEdge?: boolean, nearStart?: boolean, endDefined?: boolean, endSelected?: boolean): Time | undefined => {
  if (!endDefined) return

  if (!onEdge) return nearStart ? timeRange.startTime : timeRange.lastTime 

  if (endSelected) {
    if (nearStart) return timeRange.lastTime 
  } else if (!nearStart) return timeRange.startTime

}
