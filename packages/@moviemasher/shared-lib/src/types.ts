declare global { 
  interface Window { webkitAudioContext: typeof AudioContext } 
}

export interface DocumentWindow {
  document: Document
  crypto: Crypto
  CustomEvent: typeof CustomEvent
  EventTarget: typeof EventTarget
  HTMLCanvasElement: typeof HTMLCanvasElement
  FontFace: typeof FontFace
  DOMParser: typeof DOMParser
  // fonts: typeof FontFaceSet
}


export interface Asset extends Propertied, Identified, Typed {
  asset(assetObject: string): Asset 
  assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>>
  assetIds: Strings
  assetManager: AssetManager
  assetObject: AssetObject
  assets: Assets
  decodingOfType(...types: Strings): Decoding | undefined
  decoding?: Decoding
  decodings: Decodings
  instanceArgs(object?: InstanceObject): InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  clipObject(object?: InstanceObject): ClipObject
  source: Source
  type: RawType  
  resourceOfType(...types: Array<ResourceType | Usage>): Resource | undefined
  request?: EndpointRequest
  resource?: Resource
  resources: Resources  
  hasIntrinsicTiming?: boolean  
  hasIntrinsicSizing?: boolean
}


export interface ClientAsset extends Asset {
  assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> 
  assetIconPromise(resource: Resource, options: Rect | Size, cover?: boolean): Promise<DataOrError<SvgItem>>
  imagePromise(resource: Resource): Promise<DataOrError<ClientImage>>
  saveNeeded: boolean
  savePromise(progress?: ServerProgress): Promise<StringDataOrError>
  unload(): void
}

export interface ClientAssets extends Array<ClientAsset>{}


export interface ClientInstance extends Instance {
  asset: ClientAsset
  clip: ClientClip
  unload(): void
}


export interface ClientAudibleAsset extends ClientAsset, AudibleAsset {
  audibleSource(): AudioBufferSourceNode | undefined
}

export interface ClientVisibleAsset extends ClientAsset, VisibleAsset {}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  audiblePreviewPromise(outputSize: Size, scale?: number): Promise<DataOrError<SvgItem>>
  asset: ClientAudibleAsset
  clip: ClientClip
}

export interface ClientVisibleInstance extends VisibleInstance, ClientInstance {
  asset: ClientVisibleAsset
  clip: ClientClip
  clippedElementPromise(content: ClientVisibleInstance, args: ContainerSvgItemArgs): Promise<DataOrError<SvgItemsRecord>>
  containerSvgItemPromise(args: ContainerSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>>
  contentSvgItemPromise(args: ContentSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>>
}


export interface ClipIconArgs {
  clipSize: Size
  scale: number
  width?: number
  gap?: number
  audible: boolean
  visible: boolean
  audibleHeight: number
  visibleHeight: number
}

export interface ClientClip extends Clip {
  container?: ClientInstance & ContainerInstance
  content: ClientInstance & ContentInstance
  elementPromise(size: Size, time: Time, component: Panel): Promise<DataOrError<SvgItemsRecord>>
  svgItemPromise(args: ClipIconArgs): Promise<DataOrError<SvgElement>>
  track?: ClientTrack
  updateAssetId(oldId: string, newId: string): void
}


export interface ClientTrack extends Track {
  addClips(clip: Clips, insertIndex?: number): void
  // clips: ClientClips
  frameForClipNearFrame(clip: Clip, frame?: number): number
  mash: ClientMashAsset
  removeClips(clip: Clips): void
}

export interface Edits {
  canRedo: boolean
  canSave: boolean
  canUndo: boolean
  create(object: EditObject): void
  redo(): void
  save(): void
  undo(): void
}

export interface Edit {
  redo(): void
  undo(): void
  updateSelection(): void
  affects: PropertyIds
}

export interface ClientMashAsset extends ClientAsset, MashAsset {
  actions: Edits
  addClipToTrack(clip : Clip | Clips, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(object?: TrackObject): Track
  assetObject: MashAssetObject
  buffer: number
  changeTiming(propertied: Propertied, property: string, value : number) : void
  clearPreview(): void
  clips: ClientClips
  dispatchChanged(action: Edit): void
  draw() : void
  drawnTime? : Time
  elementsPromise(size?: Size | number, selectedClip?: Clip): Promise<SvgItems>
  encoding?: Resource 
  frame: number
  framesHaveChanged(frames?: number): void 
  loading: boolean
  mashDescription(options: ClientMashDescriptionOptions, selectedClip?: Clip): ClientMashDescription
  paused: boolean
  reload(): Promise<void> | undefined
  removeClipFromTrack(clip : Clip | Clips) : void
  removeTrack(index?: number): void
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeRange: TimeRange
  timeToBuffer: Time
  tracks: ClientTracks
  updateAssetId(oldId: string, newId: string): void
}

export interface ClientMashDescriptionOptions extends MashDescriptionOptions {
  selectedClip?: Clip
  clip?: Clip
}


export interface ClientMashDescription extends MashDescription {
  size: Size
  svgItemsPromise: Promise<SvgItems>
  elementsPromise: Promise<SvgItems>
  time: Time
  selectedClip?: Clip
  mash: ClientMashAsset
}

export interface ClientTracks extends Array<ClientTrack>{}


export interface ClientClips extends Array<ClientClip>{}


export interface ServerInstance extends Instance {
  asset: ServerAsset
  commandFiles(args: CommandFileArgs): CommandFiles
}

export interface ServerAudibleInstance extends ServerInstance, AudibleInstance {
  asset: ServerAudibleAsset
  audibleCommandFiles(args: AudioCommandFileArgs): CommandFiles
}

export interface ServerVisibleInstance extends ServerInstance, VisibleInstance {
  asset: ServerVisibleAsset
  visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles
}

export interface CommandFileArgs extends CommandFileOptions, CacheArgs {
  clipTime: TimeRange
}
export interface CommandFileOptions {
  time: Time
}

export interface VideoCommandFileOptions extends CommandFileOptions {
  encodePath: AbsolutePath
  outputSize: Size
  videoRate: number
}

export interface VisibleCommandFileArgs extends VideoCommandFileOptions {
  clipTime: TimeRange  
  containerRects: RectTuple
}

export interface ServerAsset extends Asset {
  /** All files needed for audible and/or visible encode commands. */
  assetFiles(args: CacheArgs): AssetFiles

  /** Writes a command file, if it's not a raw asset. */
  commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>>
}


export interface ServerAudibleAsset extends ServerAsset, AudibleAsset {}

export interface ServerVisibleAsset extends ServerAsset, VisibleAsset {}

export interface AudioCommandFileOptions extends CommandFileOptions {
  audioRate?: number
}

export interface AudioCommandFileArgs extends AudioCommandFileOptions {
  audioRate: number
  clipTime: TimeRange
}

export interface ServerPromiseArgs extends CacheOptions { 
  commandFiles: CommandFiles
}

export interface ServerAssets extends Array<ServerAsset>{}

export interface AssetFile {
  avType?: AudioType | VideoType
  type: AssetFileType
  file: AbsolutePath
  content?: string 
  asset: ServerAsset
}

export interface AssetFiles extends Array<AssetFile>{}

export interface CommandFile extends AssetFile {
  path?: AbsolutePath
  inputOptions?: ValueRecord
  outputOptions?: ValueRecord
  inputId: string
}
export interface CommandFiles extends Array<CommandFile>{}

export interface AudibleAsset extends Asset {
  canBeMuted?: boolean
  duration: number
  frames(quantize: number): number
}

export interface VisibleAsset extends Asset {
  alpha?: boolean
  canBeContainer?: boolean
  canBeContent?: boolean
  canBeFill?: boolean
  isVector?: boolean
  probeSize?: Size
}



export type Constrained<T> = new (...args: any[]) => T

export type Lock = SizeKey | 'longest' | 'none' | 'shortest'

export type Aspect = 'flip' | 'maintain'

export type Rounding = 'ceil' | 'floor' | 'round'

export type ManageType = 'import' | 'reference' 
export interface ManageTypes extends Array<ManageType>{}

export type AVType = AudioType | VideoType | 'both'

export type Not = undefined | null | void

export type OkNumber = number

export type Numeric = OkNumber | PopulatedString
export type Value = number | string
export type Scalar = Value | boolean
export interface ScalarTuple extends ArrayOf2<string, ScalarOrUndefined>{}
export type ScalarOrUndefined = Scalar | undefined

// export type PopulatedString = string & { isEmpty: never }
export interface PopulatedString extends String {
  length: NumberNotZero
}

export interface PopulatedArray<T=any> extends Array<T> {
  length: NumberNotZero
}

export interface Anys extends Array<any>{}

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
export interface NumberTuple extends ArrayOf2<number> {}

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


export interface Point<T = number> {
  x: T
  y: T
}

export interface Points<T=number> extends Array<Point<T>>{}

export interface PointTuple<T=number> extends ArrayOf2<Point<T>> {}

// export type PointKey = 'x' | 'y'

export interface Rect<T=number> extends Size<T>, Point<T> {}

export interface Rects<T=number> extends Array<Rect<T>>{}

export interface RectTuple<T=number> extends ArrayOf2<Rect<T>> {}

export interface RectOptions extends SizeOptions, Partial<Point> {}

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

export type RawType = AudioType | ImageType | VideoType
export interface RawTypes extends Array<RawType>{}

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
  endpoint: Endpoint | string
  init?: RequestInit

  response?: ClientMedia
  objectUrl?: string
  file?: File
  urlPromise?: Promise<StringDataOrError>
  mediaPromise?: Promise<DataOrError<ClientMedia>>
  resourcePromise?: Promise<StringDataOrError>

  path?: AbsolutePath
  type?: Mimetype | DropType
}

export interface EndpointRequests extends Array<EndpointRequest>{}

export type ClientMedia = string | ClientAudio | ClientFont | ClientImage | ClientVideo 

export interface RequestInit {
  body?: any
  headers?: StringRecord
  method?: string
}

export interface Created {

  createdAt?: string
}

export interface JobProduct extends Created, Partial<Identified>, Typed {}

export interface RequestObject {
  request: EndpointRequest
}

export type FetchType = 'fetch'

export type ResourceType = string | DropType | TranscodingType
export interface ResourceTypes extends Array<ResourceType> {}

export type Usage = TranscodeType | EncodeType 
export interface Resource extends RequestObject, JobProduct {
  type: ResourceType
  usage?: Usage
}

export interface Resources extends Array<Resource>{}

export type JobType = DecodeType | EncodeType | TranscodeType | Prompt

export type DecodeType = 'decode'

export interface Decoding extends JobProduct {
  type: DecodingType
  data: UnknownRecord
}
export interface Decodings extends Array<Decoding> { }

export type EncodeType = 'encode'

export interface Encoding extends Resource {
  type: EncodingType
}
export interface Encodings extends Array<Encoding> { }

export type Prompt = 'prompt'

export interface Prompting extends Resource {
  type: RawType
  data: UnknownRecord
}
export interface Promptings extends Array<Prompting> { }

export type TranscodeType = 'transcode'

export interface Transcoding extends Resource {
  type: TranscodingType
}

export interface Transcodings extends Array<Transcoding> { }

export interface Property extends Typed, Ordered {
  defaultValue?: Scalar
  max?: number
  min?: number
  name: string
  options?: Scalars
  step?: number
  targetId?: TargetId
  tweens?: boolean
  undefinedAllowed?: boolean
  immutable?: boolean
}

export interface Properties extends Array<Property>{}

export interface PropertyRecord extends Record<string, Property>{}

export interface Propertied  {
  boolean(key: string): boolean
  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject
  changeScalars(scalars: ScalarsById): ChangeEditObject
  constrainedValue(found: Property, value?: Scalar): Scalar | undefined
  number(key: string): number
  properties: Properties
  propertyFind(name: string): Property | undefined
  propertyIds(targetIds?: TargetIds): PropertyIds
  propertyInstance(object: Property): Property 
  setValue(name: string, value?: Scalar): ScalarTuple
  string(key: string): string
  targetId: TargetId
  toJSON(): UnknownRecord
  value(key: string): Scalar | undefined
  tweenValues(key: string, time: Time, range: TimeRange): Scalars 
  shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined
}

export type AssetRecord<T = string> = { [key in RawType]?: T }

export interface Typed {
  type: string
}

export interface MashAsset extends Asset { 
  mashIndex: MashIndex
  mashDescription(options: MashDescriptionOptions): MashDescription
  clipInstance(object: ClipObject): Clip
  clips: Clips
  clipsAudibleInTime(time: Time): Clips
  clipsInTimeOfType(time: Time, avType?: AVType): Clips
  duration: number
  endTime: Time
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

export interface MashAudioAssetObject extends MashAssetObject {}

export interface MashImageAssetObject extends MashAssetObject {}

export interface MashVideoAssetObject extends MashAssetObject {}

export interface MashInstanceObject extends InstanceObject {}

export interface PromptAsset extends Asset {}

export interface PromptAssets extends Array<PromptAsset>{}

export interface PromptAssetObject extends AssetObject {}

export interface PromptAudioAssetObject extends PromptAssetObject {}

export interface PromptImageAssetObject extends PromptAssetObject {}

export interface PromptVideoAssetObject extends PromptAssetObject {}

export interface ClientTextAsset extends TextAsset, ClientAsset {
  assetObject: TextAssetObject
}

export interface ClientTextInstance extends TextInstance, ClientInstance {
  clip: ClientClip
  asset: ClientTextAsset
}

export interface ClientTextAssetObject extends TextAssetObject {}

export interface TextAsset extends ContainerAsset {
  assetObject: TextAssetObject
  family: string
  style(prefix?: string): SvgStyleElement
}

export interface TextInstance extends ContainerInstance {
  asset: TextAsset
}

export interface TextInstanceObject extends VisibleInstanceObject {
  text?: string
}

export interface TextAssetObject extends AssetObject {
  text?: string
}

export interface VideoInstance extends VisibleInstance, AudibleInstance {
  asset: VideoAsset
}

export interface VideoInstanceObject extends VisibleInstanceObject, AudibleInstanceObject { }

export interface VideoInstanceArgs extends InstanceArgs, VideoInstanceObject {
  asset: VideoAsset
}

export type DecodingType = string 

export interface DecodingTypes extends Array<DecodingType> { }

export interface DecodeOptions {}

export type ColorSource = 'color'
export type RawSource = 'raw'

export type KnownSource = ContainerSource | ContentSource | ColorSource | MashSource | RawSource | ShapeSource | TextSource | Prompt
export type Source = string | KnownSource

export interface Sources extends Array<Source>{}

export type TextSource = 'text'

export type ContentSource = 'content'
export type ContainerSource = 'container'
export type MashSource = 'mash'

export type EncodingType = RawType
export interface EncodingTypes extends Array<EncodingType>{}

export type FontType = 'font'

export type ShapeSource = 'shape'
export type ImportType = RawType | ShapeSource | TextSource
export interface ImportTypes extends Array<ImportType>{}

export type BitmapsType = 'bitmaps'
export type AlphaType = ImageType | BitmapsType | VideoType
export type WaveformType = 'waveform'
export type TranscodingType = RawType | BitmapsType | WaveformType
export interface TranscodingTypes extends Array<TranscodingType>{}
export type SvgType = 'svg'
export type SvgsType = 'svgs'
export type TxtType = 'txt'
export type DropType = RawType | FontType
export interface DropTypes extends Array<DropType>{}
export type AssetFileType = SvgType | SvgsType | TxtType | DropType
export type RequestType = TranscodingType | AssetFileType

export interface Assets extends Array<Asset>{}

export interface AssetObject extends Identified, Labeled, Sourced, Typed {
  assets?: AssetObjects
  created?: string
  decodings?: Decodings
  resources?: Resources
  type: RawType 
}

export interface AssetArgs extends AssetObject {
  assetManager: AssetManager
}

export interface AssetObjects extends Array<AssetObject>{}


export interface SourceAsset extends Asset {
  source: Source
}

export type StringOrRecord = string | StringRecord

export interface StringOrRecords extends Array<StringOrRecord>{}

export interface AssetParams {
  types?: RawTypes | RawType
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

export type ContainerTiming = 'container'
export type ContentTiming = 'content'
export type CustomTiming = 'custom'
export type Timing = CustomTiming | ContentTiming | ContainerTiming

export interface Time {
  // add(time: Time): Time
  closest(timeRange: TimeRange): Time
  copy: Time
  // divide(number: number, rounding?: string): Time
  equalsTime(time: Time): boolean
  fps: number
  frame: number
  durationFrames(duration: number, fps?: number): Numbers
  lengthSeconds: number
  isRange: boolean
  // min(time: Time): Time
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

export interface Size<T=number> {
  width: T
  height: T
}


export type NumberNotZero = Exclude<number, 0> 

export interface NonZeroSize extends Size {
  width: NumberNotZero
  height: NumberNotZero
}

export interface RectNotZero extends NonZeroSize, Point {}

export interface Sizes<T=number> extends Array<Size<T>> {}

export interface SizeTuple<T=number> extends ArrayOf2<Size<T>> {}

export interface SizeOptions extends Partial<Size> {
  lock?: Lock
  shortest?: SizeKey
}

export type SizeKey = 'width' | 'height'


export type Direction = SideDirection | CornerDirection

export type SideDirection = 'top' | 'right' | 'bottom' | 'left'


export type CornerDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface Directions extends Array<Direction>{}

export interface SideDirectionRecord extends Partial<Record<SideDirection, boolean>>{}


export interface ShapeAsset extends VisibleAsset {
  pathSize: Size
  // path: string
  // pathWidth: number
  // pathHeight: number
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

export interface AudioInstance extends AudibleInstance {
  asset: AudioAsset
}

export interface AudioInstanceObject extends InstanceObject {}

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

export interface CacheArgs {
  validDirectories?: AbsolutePaths
  audible?: boolean
  visible?: boolean
}

export interface CacheOptions extends CacheArgs {
  size?: Size
  time?: Time
  quantize?: number
}

export interface InstanceCacheArgs extends CacheOptions {
  clipTime: TimeRange
  time: Time
  quantize: number
}

export interface AssetCacheArgs extends CacheOptions {
  assetTime?: Time
}

export interface InstanceArgs extends InstanceObject {
  asset: Asset
}

export type Transparency = 'alpha' | 'luminance'

export interface IntrinsicOptions {
  size?: boolean
  duration?: boolean
}

export interface ColorAsset extends VisibleAsset {}

export interface ColorInstance extends VisibleInstance {
  asset: ColorAsset
}

export interface ColorInstanceObject extends ImageInstanceObject {
  color?: string
}

export interface ContainerRectArgs {
  outputSize: Size
  time: Time
  timeRange: TimeRange
  loading?: boolean
}

export interface ContentRectArgs {
  outputSize: Size
  containerRects: RectTuple
  loading?: boolean
  time: Time
  timeRange: TimeRange
}


export interface ContainerInstance extends VisibleInstance {
  asset: ContainerAsset
}

export interface ContainerAsset extends VisibleAsset {}

export type ContentInstance = VisibleInstance | AudibleInstance

export type ContentAsset = VisibleAsset | AudibleAsset 

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
  dispatch: <T=any>(typeOrEvent: CustomEvent<T> | Event) => boolean
  listenersAdd(record: EventDispatcherListeners): void
  listenersRemove(record: EventDispatcherListeners): void
}

export interface Importer extends Identified, Labeled {}

export interface Importers extends Array<Importer>{}

export interface Exporter extends Identified, Labeled {}

export interface Exporters extends Array<Exporter>{}

export type ClientOrServer = 'client' | 'server'

export interface ImportResult {}




export interface  MovieMasherOptions {
  assetObject?: EndpointRequest | AssetObject
  assetObjects?: EndpointRequest | AssetObjects
  icons?: EndpointRequest | StringRecord
  transcode?: false | Record<RawType, TranscodingTypes>
  waveformTransparency?: Transparency
  timeline?: BooleanRecord
  patchSvg?: SvgElement
  supportsSvgLoad?: boolean
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
export type ScanType = 'scan'
export type ProbeType = 'probe'

export interface Scanning extends Decoding {
  type: ScanType
  data: ScanningData
}

export interface ScanningData extends UnknownRecord {
  family: string
  raw?: RawScanData
}

export interface RawScanData extends UnknownRecord {
  family?: string // "Lobster"(s)
  familylang?: string // "en"(s)
  style?: string // "Regular"(s)
  stylelang?: string // "en"(s)
  fullname?: string // "Lobster Regular"(s)
  fullnamelang?: string // "en"(s)
  slant?: number // 0(i)(s)
  weight?: number // 80(f)(s)
  width?: number // 100(f)(s)
  foundry?: string // "IMPA"(s)
  // file?: string // "/app/temporary/assets/font/lobster/lobster.ttf"(s)
  index?: number // 0(i)(s)
  outline?: number // True(s)
  scalable?: number // True(s)
  fontversion?: number // 137625(i)(s)
  capability?: string // "otlayout:DFLT otlayout:cyrl otlayout:latn"(s)
  fontformat?: string // "TrueType"(s)
  decorative?: number // False(s)
  postscriptname?: string // "Lobster-Regular"(s)
  color?: number // False(s)
  symbol?: number // False(s)
  variable?: number // False(s)
  fonthashint?: number // True(s)
  order?: number // 0(i)(s)
}

export interface Probing extends Decoding {
  type: ProbeType
  data: ProbingData
}

export interface ProbingData extends UnknownRecord {
  audible?: boolean
  duration?: number
  extension?: string
  alpha?: boolean
  fps?: number
  height?: number
  width?: number
  raw?: RawProbeData
}

export interface RawProbeData {
  streams: ProbingStream[]
  format: ProbingFormat
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

export interface ChangeEdit extends Edit {
  target: Propertied
  updateEdit(object: ChangeEditObject): void
}

export interface ChangeEditObject extends EditObject {
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

export type AbsolutePath = `/${string}`
export interface AbsolutePaths extends Array<AbsolutePath>{}

export type Mimetype = `${string}/${string}`

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
  assetType?: RawType
}

export interface MashDescriptionArgs extends MashDescriptionOptions {
  mash: MashAsset
}

export interface SegmentDescription {}

export interface SegmentDescriptionArgs {
  mashDescription: MashDescription
}

export interface AudioAsset extends AudibleAsset {}
export interface ImageAsset extends VisibleAsset {}

export interface VideoAsset extends VisibleAsset, AudibleAsset {}

export interface MashInstance extends Instance {
  asset: MashAsset
}

export type Panel = BrowserPanel | PlayerPanel | TimelinePanel | ImporterPanel | ExporterPanel

export type BrowserPanel = 'browser'
export type PlayerPanel = 'player'
export type TimelinePanel = 'timeline'
export type ImporterPanel = 'importer'
export type ExporterPanel = 'exporter'

export type SvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement | SVGFEComponentTransferElement
export interface SvgFilters extends Array<SvgFilter>{}

export interface ClientImage extends HTMLImageElement {}

export interface ClientAudio extends AudioBuffer {}
export interface ClientFont extends FontFace {}
export interface ClientVideo extends HTMLVideoElement {}

export type SvgElement = SVGSVGElement 
export type SvgItem = SVGElement | ClientImage 
export type SvgVector = SVGTextElement | SVGPolygonElement | SVGPathElement | SVGRectElement | SVGCircleElement | SVGEllipseElement
export type SvgStyleElement = SVGStyleElement
export interface SvgStyleElements extends Array<SvgStyleElement>{}
export interface SvgItems extends Array<SvgItem>{}

export interface SvgItemsRecord {
  defs: SvgItems
  items: SvgItems
  styles: SvgStyleElements
}

export interface ComplexSvgItem {
  svgItem: SvgItem
  style?: SvgStyleElement
  defs?: SvgItems
}

export interface SvgItemArgs {
  /** The full output size. */
  size: Size
  /** The time for which an svg item is needed. */
  time: Time
  /** The clip time range. */
  timeRange: TimeRange
  /** The panel that is requesting the svg item, or undefined for server. */
  panel?: Panel
  /** Potential opacity that should be applied. */
  opacity?: Scalar
}

export interface ContentSvgItemArgs extends SvgItemArgs {
  /** Area to paint content into. */
  contentRect: Rect
}

export interface ContainerSvgItemArgs extends SvgItemArgs {
  /** Area to draw container within. */
  containerRect: Rect
  /** Potential fill color for masking. */
  color?: string

}

export type MaybeComplexSvgItem = SvgItem | ComplexSvgItem
export interface MaybeComplexSvgItems extends Array<MaybeComplexSvgItem>{}


export interface VisibleContentAsset extends VisibleAsset {}
  
export interface VisibleContentInstance extends VisibleInstance {}

export interface AssetPromiseEventDetail {
  assetId: string
  assetObject?: AssetObject
  promise?: Promise<DataOrError<Asset>>
}


export interface MashIndex extends ArrayOf1<number> {}

export interface TrackIndex extends ArrayOf2<number> {}

export interface ClipIndex extends ArrayOf3<number> {}

export interface Evaluation {
  description: string
  toJSON(): EvaluationObject
  toNumber(): number
  toString(): string
  toValue(): Value
  variables: NumberRecord
}


export type EvaluationValue = Evaluation | Value 

export type EvaluationValueObject = Value | EvaluationObject

export interface EvaluationObject {
  operationId: string
  name?: string
  evaluations: EvaluationValueObjects
  variables?: NumberRecord
}
export interface EvaluationValueObjects extends Array<EvaluationValueObject> {}

export interface EvaluationValues extends Array<EvaluationValue> {}


export interface EvaluationPoint {
  x: EvaluationValue
  y: EvaluationValue
}
export interface EvaluationSize {
  width: EvaluationValue
  height: EvaluationValue
}

export interface EvaluationRect extends EvaluationPoint, EvaluationSize {}

export interface EvaluationPoints extends Array<EvaluationPoint> {}
export interface EvaluationSizes extends Array<EvaluationSize> {}


export interface EventResourcePromiseDetail {
  resource: Resource
  validDirectories?: AbsolutePaths
  promise?: Promise<StringDataOrError>
}


export interface AssetResource extends Resource {
  type: RawType
}

export interface DropResource extends Resource {
  type: DropType
}

export interface JobOptions {
  validDirectories?: AbsolutePaths
  user?: string
  id?: string
  progress?: ServerProgress
}

export interface ServerProgress {
  do: NumberSetter
  did: NumberSetter
  done: VoidFunction
}

export interface DecodeArgs {
  resource: DropResource
  type: DecodingType
  options?: DecodeOptions
}

export interface ReturningFunction<RET = any, OPTS extends object = object> {
  (args?: OPTS): DataOrError<RET>
}


export interface PromiseFunction<RET = any, OPTS extends object = object, ARGS extends Typed = Typed> {
  (args: ARGS, options?: OPTS): Promise<DataOrError<RET>>
}

export interface DecodeFunction extends PromiseFunction<Decoding, JobOptions, DecodeArgs> {}
export interface TranscodeFunction extends PromiseFunction<string | Transcoding, JobOptions, TranscodeArgs> {}
export interface RetrieveFunction extends PromiseFunction<string, JobOptions, Resource> {}

export interface FileWriteArgs extends Typed {
  path: AbsolutePath
  content: string
  dontReplace?: boolean
}

export interface FileFunction extends PromiseFunction<string, JobOptions, FileWriteArgs> {}


export interface UploadResult {
  assetRequest: EndpointRequest
  id?: string
}
export interface RequestArgs extends Typed {
  request: EndpointRequest
}


export interface SaveFunction extends PromiseFunction<string, JobOptions, Asset> {}

export interface FileUploadFunction extends PromiseFunction<UploadResult, JobOptions, RequestArgs> {}

export interface TextRectArgs {
  size: number
  family: string,
  text: string
  fontPath?: AbsolutePath
}

export interface EncodeArgs extends Typed {
  type: EncodingType
  asset: MashAssetObject
  options?: EncodeOptions
}

export interface EncodeFunction extends PromiseFunction<string | Encoding, JobOptions, EncodeArgs> {}
export interface AssetFunction extends ReturningFunction<Asset, AssetArgs> {}

export interface TranscodeArgs {
  resource: AssetResource
  type: TranscodingType
  options: TranscodeOptions
}

export interface AssetManager {
  get(id: string): DataOrError<Asset>
  define(...assetObjects: (AssetObject | Identified)[]): Promise<DataOrError<Assets>>
  undefine(id?: string | Strings): void
  updateDefinitionId(previousId: string, currentId: string): void
}

export type AssetType = 'asset'

export type ModuleType = string | FetchType | RawType | JobType

export interface MovieMasherRuntime extends EventDispatcher {
  context: ClientOrServer
  imports: StringRecord
  options: MovieMasherOptions
  importPromise(): Promise<DataOrError<ImportResult>>
  window: DocumentWindow
//* Call a loaded function. */
  call<RET = any, OPTS extends object = object>(id: string, moduleType?: ModuleType, args?: OPTS): DataOrError<RET> 

  /** install and load a function asyncronously  */
  load<RET=any, OPTS extends object = object>(moduleType: ModuleType, id: string, moduleId: string, exported?: string): Promise<DataOrError<ReturningFunction<RET, OPTS>>>

  /** Install a PromiseFunction for a module type, aside from asset.  */
  install(moduleType: ModuleType, id: string, moduleId: string, exported?: string): DefiniteError | undefined

  /** Call installed promise function, loading if needed. */
  promise<RET=any, OPTS extends object = object, ARGS extends Typed=Typed>(args: ARGS, moduleType?: ModuleType, opts?: OPTS): Promise<DataOrError<RET>>

}

export interface MovieMasherInstance extends MovieMasherRuntime {
  eventDispatcher: EventDispatcher
}

export interface Instance extends Propertied, Identified {
  asset: Asset
  assetId: string
  assetIds: Strings
  assetTime(masherTime: Time): Time
  canBeMuted: boolean
  clip: Clip
  frames(quantize: number): number 
  instanceCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>>
  instanceObject: InstanceObject
  intrinsicsKnown(options: IntrinsicOptions): boolean
  isDefault: boolean
  muted: boolean
}

export interface InstanceObject {
  assetId?: string
}

export interface AudibleInstance extends Instance {
  /** @returns Array containing duration, start trim, and end trim in frames. */
  assetFrames(quantize: number): Numbers
}

export interface AudibleInstanceObject extends InstanceObject {
  gain?: number
  muted?: boolean
  loops?: number
  speed?: number
  startTrim?: number
  endTrim?: number
}

export interface VisibleInstance extends Instance {
  asset: VisibleAsset
  clippedElement(content: VisibleContentInstance, args: ContainerSvgItemArgs): DataOrError<SvgItemsRecord>
  containedItem(contentItem: MaybeComplexSvgItem, containerItem: MaybeComplexSvgItem, args: ContainerSvgItemArgs): DataOrError<SvgItemsRecord>
  containerRects(args: ContainerRectArgs, sizingSize: Size): RectTuple
  containerSvgItem(args: ContainerSvgItemArgs): DataOrError<MaybeComplexSvgItem>
  contentRect(time: Time, containerRect: Rect, outputSize: Size): Rect
  contentRects(args: ContentRectArgs): RectTuple 
  contentSvgItem(args: ContentSvgItemArgs): DataOrError<MaybeComplexSvgItem>
  cropDirections: SideDirectionRecord
  intrinsicRect: Rect
  scaleRects(time: Time, range: TimeRange): RectTuple
  sizeKey?: SizeKey
  svgVector(rect: Rect, forecolor?: string, opacity?: Scalar): SvgVector
  tweening: boolean
  tweens(key: string): boolean
}

export interface VisibleInstanceObject extends InstanceObject {
  container?: boolean

  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  lock?: string

  height?: number
  heightEnd?: number

  width?: number
  widthEnd?: number
  pointAspect?: string
  sizeAspect?: string
}


export interface Clip extends Propertied {
  asset(assetIdOrObject: string): Asset 
  assetIds: Strings
  audible: boolean
  canBeMuted: boolean
  clipCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>>
  clipIndex: ClipIndex
  clipObject: ClipObject
  clipRects(args: ContainerRectArgs): RectTuple
  container?: ContainerInstance
  content: ContentInstance
  endFrame: number
  frame : number
  frames: number
  id: string
  intrinsicsKnown(options: IntrinsicOptions): boolean
  maxFrames(quantize : number, trim? : number) : number
  muted: boolean
  resetTiming(instance?: Instance, quantize?: number): void
  sizingRect(size: Size, loading?: boolean): Rect
  timeRange: TimeRange
  track?: Track
  trackNumber: number
  visible : boolean
}

export interface Clips extends Array<Clip>{}

export interface ClipObject extends Labeled {
  opacity?: number
  opacityEnd?: number
  containerId?: string
  contentId?: string
  content?: VisibleInstanceObject | AudibleInstanceObject
  container?: VisibleInstanceObject
  frame?: number
  transparency?: Transparency | string
  timing?: string
  sizing?: string
  frames?: number
}

export interface ClipObjects extends Array<ClipObject>{}


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


// interface Animation {
//   percent: number
//   scalar: Scalar
// }


// interface AnimationStart extends Animation {
//   percent: 0
// }

// interface AnimationEnd extends Animation {
//   percent: 1
// }
// type One = 1 | 0
// const one: One = 1
// interface AnimationMiddle extends Animation {
//   percent: NumberNotZero
// }

// type Animations = [AnimationStart, ...[AnimationMiddle], AnimationEnd]

// const animationsStart: AnimationStart = { percent: 0, scalar: 0 }
// const animationsMiddle: AnimationMiddle = { percent: one, scalar: 0.5 }
// const { percent, scalar } = animationsMiddle
// const animationsEnd: AnimationEnd = { percent: 1, scalar: 1 }

// const animations: Animations = [
//   animationsStart,
//   animationsMiddle,
//   animationsEnd
// ]