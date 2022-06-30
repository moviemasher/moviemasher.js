import { NumberObject, Rect } from "../declarations";
import { assertAboveZero, assertDimensions, assertPositive, assertRect } from "../Utility/Is";

export interface Dimensions {
  width: number;
  height: number;
}

export const DimensionsDefault = { width: 1920, height: 1080 }

export const dimensionEven = (dimension: number): number => (
  2 * Math.round(dimension / 2)
)

export const dimensionsEven = (dimensions: Dimensions): Dimensions => {
  const { width, height } = dimensions
  return { width: dimensionEven(width), height: dimensionEven(height) }
}

export const dimensionsScale = (dimensions: Dimensions, horizontally: number, vertically: number): Dimensions => {
  const { width, height } = dimensions
  return { width: width * horizontally, height: height * vertically }
}

export const dimensionsRectTransform = (dimensions: Dimensions | any, rect: Rect | any): string => {
  assertDimensions(dimensions)
  assertRect(rect)
  const { width: outWidth, height: outHeight } = dimensions
  const { x, y, width, height } = rect
  const words: string[] = []
  const scaleWidth = width / outWidth 
  const scaleHeight = height / outHeight 
  if (!(x === 0 && y === 0)) {
    words.push(`translate(${x},${y})`)
  }
  if (!(scaleWidth === 1 && y === scaleHeight)) {
    words.push(`scale(${scaleWidth},${scaleHeight})`)
  }
  return words.join(' ')
}

export const dimensionPad = (outputWidth: number, scaleWidth: number, scaleX: number, constrainWidth = false): number => {
  assertPositive(scaleX)
  assertPositive(scaleWidth)
  const inWidth  = outputWidth * scaleWidth
  const negator = constrainWidth ? -1 : 1
  const nullifier = constrainWidth ? 0 : 1
  const scaling = outputWidth + (negator * inWidth)
  // console.log("dimensionPad scaling", scaling, "=", outputWidth, "+ (", negator, "*", inWidth, ")")

  const scaled = scaling * scaleX
  // console.log("dimensionPad scaled", scaled, "=", scaling, "*", scaleX)


  const offsetting = nullifier * inWidth
  // console.log("dimensionPad offsetting", offsetting, "=", nullifier, "*", inWidth)

  const result = scaled - offsetting
  // console.log("dimensionPad result", result, "=", scaled, "-", offsetting)
  return result
}

export const dimensionsTransformToRect = (dimensions: Dimensions | any, rect: Rect | any, constrainWidth = false, constrainHeight = false): Rect => {
  assertDimensions(dimensions)
  assertRect(rect)
  const { width: outWidth, height: outHeight } = dimensions
  const { x, y, width, height } = rect
  assertPositive(x)
  assertPositive(y)
  assertPositive(width)
  assertPositive(height)
  const scaledDimensions = dimensionsScale(dimensions, width, height)

  const result = {
    ...scaledDimensions,
    x: dimensionPad(outWidth, width, x, constrainWidth), 
    y: dimensionPad(outHeight, height, y, constrainHeight)
  }
  // console.log("dimensionsTransformToRect", result, "=", dimensions, "=>", rect)
  return result
}

export const dimensionsCover = (inDimensions: Dimensions, outDimensions: Dimensions): Dimensions => {
  const { width: loadedWidth, height: loadedHeight } = inDimensions
  assertAboveZero(loadedWidth)
  assertAboveZero(loadedHeight)
  const { width, height } = outDimensions 
  const scaleWidth = width / loadedWidth
  const scaleHeight = height / loadedHeight


  if (scaleWidth > scaleHeight) return dimensionsEven({ ...outDimensions, height: loadedHeight * scaleWidth }) 
  

  return dimensionsEven({ ...outDimensions, width: loadedWidth * scaleHeight })
}

