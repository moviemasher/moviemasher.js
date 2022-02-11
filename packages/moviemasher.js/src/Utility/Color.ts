import { AlphaColor, Rgb, Rgba, RgbObject, Yuv, YuvObject } from "../declarations"

const rgbValue = (value : string | number) : number => (
  Math.min(255, Math.max(0, Math.floor(Number(value))))
)

const rgbNumeric = (rgb : RgbObject) : Rgb => ({
  r: rgbValue(rgb.r), g: rgbValue(rgb.g), b: rgbValue(rgb.b)
})

const yuvNumeric = (rgb : YuvObject) : Yuv => ({
  y: rgbValue(rgb.y), u: rgbValue(rgb.u), v: rgbValue(rgb.v)
})

const colorYuvToRgb = (yuv : YuvObject) : Rgb => {
  const floats = yuvNumeric(yuv)
  return rgbNumeric({
    r: floats.y + 1.4075 * (floats.v - 128),
    g: floats.y - 0.3455 * (floats.u - 128) - (0.7169 * (floats.v - 128)),
    b: floats.y + 1.7790 * (floats.u - 128)
  })
}

const colorRgbToHex = (rgb: RgbObject): string => {
  let r = rgb.r.toString(16)
  let g = rgb.g.toString(16)
  let b = rgb.b.toString(16)
  if (r.length < 2) r = `0${r}`
  if (g.length < 2) g = `0${g}`
  if (b.length < 2) b = `0${b}`
  return `#${r}${g}${b}`
}

const colorRgbaToHex = (rgba: Rgba): string => {
  let r = rgba.r.toString(16)
  let g = rgba.g.toString(16)
  let b = rgba.b.toString(16)
  let a = Math.round(255 * rgba.a).toString(16)
  if (r.length < 2) r = `0${r}`
  if (g.length < 2) g = `0${g}`
  if (b.length < 2) b = `0${b}`
  if (a.length < 2) a = `0${a}`
  return `#${r}${g}${b}${a}`
}

const colorYuvBlend = (yuvs : YuvObject[], yuv : YuvObject, match : number, blend : number) : number => {
  let diff = 0.0
  const blendYuv = yuvNumeric(yuv)
  yuvs.forEach(yuvObject => {
    const numericYuv = yuvNumeric(yuvObject)
    const du = numericYuv.u - blendYuv.u
    const dv = numericYuv.v - blendYuv.v
    diff += Math.sqrt((du * du + dv * dv) / (255.0 * 255.0))
  })
  diff /= yuvs.length

  if (blend > 0.0001) {
    return Math.min(1.0, Math.max(0.0, (diff - match) / blend)) * 255.0
  }
  return (diff > match) ? 255 : 0
}

const colorRgbToYuv = (rgb : RgbObject) : Yuv => {
  const ints = rgbNumeric(rgb)
  return {
    y: ints.r * 0.299000 + ints.g * 0.587000 + ints.b * 0.114000,
    u: ints.r * -0.168736 + ints.g * -0.331264 + ints.b * 0.500000 + 128,
    v: ints.r * 0.500000 + ints.g * -0.418688 + ints.b * -0.081312 + 128
  }
}

const colorRgbRegex = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/
const colorRgbaRegex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*(?:\.\d+)?)\)$/
const colorHexRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/

const colorStrip = (color: string): string => color.toLowerCase().replaceAll(/[\s]/g, '')

const colorValid = (color: string): boolean => {
  const colorStripped = colorStrip(color)
  const style = new Option().style
  style.color = color
  const styleStripped = colorStrip(style.color)
  if (!styleStripped) return false

  if (styleStripped.startsWith('rgb')) return true

  return styleStripped === colorStripped
}

const colorValidHex = (value: string): boolean => colorHexRegex.test(value)
const colorValidRgba = (value: string): boolean => colorRgbaRegex.test(value)
const colorValidRgb = (value: string): boolean => colorRgbRegex.test(value)

const getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, "g"))

const hex256 = (hexStr: string): number => parseInt(hexStr.repeat(2 / hexStr.length), 16)

const colorAlpha = (value?: number) => {
  if (typeof value === "undefined") return 1.0

  return Math.max(0, Math.min(1.0, value / 255))
}

const colorHexToRgba = (hex: string): Rgba => {
  if (!colorValidHex(hex)) return colorRgba

  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  if (!hexArr) return colorRgba

  const [r, g, b, a] = hexArr.map(hex256)
  return { r, g, b, a: colorAlpha(a) }
}

const colorHexToRgb = (hex: string): Rgb => {
  if (!colorValidHex(hex)) return colorRgb

  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  if (!hexArr) return colorRgb

  const [r, g, b] = hexArr.map(hex256)
  return { r, g, b }
}
const colorTransparent = '#00000000'

const colorRgbaToRgba = (value: string): Rgba => {
  const color = colorStrip(value)

  const rgbaMatch = color.match(colorRgbaRegex)
  if (!rgbaMatch) return colorRgba

  return {
    r: Number(rgbaMatch[1]),
    g: Number(rgbaMatch[2]),
    b: Number(rgbaMatch[3]),
    a: Number(rgbaMatch[4]),
  }
}

const colorToRgb = (value: string): Rgb => {
  const color = colorStrip(value)
   if (colorValidHex(color)) return colorHexToRgb(color)

  const rgbMatch = color.match(colorRgbRegex)
  if (!rgbMatch) return colorRgb

  return {
    r: Number(rgbMatch[1]),
    g: Number(rgbMatch[2]),
    b: Number(rgbMatch[3]),
  }
}

const colorToRgba = (value: string): Rgba => {
  if (!colorValid(value)) return colorRgba

  const color = colorStrip(value)
  if (colorValidHex(color)) return colorHexToRgba(color)

  if (colorValidRgba(color)) return colorRgbaToRgba(color)

  if (colorValidRgb(color)) return { a: 1.0, ...colorToRgb(color) }

  return colorRgba
}

const colorAlphaColor = (value: string): AlphaColor => {
  const rgba = colorToRgba(value)
  return { alpha: rgba.a, color: colorRgbToHex(rgba) }
}

const colorFromRgb = (rgb: Rgb): string => {
  const { r, g, b } = rgb
  return `rgb(${r},${g},${b})`
}

const colorFromRgba = (rgba: Rgba): string => {
  const { r, g, b, a} = rgba
  return `rgb(${r},${g},${b},${a})`
}

const colorRgba: Rgba = { r: 0, g: 0, b: 0, a: 1.0 }

const colorRgb: Rgb = { r: 0, g: 0, b: 0 }

/**
 * @category Utility
 */
const Color = {
  alphaColor: colorAlphaColor,
  fromRgb: colorFromRgb,
  fromRgba: colorFromRgba,
  hexRegex: colorHexRegex,
  hexToRgb: colorHexToRgb,
  hexToRgba: colorHexToRgba,
  rgb: colorRgb,
  rgba: colorRgba,
  rgbaRegex: colorRgbaRegex,
  rgbaToHex: colorRgbaToHex,
  rgbRegex: colorRgbRegex,
  rgbToHex: colorRgbToHex,
  rgbToYuv: colorRgbToYuv,
  strip: colorStrip,
  toRgb: colorToRgb,
  toRgba: colorToRgba,
  transparent: colorTransparent,
  valid: colorValid,
  validHex: colorValidHex,
  validRgb: colorValidRgb,
  validRgba: colorValidRgba,
  yuvBlend: colorYuvBlend,
  yuvToRgb: colorYuvToRgb,
}

export {
  Color,
  colorAlphaColor,
  colorFromRgb,
  colorFromRgba,
  colorHexRegex,
  colorHexToRgb,
  colorHexToRgba,
  colorRgb,
  colorRgba,
  colorRgbaRegex,
  colorRgbaToHex,
  colorRgbRegex,
  colorRgbToHex,
  colorRgbToYuv,
  colorStrip,
  colorToRgb,
  colorToRgba,
  colorTransparent,
  colorValid,
  colorValidHex,
  colorValidRgb,
  colorValidRgba,
  colorYuvBlend,
  colorYuvToRgb,
}
