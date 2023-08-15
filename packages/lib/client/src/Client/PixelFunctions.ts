import { roundWithMethod } from '@moviemasher/lib-shared'

export const pixelToFrame = (pixels: number, perFrame : number, rounding = 'round'): number => {
  if (!(pixels && perFrame)) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}


