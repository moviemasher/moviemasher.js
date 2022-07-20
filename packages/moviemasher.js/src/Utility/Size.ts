import { assertAboveZero, assertPositive, isNumber, isObject, throwError } from "./Is"

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


export type Sizes = Size[]
export type SizeTuple = [Size, Size]

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

export const sizePad = (outputWidth: number, scaledWidth: number, scaleX: number, constrainX = false): number => {
  // console.log("dimensionPad", outputWidth, scaledWidth, scaleX, constrainX)
  assertPositive(scaleX)
  assertPositive(scaledWidth)
  const negator = constrainX ? -1 : 1
  const nullifier = constrainX ? 0 : -1
  const pad = negator * scaledWidth
  const distance = outputWidth + pad
  const start = nullifier * scaledWidth
  const scaled = distance * scaleX
  const x = start + scaled
  // console.log("dimensionPad", x, "=", "(", nullifier, "*", scaledWidth, "):start", "+", "(", "(", outputWidth, "+", "(", negator, "*", scaledWidth, "):pad", "):distance", "*", scaleX, "):scaled")
  return x
}

export const dimensionsCover = (inDimensions: Size, outDimensions: Size): Size => {
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