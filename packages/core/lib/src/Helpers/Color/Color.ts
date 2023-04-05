import type { NumberRecord, Value, ValueRecord } from '../../Types/Core.js'

export type Color = Rgb | Rgba
export type ColorObject = RgbObject | RgbaObject

export interface Rgb extends NumberRecord {
  r: number
  g: number
  b: number
}

export interface Rgba extends Rgb {
  a: number
}

export interface RgbObject extends ValueRecord {
  r: Value
  g: Value
  b: Value
}

export interface RgbaObject extends RgbObject {
  a: Value
}
