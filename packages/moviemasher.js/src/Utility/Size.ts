import { assertAboveZero, isAboveZero, isNumber, isObject } from "./Is"
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


export const sizesEqual = (size: Size, sizeEnd?: any) => {
  if (!isSize(sizeEnd)) return false

  return size.width === sizeEnd.width && size.height === sizeEnd.height
}


export type Sizes = Size[]
export type SizeTuple = [Size, Size]
export const SizeZero = { width: 0, height: 0 }


export const sizeEven = (size: Size): Size => {
  const { width, height } = size
  return { 
    width: 2 * Math.max(1, Math.round(width / 2)) ,
    height: 2 * Math.max(1, Math.round(height / 2)),
  }
}

export const sizeScale = (size: Size, horizontally: number, vertically: number): Size => {
  const { width, height } = size
  return { width: width * horizontally, height: height * vertically }
}


export const sizeCover = (inDimensions: Size, outDimensions: Size): Size => {
  const { width: loadedWidth, height: loadedHeight } = inDimensions
  assertAboveZero(loadedWidth)
  assertAboveZero(loadedHeight)
  const { width, height } = outDimensions 
  const scaleWidth = width / loadedWidth
  const scaleHeight = height / loadedHeight

  if (scaleWidth > scaleHeight) return sizeEven({ ...outDimensions, height: loadedHeight * scaleWidth }) 
  

  return sizeEven({ ...outDimensions, width: loadedWidth * scaleHeight })
}

export const sizeAboveZero = (size: any): size is Size => { 
  if (!isSize(size)) return false

  const { width, height } = size
  return isAboveZero(width) && isAboveZero(height)
}
export function assertSizeAboveZero(size: any, name?: string): asserts size is Size {
  if (!sizeAboveZero(size)) throwError(size, 'SizeAboveZero', name)
}

export const SizeOutput: Size = { width: 1920, height: 1080 }

export const SizePreview = sizeScale(SizeOutput, 0.25, 0.25)

export const SizeIcon = sizeScale(SizePreview, 0.5, 0.5)