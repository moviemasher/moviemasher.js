import type { NumberRecord, Time, TimeRange, Value, ValueRecord } from '../types.js'

import { RGBA_KEYS, RGB_KEYS } from '../runtime.js'
import { assertTrue } from './guards.js'
import { offsetLength } from './time.js'

interface Rgb extends NumberRecord {
  r: number
  g: number
  b: number
}

interface Rgba extends Rgb {
  a: number
}

interface RgbObject extends ValueRecord {
  r: Value
  g: Value
  b: Value
}

interface RgbaObject extends RgbObject {
  a: Value
}

const blackRgb: Rgb = { r: 0, g: 0, b: 0 }
const blackRgba: Rgba = { ...blackRgb, a: 1.0 }

const colorRgbRegex = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/
const colorRgbaRegex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*(?:\.\d+)?)\)$/
const colorHexRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/

const colorStrip = (color: string): string => color.toLowerCase().replace(/[\s]/g, '')

const colorStyle = ():{ color: string } => {
  if (typeof Option !== 'function') return { color: '' }
  // console.log('colorStyle Option', Option)
  return new Option().style
}

const colorValidRgba = (value: string): boolean => colorRgbaRegex.test(value)
const colorValidRgb = (value: string): boolean => colorRgbRegex.test(value)

const getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, 'g'))

const hex256 = (hexStr: string): number => parseInt(hexStr.repeat(2 / hexStr.length), 16)

const colorRgbaToRgba = (value: string): Rgba => {
  const color = colorStrip(value)
  const rgbaMatch = color.match(colorRgbaRegex)
  if (!rgbaMatch) return blackRgba

  return {
    r: Number(rgbaMatch[1]),
    g: Number(rgbaMatch[2]),
    b: Number(rgbaMatch[3]),
    a: Number(rgbaMatch[4]),
  }
}

const colorHexToRgba = (hex: string): Rgba => {
  if (!colorValidHex(hex)) return blackRgba

  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  if (!hexArr) return blackRgba

  const [r, g, b, alpha] = hexArr.map(hex256)
  const a = Math.max(0, Math.min(255, alpha ?? 255)) / 255
  return { r, g, b, a }
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

export const colorValidServer = (color: string): boolean => {
  const stripped = colorStrip(color)
  return (colorValidHex(stripped) || colorValidRgba(stripped) || colorValidRgb(stripped)) 
}

export const colorValid = (color: string): boolean => {
  const stripped = colorStrip(color)
  if (colorValidServer(stripped)) return true

  const style = colorStyle()

  style.color = color
  const transformed = style.color
  if (transformed === color) return false
  const styleStripped = colorStrip(transformed)
  if (!styleStripped) return false
 
  if (colorValidRgba(styleStripped) || colorValidRgb(styleStripped)) return true

  return styleStripped === stripped
}

export const colorValidHex = (value: string): boolean => colorHexRegex.test(value)

export const colorToRgb = (value: string): Rgb => {
  const color = colorStrip(value)
   if (colorValidHex(color)) return colorHexToRgb(color)

  const rgbMatch = color.match(colorRgbRegex)
  if (!rgbMatch) return blackRgb

  return {
    r: Number(rgbMatch[1]),
    g: Number(rgbMatch[2]),
    b: Number(rgbMatch[3]),
  }
}

export const colorToRgba = (value: string): Rgba => {
  if (!colorValid(value)) return blackRgba

  const color = colorStrip(value)
  if (colorValidHex(color)) return colorHexToRgba(color)

  if (colorValidRgba(color)) return colorRgbaToRgba(color)

  if (colorValidRgb(color)) return { a: 1.0, ...colorToRgb(color) }

  return blackRgba
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

export const colorMixRbga = (fromRgba: Rgba, toRgba: Rgba, amountToMix = 1.0): Rgba => {
  return Object.fromEntries(RGBA_KEYS.map(key => {
    return [key, Math.round((fromRgba[key] * amountToMix) + (toRgba[key] * (1 - amountToMix)))]
  })) as Rgba
}

export const colorMixRbg = (fromRgb: Rgb, toRgb: Rgb, amountToMix = 1.0): Rgb => {
  return Object.fromEntries(RGB_KEYS.map(key => {
    return [key, Math.round((fromRgb[key] * (1 - amountToMix)) + (toRgb[key] * amountToMix))]
  })) as Rgb
}

/**
 * @internal
 */
export const colorHexToRgb = (hex: string): Rgb => {
  if (!colorValidHex(hex)) return blackRgb

  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  if (!hexArr) return blackRgb

  const [r, g, b] = hexArr.map(hex256)
  return { r, g, b }
}


export const tweenColorStep = (value: string, valueEnd: string, frame: number, frames: number): string => {
  const offset = frame / frames
  assertTrue(colorValidHex(value))
  if (value.length === 7 || value.length === 4) {
    const result = colorRgbToHex(colorMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset))
    // console.log('tweenColorStep', { frame, frames, offset })
    return result
  }
  const color = colorRgbaToHex(colorMixRbga(colorToRgba(value), colorToRgba(valueEnd), offset))
  return color
}

export const tweenColor = (value: string, valueEnd: string, time: Time, range: TimeRange): string => {
  const [offset, lengthSeconds] = offsetLength(time, range)
  return tweenColorStep(value, valueEnd, offset, lengthSeconds)
}