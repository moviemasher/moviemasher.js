import type { Lock } from '../Setup/Enums.js'

import { isAboveZero, isNumber, isObject } from './Is.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { EqualsChar, SemicolonChar } from '../Setup/Constants.js'
import { LockHeight, LockWidth, LockNone } from '../Setup/Enums.js'

export interface Size {
  width: number
  height: number
}
export const isSize = (value: any): value is Size => {
  return isObject(value) && 
    'width' in value && 'height' in value &&
    isNumber(value.width) && isNumber(value.height) 
}
export function assertSize(value: any, name?: string): asserts value is Size {
  if (!isSize(value)) errorThrow(value, 'Size', name)
}


export const sizesEqual = (size: Size, sizeEnd?: any) => {
  if (!isSize(sizeEnd)) return false

  return size.width === sizeEnd.width && size.height === sizeEnd.height
}

export type Sizes = Size[]
export type SizeTuple = [Size, Size]
export const SizeZero = { width: 0, height: 0 }

export const sizedEven = (number: number): number => {
  return 2 * Math.max(1, Math.ceil(number / 2))
}

export const sizeEven = (size: Size): Size => {
  const { width, height } = size
  return { 
    width: sizedEven(width), height: sizedEven(height),
  }
}

export const sizeRound = (point: Size): Size => {
  const { width, height } = point
  return { width: Math.round(width), height: Math.round(height) } 
}

export const sizeCeil = (size: Size): Size => {
  const { width, height } = size
  return { 
    width: Math.max(2, Math.ceil(width)),
    height: Math.max(2, Math.ceil(height)),
  }
}

export const sizeFloor = (size: Size): Size => {
  const { width, height } = size
  return { 
    width: Math.max(2, Math.floor(width)),
    height: Math.max(2, Math.floor(height)),
  }
}
export const sizeScale = (size: Size, horizontally: number, vertically: number): Size => {
  const { width, height } = size
  return { width: width * horizontally, height: height * vertically }
}

export const sizeCover = (inSize: Size, outSize: Size, contain = false): Size => {
  assertSizeAboveZero(inSize, 'sizeCover.inSize')
  assertSize(outSize, 'sizeCover.outSize')

  const { width: inWidth, height: inHeight } = inSize
  const { width, height } = outSize 
  const scaleWidth = width / inWidth
  const scaleHeight = height / inHeight

  const useWidth = contain ? scaleWidth < scaleHeight : scaleWidth > scaleHeight
  if (useWidth) {
    return sizeCeil({ ...outSize, height: inHeight * scaleWidth }) 
  }
  
  return sizeCeil({ ...outSize, width: inWidth * scaleHeight })
}

export const sizeAboveZero = (size: any): size is Size => { 
  if (!isSize(size)) return false

  const { width, height } = size
  return isAboveZero(width) && isAboveZero(height)
}
export function assertSizeAboveZero(size: any, name?: string): asserts size is Size {
  if (!sizeAboveZero(size)) errorThrow(size, 'SizeAboveZero', name)
}

export const SizeOutput: Size = { width: 1920, height: 1080 }

export const SizePreview = sizeScale(SizeOutput, 0.25, 0.25)

export const SizeIcon = sizeScale(SizePreview, 0.5, 0.5)

export const sizeCopy = (size: any) => {
  const { width = 0, height = 0 } = size
  return { width, height }
}

export const sizeLock = (lockSize: Size, lock?: Lock): Size => {
  const copy = sizeCopy(lockSize)
  switch (lock) {
    case LockWidth: 
      copy.width = copy.height
      break
    case LockHeight:
      copy.height = copy.width
      break
  }
  return copy
}

export const sizeString = (size: Size) => {
  const { width, height } = size
  return [
    ['width', width].join(EqualsChar), ['height', height].join(EqualsChar)
  ].join(SemicolonChar)
}

export const sizeLockNegative = (size: Size, lock: Lock): Size => {
  assertSizeAboveZero(size, 'sizeLockNegative')
  const locked = sizeCopy(size)
  if (lock !== LockNone) {
    if (lock === LockHeight) locked.height = -1
    else locked.width = -1
  } 
  return locked
}

export const sizeFromElement = (element: Element): Size => {
  const size = { 
    width: Number(element.getAttribute('width')), 
    height: Number(element.getAttribute('height')) 
  }
  assertSizeAboveZero(size, 'sizeFromElement')
  return size
}