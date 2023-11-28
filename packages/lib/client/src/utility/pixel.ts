import { roundWithMethod } from '@moviemasher/runtime-shared'

export const pixelPerFrame = (frames: number, width: number, zoom = 1): number => {
  if (!(frames && width)) return 0

  const widthFrames = width / frames

  const min = Math.min(1, widthFrames)
  const max = Math.max(1, widthFrames)
  if (zoom === 1) return max
  if (!zoom) return min

  return min + ((max - min) * zoom)
}

export const pixelFromFrame = (frame: number, perFrame : number, rounding = 'ceil'): number => {
  if (!(frame && perFrame)) return 0

  const pixels = frame * perFrame
  return roundWithMethod(pixels, rounding)
}

export const pixelToFrame = (pixels: number, perFrame: number, rounding = 'round'): number => {
  if (!(pixels && perFrame)) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}
