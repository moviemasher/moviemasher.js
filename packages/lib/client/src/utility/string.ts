import type { Rect } from '@moviemasher/runtime-shared'

import { assertObject, isAboveZero } from '@moviemasher/lib-shared'
import { isPopulatedString } from '@moviemasher/runtime-shared'
import { RECT_ZERO } from '@moviemasher/runtime-shared'


export const stringFamilySizeRect = (string: string, family: string, size: number): Rect => {
  if (!(isPopulatedString(string) && isAboveZero(size))) return RECT_ZERO

  const { document } = globalThis
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  assertObject(ctx, 'ctx')

  ctx.font = `${size}px ${family}`

  const metrics = ctx.measureText(string)

  // const font = new FontFace(family, string)
  const { 
    actualBoundingBoxAscent, 
    actualBoundingBoxDescent, 
    actualBoundingBoxLeft, 
    actualBoundingBoxRight, 
  } = metrics

  const rect = {
    x: actualBoundingBoxLeft, y: actualBoundingBoxAscent,
    width: actualBoundingBoxLeft + actualBoundingBoxRight,
    height: actualBoundingBoxAscent + actualBoundingBoxDescent,
  } 
  // console.log('stringFamilySizeRect', rect, ctx.textBaseline, metrics)
  return rect
}

export const stringPluralize = (count: number, value: string, suffix = 's'): string => {
  if (!isPopulatedString(value)) return value

  return `${count} ${value}${count === 1 ? '' : suffix}`
}
