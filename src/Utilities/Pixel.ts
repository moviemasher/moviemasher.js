import { Point, Rgba, ScalarValue, Size, Pixels } from "../Setup/declarations"

const fromPoint = (pt : Point, width : number) => pt.y * width + pt.x

const toPoint = (index : number, width : number) : Point => (
  { x: index % width, y: Math.floor(index / width) }
)

const toIndex = (pixel : number) => pixel * 4

const rgbaAtIndex = (index : number, pixels : Pixels) : Rgba => (
  {
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2],
    a: pixels[index + 3],
  }
)

const rgba = (pixel : number, data : Pixels) => rgbaAtIndex(toIndex(pixel), data)

const safePixel = (pixel : number, offsetPoint: Point, size : Size) => {
  const { x, y } = offsetPoint
  const { width, height } = size
  const pt = toPoint(pixel, width)
  pt.x = Math.max(0, Math.min(width - 1, pt.x + x))
  pt.y = Math.max(0, Math.min(height - 1, pt.y + y))
  return fromPoint(pt, width)
}

const safePixels = (pixel : number, size : Size) : number[] => {
  const depth = 3 // should be 4, no?
  const pixels = []
  const halfSize = Math.floor(depth / 2)
  for (let y = 0; y < depth; y += 1) {
    for (let x = 0; x < depth; x += 1) {
      const offsetPoint = { x: x - halfSize, y: y - halfSize }
      pixels.push(safePixel(pixel, offsetPoint, size))
    }
  }
  return pixels
}

const surroundingRgbas = (pixel : number, data : Pixels, size : Size) : Rgba[] => (
  safePixels(pixel, size).map(p => rgba(p, data))
)

const color = (value : ScalarValue) : string => {
  const string = String(value)
  if (string.slice(0, 2) === "0x") return `#${string.slice(2)}`

  return string
}

export const Pixel = {
  color,
  rgbaAtIndex,
  surroundingRgbas,
}
