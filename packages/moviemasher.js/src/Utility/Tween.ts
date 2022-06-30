import { NumberObject, Point, PopulatedString, Rect, Scalar, Value } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { colorRgbaToHex, colorRgbToHex, colorToRgb, colorToRgba, colorValidHex } from "./Color"
import { assertNumber, assertPopulatedString, assertString, assertTrue, isDimensions, isNumber, isPoint, isPopulatedString, isRect } from "./Is"
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
    return colorRgbToHex(pixelsMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset))
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

export const tweenDimensionsTransform = (dimensions: Dimensions, dimensionsEnd: Dimensions | undefined): Dimensions => {
  if (!isDimensions(dimensionsEnd)) return { width: 1, height: 1 }

  return {
    width: dimensions.width / dimensionsEnd.width,
    height: dimensions.height / dimensionsEnd.height,
  }
}
export const tweenPointTransform = (point: Point, pointEnd: Point | undefined): Point => {
  if (!isPoint(pointEnd)) return { x: 0, y: 0 }

  return {
    x: pointEnd.x - point.x,
    y: pointEnd.y - point.y,
  }
}

export const tweenRectTransform = (rect: Rect, rectEnd: Rect | undefined): Rect => {
  if (!isRect(rectEnd)) return { x: 0, y: 0, width: 1, height: 1 }

  return { 
    ...tweenPointTransform(rect, rectEnd), 
    ...tweenDimensionsTransform(rect, rectEnd) 
  }
  
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

export const tweenOption = (option: Scalar, optionEnd: Scalar, pos = 'pos'): Value => {
  assertNumber(option)
  if (!isNumber(optionEnd) || option === optionEnd) return option

  return`(${option}+(${optionEnd - option}*${pos}))`
}

export const tweenableRects = (rect: Rect, rectEnd?: Rect): rectEnd is Rect => {
  if (!isRect(rectEnd)) return false

  if (rect.x !== rectEnd.x) return true
  if (rect.y !== rectEnd.y) return true
  if (rect.width !== rectEnd.width) return true
  if (rect.height !== rectEnd.height) return true

  return false
}