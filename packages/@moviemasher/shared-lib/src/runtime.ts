import type { Rounding, AVType, AlphaProbing, AlphaType, Asset, AssetObject, AssetType, AssetTypes, AudibleProbing, AudibleType, AudioAssetObject, AudioOutputOptions, AudioType, BooleanDataType, ColorAssetObject, ColorSource, CornerDirection, DataType, DecodeType, Decoding, DefiniteError, Directions, DurationProbing, EncodeType, ErrorObject, EventDispatcher, EventDispatcherListeners, FontType, Framed, Identified, ImageAssetObject, ImageOutputOptions, ImageType, DropType, DropTypes, Importer, Indexed, Lock, MashAudioAssetObject, MashImageAssetObject, MashSource, MashVideoAssetObject, NumberDataType, Numbers, Ordered, OutputOptions, Point, PopulatedString, ProbeType, Probing, ProbingTypes, PromptAudioAssetObject, PromptImageAssetObject, PromptSource, PromptVideoAssetObject, RawAudioAssetObject, RawImageAssetObject, RawSource, RawVideoAssetObject, Rect, SequenceOutputOptions, BitmapsType, ShapeAssetObject, ShapeSource, SideDirection, Size, SizeProbing, Source, SourceAsset, StringDataType, StringRecord, Strings, StringsRecord, TargetIds, TextAssetObject, TextSource, Timing, Tracked, TranscodeType, TranscodingType, Transparency, Typed, Unknowns, ValueRecord, VideoAssetObject, VideoOutputOptions, VideoType, VisibleType, WaveformOutputOptions, WaveformType, ImportTypes, Mimetype, AbsolutePath, MovieMasherRuntime, EventDispatcherListener, EventOptions, AssetPromiseEventDetail, Value, Numeric } from './types.js'


type ErrorNameType = typeof ERROR[keyof typeof ERROR] | string

type ErrorContext = ValueRecord | string | undefined

const IdPrefix = 'com.moviemasher.'
const IdSuffix = '.default'

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const LIST = 'LIST'

export const HTTP = 'http'
export const HTTPS = 'https'

export const AUDIO: AudioType = 'audio'
export const COLOR: ColorSource = 'color'
export const FONT: FontType = 'font'
export const IMAGE: ImageType = 'image'
export const MASH: MashSource = 'mash'
export const PROMPT: PromptSource = 'prompt'
export const RAW: RawSource = 'raw'
export const SHAPE: ShapeSource = 'shape'
export const TEXT: TextSource = 'text'
export const VIDEO: VideoType = 'video'

export const ASTERISK = '*'
export const COLON = ':'
export const COMMA = ','
export const EQUALS = '='
export const NEWLINE = '\n'
export const QUESTION = '?'
export const SEMICOLON = ';'
export const SLASH = '/'
export const DOT = '.';
export const DASH = '-'
export const PIPE = '|'
export const SPACE = ' '

export const JSON = 'json'
export const TXT = 'txt'
export const SVG = 'svg'

export const MIME_JSON = `application/${JSON}`
export const MIME_CSS = `${TEXT}/css`
export const MIME_MULTI = 'multipart/form-data'
export const CONTENT_TYPE = 'Content-Type'

export const NAMESPACE_SVG = 'http://www.w3.org/2000/svg'
export const NAMESPACE_XLINK = 'http://www.w3.org/1999/xlink'

export const CUSTOM = 'custom'
export const ASSET_TARGET = 'asset'
export const CLIP_TARGET = 'clip'
export const CONTAINER = 'container'
export const CONTENT = 'content'
export const CHANGE = 'change'
export const CHANGE_MULTIPLE = 'change-multiple'

export const BOTH: AVType = 'both'

export const VERSION = '5.2.0'

export const PROBE: ProbeType = 'probe'
export const BITMAPS = 'bitmaps'
export const SVGS = 'svgs'
export const WAVEFORM = 'waveform'

export const FLIP = 'flip'
export const MAINTAIN = 'maintain'
export const LONGEST = 'longest'
export const NONE = 'none'
export const SHORTEST = 'shortest'


export const $OPACITY = 'opacity'
export const $POINT = 'point'
export const $SIZE = 'size'


export const ALPHA: AlphaProbing = 'alpha'
export const AUDIBLE: AudibleProbing = 'audible'
export const DURATION: DurationProbing = 'duration'
export const SIZE_PROBING: SizeProbing = 'size'
export const LUMINANCE: Transparency = 'luminance'

// Note: these are all capitalized since they are suffixes
export const END = 'End'
export const CROP = 'Crop'
export const ASPECT = 'Aspect'


export const LEFT: SideDirection = 'left';
export const TOP: SideDirection = 'top';
export const BOTTOM: SideDirection = 'bottom';
export const RIGHT: SideDirection = 'right';


export const TOP_RIGHT: CornerDirection = 'top-right'
export const TOP_LEFT: CornerDirection = 'top-left'
export const BOTTOM_RIGHT: CornerDirection = 'bottom-right'
export const BOTTOM_LEFT: CornerDirection = 'bottom-left'


export const BOOLEAN: BooleanDataType = 'boolean'
export const NUMBER: NumberDataType = 'number'
export const STRING: StringDataType = 'string'
export const CONTAINER_ID: DataType = 'containerid'
export const CONTENT_ID: DataType = 'contentid'
export const FRAME = 'frame'
export const PERCENT: DataType = 'percent'
export const RGB: DataType = 'rgb'
export const CACHE_ALL = 'cache_all'
export const CACHE_NONE = 'cache_none'
export const CACHE_SOURCE_TYPE = 'cache_source_type'


export const DEFAULT_CONTENT_ID = `${IdPrefix}content.image${IdSuffix}`
export const DEFAULT_CONTAINER_ID = `${IdPrefix}container.image${IdSuffix}`

export const TEMPORARY = 'temporary'
export const TEXT_HEIGHT = 1000

export const DECODE: DecodeType = 'decode'
export const ENCODE: EncodeType = 'encode'
export const TRANSCODE: TranscodeType = 'transcode'
export const CURRENT_COLOR = 'currentColor'
export const RGB_BLACK = '#000000'
export const RGB_GRAY = '#808080'
export const RGB_WHITE = '#FFFFFF'
export const RGBA_BLACK = '#000000FF'
export const RGBA_BLACK_ZERO = '#00000000'
export const RGBA_WHITE_ZERO = '#FFFFFF00'


export const ASSET_DURATION = 3
export const DURATION_UNKNOWN = -1
export const DURATION_UNLIMITED = -2
export const DURATION_NONE = 0
export const FRAMES_MINIMUM = 2

export const ASSET_TYPES: AssetTypes = [VIDEO, AUDIO, IMAGE]
export const AUDIBLE_TYPES: AudibleType[] = [AUDIO, VIDEO]
export const VISIBLE_TYPES: AssetTypes = [IMAGE, VIDEO]
export const DROP_TYPES: DropTypes = [FONT, ...ASSET_TYPES]
export const IMPORT_TYPES: ImportTypes = [...ASSET_TYPES, TEXT, SHAPE]
export const PROBING_TYPES: ProbingTypes = [ALPHA, AUDIBLE, DURATION, SIZE_PROBING]


export const ASPECTS = [FLIP, MAINTAIN] 

export const RGB_KEYS = ['r', 'g', 'b'] as const
export const RGBA_KEYS = [...RGB_KEYS, 'a'] as const
export const $X: string & 'x' = 'x' 
export const $Y: string & 'y' = 'y' 

export const HEIGHT: string & 'height' = 'height'
export const WIDTH: string & 'width' = 'width'

export const POINT_KEYS = [$X, $Y] as const
export const SIZE_KEYS = [WIDTH, HEIGHT] as const
export const RECT_KEYS = [...POINT_KEYS, ...SIZE_KEYS] as const

export const LOCKS: Lock[] = [HEIGHT, LONGEST, NONE, SHORTEST, WIDTH]


export const DIRECTIONS_SIDE: SideDirection[] = [
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
]

export const DIRECTIONS_CORNER = [
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
]

export const DIRECTIONS_ALL: Directions = [
  ...DIRECTIONS_CORNER,
  ...DIRECTIONS_SIDE,
]

export const TARGET_IDS: TargetIds = [
  MASH, CLIP_TARGET, CONTENT, CONTAINER, ASSET_TARGET
]

export const SIZINGS = [MASH, CONTENT, CONTAINER]
export const TIMINGS = [CUSTOM, CONTENT, CONTAINER]
export const TRANSPARENCIES = [ALPHA, LUMINANCE]


export const POINT_ZERO: Point = { x: 0, y: 0 } as const
export const SIZE_ZERO = { width: 0, height: 0 } as const
export const SIZE_OUTPUT: Size = { width: 1920, height: 1080 } as const
export const RECT_ZERO: Rect = { ...POINT_ZERO, ...SIZE_ZERO } as const

export const ERROR = {
  ClientDisabledDelete: 'client.disabled.delete',
  ClientDisabledGet: 'client.disabled.get',
  ClientDisabledList: 'client.disabled.list',
  ClientDisabledSave: 'client.disabled.save',
  DecodeProbe: 'decode.probe',
  Environment: 'error.environment',
  Evaluation: 'error.evaluation',
  FilterId: 'filter.id',
  Frame: 'error.frame',
  Ffmpeg: 'ffpmeg',
  ImportDuration: 'import.duration',
  ImportFile: 'import.file',
  ImportSize: 'import.size',
  ImportType: 'import.type',
  ImportExtension: 'import.extension',
  Internal: 'error.internal',
  AssetId: 'asset.id',
  OutputDimensions: 'output.dimensions',
  OutputDuration: 'output.duration',
  Range: 'error.range',
  Reference: 'error.reference',
  ServerAuthentication: 'server.authentication',
  ServerAuthorization: 'server.authorization',
  Syntax: 'error.syntax',
  Type: 'error.type',
  Unavailable: 'error.unavilable',
  Unimplemented: 'error.unimplemented',
  Unknown: 'error.unknown',
  Url: 'error.url',
} as const

export const ERROR_NAMES: Strings = Object.values(ERROR)

export const OUTPUT_DEFAULTS: Record<TranscodingType, OutputOptions> = {
  [AUDIO]:  {
    options: {},
    audioBitrate: 160,
    audioCodec: 'libmp3lame',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'mp3',
  }, 
  [BITMAPS]: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'jpg',
  },
  [WAVEFORM]: {
    options: {},
    width: 320,
    height: 100,
    forecolor: '#000000',
    backcolor: '#00000000',
    audioBitrate: 160,
    audioCodec: 'aac',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'png',
  },
  [IMAGE]: {
    options: {},
    width: 320,
    height: 240,
    extension: 'jpg',
  },
  [VIDEO]: {
    options: {
      // g: 60,
      level: 41,
      movflags: 'faststart'
    },
    width: 1920 / 4,
    height: 1080 / 4,
    videoRate: 30,
    videoBitrate: 2000,
    audioBitrate: 160,
    audioCodec: 'aac',
    videoCodec: 'libx264',
    audioChannels: 2,
    audioRate: 44100,
    // g: 0,
    format: 'mp4',
  },
}

export const ALPHA_OUTPUT_DEFAULTS = {
  [IMAGE]: {
    options: {},
    width: 320,
    height: 240,
    extension: 'png',
    format: 'image2',
    offset: 0
  },
  [BITMAPS]: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'png',
  },
  [VIDEO]: {
    options: {
      g: 60,
      level: 41,
      movflags: 'faststart'
    },
    width: 1920,
    height: 1080,
    videoRate: 30,
    videoBitrate: 2000,
    audioBitrate: 160,
    audioCodec: 'aac',
    videoCodec: 'libx264',
    audioChannels: 2,
    audioRate: 44100,
    g: 0,
    format: 'mp4',
    extension: 'mp4',
  },
}

export const VOID_FUNCTION = () => {}

export const length = (value: string | Unknowns): boolean => !!value.length
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isString = (value: any): value is string => (
  typeof value === 'string'
)
export const isPopulatedString = (value: any): value is PopulatedString => (
  isString(value) && length(String(value))
)

export const isUndefined = (value: any): boolean => typeof value === 'undefined'
export const isDefined = <T = any>(value: any): value is T => !isUndefined(value)

export const isObject = (value: any): value is object => typeof value === 'object'

export const isNumber = (value: any): value is number => (
  isNumberOrNaN(value) && !Number.isNaN(value)
)

export const isNumberOrNaN = (value: any): value is number => typeof value === 'number'

export const isNan = (value: any): boolean => isNumberOrNaN(value) && Number.isNaN(value)

export const isNumeric = (value: any): value is Numeric => (
  (isNumber(value) || isPopulatedString(value)) && !isNan(Number(value))
)

export function isArray<T = unknown>(value: any): value is T[] {
  return Array.isArray(value)
}

export const isFunction = (value: any): value is Function => typeof value === 'function'

export const isDate = (value: any): value is Date => value instanceof Date
export const isTyped = (value: any): value is Typed => {
  return isObject(value) &&
    'type' in value &&
    isPopulatedString(value.type)
}
export function assertTyped(value: any, name?: string): asserts value is Typed {
  if (!isTyped(value))
    errorThrow(value, 'Typed', name)
}

export const isProbing = (value: any): value is Probing => {
  return isDecoding(value) && value.type === PROBE
}
export function assertProbing(value: any): asserts value is Probing {
  if (!isProbing(value)) errorThrow(value, 'Probing') 
}

export function typeOutputOptions(type: AudioType, overrides?: OutputOptions): AudioOutputOptions
export function typeOutputOptions(type: ImageType, overrides?: OutputOptions): ImageOutputOptions
export function typeOutputOptions(type: BitmapsType, overrides?: OutputOptions): SequenceOutputOptions
export function typeOutputOptions(type: VideoType, overrides?: OutputOptions): VideoOutputOptions
export function typeOutputOptions(type: WaveformType, overrides?: OutputOptions): WaveformOutputOptions
export function typeOutputOptions(type: TranscodingType, overrides?: OutputOptions): OutputOptions 
export function typeOutputOptions(type: TranscodingType, overrides?: OutputOptions): OutputOptions {
  return { ...OUTPUT_DEFAULTS[type], ...overrides }
}

export function typeOutputAlphaOptions(type: ImageType, overrides?: OutputOptions): ImageOutputOptions
export function typeOutputAlphaOptions(type: BitmapsType, overrides?: OutputOptions): SequenceOutputOptions
export function typeOutputAlphaOptions(type: VideoType, overrides?: OutputOptions): VideoOutputOptions
export function typeOutputAlphaOptions(type: AlphaType, overrides?: OutputOptions): OutputOptions 
export function typeOutputAlphaOptions(type: AlphaType, overrides?: OutputOptions): OutputOptions {
  return { ...ALPHA_OUTPUT_DEFAULTS[type], ...overrides }
}

export const isDropType = (value?: any): value is DropType => (
  DROP_TYPES.includes(value)
)

export const isTiming = (value?: any): value is Timing => (
  TIMINGS.includes(value)
)

export const isImporter = (value?: any): value is Importer => (
  isIdentified(value) 
  && 'source' in value && isPopulatedString(value.source)
  && 'types' in value && isArray(value.types)
)

export const mimeDropType = (mimetype: string): DropType | undefined => {
  const [type] = mimetype.split(SLASH)
  if (isDropType(type)) return type
}

const Counts = new Map<string, number> ()

export const idReset = () => Counts.clear()

export const idGenerateString = (): string => {
  return [
    TEMPORARY, Date.now().toString(36), Math.random().toString(36).slice(2)
  ].join(DASH)
}

export const idGenerate = (prefix: string): string => {
  const count = Counts.get(prefix) || 0
  Counts.set(prefix, count + 1)
  return [prefix, String(count)].join(DASH)
}

export const idTemporary = () => idGenerate(TEMPORARY)

export const idIsTemporary = (id: string) => id.startsWith(TEMPORARY)


export const isIdentified = (value: any): value is Identified => {
  return isObject(value) && 'id' in value && isString(value.id)
}
export function assertIdentified(value: any, name?: string): asserts value is Identified {
  if (!isIdentified(value))
    errorThrow(value, 'Identified', name)
}

export const isListenerRecord = (value: any): value is EventDispatcherListeners => (
  isObject(value) && Object.values(value).every(isFunction)
)

export const isErrorName = (value: any): value is ErrorNameType => (
  (isString(value)) && ERROR_NAMES.includes(value)
)

export const errorMessage = (name: ErrorNameType, context?: ErrorContext): string => (
  isString(context) ? context : name
)

export const errorMessageObject = (message: string, name: string = ERROR.Internal, cause?: unknown): ErrorObject => {
  const error = new Error(message)
  Object.assign(error, { name, cause })
  return error
}

export const errorObjectCaught = (error: any): ErrorObject => {
  if (isErrorName(error)) return errorName(error) 
  if (isString(error)) return errorMessageObject(error)
  
  const { message: errorMessage = '', name = ERROR.Internal } = error
  const message = errorMessage || String(name)
  return errorMessageObject(message, name, error)
}

export const errorName = (name: ErrorNameType, context?: ErrorContext): ErrorObject => {
  // console.log('errorName', name, context)
  return { name, message: errorMessage(name, context), cause: context }
}

export const errorCaught = (error: any): DefiniteError => {
  // console.error('errorCaught', error)
  return { error: errorObjectCaught(error) }
}

export const errorPromise = (name: ErrorNameType, context?: ErrorContext): Promise<DefiniteError & any> => (
  Promise.resolve(namedError(name, context))
)

const errorExpected = (value: any, expected: string, prop?: string): ErrorObject => {
  const type = typeof value
  const isDefined = type !== 'undefined'
  const isObject = type === 'object'
  const name = prop || (isDefined ? type : 'value')
  const words = [name, 'is']
  words.push(isObject ? value.constructor.name : type)
  if (isDefined) words.push(isObject ? jsonStringify(value) : `'${value}'`)
  if (isPopulatedString(expected)) words.push('instead of', expected)
  return errorMessageObject(words.join(' '), ERROR.Type)
}

export const errorThrow = (value: any, type?: ErrorContext, property?: string): never => {
  const typeIsString = isPopulatedString(type)
  const object = typeIsString ? errorExpected(value, type, property) : errorObjectCaught(value)

  const { message, name, cause } = object
  const errorCause = typeIsString ? cause : type
  const throwObject = errorMessageObject(message, name, errorCause)
  // console.trace(throwObject.toString())
  throw throwObject
}

export const namedError = (code: ErrorNameType, context?: ErrorContext): DefiniteError => (
  { error: errorName(code, context)}
)

export const isDefiniteError = (value: any): value is DefiniteError => {
  return isObject(value) && 'error' in value // && isObject(value.error)
}

export const isDecodingType = isPopulatedString

export const isDecoding = (value: any): value is Decoding => (
  isTyped(value) && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}

export const isAssetType = (value?: any): value is AssetType => (
  ASSET_TYPES.includes(value)
)

export const isAudibleAssetType = (value?: any): value is AudibleType => (
  AUDIBLE_TYPES.includes(value)
)

export const isVisibleAssetType = (value?: any): value is VisibleType => (
  VISIBLE_TYPES.includes(value)
)


export const isAsset = (value: any): value is Asset => (
  isIdentified(value) 
  && isTyped(value) 
  && isAssetType(value.type) 
  && 'isVector' in value
)

export function assertAssetType(type: any, name?: string): asserts type is AssetType {
  if (!isAssetType(type)) errorThrow(type, 'AssetType', name)
}

export function assertAsset(value: any, name?: string): asserts value is Asset {
  assertIdentified(value, name)
  assertTyped(value, name)
  assertAssetType(value.type, name)
  if (!isAsset(value)) errorThrow(value, 'Asset', name)
}
export const isSourceAsset = (value: any): value is SourceAsset => (
  isAsset(value) && isPopulatedString(value.source)
)

export function isAssetObject(value: any, type?: undefined, source?: undefined): value is AssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: undefined): value is AudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: undefined): value is ImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: undefined): value is VideoAssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: RawSource): value is RawAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: RawSource): value is RawImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: RawSource): value is RawVideoAssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: MashSource): value is MashAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: MashSource): value is MashImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: MashSource): value is MashVideoAssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: PromptSource): value is PromptAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: PromptSource): value is PromptImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: PromptSource): value is PromptVideoAssetObject 

export function isAssetObject(value: any, type?: ImageType, source?: TextSource): value is TextAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: ColorSource): value is ColorAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: ShapeSource): value is ShapeAssetObject 

export function isAssetObject(value: any, type?: AssetType, source?: Source): value is AssetObject 
export function isAssetObject(value: any, type: undefined | AssetType = undefined, source: undefined | Source = undefined): value is AssetObject {
  return (
    value && isIdentified(value) 
    && isTyped(value) && isAssetType(value.type) 
    && (!type || type === value.type)
    && 'source' in value && isPopulatedString(value.source)
    && (!source || source === value.source)
  )
}

export const arrayLast = <T=unknown>(array: T[]): T => array[array.length - 1]

export const arraySet = <T=unknown>(array: T[], items: T[]): T[] => {
  array.splice(0, array.length, ...items)
  return array
}

export const arrayUnique = <T=unknown>(array: T[]): T[] => [...new Set(array)]

export const arrayOfNumbers = (count = 0, start = 0): Numbers => (
  [...Array(count)].map((_, index) => start + index)
)

export function arrayFromOneOrMore<T>(value?: T | T[]): T[] {
  if (typeof value === 'undefined') return []

  if (isArray<T>(value)) return value

  if (isString(value)) {
    const strings: Strings = value ? value.split(COMMA) : []
    if (isArray<T>(strings)) return strings 
  }
  return [value]
}

export const arrayRemove = <T=unknown>(array: T[], item: T | T[]) => {
  const items = arrayFromOneOrMore(item)

  const indexes = items.map(item => array.indexOf(item))
  const positives: Numbers = indexes.filter(i => i >= 0)
  const removes = positives.sort((a, b) => b - a)
  removes.forEach(index => array.splice(index, 1))
}

export const jsonParse = <T = any>(json: string): T => globalThis.JSON.parse(json)
export const jsonStringify = (value: any): string => globalThis.JSON.stringify(value, null, 2)
export const CEIL = 'ceil'
export const FLOOR = 'floor'
export const ROUND = 'round'

const roundMethod = (rounding?: Rounding): (value: number) => number => {
  switch (rounding) {
    case CEIL: return Math.ceil
    case FLOOR: return Math.floor
    default: return Math.round
  }
}

export const roundWithMethod = (number: number, rounding?: Rounding): number => {
  return roundMethod(rounding)(number)
}

export const sortByType = (a : Typed, b : Typed) : number => (
  a.type.localeCompare(b.type)
)

export const sortByFrame = (a : Framed, b : Framed) : number => (
  a.frame - b.frame
)

export const sortByOrder = (a : Ordered, b : Ordered) : number => {
  const { order: orderA = Number.MAX_SAFE_INTEGER } = a
  const { order: orderB = Number.MAX_SAFE_INTEGER } = b
  return orderA - orderB
}

export const sortByIndex = (a : Indexed, b : Indexed) : number => (
  a.index - b.index
)

export const sortByTrack = (a : Tracked, b : Tracked) : number => (
  a.trackNumber - b.trackNumber
)

export const svgStringClean = (svgString: string) => {
  // extract just the svg tag
  const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/
  const svgMatch = svgString.match(svgRegex)
  let string = svgMatch ? svgMatch[0] : ''
  if (!string) return

  // remove whitespace between tags
  const whitespaceBetweenTagsRegex = />\s+</g
  string = string.replace(whitespaceBetweenTagsRegex, '><')

  // remove whitespace around equals sign
  const whitespaceAroundEqualsRegex = /\s*=\s*/g
  string = string.replace(whitespaceAroundEqualsRegex, '=')

  // replace all whitespace and newlines with single space
  const whitespaceRegex = /\s+/g
  string = string.replace(whitespaceRegex, ' ')
  
  // include version attribute unless specified
  if (!string.includes('version=')) {
    string = string.replace(/<svg/, "<svg version='1.1'")
  }

  // include namespace attribute unless specified
  if (!string.includes('xmlns=')) {
    string = string.replace(/<svg/, `<svg xmlns='${NAMESPACE_SVG}'`)
  }
  return string 
}

export const isMimetype = (value: any): value is Mimetype => {
  return isString(value) && value.includes('/')
}

export const isAbsolutePath = (value: any): value is AbsolutePath => {
  return isString(value) && value.startsWith('/')
}


export const CLIENT = 'client'
export const SERVER = 'server'


class DefaultEventDispatcher extends EventTarget implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): EventDispatcher {
    this.addEventListener(type, listener as EventListener, options);
    return this;
  }

  dispatch<T>(event: CustomEvent<T> | Event): boolean {
    return this.dispatchEvent(event);
  }

  listenersAdd(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.addDispatchListener(type, listener);
    });
  }

  listenersRemove(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.removeDispatchListener(type, listener);
    });
  }

  removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): EventDispatcher {
    this.removeEventListener(type, listener as EventListener, options);
    return this;
  }
}




export const MOVIEMASHER: MovieMasherRuntime = {
  context: CLIENT,
  document: globalThis.document,
  eventDispatcher: new DefaultEventDispatcher(),
  imports: {},
  options: {},
  get importPromise() { 
    const { imports, eventDispatcher, context } = MOVIEMASHER
    const suffix = context[0].toUpperCase() + context.slice(1)
    const functions = Object.keys(imports).sort((a, b) => b.length - a.length)
    const moduleIds = [...new Set(Object.values(imports).filter(isPopulatedString))]
    const byId: StringsRecord = Object.fromEntries(moduleIds.map(id => (
      [id, functions.filter(key => imports[key] === id)]
    )))
    const promises = moduleIds.map(moduleId => {
      return import(moduleId).then(module => {
        const importers = byId[moduleId]
        const potentialErrors = importers.map(importer => {
          const regex = /^[a-z]+$/
          const key = importer.match(regex) ? `${importer}${suffix}Listeners` : importer
          const { [key]: funktion } = module
          if (!isFunction(funktion)) return namedError(ERROR.Url, importer)
          
          const listeners = funktion()
          if (!isListenerRecord(listeners)) return namedError(ERROR.Type, importer)
          
          // console.log('importPromise', moduleId, key, Object.keys(listeners))
          eventDispatcher.listenersAdd(listeners)
          return {}
        })
        const definiteErrors = potentialErrors.filter(isDefiniteError)
        if (definiteErrors.length) return definiteErrors[0]
        
        return {}
      }).catch(error => errorCaught(error))
    })
    return Promise.all(promises).then(results => {
      results.filter(isDefiniteError).forEach(error => {
        console.error('importPromise', error)
      })
    })   
  },
} as const


