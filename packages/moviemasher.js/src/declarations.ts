/* eslint-disable @typescript-eslint/no-namespace */
declare global { interface Window { webkitAudioContext: typeof AudioContext } }

export type Value = number | string
export type Scalar = boolean | Value | undefined
export type PopulatedString = string & { isEmpty: never }
export interface ValueObject extends Record<string, Value> {}
export interface NumberObject extends Record<string, number> {}
export interface BooleanObject extends Record<string, boolean> {}
export interface UnknownObject extends Record<string, unknown> {}
export interface StringObject extends Record<string, string> { }
export interface ScalarObject extends Record<string, Scalar> { }
export interface StringsObject extends Record<string, string[]> { }
export interface RegExpObject extends Record<string, RegExp> {}

export interface ObjectUnknown extends Record<string, UnknownObject> {}

export interface VisibleContextData extends ImageData {}
export interface VisibleContextElement extends HTMLCanvasElement { }

export interface AudibleContextData extends AudioContext {}
export interface Context2D extends CanvasRenderingContext2D {}

export interface Pixels extends Uint8ClampedArray {}
export interface LoadedImage extends HTMLImageElement {} // limited Image API in tests!
export interface LoadedVideo extends HTMLVideoElement {}
export interface LoadedAudio extends AudioBuffer {}
export interface LoadedFont extends FontFace { } // just { family: string } in tests!
export interface AudibleSource extends AudioBufferSourceNode {}

export type FfmpegSvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement
export type SvgFilter = FfmpegSvgFilter | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement
export type SvgFilters = SvgFilter[]
export type SvgItem = SVGElement 


export type SvgItems = SvgItem[]
export type SvgItemsTuple = [SvgItems, SvgItems]


export type SvgOrImage = SVGSVGElement | LoadedImage

export type VisibleSource = HTMLVideoElement | HTMLImageElement | SVGImageElement | HTMLCanvasElement

export type CanvasVisibleSource = VisibleSource | ImageBitmap | CanvasImageSource

export type Timeout = ReturnType<typeof setTimeout>
export type Interval = ReturnType<typeof setInterval>

export type LoadFontPromise = Promise<LoadedFont>
export type LoadImagePromise = Promise<LoadedImage>
export type LoadVideoPromise = Promise<LoadedVideo>
export type LoadAudioPromise = Promise<LoadedAudio>

export interface NumberConverter { (value: number): number }
export interface StringSetter { (value: string): void }
export interface NumberSetter { (value: number): void }
export interface BooleanSetter { (value: boolean): void }
export interface BooleanGetter { (): boolean }
export type EventHandler = (event: Event) => void 

export type AnyArray = any[]
export type JsonValue = Scalar | AnyArray | UnknownObject
export interface JsonObject extends Record<string, JsonValue | JsonValue[]> {}

export interface WithFrame {
  frame : number
}

export interface WithIndex {
  index : number
}

export interface WithTrack {
  trackNumber : number
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

export interface AlphaColor {
  color: string
  alpha: number
}

export interface AndType {
  type: string
}

export interface AndId {
  id: string
}

export interface AndLabel {
  label: string
}

export interface LabelAndId extends AndId, AndLabel {}

export interface WithError {
  error?: string
}

export interface AndTypeAndId extends AndType, AndId {}

export interface AndTypeAndValue extends AndType {
  value : number
}

export interface RgbObject {
  r: Value
  g: Value
  b: Value
}

export interface RgbaObject extends RgbObject {
  a: Value
}

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface YuvObject {
  y: Value
  u: Value
  v: Value
}

export interface Yuv {
  y: number
  u: number
  v: number
}


// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Constrained<T = UnknownObject> = new (...args: any[]) => T

export interface GenericFactory<INSTANCE, INSTANCEOBJECT, DEFINITION, DEFINITIONOBJECT> {
  defaults?: DEFINITION[]
  definitionFromId(id : string) : DEFINITION
  definition(object: DEFINITIONOBJECT): DEFINITION
  instance(object : INSTANCEOBJECT) : INSTANCE
  fromId(id : string) : INSTANCE
}

export interface StartOptions {
  duration: number
  offset?: number
  start: number
}

// TODO: rename prefix to path and add query string parameters?
export interface Endpoint {
  protocol?: string
  prefix?: string
  host?: string
  port?: number
}

export interface UploadDescription {
  name: string
  type: string
  size: number
}

export interface InputParameter {
  key: string
  value: Value
}

export interface DescribedObject extends AndId, UnknownObject {
  icon?: string
  label?: string
}

export interface Described extends AndId {
  createdAt: string
  icon: string
  label: string
}



export const isCustomEvent = (value: any): value is CustomEvent => (
  value instanceof CustomEvent
)












