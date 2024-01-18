import type { Rounding } from '@moviemasher/shared-lib/types.js'

import { CEIL, ROUND, roundWithMethod } from '@moviemasher/shared-lib/runtime.js'

const MIN_PIXELS_PER_FRAME = 5
export const pixelPerFrame = (frames: number, width: number, zoom = 1): number => {
  if (!(frames && width)) return 0

  const widthFrames = width / frames

  const min = Math.min(MIN_PIXELS_PER_FRAME, widthFrames)
  const max = Math.max(MIN_PIXELS_PER_FRAME, widthFrames)
  if (zoom === 1) return max
  if (!zoom) return min

  return min + ((max - min) * zoom)
}

export const pixelFromFrame = (frame: number, perFrame : number, rounding: Rounding = CEIL): number => {
  if (!(frame && perFrame)) return 0

  const pixels = frame * perFrame
  return roundWithMethod(pixels, rounding)
}

export const pixelToFrame = (pixels: number, perFrame: number, rounding: Rounding = ROUND): number => {
  if (!(pixels && perFrame)) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}
