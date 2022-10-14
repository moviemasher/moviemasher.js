import { Rgba, Value, Pixels, Rgb, Yuv } from "../declarations"
import { Point } from "../Utility/Point"
import { Size } from "./Size"
import { colorRgbaKeys, colorRgbaTransparent, colorRgbKeys, colorRgbToYuv, colorYuvBlend, colorYuvDifference } from "./Color"
import { isPositive } from "./Is"
import { roundWithMethod } from "./Round"

const pixelFromPoint = (pt : Point, width : number) => pt.y * width + pt.x

const pixelToPoint = (index : number, width : number) : Point => (
  { x: index % width, y: Math.floor(index / width) }
)

const pixelToIndex = (pixel : number) => pixel * 4

export const pixelRgbaAtIndex = (index : number, pixels : Pixels) : Rgba => (
  {
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2],
    a: pixels[index + 3],
  }
)

const pixelRgba = (pixel : number, data : Pixels) => pixelRgbaAtIndex(pixelToIndex(pixel), data)

const pixelSafe = (pixel : number, offsetPoint: Point, size : Size) => {
  const { x, y } = offsetPoint
  const { width, height } = size
  const pt = pixelToPoint(pixel, width)
  pt.x = Math.max(0, Math.min(width - 1, pt.x + x))
  pt.y = Math.max(0, Math.min(height - 1, pt.y + y))
  return pixelFromPoint(pt, width)
}

const pixelNeighboringPixels = (pixel : number, size : Size) : number[] => {
  const depth = 3
  const pixels: number[] = []
  const halfSize = Math.floor(depth / 2)
  for (let y = 0; y < depth; y += 1) {
    for (let x = 0; x < depth; x += 1) {
      const offsetPoint = { x: x - halfSize, y: y - halfSize }
      pixels.push(pixelSafe(pixel, offsetPoint, size))
    }
  }
  return pixels
}

export const pixelNeighboringRgbas = (pixel : number, data : Pixels, size : Size) : Rgba[] => (
  pixelNeighboringPixels(pixel, size).map(p => pixelRgba(p, data))
)

export const pixelColor = (value : Value) : string => {
  const string = String(value)
  if (string.slice(0, 2) === "0x") return `#${string.slice(2)}`

  return string
}

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

export const pixelToFrame = (pixels: number, perFrame : number, rounding = 'round'): number => {
  if (!(pixels && perFrame)) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}


export function pixelsMixRbga(fromRgba: Rgba, toRgba: Rgba, amountToMix = 1.0): Rgba {
  return Object.fromEntries(colorRgbaKeys.map(key => {
    return [key, Math.round((fromRgba[key] * amountToMix) + (toRgba[key] * (1 - amountToMix)))]
  })) as Rgba
}
export function pixelsMixRbg(fromRgb: Rgb, toRgb: Rgb, amountToMix = 1.0): Rgb {
  return Object.fromEntries(colorRgbKeys.map(key => {
    return [key, Math.round((fromRgb[key] * (1 - amountToMix)) + (toRgb[key] * amountToMix))]
  })) as Rgb
}

export const pixelsRemoveRgba = (pixels: Uint8ClampedArray, size: Size, rgb: Rgb, similarity = 0, blend = 0, accurate = false) => {
  pixelsReplaceRgba(pixels, size, rgb, colorRgbaTransparent, similarity, blend)
}
export const pixelsReplaceRgba = (pixels: Uint8ClampedArray, size: Size, find: Rgb, replace: Rgba, similarity = 0, blend = 0, accurate = false) => {
  const yuv = colorRgbToYuv(find)
  let index = pixels.length / 4
  while (index--) {
    const pixels_offset = index * 4
    const rgbaAtIndex = pixelRgbaAtIndex(pixels_offset, pixels)
    if (isPositive(rgbaAtIndex.a)) {

      const rgbaAsYuv = colorRgbToYuv(rgbaAtIndex)
      const difference = accurate ? colorYuvBlend(yuvsFromPixelsAccurate(pixels, index, size), yuv, similarity, blend) : colorYuvDifference(rgbaAsYuv, yuv, similarity, blend)
      const mixed = pixelsMixRbga(rgbaAtIndex, replace, difference)
      pixels[pixels_offset + 3] = mixed.a
      if (mixed.a) {
        pixels[pixels_offset] = mixed.r
        pixels[pixels_offset + 1] = mixed.g
        pixels[pixels_offset + 2] = mixed.b
      }
    }
  }
}


const yuvsFromPixelsAccurate = (pixels: Pixels, index: number, size: Size): Yuv[] => {
  // console.log(this.constructor.name, "yuvsFromPixelsAccurate")
  return pixelNeighboringRgbas(index * 4, pixels, size).map(rgb => colorRgbToYuv(rgb))

}
