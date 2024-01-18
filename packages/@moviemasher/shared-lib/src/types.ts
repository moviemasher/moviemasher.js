declare global { interface Window { webkitAudioContext: typeof AudioContext } }

export type Constrained<T> = new (...args: any[]) => T

export type Lock = PropertySize | 'longest' | 'none' | 'shortest'

export type Rounding = 'ceil' | 'floor' | 'round'

export type ManageType = 'import' | 'reference' 
export interface ManageTypes extends Array<ManageType>{}

export type AVType = AudioAVType | BothAVType | VideoAVType

export type AudioAVType = 'audio'
export type BothAVType = 'both'
export type VideoAVType = 'video'

export type Numeric = number | PopulatedString

export type Value = number | string
export type Scalar = Value | boolean
export interface ScalarTuple extends ArrayOf2<string, ScalarOrUndefined>{}
export type ScalarOrUndefined = Scalar | undefined
export type PopulatedString = string & { isEmpty: never }
export type Integer = number 

export type AlphaProbing = 'alpha'
export type AudibleProbing = 'audible'
export type DurationProbing = 'duration'

export type PointOrSize = 'point' | 'size'

export type SizeProbing = 'size'

export type ProbingType = string | AlphaProbing | AudibleProbing | DurationProbing | SizeProbing

export interface Scalars extends Array<Scalar> {}
export interface Strings extends Array<string>{}
export interface Values extends Array<Value>{}
export interface Numbers extends Array<number>{}

export interface ValueRecord extends Record<string, Value> {}
export interface NumberRecord extends Record<string, number> {}
export interface UnknownRecord extends Record<string, unknown> {}
export interface ScalarRecord extends Record<string, Scalar> {}
export interface StringRecord extends Record<string, string> {}
export interface StringsRecord extends Record<string, Strings> {}
export interface BooleanRecord extends Record<string, boolean> {}

export type ArrayOf1<T=unknown> = [T]
export type ArrayOf2<T=unknown, S=T> = [T, S]
export type ArrayOf3<T=unknown, S=T, U=S> = [T, S, U]

export interface BooleanTuple extends ArrayOf2<boolean> {}
export interface StringTuple extends ArrayOf2<string> {}

export type IdElement = [string, Element]


export interface NestedStringRecord extends Record<string, string | StringRecord | NestedStringRecord> {}

export interface UnknownRecords extends Array<UnknownRecord>{}

export interface StringSetter { (value: string): void }
export interface NumberSetter { (value: number): void }
export interface BooleanSetter { (value: boolean): void }
export interface BooleanGetter { (): boolean }

export interface Unknowns extends Array<unknown>{}
export type JsonArray = Strings | Numbers | UnknownRecords
export type JsonValue = Scalar | Unknowns | UnknownRecord
export interface JsonRecord extends Record<string, JsonRecord | JsonValue | JsonValue[]> {}
export interface JsonRecords extends Array<JsonRecord>{}


export interface Point {
  x: number
  y: number
}

export interface Points extends Array<Point>{}

export type PointTuple = [Point, Point]

export type PropertyPoint = 'x' | 'y'

export interface Rect extends Size, Point {}

export interface Rects extends Array<Rect>{}

export type RectTuple = [Rect, Rect]

export interface RectOptions extends SizeOptions, Partial<Point> {}

export type PropertyRect = PropertySize | PropertyPoint

export interface Identified {
  id: string
}

export interface Framed {
  frame: number
}

export interface Indexed {
  index: number
}

export interface Tracked {
  trackNumber: number
}

export interface Labeled {
  label?: string 
}
export interface Ordered {
  order?: number
}


export type AudioType = 'audio'
export type ImageType = 'image'
export type VideoType = 'video'

export type AssetType = AudioType | ImageType | VideoType
export interface AssetTypes extends Array<AssetType>{}

export type AudibleType = AudioType | VideoType
export type VisibleType = ImageType | VideoType

export type Sizing = 'mash' | 'content' | 'container'

export interface StringData extends Data<string> {}

export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>
export type StringDataOrError = DataOrError<string>
export type StringRecordDataOrError = DataOrError<StringRecord>
export type StringsDataOrError = DataOrError<Strings>


export type ScalarsById = Partial<Record<PropertyId, Scalar>>

export interface EndpointRequest {
  requestType?: RequestType
  endpoint: Endpoint | string
  init?: RequestInit
}

export interface EndpointRequests extends Array<EndpointRequest>{}

export type ClientMedia = AudioBuffer | FontFace | ImageElement | HTMLVideoElement 

export interface ClientMediaRequest extends EndpointRequest {
  response?: ClientMedia
  objectUrl?: string
  file?: File
  urlPromise?: Promise<StringDataOrError>
  mediaPromise?: Promise<DataOrError<ClientMedia>>
}

export interface ServerMediaRequest extends EndpointRequest {
  path?: AbsolutePath
  dataUrl?: string
  type?: Mimetype | DropType
}

export interface RequestInit {
  body?: any
  headers?: StringRecord
  method?: string
}

export interface RequestObject {
  request: EndpointRequest
}

export interface Requestable extends RequestObject, Typed, Identified {
  createdAt?: string
}

export interface Requestables extends Array<Requestable>{}

export interface Property extends Typed, Ordered {
  defaultValue?: Scalar
  max?: number
  min?: number
  name: string
  options?: Scalars
  step?: number
  targetId: TargetId
  tweens?: boolean
  undefinedAllowed?: boolean
}

export interface Properties extends Array<Property>{}

export interface PropertyRecord extends Record<string, Property>{}


export interface Propertied {
  constrainedValue(found: Property, value?: Scalar): Scalar | undefined
  initializeProperties(object: unknown): void
  properties: Properties
  propertyFind(name: string): Property | undefined
  propertyIds(targetIds?: TargetIds): PropertyIds
  propertyInstance(object: Property): Property 
  setValue(name: string, value?: Scalar): ScalarTuple
  targetId: TargetId
  toJSON(): UnknownRecord
  value(key: string): Scalar | undefined
}

export type AssetRecord<T = string> = { [key in AssetType]?: T }

export interface Typed {
  type: string
}

export interface MashAsset extends Asset { 
  mashIndex: MashIndex
  mashDescription(options: MashDescriptionOptions): MashDescription
  // gain: number
  clipInstance(object: ClipObject): Clip
  clips: Clips
  clipsAudibleInTime(time: Time): Clips
  clipsInTimeOfType(time: Time, avType?: AVType): Clips
  color: string
  duration: number
  endTime: Time
  loop: boolean
  quantize: number
  size: Size
  toJSON(): UnknownRecord
  totalFrames: number
  trackInstance(args: TrackArgs): Track
  tracks: Track[]
}


/**
 * A plain object representation of a MashAsset.
 */
export interface MashAssetObject extends AssetObject {
  aspectHeight?: number
  aspectShortest?: number
  aspectWidth?: number
  buffer?: number
  /** Background color. */
  color?: string
  loop?: boolean
  /** Determines duration of clip frames. */
  quantize?: number
  tracks?: TrackObjects
}

export interface MashAudioAssetObject extends MashAssetObject, AudioAssetObject {}

export interface MashImageAssetObject extends MashAssetObject, ImageAssetObject {}

export interface MashVideoAssetObject extends MashAssetObject, VideoAssetObject {}

export interface MashInstance extends Instance {
  asset: MashAsset
}

export interface MashInstanceObject extends InstanceObject {
  
}

export interface PromptAsset extends Asset {
  request: EndpointRequest
}

export interface PromptAssets extends Array<PromptAsset>{}

export interface PromptAssetObject extends AssetObject {
  request: EndpointRequest
}

export interface PromptAudioAssetObject extends PromptAssetObject, AudioAssetObject {}

export interface PromptImageAssetObject extends PromptAssetObject, ImageAssetObject {}

export interface PromptVideoAssetObject extends PromptAssetObject, VideoAssetObject {}



export interface RawAsset extends Asset {
  assetObject: RawAssetObject
  request: EndpointRequest
}

export interface RawAssets extends Array<RawAsset>{}

export interface RawAssetObject extends AssetObject {
  request: EndpointRequest
}

export interface RawAudioAssetObject extends RawAssetObject, AudioAssetObject {}

export interface RawImageAssetObject extends RawAssetObject, ImageAssetObject {}

export interface RawVideoAssetObject extends RawAssetObject, VideoAssetObject {}

export interface RawInstanceObject extends InstanceObject {
  
}

export interface TextAsset extends RawAsset, ContentAsset {
  assetObject: TextAssetObject
  family: string
  string: string
}

export interface TextInstance extends ContentInstance {
  asset: TextAsset
  string: string
  intrinsic?: Rect
}

export interface TextInstanceObject extends VisibleInstanceObject {
  intrinsic?: Rect
  string?: string
}

export interface TextAssetObject extends RawAssetObject {
  string?: string
}


export interface VideoInstance extends VisibleInstance, AudibleInstance {
  asset: VideoAsset
}

export interface VideoInstanceObject extends VisibleInstanceObject, AudibleInstanceObject { }

export interface VideoInstanceArgs extends InstanceArgs, VideoInstanceObject {
  asset: VideoAsset
}



export type DecodeType = 'decode'
export type EncodeType = 'encode'
export type TranscodeType = 'transcode'

export interface JobProduct extends Typed, Identified {
  createdAt?: string
}

export interface Decoding extends JobProduct {
  type: DecodingType
  data?: UnknownRecord
}

export interface Encoding extends JobProduct, RequestObject {
  type: EncodingType
}

export interface Transcoding extends JobProduct, Requestable {
  type: TranscodingType
}


export interface Transcodings extends Array<Transcoding> { }

export interface TranscodeArgs {
  assetType: AssetType
  request: EndpointRequest
  transcodingType: TranscodingType
  options: TranscodeOptions
}
export interface Encodings extends Array<Encoding> { }

export interface EncodeArgs {
  encodingType?: EncodingType
  mashAssetObject: MashAssetObject
  encodeOptions?: EncodeOptions
}
export interface Decodings extends Array<Decoding> { }

export type DecodingType = string | ProbeType

export interface DecodingTypes extends Array<DecodingType> { }

export type ProbeType = 'probe'

export interface DecodeOptions { }

export interface DecodeArgs {
  assetType: AssetType
  request: EndpointRequest
  decodingType: DecodingType
  options: DecodeOptions
}

export type ColorSource = 'color'
export type RawSource = 'raw'

export type KnownSource = ContainerSource | ContentSource | ColorSource | MashSource | RawSource | ShapeSource | TextSource | PromptSource
export type Source = string | KnownSource

export interface Sources extends Array<Source>{}


export type TextSource = 'text'
export type PromptSource = 'prompt'

export type ContentSource = 'content'
export type ContainerSource = 'container'
export type MashSource = 'mash'

export type EncodingType = AssetType
export interface EncodingTypes extends Array<EncodingType>{}

export type FontType = 'font'

export type ShapeSource = 'shape'
export type ImportType = AssetType | ShapeSource | TextSource
export interface ImportTypes extends Array<ImportType>{}

export type BitmapsType = 'bitmaps'
export type AlphaType = ImageType | BitmapsType | VideoType
export type WaveformType = 'waveform'
export type TranscodingType = AssetType | BitmapsType | WaveformType
export interface TranscodingTypes extends Array<TranscodingType>{}
export type SvgType = 'svg'
export type SvgsType = 'svgs'
export type TxtType = 'txt'
export type DropType = AssetType | FontType
export interface DropTypes extends Array<DropType>{}
export type AssetFileType = SvgType | SvgsType | TxtType | DropType
export type RequestType = TranscodingType | AssetFileType

export interface Assets extends Array<Asset>{}

export interface AssetObject extends Identified, Labeled, Sourced, Typed {
  created?: string
  assets?: AssetObjects
  type: AssetType 
  decodings?: Decodings
}

export interface AssetObjects extends Array<AssetObject>{}


export interface AudibleAssetObject extends AssetObject {
  duration?: number
  audio?: boolean
  loop?: boolean
  waveform?: string
  audioUrl?: string
}

export interface VisibleAssetObject extends AssetObject {
  probeSize?: Size
}

export interface SourceAsset extends Asset {
  source: Source
}

export type StringOrRecord = string | StringRecord

export interface StringOrRecords extends Array<StringOrRecord>{}

export interface AssetParams {
  types?: AssetTypes | AssetType
  sources?: Sources | Source
  terms?: Strings | string
}

export interface AssetObjectsResponse {
  assets: AssetObject[]
  cacheControl?: string
}

export interface TrackObject extends UnknownRecord {
  clips?: ClipObjects
  dense?:  boolean
  index?: number
}

export interface TrackObjects extends Array<TrackObject>{}

export interface TrackArgs extends TrackObject {
  mashAsset: MashAsset
}

export interface Track extends Propertied, Indexed {
  trackIndex: TrackIndex
  assureFrames(quantize: number, clips?: Clips): void
  clips: Clips
  dense: boolean
  frames: number
  identifier: string
  mash: MashAsset
  sortClips(clips?: Clips): void
  trackObject: TrackObject
}

export interface Tracks extends Array<Track>{}



export interface VideoAssetObject extends AssetObject, VisibleAssetObject, AudibleAssetObject { }


export type ContainerTiming = 'container'
export type ContentTiming = 'content'
export type CustomTiming = 'custom'
export type Timing = CustomTiming | ContentTiming | ContainerTiming

export interface Time {
  add(time: Time): Time
  closest(timeRange: TimeRange): Time
  copy: Time
  divide(number: number, rounding?: string): Time
  equalsTime(time: Time): boolean
  fps: number
  frame: number
  durationFrames(duration: number, fps?: number): Numbers
  lengthSeconds: number
  isRange: boolean
  min(time: Time): Time
  scale(fps: number, rounding?: string): Time
  scaleToFps(fps: number): Time
  seconds: number
  startTime: Time
  timeRange: TimeRange
  withFrame(frame: number): Time
}

export interface TimeRange extends Time {
  copy: TimeRange
  end: number
  endTime: Time
  equalsTimeRange(timeRange : TimeRange) : boolean
  frames: number
  frameTimes: Times
  includes(frame: number): boolean
  /** @returns TimeRange that intersects two others. */
  intersection(time: Time): TimeRange | undefined 
  intersects(time: Time): boolean
  last: number
  lastTime: Time
  position: number
  positionTime(position: number, rounding?: string): Time
  scale(fps: number, rounding?: string): TimeRange
  /** @returns Array with start Time, and end Time if longer than a frame. */
  times: Times
  withFrame(frame: number): TimeRange
}

export interface Times extends Array<Time>{}
export interface TimeRanges extends Array<TimeRange>{}



export interface Sourced {
  source: Source
}

export interface SourceRecord<T = string> extends Record<Source, T | undefined> {}

export interface StringIndexable { [_:string]: any }

export interface Size {
  width: number
  height: number
}

export interface Sizes extends Array<Size> {}

export interface SizeTuple extends Array<Size> { length: 2 }

export interface SizeOptions extends Partial<Size> {
  lock?: Lock
  shortest?: PropertySize
}

export type PropertySize = 'width' | 'height'


export type Direction = SideDirection | CornerDirection

export type SideDirection = 'top' | 'right' | 'bottom' | 'left'


export type CornerDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface Directions extends Array<Direction>{}

export interface SideDirectionRecord extends Partial<Record<SideDirection, boolean>>{}


export interface ShapeAsset extends VisibleAsset {
  path: string
  pathWidth: number
  pathHeight: number
}

export interface ShapeInstance extends VisibleInstance {
  asset: ShapeAsset
}

export interface ShapeInstanceObject extends InstanceObject {}

export interface ShapeAssetObject extends AssetObject {
  pathWidth?: number
  pathHeight?: number
  path?: string
}

export type TargetId = 'asset' | 'clip' | 'container' | 'content' | 'mash' 

export interface TargetIds extends Array<TargetId>{}

export type PropertyId = `${TargetId}.${string}`

export interface PropertyIds extends Array<PropertyId>{}

export type SelectorType = TargetId | PropertyId 

export interface SelectorTypes extends Array<SelectorType>{}


export type ScalarType = BooleanDataType | NumberDataType | StringDataType
export type BooleanType = 'boolean'
export type NumberType = 'number'
export type StringType = 'string'




export interface AudioAssetObject extends AssetObject { }

export interface AudioInstance extends AudibleInstance {
  asset: AudioAsset
}

export interface AudioInstanceObject extends InstanceObject { }

export interface AudioInstanceArgs extends InstanceArgs, AudioInstanceObject {
  asset: AudioAsset
}
export interface ImageInstance extends VisibleInstance {
  asset: ImageAsset
}

export interface ImageInstanceObject extends VisibleInstanceObject { }

export interface ImageInstanceArgs extends InstanceArgs, ImageInstanceObject {
  asset: ImageAsset
}


export interface ImageAssetObject extends AssetObject { }


export interface CacheArgs {
  validDirectories?: Strings
  audible?: boolean
  visible?: boolean
}

export interface CacheOptions extends CacheArgs {
  quantize?: number
  time?: Time
  size?: Size
}

export interface InstanceCacheArgs extends CacheOptions {
  clipTime: TimeRange
  time: Time
  quantize: number
}

export interface AssetCacheArgs extends CacheOptions {
  assetTime?: Time
}


export interface InstanceObject extends Labeled {
  assetId?: string

  
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  lock?: string
  container?: boolean

  height?: number
  heightEnd?: number

  opacity?: number
  opacityEnd?: number
  width?: number
  widthEnd?: number
  pointAspect?: string
  sizeAspect?: string
}

export interface InstanceArgs extends InstanceObject {
  asset: Asset
}

interface AudibleInstanceProperties {
  gain: number
  gainPairs: Numbers[]
  speed: number
  startTrim: number
  endTrim: number
}

export interface AudibleInstanceObject extends InstanceObject {
  gain?: Value
  muted?: boolean
  loops?: number
  speed?: number
  startTrim?: number
  endTrim?: number
}

export interface VisibleInstanceObject extends InstanceObject {}


export interface Clip extends Propertied {
  sizingRect(size: Size, loading?: boolean): Rect
  asset(assetIdOrObject: string | AssetObject): Asset 
  assetIds: Strings
  audible: boolean
  clipCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>>
  clipIndex: ClipIndex
  clipObject: ClipObject
  container?: ContainerInstance
  containerId: string
  content: ContentInstance | AudioInstance
  contentId: string
  // element(size: Size, time: Time): DataOrError<Element>
  endFrame: number
  frame : number
  frames: number
  id: string
  intrinsicsKnown(options: IntrinsicOptions): boolean
  label: string
  transparency: Transparency
  maxFrames(quantize : number, trim? : number) : number
  canBeMuted: boolean
  muted: boolean
  clipRects(args: ContainerRectArgs): RectTuple
  resetTiming(instance?: Instance, quantize?: number): void
  sizing: Sizing
  timeRange: TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export interface Clips extends Array<Clip>{}

export type Transparency = 'alpha' | 'luminance'

export interface ClipObject extends Labeled {
  containerId?: string
  contentId?: string
  content?: InstanceObject
  container?: InstanceObject
  frame?: number
  transparency?: Transparency | string
  timing?: string
  sizing?: string
  frames?: number
}

export interface ClipObjects extends Array<ClipObject>{}

export interface IntrinsicOptions {



  size?: boolean
  duration?: boolean
}

export interface ColorAsset extends ContentAsset {}

export interface ColorInstance extends ContentInstance {
  color: string
  asset: ColorAsset
}

export interface ColorInstanceObject extends ImageInstanceObject {
  color?: string
}

export interface ColorAssetObject extends ImageAssetObject {}


export interface ContainerRectArgs {
  size: Size
  time: Time
  timeRange: TimeRange
  loading?: boolean
}

export interface ContentRectArgs {
  even?: boolean
  containerRects: RectTuple
  loading?: boolean
  shortest: PropertySize
  time: Time
  timeRange: TimeRange
}


export interface ContainerInstance extends VisibleInstance {
  asset: ContainerAsset
}
export interface ContainerAsset extends VisibleAsset {}
export interface ContentInstance extends VisibleInstance {
  asset: ContentAsset
}
export interface ContentAsset extends VisibleAsset {
}

export type DataGroup = string 

export interface Data<T = unknown> { 
  data: T
}

export interface ErrorObject {
  message: string
  name: string
  cause?: unknown
}

export interface DefiniteError {
  error: ErrorObject
}

export interface PotentialError extends Partial<DefiniteError> {}

export type DataOrError<T = unknown> = DefiniteError | Data<T>

export type DataType = string | BooleanDataType | NumberDataType | StringDataType

export type BooleanDataType = 'boolean'
export type NumberDataType = 'number'
export type StringDataType = 'string'

export type ControlGroupType = string 

/**
 * Supports a subset of the standard URL interface
 */
export interface Endpoint {
  /**
   * includes ':' suffix if defined
   */
  protocol?: string
  /**
   * relative or absolute path if defined
   */
  pathname?: string
  /**
   * full domain name if defined
   */
  hostname?: string

  /**
   * includes '?' prefix if defined
   */
  search?: string
  /**
   * does not include ':' prefix
   */
  port?: number
}

export interface EventDispatcherListener<T=any> {
  (event: CustomEvent<T>): void
}

export interface EventDispatcherListeners extends Record<string, EventDispatcherListener> {}

export interface ListenersFunction {
  (): EventDispatcherListeners
}

export interface EventDispatcherOptions {
  once?: boolean
  capture?: boolean
}

export type EventOptions = EventDispatcherOptions | boolean

export interface EventDispatcher {
  addDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions) => void
  dispatch: <T>(typeOrEvent: CustomEvent<T> | Event) => boolean
  listenersAdd(record: EventDispatcherListeners): void
  listenersRemove(record: EventDispatcherListeners): void
  removeDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions) => void
}

export interface Importer extends Identified, Labeled {}

export interface Importers extends Array<Importer>{}

export interface Exporter extends Identified, Labeled {}

export interface Exporters extends Array<Exporter>{}

export type ClientOrServer = 'client' | 'server'

export interface MovieMasherRuntime {
  context: ClientOrServer
  imports: StringRecord
  eventDispatcher: EventDispatcher
  options: MovieMasherOptions
  importPromise: Promise<void>
  document: Document
}

export interface  MovieMasherOptions {
  assetObject?: EndpointRequest | AssetObject
  assetObjects?: EndpointRequest | AssetObjects
  icons?: EndpointRequest | StringRecord
  transcode?: false | Record<AssetType, TranscodingTypes>
  waveformTransparency?: Transparency
  timeline?: BooleanRecord
}

export interface OutputOptions {
  [_: string]: string | Value | ValueRecord | undefined
  extension?: string
  format?: string
  options?: ValueRecord
}

export interface AudioOutputOptions extends OutputOptions {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
}

export interface ImageOutputOptions extends Partial<Size>, OutputOptions {
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
}

export interface VideoOutputOptions extends ImageOutputOptions, AudioOutputOptions { }

export interface SequenceOutputOptions extends ImageOutputOptions {}

export interface WaveformOutputOptions extends OutputOptions {

}

export type EncodeOptions = AudioOutputOptions | VideoOutputOptions | ImageOutputOptions

export type TranscodeOptions = EncodeOptions | WaveformOutputOptions | SequenceOutputOptions

export interface ParameterObject {
  name : string
  value: Value | ValueRecord[]
  values?: Value[]
  dataType?: DataType | string
}
export interface ParameterObjects extends Array<ParameterObject>{}

export interface Parameter {
  dataType: DataType
  name: string
  value: Value | ValueRecord[]
  values?: Value[]
}

export interface Parameters extends Array<Parameter>{}


export interface ProbingTypes extends Array<ProbingType>{}

export interface ProbingOptions extends DecodeOptions {
  types: ProbingTypes
}

export interface Probing extends Decoding {
  type: ProbeType
  data: ProbingData
}

export interface ProbingData extends UnknownRecord {
  audible?: boolean
  duration?: number
  family?: string
  extension?: string
  alpha?: boolean
  fps?: number
  height?: number
  width?: number
  raw?: RawProbeData
}

export interface ProbingStream {
  [key: string]: any

  // avg_frame_rate?: string | undefined
  // bit_rate?: string | undefined
  // bits_per_raw_sample?: string | undefined
  // bits_per_sample?: number | undefined
  // channel_layout?: string | undefined
  // channels?: number | undefined
  // chroma_location?: string | undefined
  // codec_long_name?: string | undefined
  // codec_tag_string?: string | undefined
  // codec_tag?: string | undefined
  // codec_time_base?: string | undefined
  // coded_height?: number | undefined
  // coded_width?: number | undefined
  // color_primaries?: string | undefined
  // color_range?: string | undefined
  // color_space?: string | undefined
  // color_transfer?: string | undefined
  // display_aspect_ratio?: string | undefined
  // duration_ts?: string | undefined
  // field_order?: string | undefined
  // has_b_frames?: number | undefined
  // id?: string | undefined
  // level?: string | undefined
  // max_bit_rate?: string | undefined
  // nb_frames?: string | undefined
  // nb_read_frames?: string | undefined
  // nb_read_packets?: string | undefined
  // profile?: number | undefined
  // r_frame_rate?: string | undefined
  // refs?: number | undefined
  // sample_aspect_ratio?: string | undefined
  // sample_fmt?: string | undefined
  // sample_rate?: number | undefined
  // start_pts?: number | undefined
  // start_time?: number | undefined
  // time_base?: string | undefined
  // timecode?: string | undefined
  codec_name?: string | undefined
  codec_type?: string | undefined
  duration?: string | undefined
  height?: number | undefined
  pix_fmt?: string | undefined
  rotation?: string | number | undefined
  width?: number | undefined
}

export interface ProbingFormat {
  filename?: string | undefined
  // nb_streams?: number | undefined
  // nb_programs?: number | undefined
  // format_name?: string | undefined
  format_long_name?: string | undefined
  // start_time?: number | undefined
  duration?: number | undefined
  // size?: number | undefined
  // bit_rate?: number | undefined
  probe_score?: number | undefined
  tags?: Record<string, string | number> | undefined
}

export interface RawProbeData {
  streams: ProbingStream[]
  format: ProbingFormat
}


export interface ChangeEditObject extends EditArgs {
  target: Propertied
}

export interface ChangePropertyEditObject extends ChangeEditObject {
  property: PropertyId
  redoValue?: Scalar
  undoValue?: Scalar
}

export interface ChangePropertiesEditObject extends ChangeEditObject {
  redoValues: ScalarsById
  undoValues: ScalarsById
}
export interface EditObject extends Typed {}

export interface EditArgs extends EditObject {}

export type AbsolutePath = `/${string}`
export type Mimetype = `${string}/${string}`


export type SvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement | SVGFEComponentTransferElement
export interface SvgFilters extends Array<SvgFilter>{}
export interface ImageElement extends HTMLImageElement {}
export type SvgItem = SVGElement | ImageElement 
export type SvgVector = SVGTextElement | SVGPolygonElement | SVGPathElement | SVGRectElement | SVGCircleElement | SVGEllipseElement
export interface SvgItems extends Array<SvgItem>{}

export interface Nodes extends Array<Node>{}
export interface Elements extends Array<Element>{}

export interface MashDescription {
  mash: MashAsset
  size: Size
  time: Time
}

export interface MashDescriptionOptions {
  size?: Size
  clip?: Clip
  time?: Time
  frame?: number
  frames?: number
  assetType?: AssetType
}

export interface MashDescriptionArgs extends MashDescriptionOptions {
  mash: MashAsset
}

export interface SegmentDescription {
}

export interface SegmentDescriptionArgs {
  mashDescription: MashDescription
}

export interface Asset extends Propertied, Identified, Typed, Labeled {
  requests: EndpointRequests
  asset(assetIdOrObject: string | AssetObject): Asset 
  assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>>
  assetIds: Strings
  assetObject: AssetObject
  assets: Assets
  decodings: Decodings
  instanceArgs(object?: InstanceObject): InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  clipObject(object?: InstanceObject): ClipObject
  source: Source
  type: AssetType  
}

export interface AudibleAsset extends Asset {
  assetObject: AudibleAssetObject
  canBeMuted: boolean
  audioUrl: string
  duration: number
  frames(quantize: number): number
  loop: boolean
}

export interface VisibleAsset extends Asset {
  assetObject: VisibleAssetObject
  probeSize?: Size
  alpha?: boolean
  canBeFill?: boolean
  canBeContainer?: boolean
  canBeContent?: boolean
  container?: boolean
  content?: boolean
  isVector?: boolean
}

export interface AudioAsset extends AudibleAsset {}
export interface ImageAsset extends VisibleAsset {}

export interface VideoAsset extends VisibleAsset, AudibleAsset {
  assetObject: VideoAssetObject
}

export interface Instance extends Propertied, Identified {
  scaleRects(time: Time, range: TimeRange): RectTuple
  asset: Asset
  assetId: string
  assetIds: Strings
  assetTime(masherTime: Time): Time
  bottomConstrain: boolean
  clip: Clip
  clipped: boolean
  container: boolean
  containerRects(args: ContainerRectArgs, sizingSize: Size): RectTuple
  contentRects(args: ContentRectArgs): RectTuple 
  frames(quantize: number): number 
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  height: number
  instanceCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>>
  instanceObject: InstanceObject
  intrinsicRect: Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  isDefault: boolean
  isDefaultOrAudio: boolean
  leftConstrain: boolean
  lock: Lock
  canBeMuted: boolean
  muted: boolean
  opacity: number
  opacityEnd?: number
  pointAspect: string
  propertySize?: PropertySize
  rightConstrain: boolean
  sideDirectionRecord: SideDirectionRecord
  sizeAspect: string
  topConstrain: boolean
  tweenValues(key: string, time: Time, range: TimeRange): Scalars 
  width: number
  x: number
  y: number
  xEnd?: number
  yEnd?: number
  widthEnd?: number
  heightEnd?: number
}

export interface AudibleInstance extends Instance, AudibleInstanceProperties {
  /** @returns Array containing duration, start trim, and end trim in frames. */
  assetFrames(quantize: number): Numbers
}

export type ContentFill = string | SvgItem

export interface ComplexSvgItem {
  svgItem: SvgItem
  style?: SVGStyleElement
  defs?: SvgItems
}

export interface SvgItemArgs {
  /** The full output size. */
  size: Size
  /** The container rect. */
  rect: Rect
  /** The time for which an svg item is needed. */
  time: Time
  /** The clip time range. */
  timeRange: TimeRange
  /** Potential fill color for masking. */
  color?: string
}


export interface VisibleInstance extends Instance {
  containerSvgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem>
  containerOpacityFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined
  contentSvgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem>
  itemContentRect(containerRect: Rect, shortest: PropertySize, time: Time): Rect
  pathElement(rect: Rect): SvgVector
  svgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem>
  asset: VisibleAsset
  tweening: boolean
  tweens(key: string): boolean
}

export interface VisibleContentAsset extends ContentAsset {}
  
export interface VisibleContentInstance extends ContentInstance {}

export interface AssetPromiseEventDetail {
  assetId: string
  assetObject?: AssetObject
  promise?: Promise<DataOrError<Asset>>
}


export interface MashIndex extends ArrayOf1<number> {}

export interface TrackIndex extends ArrayOf2<number> {}

export interface ClipIndex extends ArrayOf3<number> {}


