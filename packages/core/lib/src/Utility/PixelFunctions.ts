import { roundWithMethod } from './RoundFunctions.js'

export const pixelToFrame = (pixels: number, perFrame : number, rounding = 'round'): number => {
  if (!(pixels && perFrame)) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}


