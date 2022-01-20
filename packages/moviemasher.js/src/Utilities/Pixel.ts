import { Point, Rgba, Value, Size, Pixels } from "../declarations"
import { roundWithMethod } from "./Round"

const pixelFromPoint = (pt : Point, width : number) => pt.y * width + pt.x

const pixelToPoint = (index : number, width : number) : Point => (
  { x: index % width, y: Math.floor(index / width) }
)

const pixelToIndex = (pixel : number) => pixel * 4

const pixelRgbaAtIndex = (index : number, pixels : Pixels) : Rgba => (
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
  const depth = 3 // should be 4, no?
  const pixels = []
  const halfSize = Math.floor(depth / 2)
  for (let y = 0; y < depth; y += 1) {
    for (let x = 0; x < depth; x += 1) {
      const offsetPoint = { x: x - halfSize, y: y - halfSize }
      pixels.push(pixelSafe(pixel, offsetPoint, size))
    }
  }
  return pixels
}

const pixelNeighboringRgbas = (pixel : number, data : Pixels, size : Size) : Rgba[] => (
  pixelNeighboringPixels(pixel, size).map(p => pixelRgba(p, data))
)

const pixelColor = (value : Value) : string => {
  const string = String(value)
  if (string.slice(0, 2) === "0x") return `#${string.slice(2)}`

  return string
}

const pixelPerFrame = (frames: number, width: number, zoom: number): number => {
  if (!(frames && width)) return 0

  const widthFrames = width / frames

  const min = Math.min(1, widthFrames)
  const max = Math.max(1, widthFrames)
  if (zoom === 1) return max
  if (!zoom) return min

  return min + ((max - min) * zoom)
}

const pixelFromFrame = (frame: number, perFrame : number, rounding = 'ceil'): number => {
  if (!(frame && perFrame)) return 0

  const pixels = frame * perFrame
  return roundWithMethod(pixels, rounding)
}

const pixelToFrame = (pixels: number, perFrame : number, rounding = 'round'): number => {
  if (!(pixels && perFrame)) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}

/**
 * @category Utility
 */
const Pixel = {
  color: pixelColor,
  fromFrame: pixelFromFrame,
  neighboringRgbas: pixelNeighboringRgbas,
  perFrame: pixelPerFrame,
  rgbaAtIndex: pixelRgbaAtIndex,
  toFrame: pixelToFrame,
}

export {
  Pixel,
  pixelColor,
  pixelFromFrame,
  pixelNeighboringRgbas,
  pixelPerFrame,
  pixelRgbaAtIndex,
  pixelToFrame,
}
