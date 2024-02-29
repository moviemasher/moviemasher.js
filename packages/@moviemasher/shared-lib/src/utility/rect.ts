import type { EvaluationPoint, EvaluationPoints, EvaluationSize, EvaluationSizes, EvaluationValue, Point, PointTuple, Rect, RectNotZero, RectTuple, Rects, Rounding, SideDirectionRecord, Size, SizeKey, NonZeroSize, SizeTuple, Time, TimeRange, Aspect, StringRecord } from '../types.js'

import { $ADD, $DIVIDE, $GT, $IF, $MAX, $MULTIPLY, $SUBTRACT, $CEIL, $FLIP, $FLOOR, $HEIGHT, $MAINTAIN, $NUMBER, $WIDTH, $X, $Y, COMMA, EQUALS, POINT_ZERO, SEMICOLON, assertTuple, errorThrow } from '../runtime.js'
import { Eval, } from './evaluation.js'
import { assertDefined, isPoint, isRect, isSize } from './guards.js'
import { isAboveZero, isValue } from './guard.js'
import { offsetLength } from './time.js'

export const MIN_DIMENSION = 2

export const rectsEqual = (rect: Rect, rectEnd: any): boolean => {
  if (!isRect(rectEnd))
    return false

  return pointsEqual(rect, rectEnd) && sizesEqual(rect, rectEnd)
}

export const sizeNotZero = (size: any): size is NonZeroSize => {
  if (!isSize(size)) return false

  const { width, height } = size
  return isAboveZero(width) && isAboveZero(height)
}

export function assertSizeNotZero(size: any, name?: string): asserts size is NonZeroSize {
  if (!sizeNotZero(size)) errorThrow(size, 'NonZeroSize', name)
}

export function assertRectNotZero(size: any, name?: string): asserts size is RectNotZero {
  if (!sizeNotZero(size)) errorThrow(size, 'RectNotZero', name)
}

export const rectTransformAttribute = (dimensions: Rect | Size, rect: Rect): string => {
  assertSizeNotZero(dimensions, 'dimensions')
  assertRectNotZero(rect, 'rect')

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

export const sizesEqual = <T=number>(size: Size<T>, sizeEnd?: Size<T>): boolean => {
  if (!isSize(sizeEnd)) return false

  return size.width === sizeEnd.width && size.height === sizeEnd.height
}

/** @returns false when size is larger than FFmpeg can render. */
export const sizeValid = (size: Size): boolean => {
  if (!sizeNotZero(size)) return false

  const { width, height } = size
  return width <= 16384 && height <= 16384
}

export const coverSize = (inSize: Size, outSize: Size, contain = false): Size => {
  return numberSize(coverEvaluationSize(inSize, outSize, contain))
  // assertSizeNotZero(inSize, 'coverSize.inSize')
  // assertSize(outSize, 'coverSize.outSize')
  
  // const ratioSize = {
  //   width: outSize.width / inSize.width,
  //   height: outSize.height / inSize.height
  // }

  // const gt = contain ? ratioSize.width < ratioSize.height : ratioSize.width > ratioSize.height

  // const scaledSize = {
  //   width: inSize.width * ratioSize.height,
  //   height: inSize.height * ratioSize.width
  // }

  // const ifSize = {
  //   width: gt ? outSize.width : scaledSize.width,
  //   height: gt ? scaledSize.height : outSize.height
  // }
  // const minSize = minimumSize(ifSize)
  // return minSize
}

export const containSize = (inSize: Size, outSize: Size | number): Size => {
  const size = isSize(outSize) ? outSize : { width: outSize, height: outSize }
  return coverSize(inSize, size, true)
}

export const sizeString = (size: Size) => {
  const { width, height } = size
  return [
    [$WIDTH, width].join(EQUALS), [$HEIGHT, height].join(EQUALS)
  ].join(SEMICOLON)
}

export const sizeFromElement = (element: Element): Size => {
  const size = {
    width: Number(element.getAttribute($WIDTH)),
    height: Number(element.getAttribute($HEIGHT))
  }
  assertSizeNotZero(size, 'sizeFromElement')
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

export const pointsEqual = (point: Point, pointEnd?: any) => {
  if (!isPoint(pointEnd)) return false

  return point.x === pointEnd.x && point.y === pointEnd.y
}

export const copySize = <T=number>(from: Size<T>, to?: Size<T>): Size<T> => {
  const strip = (size: Size<T>): Size<T> => {
    const { width, height } = size
    return { width, height }
  }
  const copy = (size: Size<T>, copy: Size<T>): Size<T> => {
    copy.width = size.width
    copy.height = size.height
    return copy
  }
  return to ? copy(from, to) : strip(from)
}

export const copyPoint = <T=number>(from: Point<T>, to?: Point<T>):Point<T> => {
  const strip = (point: Point<T>): Point<T> => {
    const { x, y } = point
    return { x, y }
  }
  const copy = (point: Point<T>, copy: Point<T>): Point<T> => {
    copy.x = point.x
    copy.y = point.y
    return copy
  }
  return to ? copy(from, to) : strip(from)
}

export const centerPoint = (size: Size, inSize: Size): Point => {
  return {
    x: Math.round((size.width - inSize.width) / 2),
    y: Math.round((size.height - inSize.height) / 2)
  }
}



export const copyRect = <T=number>(from: Rect<T>, to?: Rect<T>): Rect<T> => {
  if (to) {
    copyPoint(from, to)
    copySize(from, to)
    return to
  }
  return { ...copyPoint(from), ...copySize(from) }
}

export const evenSize = (size: Size, rounding: Rounding): Size => {
  return numberSize(evenEvaluationSize(size, rounding))
  // const evened = (number: number, rounding: Rounding): number => {
  //   return 2 * Math.max(1, roundWithMethod(number / 2, rounding))
  // }
  // return {
  //   width: evened(size.width, rounding), 
  //   height: evened(size.height, rounding)
  // }
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

export const flipPoint = <T=number>(point: Point<T>): Point<T>=> {
  return { x: point.y, y: point.x } 
}

const flipDirections = (cropDirections: SideDirectionRecord): SideDirectionRecord => {
  const { top, bottom, left, right } = cropDirections
  return {
    top: left,
    bottom: right,
    left: top,
    right: bottom
  }
}

export const translatePoint = (point: Point, translate: Point, negate = false): Point => {
  return numberPoint(translateEvaluationPoint(point, translate, negate))
  // const { x, y } = point
  // const negator = negate ? -1 : 1
  // const { x: tx, y: ty } = translate
  // return { x: x + tx * negator, y: y + ty * negator }
}

export const flipSize = <T=number>(size: Size<T>): Size<T> => {
  const { width, height } = size
  return { width: height, height: width }
}

const lockSize = <T=number>(size: Size<T>, sizeKey?: SizeKey): Size<T> => {
  if (!sizeKey) return size

  const copy = copySize(size)
  const otherPropertySize = sizeKey === $WIDTH ? $HEIGHT : $WIDTH

  copy[otherPropertySize] = copy[sizeKey]
  return copy
}

const unionRect = (startRect: Rect, endRect: Rect): Rect => {
  const topLeftPoint = {  
    x: Math.min(startRect.x, endRect.x),
    y: Math.min(startRect.y, endRect.y)
  }
  const botRightPoint = { 
    x: Math.max(startRect.x + startRect.width, endRect.x + endRect.width),
    y: Math.max(startRect.y + startRect.height, endRect.y + endRect.height)
  }
  return { 
    ...roundPoint(topLeftPoint, $FLOOR), 
    ...evenSize({
      width: botRightPoint.x - topLeftPoint.x, 
      height: botRightPoint.y - topLeftPoint.y 
    }, $CEIL)
  }
}

export const unionRects = (...rects: Rects): Rect => {
  const rect = rects.shift()
  assertDefined(rect, 'unionRects.rect')
  return rects.reduce((union, rect) => unionRect(union, rect), rect)
}


export const unionRectsToSize = (containerRects: RectTuple, outputSize: Size): Rect => {
  const [startRect, endRect] = containerRects
  const union = unionRect(startRect, endRect)
  return unionRect(union, { ...POINT_ZERO, ...outputSize })
}

export const containerEvaluationPoint = (tweenPoint: EvaluationPoint, containerSize: EvaluationSize, outputSize: Size, pointAspect: Aspect, cropDirections: SideDirectionRecord, rounding: Rounding): EvaluationPoint => {
  const padEvaluation = (inDistance: EvaluationValue, outDistance: EvaluationValue, scale: EvaluationValue, startCrop?: boolean, endCrop?: boolean): EvaluationValue => {
    const different = String(inDistance) !== String(outDistance)

    const outMinusIn = different ? Eval($SUBTRACT, [outDistance, inDistance], 'baseSpace') : 0
    const eastAdded = startCrop ? Eval($ADD, [outMinusIn, outDistance], 'baseMinusSpace') : outMinusIn
    const westAdded = endCrop ? Eval($ADD, [eastAdded, outDistance],'travelSpace') : eastAdded
    const scaled = Eval($MULTIPLY, [westAdded, scale], 'location')
    const offsetByEast = startCrop ? Eval($SUBTRACT, [scaled, outDistance], 'offsetLocation') : scaled
    return offsetByEast
  }
  const directions = orientDirections(outputSize, pointAspect, cropDirections)
  const flippedPoint = orientPoint(tweenPoint, outputSize, pointAspect)
  const { left, right, top, bottom } = directions
  const outputWidth = Eval($NUMBER, [outputSize.width], 'outputWidth')
  const outputHeight = Eval($NUMBER, [outputSize.height], 'outputHeight')
  
  const paddedPoint: EvaluationPoint = {
    x: padEvaluation(containerSize.width, outputWidth, flippedPoint.x, left, right), 
    y: padEvaluation(containerSize.height, outputHeight, flippedPoint.y, top, bottom)
  }
  const roundedPoint = roundEvaluationPoint(paddedPoint, rounding)
  return roundedPoint
}

export const containerPoints = (tweenPoints: PointTuple, containerSizes: SizeTuple, outputSize: Size, pointAspect: Aspect, cropDirections: SideDirectionRecord, rounding: Rounding): PointTuple => {
  const points = tweenPoints.map((tweenPoint, index) => {
    const containerSize = containerSizes[index]
    const point = containerEvaluationPoint(tweenPoint, containerSize, outputSize, pointAspect, cropDirections, rounding)
    return numberPoint(point)
  }) 
  assertTuple<Point>(points)

  return points 
}

export const containerEvaluationSize =  (tweenSize: Size, intrinsicSize: Size, outputSize: Size, sizeAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): EvaluationSize => {
  const flippedEvaluationSize = orientEvaluationSize(tweenSize, intrinsicSize, outputSize, sizeAspect, sizeKey)
  const scaledEvaluationSize = scaleEvaluationSize(outputSize, flippedEvaluationSize.width, flippedEvaluationSize.height, rounding)
  const evenedEvaluationSize = evenEvaluationSize(scaledEvaluationSize, rounding)
  return evenedEvaluationSize
}

export const descriptionValue = (value: EvaluationValue): string => {
  return isValue(value) ? String(value) : value.description
}

const descriptionSize = (size: EvaluationSize): StringRecord => {
  return {
    width: descriptionValue(size.width),
    height: descriptionValue(size.height)
  }
}
const logDescription = (record: StringRecord, prefix?: string): void => {
  Object.entries(record).forEach(([key, value]) => {
    const label = prefix ? `${prefix} ${key}` : key
    console.log(label.padStart(10, '-').padEnd(20, '-'))
    console.log(value)
  })
}

const containerSize = (tweenSize: Size, intrinsicSize: Size, outputSize: Size, sizeAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): Size => {
  const valueSize = containerEvaluationSize(tweenSize, intrinsicSize, outputSize, sizeAspect, rounding, sizeKey)
  // logDescription(descriptionSize(valueSize))
  const size = numberSize(valueSize)
  // console.log('containerSize', { tweenSize, intrinsicSize, outputSize, sizeAspect, rounding, sizeKey, size })
  return size
}

export const containerSizes = (tweenSizes: SizeTuple, intrinsicSize: Size, outputSize: Size, sizeAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): SizeTuple => {
  const sizes = tweenSizes.map(tweenSize => {
    return containerSize(tweenSize, intrinsicSize, outputSize, sizeAspect, rounding, sizeKey)
  })
  assertTuple<Size>(sizes)

  return sizes
}

export const contentEvaluationSize = (tweenSize: EvaluationSize, intrinsicSize: Size, containerSize: EvaluationSize, outputSize: Size, sizeAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): EvaluationSize => {
  const outputtingPortrait = outputSize.width < outputSize.height
  const sizeFlipping = outputtingPortrait && sizeAspect === $FLIP
  const flippedSize = sizeFlipping ? flipSize(tweenSize) : copySize(tweenSize)
  const orientedTweenSize = lockSize(flippedSize, sizeKey)
  // const orientedTweenSize = orientEvaluationSize(tweenSize, intrinsicSize, outputSize, sizeAspect, sizeKey)
  const scaledSize = scaleContentEvaluationSize(intrinsicSize, containerSize, orientedTweenSize, rounding)
  return scaledSize 
}

/** Returns scaled inSize to just fit within outSize. */
export const coverEvaluationSize = (inSize: EvaluationSize, outSize: EvaluationSize, contain?: boolean): EvaluationSize => {
  const ratioSize = {
    width: Eval($DIVIDE, [outSize.width, inSize.width], 'widthRatio'),
    height: Eval($DIVIDE, [outSize.height, inSize.height], 'heightRatio')
  }
  const contained = contain ? flipSize(ratioSize) : ratioSize
  const gt = Eval($GT, [contained.width, contained.height], contain ? 'portrait' : 'landscape')
  const scaledSize = {
    width: Eval($MULTIPLY, [inSize.width, ratioSize.height], 'widthScaled'),
    height: Eval($MULTIPLY, [inSize.height, ratioSize.width], 'heightScaled')
  }
  const ifSize = {
    width: Eval($IF, [gt, outSize.width, scaledSize.width], 'widthConditional'),
    height: Eval($IF, [gt, scaledSize.height, outSize.height], 'heightConditional'),
  }
  const minSize = minimumEvaluationSize(ifSize)
  return minSize
}

const contentPoint = (tweenRect: Rect, intrinsicSize: Size, containerRect: Rect, outputSize: Size, sizeAspect: Aspect, pointAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): Point => {
  const containerSize = copySize(containerRect)
  const containerPoint = copyPoint(containerRect)
  const outputtingPortrait = outputSize.width < outputSize.height
  const sizeFlipping = outputtingPortrait && sizeAspect === $FLIP
  const tweenSize = copySize(tweenRect)
  const flippedSize = sizeFlipping ? flipSize(tweenSize) : copySize(tweenSize)
  const orientedTweenSize = lockSize(flippedSize, sizeKey)

  // const orientedTweenSize = lockSize(tweenRect, sizeKey) 
  // const orientedTweenSize = orientEvaluationSize(tweenRect, intrinsicSize, outputSize, sizeAspect, sizeKey)
  const tweenPoint = orientPoint(tweenRect, outputSize, pointAspect)
  const scaledEvaluationSize = scaleContentEvaluationSize(intrinsicSize, containerSize, orientedTweenSize, rounding)
  const contentEvaluationPoint = scaleContentEvaluationPoint(scaledEvaluationSize, containerSize, tweenPoint, rounding)
  const translatedEvaluationPoint = translateEvaluationPoint(containerPoint, contentEvaluationPoint) 
  const translatedPoint = numberPoint(translatedEvaluationPoint)
  return translatedPoint
}

export const contentPoints = (tweenRects: RectTuple, intrinsicSize: Size, containerRects: RectTuple, outputSize: Size, sizeAspect: Aspect, pointAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): PointTuple => {
  const points = tweenRects.map((tweenRect, index) => {
    const containerRect = containerRects[index]
    return contentPoint(tweenRect, intrinsicSize, containerRect, outputSize, sizeAspect, pointAspect, rounding, sizeKey)
  }) 
  assertTuple<Point>(points)

  return points
}

export const contentSizes = (tweenSizes: SizeTuple, intrinsicSize: Size, containerSizes: SizeTuple, outputSize: Size, sizeAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): SizeTuple => {
  const sizes = tweenSizes.map((tweenSize, index) => {
    const containerSize = containerSizes[index]
    const size = contentEvaluationSize(tweenSize, intrinsicSize, containerSize, outputSize, sizeAspect, rounding, sizeKey)
    return numberSize(size)
  })
  assertTuple<Size>(sizes)

  return sizes
}

export const orientPoint = <T=number>(tweenPoint: Point<T>, outputSize: Size, pointAspect: Aspect): Point<T> => {
  const outputtingPortrait = outputSize.width < outputSize.height
  const pointFlipping = outputtingPortrait && pointAspect === $FLIP 
  const flippedPoint = pointFlipping ? flipPoint(tweenPoint) : copyPoint(tweenPoint)
  return flippedPoint
}

export const orientDirections = (outputSize: Size, pointAspect: Aspect, cropDirections: SideDirectionRecord): SideDirectionRecord => {
  const outputtingPortrait = outputSize.width < outputSize.height
  const pointFlipping = outputtingPortrait && pointAspect === $FLIP 
  const directions = pointFlipping ? flipDirections(cropDirections) : cropDirections
  return directions
}

export const roundPoint = (point: Point, rounding: Rounding): Point => {
  return numberPoint(roundEvaluationPoint(point, rounding))
  // const { x, y } = point
  // return { x: roundWithMethod(x, rounding), y: roundWithMethod(y, rounding) }
}

const tweenNumberStep = (number: number, numberEnd: number, frame: number, frames: number): number => {
  const unit = (numberEnd - number) / frames
  const result = number + (unit * frame)
  // console.log('tweenNumberStep', { number, numberEnd, frame, frames, unit, result })
  return result
}

export const tweenNumber = (value: number, valueEnd: number, time: Time, range: TimeRange): number => {
  const [offset, lengthSeconds] = offsetLength(time, range)
  return tweenNumberStep(value, valueEnd, offset, lengthSeconds)
}

/** Round size to the nearest even dimensions */
export const evenEvaluationSize = (size: EvaluationSize, rounding: Rounding): EvaluationSize => {
  const evenEvaluation = (name: string, number: EvaluationValue, rounding: Rounding): EvaluationValue => {
    const divided = Eval($DIVIDE, [number, 2], `${name}Divided`)
    const rounded = Eval(rounding, [divided], `${name}Rounded`)
    const maxed = Eval($MAX, [1, rounded], `${name}Maxed`)
    const multiplied = Eval($MULTIPLY, [2, maxed], `${name}Even`)
    // console.log('evenEvaluation', debugEvaluations({ number, divided, rounded, maxed, multiplied }))
    return multiplied
  }
  const evenSize = {
    width: evenEvaluation($WIDTH, size.width, rounding), 
    height: evenEvaluation($HEIGHT, size.height, rounding)
  }
  // console.log('evenEvaluationSize', debugObjects({ size, evenSize }))
  return evenSize
}

/** make sure size is at least 2x2 */ 
export const minimumEvaluationSize = (size: EvaluationSize): EvaluationSize => {
  const { width, height } = size
  const minDim = Eval($NUMBER, [MIN_DIMENSION], 'minDim')
  const minSize: EvaluationSize = {
    width: Eval($MAX, [minDim, width], 'minWidth'),
    height: Eval($MAX, [minDim, height], 'minHeight'),
  }
  return minSize
}

const orientEvaluationSize = (tweenSize: EvaluationSize, intrinsicSize: Size, outputSize: Size, sizeAspect: Aspect = $MAINTAIN, sizeKey?: SizeKey): EvaluationSize => {
  const outputtingPortrait = outputSize.width < outputSize.height
  const sizeFlipping = outputtingPortrait && sizeAspect === $FLIP
  const flippedSize = sizeFlipping ? flipSize(tweenSize) : copySize(tweenSize)
  if (sizeKey) {
    // // lock other side to same aspect ratio as intrinsic
    const otherKey = sizeKey === $WIDTH ? $HEIGHT : $WIDTH
    flippedSize[otherKey] = otherEvaluationDimension(sizeFlipping, tweenSize, intrinsicSize, outputSize, sizeKey)
  }
  return flippedSize 
}

const otherEvaluationDimension = (sizeFlipping: boolean, tweenSize: EvaluationSize, intrinsicSize: Size, outputSize: Size, sizeKey: SizeKey): EvaluationValue => {
  const flippedSize = sizeFlipping ? flipSize(tweenSize) : copySize(tweenSize)
  // lock other side to same aspect ratio as intrinsic
  // logDescription(descriptionSize(tweenSize), 'other')
  const otherKey = sizeKey === $WIDTH ? $HEIGHT : $WIDTH
  const otherPer = intrinsicSize[otherKey] / intrinsicSize[sizeKey]
  const outputDimension = Eval($MULTIPLY, [outputSize[sizeKey], flippedSize[sizeKey]])
  const lockDimension = Eval($MULTIPLY, [outputDimension, otherPer])
  const dimension = Eval($DIVIDE, [lockDimension, outputSize[otherKey]])
  return dimension
}

export const numberSize = (size: EvaluationSize): Size => {
  return { width: Number(size.width), height: Number(size.height) }
}

export const numberPoint = (point: EvaluationPoint): Point => {
  return { x: Number(point.x), y: Number(point.y) }
}

export const roundEvaluationPoint = (point: EvaluationPoint, rounding: Rounding): EvaluationPoint => {
  const roundedPoint = {
    x: Eval(rounding, [point.x]),
    y: Eval(rounding, [point.y])
  }
  return roundedPoint
}

export const scaleContentEvaluationPoint = (contentSize: EvaluationSize, containerSize: EvaluationSize, scalingPoint: Point | EvaluationPoint, rounding: Rounding): EvaluationPoint => {
  const availableSize = {
    width: Eval($SUBTRACT, [containerSize.width, contentSize.width]),
    height: Eval($SUBTRACT, [containerSize.height, contentSize.height]),
  }
  const invertedScalingPoint = {
    x: Eval($SUBTRACT, [1.0, scalingPoint.x]),
    y: Eval($SUBTRACT, [1.0, scalingPoint.y]),
  }
  const scaledPoint = {
    x: Eval($MULTIPLY, [invertedScalingPoint.x, availableSize.width]),
    y: Eval($MULTIPLY, [invertedScalingPoint.y,  availableSize.height]),
  }
  const roundedPoint = roundEvaluationPoint(scaledPoint, rounding)
  return roundedPoint
}

export const scaleContentEvaluationSize = (inSize: Size, outSize: EvaluationSize, size: EvaluationSize, rounding: Rounding): EvaluationSize => {
  const coveredSize = coverEvaluationSize(inSize, outSize)
  const scaledSize = scaleEvaluationSize(coveredSize, size.width, size.height, rounding)
  return scaledSize
}

export const scaleEvaluationSize = (size: EvaluationSize, horizontal: EvaluationValue, vertical: EvaluationValue, rounding: Rounding): EvaluationSize => {
  const scaledSize = {
    width: Eval($MULTIPLY, [size.width, horizontal], 'widthTimesScale'),
    height: Eval($MULTIPLY, [size.height, vertical], 'heightTimesScale')
  }
  const evenedSize = evenEvaluationSize(scaledSize, rounding) 
  return evenedSize
}

export const translateEvaluationPoint = (point: Point | EvaluationPoint, translate: Point | EvaluationPoint, negate = false): EvaluationPoint => {
  const negated = negate ? {
    x: Eval($MULTIPLY, [translate.x, -1], 'negatedX'),
    y: Eval($MULTIPLY, [translate.y, -1], 'negatedY'),
  } : translate 
  const added = { 
    x: Eval($ADD, [point.x, negated.x], 'translatedX'), 
    y: Eval($ADD, [point.y, negated.y], 'translatedY')
  }
  return added
}

export const tweenEvaluation = (name: string, start: EvaluationValue, end: EvaluationValue, pos: EvaluationValue): EvaluationValue => {
  if (String(start) === String(end)) {
    // console.log('tweenEvaluation start equals end', String(start), String(end))
    return start
  }
  const distance = Eval($SUBTRACT, [end, start], `${name}Distance`)
  const duration = Eval($MULTIPLY, [distance, pos], `${name}PositionDistance`)
  const startPlusDuration = Eval($ADD, [start, duration], `${name}Pixel`)
  return startPlusDuration
}

export const tweenEvaluationSize = (sizes: EvaluationSizes, position: EvaluationValue): EvaluationSize => {
  const [startSize, endSize] = sizes 
  const tweenSize = {
    width: tweenEvaluation($WIDTH, startSize.width, endSize.width, position),
    height: tweenEvaluation($HEIGHT, startSize.height, endSize.height, position),
  }
  return tweenSize
}

export const tweenEvaluationPoint = (points: EvaluationPoints, position: EvaluationValue): EvaluationPoint => {
  const [startPoint, endPoint] = points
  const tweenPoint = {
    x: tweenEvaluation($X, startPoint.x, endPoint.x, position),
    y: tweenEvaluation($Y, startPoint.y, endPoint.y, position),
  }
  return tweenPoint
}
