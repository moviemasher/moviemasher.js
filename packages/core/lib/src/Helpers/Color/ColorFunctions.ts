import { Rgb, Rgba, RgbaObject, RgbObject } from "./Color"
import { isPositive } from "../../Utility/Is"
import { colorRgbaKeys, colorRgbKeys } from "./ColorConstants"


const colorRgbRegex = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/
const colorRgbaRegex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*(?:\.\d+)?)\)$/
const colorHexRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/

const colorStrip = (color: string): string => color.toLowerCase().replace(/[\s]/g, '')

const colorStyle = ():{ color: string } => {
  if (typeof Option !== 'function') return { color: '' }
  console.log("colorStyle Option", Option)
  return new Option().style
}

const colorValidRgba = (value: string): boolean => colorRgbaRegex.test(value)
const colorValidRgb = (value: string): boolean => colorRgbRegex.test(value)

const getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, "g"))

const hex256 = (hexStr: string): number => parseInt(hexStr.repeat(2 / hexStr.length), 16)

const colorAlpha = (value?: number) => {
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

const colorRgb: Rgb = { r: 0, g: 0, b: 0 }
const colorRgba: Rgba = { ...colorRgb, a: 1.0 }

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

export const colorFromRgb = (rgb: Rgb): string => {
  const { r, g, b } = rgb
  return `rgb(${r},${g},${b})`
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


export function colorMixRbga(fromRgba: Rgba, toRgba: Rgba, amountToMix = 1.0): Rgba {
  return Object.fromEntries(colorRgbaKeys.map(key => {
    return [key, Math.round((fromRgba[key] * amountToMix) + (toRgba[key] * (1 - amountToMix)))]
  })) as Rgba
}
export function colorMixRbg(fromRgb: Rgb, toRgb: Rgb, amountToMix = 1.0): Rgb {
  return Object.fromEntries(colorRgbKeys.map(key => {
    return [key, Math.round((fromRgb[key] * (1 - amountToMix)) + (toRgb[key] * amountToMix))]
  })) as Rgb
}
