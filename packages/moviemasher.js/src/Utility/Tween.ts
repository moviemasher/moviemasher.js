import { NumberObject, PopulatedString, Scalar, Value } from "../declarations"
import { Point, pointsEqual, pointTransform } from "./Point"
import { assertRect, isRect, Rect } from "./Rect"
import { assertSize, sizePad, dimensionsEven, dimensionsScale, isSize, Size } from "./Size"
import { colorRgbaToHex, colorRgbToHex, colorToRgb, colorToRgba, colorValidHex } from "./Color"
import { assertNumber, assertPopulatedString, assertPositive, assertString, assertTrue, isDefined, isNumber, isObject, isPopulatedString } from "./Is"
import { pixelsMixRbg, pixelsMixRbga } from "./Pixel"

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
    const result = colorRgbToHex(pixelsMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset))
    return result
  }
  return colorRgbaToHex(pixelsMixRbga(colorToRgba(value), colorToRgba(valueEnd), offset))
}

const tweenRectStep = (rect: Rect, rectEnd: Rect, frame: number, frames: number): Rect => {
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
    for (let frame = 1; frame < frames; frame++) {
      colors.push(tweenColorStep(color, colorEnd, frame, frames))
    }
  }
  return colors
}

export const tweenDimensionsTransform = (dimensions: Size, dimensionsEnd: Size | undefined): Size => {
  if (!isSize(dimensionsEnd)) return { width: 1, height: 1 }

  return {
    width: dimensions.width / dimensionsEnd.width,
    height: dimensions.height / dimensionsEnd.height,
  }
}


export const tweenRectTransform = (rect: Rect, rectEnd: Rect | undefined): Rect => {
  if (!isRect(rectEnd)) return { x: 0, y: 0, width: 1, height: 1 }

  return { 
    ...pointTransform(rect, rectEnd), 
    ...tweenDimensionsTransform(rect, rectEnd) 
  }
}

export const tweenSizesEqual = (dimensions: Size, dimensionsEnd?: any) => {
  if (!isSize(dimensionsEnd)) return false

  return dimensions.width === dimensionsEnd.width && dimensions.height === dimensionsEnd.height
}
export const tweenRectsEqual = (rect: Rect, rectEnd?: any) => {
  return pointsEqual(rect, rectEnd) && tweenSizesEqual(rect, rectEnd)
}

export const tweenRects = (rect: Rect, rectEnd: Rect | undefined, frames: number): Rect[] => {
  const rects = [rect]
  if (rectEnd && frames > 1) {
    for (let frame = 1; frame < frames; frame++) {
      rects.push(tweenRectStep(rect, rectEnd, frame, frames))
    }
  }
  return rects
}

export const tweenMaxSize = (size: Size, sizeEnd?: any): Size => {
  const { width, height } = size
  if (!isSize(sizeEnd) || tweenSizesEqual(size, sizeEnd)) return { width, height }

  return {
    width: Math.max(width, sizeEnd.width),
    height: Math.max(height, sizeEnd.height),
  }
}

export const tweenMinSize = (size: Size, sizeEnd?: any): Size => {
  const { width, height } = size
  if (!isSize(sizeEnd) || tweenSizesEqual(size, sizeEnd)) return { width, height }
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
 
  const nCased = pos.includes('n') ? 'n' : 'N'
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

export const tweenNumberObject = (object: any): NumberObject => {
  if (!isObject(object)) return {}
  const entries = Object.entries(object).filter(([_, value]) => isNumber(value)) 
  return Object.fromEntries(entries) as NumberObject
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

export const tweenScaleSizeToRect = (size: Size | any, rect: Rect | any, constrainX = false, constrainY = false): Rect => {
  assertSize(size)
  assertRect(rect)
  const { width: outWidth, height: outHeight } = size
  const { x, y, width, height } = rect
  assertPositive(x)
  assertPositive(y)
  assertPositive(width)
  assertPositive(height)
  const scaledDimensions = dimensionsEven(dimensionsScale(size, width, height))
  const result = {
    ...scaledDimensions,
    x: Math.round(sizePad(outWidth, scaledDimensions.width, x, constrainX)), 
    y: Math.round(sizePad(outHeight, scaledDimensions.height, y, constrainY))
  }
  return result
}

export const tweenRectScale = (dimensions: Size | any, rect: Rect | any): string => {
  assertSize(dimensions)
  assertSize(rect)

  const { width: outWidth, height: outHeight } = dimensions
  const { width, height } = rect
  const words: string[] = []
  const scaleWidth = width / outWidth 
  const scaleHeight = height / outHeight 
  if (isRect(rect)) {
    const { x, y } = rect
    if (!(x === 0 && y === 0)) words.push(`translate(${x},${y})`)
  }
  if (!(scaleWidth === 1 && scaleHeight === 1)) {
    words.push(`scale(${scaleWidth},${scaleHeight})`)
  }
  return words.join(' ')
}
