import { AVType, RenderType } from "./Setup/Enums"

import { TimeRange } from "./Helpers/TimeRange"

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


/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any
export type Value = number | string
export type Scalar = boolean | Value

export interface ValueObject extends Record<string, Value> {}
export interface NumberObject extends Record<string, number> {}
export interface UnknownObject extends Record<string, unknown> {}
export interface StringObject extends Record<string, string> {}
export interface ObjectUnknown extends Record<string, UnknownObject> {}

export interface VisibleContextData extends ImageData {}
export interface VisibleContextElement extends HTMLCanvasElement { }

export interface AudibleContextData extends AudioContext {}
export interface Context2D extends CanvasRenderingContext2D {}

export interface Pixels extends Uint8ClampedArray {}
export interface LoadedImage extends HTMLImageElement {}
export interface LoadedVideo extends HTMLVideoElement {}
export interface LoadedAudio extends AudioBuffer {}
export interface LoadVideoResult { video: LoadedVideo, audio: LoadedAudio, sequence: Sequence[] }
export interface LoadedFont { family: string } // really a Font, but not in tests
export interface AudibleSource extends AudioBufferSourceNode {}
export type VisibleSource = CanvasImageSource

export interface Timeout extends ReturnType<typeof setTimeout> {}
export interface Interval extends ReturnType<typeof setInterval> {}

export type LoadPromise = Promise <void>
export type LoadFontPromise = Promise<LoadedFont>
export type LoadImagePromise = Promise<LoadedImage>
export type LoadVideoPromise = Promise<LoadVideoResult>
export type LoadAudioPromise = Promise<LoadedAudio>
export type Sequence = LoadPromise | VisibleSource

export interface ScalarConverter { (value?: Value): Value }
export interface NumberConverter { (value: number): number }
export interface StringSetter { (value: string): void }
export interface NumberSetter { (value: number): void }
export interface BooleanSetter { (value: boolean): void }

export type ScalarArray = unknown[]
export type JsonValue = Scalar | ScalarArray | UnknownObject
export interface JsonObject extends Record<string, JsonValue | JsonValue[]> {}

export type EvaluatorValue = Value | ScalarConverter

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

export interface WithError {
  error?: string
}

export interface AndTypeAndId extends AndType, AndId {

}

export interface AndTypeAndValue extends AndType {
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
  r: Value
  g: Value
  b: Value
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
export interface Constructor { new (...args: any[]): any }

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

export interface StartOptions {
  duration: number
  offset?: number
  start: number
}

export interface ServerOptions {
  protocol?: string
  prefix?: string
  host?: string
  port?: number
}

export interface ServerCallback {
  server: ServerOptions
  request: RequestInit
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

/**
 * matched by fluent-ffmpeg's FilterSpecification
 */
export interface GraphFilter {
  filter: string
  inputs?: string[]
  outputs?: string[]
  options: ValueObject
}

export interface GraphInput {
  source: string
  options?: ValueObject
}

export interface GraphFile {
  type: string
  source?: string
  content?: string
}

export interface Layer {
  files: GraphFile[]
  layerInputs: GraphInput[]
  filters: GraphFilter[]
  merger?: GraphFilter
}

export interface Segment {
  avType?: AVType
  duration?: number
  layers: Layer[]
}

export type Segments = Segment[]

export type SegmentPromise = Promise<Segment>
export type SegmentsPromise = Promise<Segments>

export interface SegmentOptions {
  type: RenderType
  size: Size
  timeRange?: TimeRange
  videoRate: number
}

export interface SegmentArgs extends Required<SegmentOptions> { }

export interface LayerArgs extends SegmentArgs {
  layerIndex: number
  prevLayer: Layer
  clipTimeRange: TimeRange
  inputCount: number
  prevFilter?: GraphFilter,
}