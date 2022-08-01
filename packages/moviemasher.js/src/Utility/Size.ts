import { assertAboveZero, isNumber, isObject } from "./Is"
import { throwError } from "./Throw";

export interface Size {
  width: number;
  height: number;
}

export const isSize = (value: any): value is Size => {
  return isObject(value) && isNumber(value.width) && isNumber(value.height) 
}
export function assertSize(value: any, name?: string): asserts value is Size {
  if (!isSize(value)) throwError(value, 'Size', name)
}


export const sizesEqual = (dimensions: Size, dimensionsEnd?: any) => {
  if (!isSize(dimensionsEnd)) return false

  return dimensions.width === dimensionsEnd.width && dimensions.height === dimensionsEnd.height
}


export type Sizes = Size[]
export type SizeTuple = [Size, Size]
export const SizeZero = { width: 0, height: 0 }
export const dimensionEven = (dimension: number): number => (
  2 * Math.max(1, Math.round(dimension / 2)) 
  // Math.max(2, Math.round(dimension)) 
)

export const dimensionsEven = (dimensions: Size): Size => {
  const { width, height } = dimensions
  return { width: dimensionEven(width), height: dimensionEven(height) }
}

export const dimensionsScale = (dimensions: Size, horizontally: number, vertically: number): Size => {
  const { width, height } = dimensions
  return { width: width * horizontally, height: height * vertically }
}


export const sizeCover = (inDimensions: Size, outDimensions: Size): Size => {
  const { width: loadedWidth, height: loadedHeight } = inDimensions
  assertAboveZero(loadedWidth)
  assertAboveZero(loadedHeight)
  const { width, height } = outDimensions 
  const scaleWidth = width / loadedWidth
  const scaleHeight = height / loadedHeight


  if (scaleWidth > scaleHeight) return dimensionsEven({ ...outDimensions, height: loadedHeight * scaleWidth }) 
  

  return dimensionsEven({ ...outDimensions, width: loadedWidth * scaleHeight })
}



export const DimensionsOutput: Size = { width: 1920, height: 1080 }

export const DimensionsPreview = dimensionsScale(DimensionsOutput, 0.25, 0.25)