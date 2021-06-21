/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

export type Context2D = CanvasRenderingContext2D
export type ContextElement = HTMLCanvasElement
export type DrawingSource = CanvasImageSource
export type ContextData = ImageData
export type Pixels = Uint8ClampedArray
export type Timeout = ReturnType<typeof setTimeout>
export type Interval = ReturnType<typeof setInterval>

export type EventsTarget = EventTarget
export type EventsCallback = EventHandlerNonNull

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

export type ScalarValue = number | string
export type ScalarArray = unknown[]
export type UnknownObject = Record<string, unknown>
export type ObjectUnknown = Record<string, UnknownObject>

export type ValueObject = Record<string, ScalarValue>
export type ScalarRaw = boolean | ScalarValue

export type Scalar = ScalarRaw | ScalarArray | UnknownObject
export type ScalarMethod = (_? : ScalarValue) => ScalarValue

export type JsonValue = Scalar
export type JsonObject = Record<string, JsonValue | JsonValue[]>
export type SelectionValue = ScalarValue | ValueObject
export type SelectionObject = Record<string, SelectionValue>
export type EvaluatorValue = ScalarValue | ScalarMethod

export interface WithFrame {
  frame : number
}

export interface WithTrack {
  track : number
}

export interface WithLabel {
  label : string
}

export interface Rgb {
  [index: string] : number
  r : number
  g : number
  b : number
}

export interface Rgba extends Rgb {
  a : number
}


export interface WithType {
  type: string
}

export interface WithId {
  id: string
}

export interface WithTypeAndId extends WithType, WithId {

}

export interface WithTypeAndValue extends WithType {
  value : number
}

export interface Size {
  width: number
  height: number
}

export interface EvaluatedSize {
  w? : number
  h? : number
  width? : number
  height? : number
}

export interface EvaluatedPoint {
  x? : number
  y? : number
}

export interface Point {
  x : number
  y: number
}

export interface EvaluatedRect {
  x? : number
  y? : number
  w? : number
  h? : number
  // eslint-disable-next-line camelcase
  out_w? : number
  // eslint-disable-next-line camelcase
  out_h? : number
}


export interface Rect extends Size, Point {}

export interface TextStyle {
  height : number
  family : string
  color : string
  shadow? : string
  shadowPoint? : Point
}

export interface RgbObject {
  r: string | number
  g: string | number
  b: string | number
}

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface YuvObject {
  y: string | number
  u: string | number
  v: string | number
}

export interface Yuv {
  y: number
  u: number
  v: number
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Constructor = new (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Constrained<T = UnknownObject> = new (...args: any[]) => T

export interface GenericFactory<INSTANCE, INSTANCEOBJECT, DEFINITION, DEFINITIONOBJECT> {
  // [index : string] : (...args: Any[]) => Any
  define(object : DEFINITIONOBJECT) : DEFINITION
  definitionFromId(id : string) : DEFINITION
  definition(object : DEFINITIONOBJECT) : DEFINITION
  instance(object : INSTANCEOBJECT) : INSTANCE
  initialize() : void
  fromId(id : string) : INSTANCE
}

export type LoadPromise = Promise <void>

export type LoadFontPromise = Promise< { family: string } >
export type LoadImagePromise = Promise<DrawingSource>
