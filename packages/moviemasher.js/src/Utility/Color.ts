import {
  AlphaColor, Rgb, Rgba, RgbaObject, RgbObject, Yuv, YuvObject
} from "../declarations"
import { isPositive } from "./Is"

export const colorRgbKeys = 'rgb'.split('')
export const colorRgbaKeys = [...colorRgbKeys, 'a']
export const colorTransparent = '#00000000'
export const colorBlack = '#000000'
export const colorWhite = '#FFFFFF'
export const colorWhiteTransparent = '#FFFFFF00'
export const colorBlackTransparent = '#00000000'
export const colorWhiteOpaque = '#FFFFFFFF'
export const colorBlackOpaque = '#000000FF'
export const colorGreen = '#00FF00'
export const colorYellow = '#FFFF00'
export const colorRed = '#FF0000'
export const colorBlue = '#0000FF'

export enum Color {
  Transparent = '#00000000',
  Black = '#000000',
  White = '#FFFFFF',
  WhiteTransparent = '#FFFFFF00',
  BlackTransparent = '#00000000',
  WhiteOpaque = '#FFFFFFFF',
  BlackOpaque = '#000000FF',
  Green = '#00FF00',
  Yellow = '#FFFF00',
  Red = '#FF0000',
  Blue = '#0000FF',
}
export const Colors = Object.values(Color)

export const colorName = (color: string): string => {
  for (const entry of Object.entries(Color)) {
    const [key, value] = entry
    if (value === color) return key
  }
  return ''
}

export const rgbValue = (value : string | number) : number => (
  Math.min(255, Math.max(0, Math.floor(Number(value))))
)

export const rgbNumeric = (rgb : RgbObject) : Rgb => ({
  r: rgbValue(rgb.r), g: rgbValue(rgb.g), b: rgbValue(rgb.b)
})

export const yuvNumeric = (rgb : YuvObject) : Yuv => ({
  y: rgbValue(rgb.y), u: rgbValue(rgb.u), v: rgbValue(rgb.v)
})

export const colorYuvToRgb = (yuv : YuvObject) : Rgb => {
  const floats = yuvNumeric(yuv)
  return rgbNumeric({
    r: floats.y + 1.4075 * (floats.v - 128),
    g: floats.y - 0.3455 * (floats.u - 128) - (0.7169 * (floats.v - 128)),
    b: floats.y + 1.7790 * (floats.u - 128)
  })
}

export const colorRgbToHex = (rgb: RgbObject): string => {
  let r = rgb.r.toString(16)
  let g = rgb.g.toString(16)
  let b = rgb.b.toString(16)
  if (r.length < 2) r = `0${r}`
  if (g.length < 2) g = `0${g}`
  if (b.length < 2) b = `0${b}`
  return `#${r}${g}${b}`
}

export const colorRgbaToHex = (object: RgbaObject): string => {
  let r = object.r.toString(16)
  let g = object.g.toString(16)
  let b = object.b.toString(16)
  let a = Math.round(255 * Number(object.a)).toString(16)
  if (r.length < 2) r = `0${r}`
  if (g.length < 2) g = `0${g}`
  if (b.length < 2) b = `0${b}`
  if (a.length < 2) a = `0${a}`
  return `#${r}${g}${b}${a}`
}

export const colorYuvDifference = (fromYuv: Yuv, toYuv: Yuv, similarity: number, blend: number) => {
  const du = fromYuv.u - toYuv.u
  const dv = fromYuv.v - toYuv.v
  const diff = Math.sqrt((du * du + dv * dv) / (255.0 * 255.0))

  if (blend > 0.0001) {
    return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0
  }
  return (diff > similarity) ? 255 : 0
}

export const colorYuvBlend = (yuvs : YuvObject[], yuv : YuvObject, similarity : number, blend : number) : number => {
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
    return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0
  }
  return (diff > similarity) ? 255 : 0
}

export const colorRgbToYuv = (rgb : RgbObject) : Yuv => {
  const ints = rgbNumeric(rgb)
  return {
    y: ints.r * 0.299000 + ints.g * 0.587000 + ints.b * 0.114000,
    u: ints.r * -0.168736 + ints.g * -0.331264 + ints.b * 0.500000 + 128,
    v: ints.r * 0.500000 + ints.g * -0.418688 + ints.b * -0.081312 + 128
  }
}

export const colorRgbRegex = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/
export const colorRgbaRegex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*(?:\.\d+)?)\)$/
export const colorHexRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/

export const colorStrip = (color: string): string => color.toLowerCase().replaceAll(/[\s]/g, '')

export const colorStyle = ():{ color: string } => {
  if (typeof Option !== 'function') return { color: '' }
  console.log("colorStyle Option", Option)
  return new Option().style
}
export const colorValid = (color: string): boolean => {
  const stripped = colorStrip(color)
  if (colorValidHex(stripped) || colorValidRgba(stripped) || colorValidRgb(stripped)) return true

  const style = colorStyle()

  style.color = color
  const transformed = style.color
  if (transformed === color) return false
  const styleStripped = colorStrip(transformed)
  if (!styleStripped) return false
 
  if (colorValidRgba(stripped) || colorValidRgb(stripped)) return true

  return styleStripped === stripped
}

export const colorValidHex = (value: string): boolean => colorHexRegex.test(value)
export const colorValidRgba = (value: string): boolean => colorRgbaRegex.test(value)
export const colorValidRgb = (value: string): boolean => colorRgbRegex.test(value)

export const getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, "g"))

export const hex256 = (hexStr: string): number => parseInt(hexStr.repeat(2 / hexStr.length), 16)

export const colorAlpha = (value?: number) => {
  if (!isPositive(value)) return 1.0

  return Math.max(0, Math.min(1.0, value / 255))
}

export const colorHexToRgba = (hex: string): Rgba => {
  if (!colorValidHex(hex)) return colorRgba

  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  if (!hexArr) return colorRgba

  const [r, g, b, a] = hexArr.map(hex256)
  return { r, g, b, a: colorAlpha(a) }
}

export const colorHexToRgb = (hex: string): Rgb => {
  if (!colorValidHex(hex)) return colorRgb

  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  if (!hexArr) return colorRgb

  const [r, g, b] = hexArr.map(hex256)
  return { r, g, b }
}


export const colorRgbaToRgba = (value: string): Rgba => {
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

export const colorToRgb = (value: string): Rgb => {
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

export const colorToRgba = (value: string): Rgba => {
  if (!colorValid(value)) return colorRgba

  const color = colorStrip(value)
  if (colorValidHex(color)) return colorHexToRgba(color)

  if (colorValidRgba(color)) return colorRgbaToRgba(color)

  if (colorValidRgb(color)) return { a: 1.0, ...colorToRgb(color) }

  return colorRgba
}

export const colorAlphaColor = (value: string): AlphaColor => {
  const toRgba = colorToRgba(value)
  return { alpha: toRgba.a, color: colorRgbToHex(toRgba) }
}

export const colorFromRgb = (rgb: Rgb): string => {
  const { r, g, b } = rgb
  return `rgb(${r},${g},${b})`
}

export const colorFromRgba = (object: Rgba): string => {
  const { r, g, b, a} = object
  return `rgb(${r},${g},${b},${a})`
}

export const colorRgb: Rgb = { r: 0, g: 0, b: 0 }
export const colorRgba: Rgba = { ...colorRgb, a: 1.0 }

export const colorRgbaTransparent: Rgba = { ...colorRgb, a: 0.0 }

export const colorServer = (color: string): string => {
  if (!colorValidHex(color)) return color

  return `${color.slice(0, 7)}@0x${color.slice(-2)}`
}

export const colorRgbDifference = (rgb: Rgb | Rgba): Rgb | Rgba => {
  const { r, g, b } = rgb
  return { 
    ...rgb, 
    r: 255 - r,
    g: 255 - g,
    b: 255 - b,
    
  }
}