const fromPoint = (pt, width) => pt.y * width + pt.x

const toPoint = (index, width) => {
  return { x: index % width, y: Math.floor(index / width) }
}

const toIndex = pixel => pixel * 4

const rgbAtIndex = (index, pixels) => {
  if (index < 0) return
  if (index > pixels.length - 4) return

  return {
    r: pixels[index], g: pixels[index + 1],
    b: pixels[index + 2], a: pixels[index + 3],
  }
}

const rgb = (pixel, data) => rgbAtIndex(toIndex(pixel), data)

const safePixel = (pixel, x_dif, y_dif, width, height) => {
  const pt = toPoint(pixel, width)
  pt.x = Math.max(0, Math.min(width - 1, pt.x + x_dif));
  pt.y = Math.max(0, Math.min(height - 1, pt.y + y_dif));
  return fromPoint(pt, width)
}

const safePixels = (pixel, width, height, size = 3) => {
  const pixels = []
  const half_size = Math.floor(size / 2)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      pixels.push(safePixel(pixel, x - half_size, y - half_size, width, height))
    }
  }
  return pixels
}

const rgbs = (pixel, data, width, height, size) => {
  return safePixels(pixel, width, height, size).map(pixel => rgb(pixel, data))
}

const color = (value) => {
  const string = String(value)
  if (string.slice(0, 2) === "0x") return "#" + string.slice(2)

  return string
}

export const Pixel = {
  color,
  rgbAtIndex,
  rgbs,
}
