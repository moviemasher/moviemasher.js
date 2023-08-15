import type { Lock, NumberRecord, Point, PopulatedString, PropertySize, Rect, Rects, Scalar, SideDirectionRecord, Size, Value } from '@moviemasher/runtime-shared'

import { isDefined, isNumber, isObject, isPopulatedString } from '@moviemasher/runtime-shared'
import { AspectFlip, LockHeight, LockLongest, LockNone, LockShortest, LockWidth } from '../../../Setup/LockConstants.js'
import { assertNumber, assertPopulatedString, assertPositive, assertString, assertTrue } from '../../SharedGuards.js'
import { arrayOfNumbers } from '../../../Utility/ArrayFunctions.js'
import { isRect, rectFromSize } from '../../../Utility/RectFunctions.js'
import { isSize, sizeCeil, sizeCopy, sizeCover, sizeFlip, sizeScale, sizesEqual } from '../../../Utility/SizeFunctions.js'
import { colorMixRbg, colorMixRbga, colorRgbToHex, colorRgbaToHex, colorToRgb, colorToRgba, colorValidHex } from '../../../Helpers/Color/ColorFunctions.js'
import { pointCopy, pointFlip } from '../../../Utility/PointFunctions.js'

export const tweenPad = (outputDistance: number, scaledDistance: number, scale: number, leftCrop = false, rightCrop = false): number => {
  assertPositive(scale)
  assertPositive(scaledDistance)

  const baseDistance = outputDistance - scaledDistance
  const east = leftCrop ? scaledDistance: 0 
  const west = rightCrop ? scaledDistance : 0
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

export const numberRecord = (object: any): NumberRecord => {
  if (!isObject(object)) return {}
  const entries = Object.entries(object).filter(([_, value]) => isNumber(value)) 
  return Object.fromEntries(entries) as NumberRecord
}

export const tweenOverRect = (rect: Rect, rectEnd?: any): Rect => {
  return  { ...rect, ...numberRecord(rectEnd) }
}

export const tweenOverSize = (point: Size, pointEnd: any): Size => {
  if (!isDefined(pointEnd)) return point

  return { ...point, ...numberRecord(pointEnd) }
}



export const tweenMinMax = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

const lockScaleSize = (scaleSize: Size, lock: Lock, shortest: PropertySize): Size => {
  if (lock === LockNone) return scaleSize

  const copy = sizeCopy(scaleSize)
  const longest = shortest === 'width' ? 'height' : 'width'
  switch (lock) {
    case LockHeight: {
      copy.width = copy.height
      break
    }
    case LockWidth: {
      copy.height = copy.width
      break
    }
    case LockShortest: {
      copy[longest] = copy[shortest]
      break
    }
    case LockLongest: {
      copy[shortest] = copy[longest]
      break
    }
  }
  return copy
}

// const tweenRectsLock = (rects: Rects, lock: Lock, shortest: PropertySize): Rects => {
//   return rects.map(tweenRect => ({
//     ...tweenRect, ...sizeLock(tweenRect, lock, shortest)
//   })) 
// }




const tweenCoverSize = (intrinsicSize: Size, containerSize: Size, scale: Size): Size => {
  // const [size, sizeEnd] = sizes
  // const [scale, scaleEnd] = scales
  const unscaledSize = sizeCover(intrinsicSize, containerSize)
  const { width, height } = scale
  const scaledSize = sizeScale(unscaledSize, width, height)
  return sizeCeil(scaledSize)

  // const coverSizes: Sizes = [coverSize]
  // if (sizeEnd && scaleEnd) {
  //   const unscaledSizeEnd = sizeCover(inSize, sizeEnd)
  //   const { width: widthEnd, height: heightEnd } = scaleEnd
  //   const scaledSizeEnd = sizeScale(unscaledSizeEnd, widthEnd, heightEnd)
  //   const coverSizeEnd = sizeCeil(scaledSizeEnd)
  //   coverSizes.push(coverSizeEnd)
  // }
  // return coverSizes
}
// const tweenCoverPoints = (scaledSizes: Sizes, outSizes: Sizes, scales: Points): Points => {
//   const [coverSize, coverSizeEnd] = scaledSizes
//   const [rect, rectEnd] = outSizes
//   const [scale, scaleEnd] = scales
//   const { x, y } = scale
//   const point: Point = {
//     x: x * (coverSize.width - rect.width),
//     y: y * (coverSize.height - rect.height),
//   }
//   const points: Points = [point]
//   if (scaleEnd && rectEnd && coverSizeEnd) {
//     const { x: xEnd, y: yEnd } = scaleEnd
//     const pointEnd: Point = {
//       x: xEnd * (coverSizeEnd.width - rectEnd.width),
//       y: yEnd * (coverSizeEnd.height - rectEnd.height),
//     }
//     points.push(pointEnd)
//   }

//   return points
// }

const tweenCoverPoint = (coverSize: Size, rect: Size, scale: Point): Point => {
  const { x, y } = scale
  const point: Point = {
    x: x * (coverSize.width - rect.width),
    y: y * (coverSize.height - rect.height),
  }
  return point
  
}

export const tweenRectsContent = (tweenRects: Rects, intrinsicRect: Rect, containerRects: Rects, lock: Lock, shortest: PropertySize) => {
  return tweenRects.map((tweenRect, index) => {
    const tweenPoint = pointCopy(tweenRect)
    const tweenSize = lockScaleSize(tweenRect, lock, shortest)
    const containerRect = containerRects[index]
    const size = tweenCoverSize(intrinsicRect, containerRect, tweenSize)
    const point = tweenCoverPoint(size, containerRect, tweenPoint)
    return rectFromSize(size, point)
  })
  
  // const locked = tweenRectsLock(tweenRects, lock, shortest) 
  // const coverSizes = tweenCoverSizes(intrinsicRect, rects, locked)
  // const [size, sizeEnd] = coverSizes 
  // const coverPoints = tweenCoverPoints(coverSizes, rects, locked)
  // const [point, pointEnd] = coverPoints
  // const rect = rectFromSize(size, point)
  // const rectEnd = rectFromSize(sizeEnd, pointEnd)
  // return [rect, rectEnd]
  
}

const tweenScaleSizeRatioLock = (scale: Size, previewSize: Size, inRatio: number, lock: Lock, flipped: boolean): Size => {
  if (lock === LockNone) return scale

  const { width: outWidth, height: outHeight } = previewSize

  const result = { ...scale }
  const forcedScale = { ...scale }
  forcedScale.width = ((outHeight * result.height) * inRatio) / outWidth
  forcedScale.height = ((outWidth * result.width) / inRatio) / outHeight

  switch(lock){
    case LockLongest: {
      if (flipped) result.width = forcedScale.width
      else result.height = forcedScale.height
      break
    }
    case LockShortest: {
      if (flipped) result.height = forcedScale.height
      else result.width = forcedScale.width 
      break
    }
    case LockHeight: {
      result.width = forcedScale.width
      break
    }
    case LockWidth: {
      result.height = forcedScale.height
      break
    }
  }
  return result
}

export const tweenScaleSizeToRect = (size: Size, scaleRect: Rect, directions: SideDirectionRecord = {}): Rect => {
  const { width: outWidth, height: outHeight } = size
  const { x, y, width, height } = scaleRect
  assertPositive(x)
  assertPositive(y)
  assertPositive(width)
  assertPositive(height)

  const scaledSize = sizeScale(size, width, height)
  const evenSize = sizeCeil(scaledSize)
  const result = {
    ...evenSize,
    x: Math.round(tweenPad(outWidth, evenSize.width, x, directions.left, directions.right)), 
    y: Math.round(tweenPad(outHeight, evenSize.height, y, directions.top, directions.bottom))
  }
  return result
}

const sideDirectionRecordFlip = (directions: SideDirectionRecord): SideDirectionRecord => {
  const { top, bottom, left, right } = directions
  return {
    top: left,
    bottom: right,
    left: top,
    right: bottom
  }
}

const tweenRectContainer = (tweenRect: Rect, intrinsicRect: Rect, lock: Lock, previewSize: Size, sideDirectionRecord: SideDirectionRecord, pointAspect: string, sizeAspect: String): Rect => {
  const portrait = previewSize.width < previewSize.height

  const flippedPoint = pointAspect === AspectFlip 
  const flippedSize = sizeAspect === AspectFlip

  const shortest = portrait ? 'width' : 'height'
  const tweenPoint = portrait && flippedPoint ? pointFlip(tweenRect) : pointCopy(tweenRect)
  const tweenSize = portrait && flippedSize ? sizeFlip(tweenRect) : sizeCopy(tweenRect)
  const directions = portrait && flippedPoint ? sideDirectionRecordFlip(sideDirectionRecord) : sideDirectionRecord
  
  lockScaleSize(tweenRect, lock, shortest)

  // previewSize is the space we want to position within
  // tweenRect properties represent a percentage of the previewSize

  
  // const scale = {
  //   ...tweenPoint, ...lockScaleSize(tweenRect, lock, shortest)
  // }

  const ratio = intrinsicRect.width / intrinsicRect.height
  const forcedScale = {
    ...tweenPoint, 
    ...tweenScaleSizeRatioLock(tweenSize, previewSize, ratio, lock, portrait && flippedSize)
  }

  // console.log('tweenScaleSizeToRect', intrinsicRect, forcedScale, directions)

  return tweenScaleSizeToRect(previewSize, forcedScale, directions)

}

export const tweenRectsContainer = (tweenRects: Rects, intrinsicRect: Rect, lock: Lock, previewSize: Size, directions: SideDirectionRecord, pointAspect: string, sizeAspect: String): Rects => {

  return tweenRects.map(tweenRect => 
    tweenRectContainer(tweenRect, intrinsicRect, lock, previewSize, directions, pointAspect, sizeAspect)
  )
}
  // tweenRect => {
  //   const tweenPoint = pointCopy(tweenRect)
  //   // previewSize is the space we want to position within
  //   // tweenRect properties represent a percentage of the previewSize

    
  //   const scale = {
  //     ...tweenPoint, ...lockScaleSize(tweenRect, lock, shortest)
  //   }

  //   const ratio = intrinsicRect.width / intrinsicRect.height
  //   const forcedScale = tweenScaleSizeRatioLock(scale, previewSize, ratio, lock)



  //   console.log('tweenScaleSizeToRect', intrinsicRect, forcedScale, sideDirectionRecord)

  //   return tweenScaleSizeToRect(intrinsicRect, forcedScale, sideDirectionRecord)

    
    // return tweenScaleSizeToRect(previewSize, scale, sideDirectionRecord)

        // console.log('tweenRectsContainer forcedScale', forcedScale, '= tweenScaleSizeRatioLock(', scale, previewSize, ratio, lock, ')')
    // return tweenScaleSizeToRect(previewSize, scale, sideDirectionRecord)

  // })

  // const rects: Rects = [transformedRect]

  // if (scaleRectEnd) {
  //   const forcedScaleEnd = tweenScaleSizeRatioLock(scaleRectEnd, intrinsicRect, ratio, lock)
  //   const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd)
  //   const tweened = tweenScaleSizeToRect(intrinsicRect, tweenRect, sideDirectionRecord)
  //   rects.push(tweened)
  // }
  // return rects
