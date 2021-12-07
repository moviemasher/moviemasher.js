/* eslint-disable @typescript-eslint/no-namespace */


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

export type Context2D = CanvasRenderingContext2D
export type ContextElement = AudioContext
export type VisibleContextElement = HTMLCanvasElement
export type VisibleSource = CanvasImageSource

export type LoadedFont = { family: string } // really a Font, but not in tests

export type LoadedImage = HTMLImageElement
export type LoadedVideo = HTMLVideoElement
export type LoadedAudio = AudioBuffer

export type AudibleSource = AudioBufferSourceNode
export type LoadPromise = Promise <void>
export type LoadFontPromise = Promise<LoadedFont>
export type LoadImagePromise = Promise<LoadedImage>
export type Sequence = LoadPromise | VisibleSource
export type LoadVideoResult = { video: LoadedVideo, audio: LoadedAudio, sequence: Sequence[] }
export type LoadVideoPromise = Promise<LoadVideoResult>
export type LoadAudioPromise = Promise<LoadedAudio>

export type ContextData = ImageData
export type Pixels = Uint8ClampedArray
export type Timeout = ReturnType<typeof setTimeout>
export type Interval = ReturnType<typeof setInterval>

export type EventsTarget = EventTarget

export type ScalarValue = number | string
export type ScalarArray = unknown[]
export type NumberObject = Record<string, number>
export type UnknownObject = Record<string, unknown>
export type StringObject = Record<string, string>
export type ObjectUnknown = Record<string, UnknownObject>

export type ValueObject = Record<string, ScalarValue>
export type ScalarRaw = boolean | ScalarValue

export type Scalar = ScalarRaw | ScalarArray | UnknownObject
export type ScalarConverter = (value? : ScalarValue) => ScalarValue

export type NumberConverter = (value: number) => number

export type StringSetter = (value: string) => void
export type NumberSetter = (value: number) => void
export type BooleanSetter = (value: boolean) => void

export type JsonValue = Scalar
export type JsonObject = Record<string, JsonValue | JsonValue[]>
export type SelectionValue = ScalarRaw | ValueObject
export type SelectionObject = Record<string, SelectionValue>
export type EvaluatorValue = ScalarValue | ScalarConverter

export interface WithFrame {
  frame : number
}

export interface WithLayer {
  layer : number
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
  r: ScalarValue
  g: ScalarValue
  b: ScalarValue
}

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface YuvObject {
  y: ScalarValue
  u: ScalarValue
  v: ScalarValue
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
  define(object : DEFINITIONOBJECT) : DEFINITION
  definitionFromId(id : string) : DEFINITION
  definition(object: DEFINITIONOBJECT): DEFINITION
  install(object : DEFINITIONOBJECT) : DEFINITION
  instance(object : INSTANCEOBJECT) : INSTANCE
  initialize() : void
  fromId(id : string) : INSTANCE
}

// TODO: remove
export interface ScrollMetrics {
  height : number
  width : number
  scrollPaddingleft : number
  scrollPaddingRight : number
  scrollPaddingTop : number
  scrollPaddingBottom : number
  scrollLeft : number
  scrollTop : number
  x : number
  y : number
}
export type MasherChangeHandler = (property: string, value?: SelectionValue) => void

export interface StartOptions {
  duration: number
  offset?: number
  start: number
}

export interface InputParameter {
  key: string
  value: ScalarValue
}

export interface InputFilter {
  filter: string
  inputs?: string[]
  outputs?: string[]
  options: ValueObject
}

export interface InputOverlay extends Point {
  z?: number
}

export interface InputCommand {
  sources?: StringObject
  filters: InputFilter[]
  merger?: InputFilter
}

export type InputCommands = InputCommand[]

export type InputCommandsPromise = Promise<InputCommands[]>

export interface RemoteServer {
  protocol?: string
  prefix?: string
  host?: string
  port?: ScalarValue
}

export interface RemoteServerProps {
  remoteServer?: RemoteServer
}

export type ClipState = InputCommand
export type MashStatePromise = Promise<MashState>
export type MashState = ClipState[]

export type Options = string[] | ValueObject
export interface OutputOptions {
  options?: Options
  audioCodec?: string
  audioBitrate?: ScalarValue
  audioChannels?: number
  audioFrequency?: number
  videoCodec?: string
  width?: number
  height?: number
  videoBitrate?: ScalarValue
  maxRate?: ScalarValue
  bufSize?: ScalarValue
  g?: number
  fps?: number
  format?: string
}
