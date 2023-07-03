import type { Lock, Size, Rect } from '@moviemasher/runtime-shared'

import { isNumber, isObject, errorThrow } from '@moviemasher/runtime-shared'

import { isAboveZero } from '../Shared/SharedGuards.js'
import { EqualsChar, SemicolonChar } from '../Setup/Constants.js'
import { LockHeight, LockWidth, LockNone } from '../Setup/LockConstants.js'



export const isSize = (value: any): value is Size => {
  return isObject(value) &&
    'width' in value && 'height' in value &&
    isNumber(value.width) && isNumber(value.height)
}
export function assertSize(value: any, name?: string): asserts value is Size {
  if (!isSize(value))
    errorThrow(value, 'Size', name)
}

export const sizesEqual = (size: Size, sizeEnd?: any) => {
  if (!isSize(sizeEnd))
    return false

  return size.width === sizeEnd.width && size.height === sizeEnd.height
}


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
  if (!isSize(size))
    return false

  const { width, height } = size
  return isAboveZero(width) && isAboveZero(height)
}
export function assertSizeAboveZero(size: any, name?: string): asserts size is Size {
  if (!sizeAboveZero(size))
    errorThrow(size, 'SizeAboveZero', name)
}

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
    if (lock === LockHeight)
      locked.height = -1
    else
      locked.width = -1
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

