import type { AbsolutePath, AlphaType, ArrayOf2, Aspect, Asset, AssetObject, AudibleType, AudioOutputOptions, AudioType, BitmapsType, BooleanDataType, ClientOrServer, ColorSource, CornerDirection, DataOrError, DataType, DecodeType, Decoding, DefiniteError, Directions, DocumentWindow, DropType, DropTypes, EncodeType, EndpointRequest, ErrorObject, EventDispatcher, EventDispatcherListener, EventDispatcherListeners, EventOptions, FontType, Framed, Identified, ImageOutputOptions, ImageType, ImportResult, ImportTypes, Importer, Indexed, JobType, Lock, MashAudioAssetObject, MashImageAssetObject, MashSource, MashVideoAssetObject, Mimetype, ModuleType, MovieMasherInstance, MovieMasherOptions, MovieMasherRuntime, NumberDataType, Numbers, Ordered, OutputOptions, Panel, Point, Probing, ProbingTypes, PromiseFunction, PromptAudioAssetObject, PromptImageAssetObject, Prompt, PromptVideoAssetObject, RawSource, RawType, RawTypes, Rect, RectTuple, Resource, ReturningFunction, Rounding, Scanning, SequenceOutputOptions, ShapeAssetObject, ShapeSource, SideDirection, Size, Source, SourceAsset, StringDataType, StringRecord, StringTuple, Strings, StringsRecord, TargetIds, TextAssetObject, TextSource, Timing, Tracked, TranscodeType, TranscodingType, Typed, ValueRecord, VideoOutputOptions, VideoType, VisibleType, WaveformOutputOptions, WaveformType } from './types.js'

import { isArray, isFunction, isObject, isPopulatedString, isString } from './utility/guard.js'

type ErrorNameType = typeof ERROR[keyof typeof ERROR] | string

type ErrorContext = ValueRecord | string | undefined

export const $AUDIO: AudioType = 'audio' as const
export const $IMAGE: ImageType = 'image' as const
export const $VIDEO: VideoType = 'video' as const

export const $COLOR: ColorSource = 'color' as const
export const $FONT: FontType = 'font' as const
export const $MASH: MashSource = 'mash' as const
export const $PROMPT: Prompt = 'prompt' as const
export const $RAW: RawSource = 'raw' as const
export const $SHAPE: ShapeSource = 'shape' as const
export const $TEXT: TextSource = 'text' as const
export const $DOM = 'dom' as const
export const $WINDOW = 'window' as const
export const $BROWSER: Panel = 'browser' as const
export const $PLAYER: Panel = 'player' as const
export const $TIMELINE: Panel = 'timeline' as const
export const $IMPORTER: Panel = 'importer' as const
export const $EXPORTER: Panel = 'exporter' as const
export const $RETRIEVE = 'retrieve' as const
export const $SAVE = 'save' as const
export const $JSON = 'json' as const
export const $WOFF2 = 'woff2' as const
export const $CSS = 'css' as const
export const $PROMISE = 'promise' as const
export const $CALL = 'call' as const
export const $TTF = 'ttf' as const
export const $TXT = 'txt' as const
export const $SVG = 'svg' as const
export const $CUSTOM = 'custom' as const
export const $ASSET = 'asset' as const
export const $CLIP = 'clip' as const
export const $CONTAINER = 'container' as const
export const $CONTENT = 'content' as const
export const $URL = 'url' as const
export const $BITMAPS = 'bitmaps' as const
export const $SVGS = 'svgs' as const
export const $WAVEFORM = 'waveform' as const
export const $FLIP = 'flip' as const
export const $MAINTAIN = 'maintain' as const
export const $LONGEST = 'longest' as const
export const $NONE = 'none' as const
export const $SHORTEST = 'shortest' as const

export const $OPACITY = 'opacity' as const
export const $POINT = 'point' as const
export const $SIZE = 'size' as const
export const $RECT = 'rect' as const

export const $DEFAULT = 'default' as const

export const $ALPHA = 'alpha' as const
export const $AUDIBLE = 'audible' as const
export const $DURATION = 'duration' as const
export const $LUMINANCE = 'luminance' as const
export const $FAMILY = 'family' as const  

export const $LEFT: SideDirection = 'left' as const
export const $TOP: SideDirection = 'top' as const
export const $BOTTOM: SideDirection = 'bottom' as const
export const $RIGHT: SideDirection = 'right' as const
export const $JS = 'js' as const

export const $TEMPORARY = 'temporary' as const

export const $DECODE: DecodeType = 'decode' as const
export const $ENCODE: EncodeType = 'encode' as const
export const $TRANSCODE: TranscodeType = 'transcode' as const
export const $WRITE = 'write' as const
export const $UPLOAD = 'upload' as const
export const $FILE = 'file' as const

export const $PROBE = 'probe' as const
export const $SCAN = 'scan' as const

export const $CLIENT = 'client' as const
export const $SERVER = 'server' as const

export const $CHANGE = 'change' as const
export const $CHANGES = 'changes' as const

export const $BOTH = 'both' as const

export const $CEIL = 'ceil' as const
export const $FLOOR = 'floor' as const
export const $ROUND = 'round' as const

export const $X: string & 'x' = 'x' as const 
export const $Y: string & 'y' = 'y' as const 

export const $HEIGHT: string & 'height' = 'height' as const
export const $WIDTH: string & 'width' = 'width' as const

export const $BOOLEAN: BooleanDataType = 'boolean' as const
export const $NUMBER: NumberDataType = 'number' as const
export const $STRING: StringDataType = 'string' as const
export const $FRAME = 'frame' as const
export const $PERCENT: DataType = 'percent' as const
export const $FRAMES = 'frames' as const
export const $RGB: DataType = 'rgb' as const

// can these just be CONTAINER and CONTENT?
export const $CONTAINER_ID: DataType = 'container-id' as const
export const $CONTENT_ID: DataType = 'content-id' as const

export const $HTTP = 'http' as const
export const $HTTPS = 'https' as const

export const $GTE = 'gte' as const
export const $LT = 'lt' as const
export const $LTE = 'lte' as const
export const $GT = 'gt' as const
export const $EQ = 'eq' as const
export const $NE = 'ne' as const

export const $IF = 'if' as const
export const $IFNOT = 'ifnot' as const

export const $MIN = 'min' as const
export const $MAX = 'max' as const

export const $DIVIDE = '/' as const
export const $MULTIPLY = '*' as const
export const $ADD = '+' as const
export const $SUBTRACT = '-' as const

export const $VARIABLE = 'variable' as const
export const $LOCK = 'lock' as const

// Note: these are all capitalized since they are suffixes
export const $END = 'End' as const
export const $CROP = 'Crop' as const
export const $ASPECT = 'Aspect' as const

export const $GET = 'GET' as const
export const $POST = 'POST' as const
export const $PUT = 'PUT' as const
export const $LIST = 'LIST' as const

export const $TOP_RIGHT: CornerDirection = 'top-right' as const
export const $TOP_LEFT: CornerDirection = 'top-left' as const
export const $BOTTOM_RIGHT: CornerDirection = 'bottom-right' as const
export const $BOTTOM_LEFT: CornerDirection = 'bottom-left' as const

export const $CACHE_ALL = 'cache-all' as const
export const $CACHE_NONE = 'cache-none' as const
export const $CACHE_SOURCE_TYPE = 'cache-source-type' as const
export const $CHANGE_FRAME = 'change-frame' as const

export const VERSION = '5.2.0' as const

export const ASTERISK = '*' as const
export const COLON = ':' as const
export const COMMA = ',' as const
export const EQUALS = '=' as const
export const NEWLINE = '\n' as const
export const QUESTION = '?' as const
export const SEMICOLON = ';' as const
export const SLASH = '/' as const
export const DOT = '.' as const
export const DASH = '-' as const
export const PIPE = '|' as const
export const SPACE = ' ' as const

export const MIME_JSON = ['application', $JSON].join(SLASH)
export const MIME_CSS = [$TEXT, $CSS].join(SLASH)
export const MIME_MULTI = 'multipart/form-data'
export const CONTENT_TYPE = 'Content-Type'
export const MIME_SVG: DOMParserSupportedType = `${$IMAGE}${SLASH}${$SVG}+xml`

export const NAMESPACE_SVG = 'http://www.w3.org/2000/svg'
export const NAMESPACE_XLINK = 'http://www.w3.org/1999/xlink'

const IdPrefix = 'com.moviemasher'
const IdSuffix = 'image.default'

export const DEFAULT_CONTENT_ID = [IdPrefix, 'content', IdSuffix].join(DOT)
export const DEFAULT_CONTAINER_ID = [IdPrefix, 'container', IdSuffix].join(DOT)

export const CURRENT_COLOR = 'currentColor' as const

export const RGB_BLACK = '#000000'
export const RGB_GRAY = '#808080'
export const RGB_WHITE = '#FFFFFF'
export const RGBA_BLACK = '#000000FF'
export const RGBA_BLACK_ZERO = '#00000000'
export const RGBA_WHITE_ZERO = '#FFFFFF00'

export const TEXT_HEIGHT = 1000

export const ASSET_DURATION = 3
export const DURATION_UNKNOWN = -1
export const DURATION_UNLIMITED = -2
export const DURATION_NONE = 0
export const FRAMES_MINIMUM = 2

export const RAW_TYPES: RawTypes = [$VIDEO, $AUDIO, $IMAGE]
export const AUDIBLE_TYPES: AudibleType[] = [$AUDIO, $VIDEO]
export const VISIBLE_TYPES: RawTypes = [$IMAGE, $VIDEO]
export const DROP_TYPES: DropTypes = [$FONT, ...RAW_TYPES]
export const IMPORT_TYPES: ImportTypes = [...RAW_TYPES, $TEXT, $SHAPE]
export const PROBING_TYPES: ProbingTypes = [$ALPHA, $AUDIBLE, $DURATION, $SIZE]


export const ASPECTS: Aspect[] = [$FLIP, $MAINTAIN] 

export const RGB_KEYS = ['r', 'g', 'b'] as const
export const RGBA_KEYS = [...RGB_KEYS, 'a'] as const
export const POINT_KEYS = [$X, $Y] as const
export const SIZE_KEYS = [$WIDTH, $HEIGHT] as const
export const RECT_KEYS = [...POINT_KEYS, ...SIZE_KEYS] as const

export const LOCKS: Lock[] = [$HEIGHT, $LONGEST, $NONE, $SHORTEST, $WIDTH]


export const DIRECTIONS_SIDE: SideDirection[] = [
  $LEFT,
  $RIGHT,
  $TOP,
  $BOTTOM,
]

export const DIRECTIONS_CORNER = [
  $BOTTOM_LEFT,
  $BOTTOM_RIGHT,
  $TOP_LEFT,
  $TOP_RIGHT,
]

export const DIRECTIONS_ALL: Directions = [
  ...DIRECTIONS_CORNER,
  ...DIRECTIONS_SIDE,
]

export const TARGET_IDS: TargetIds = [
  $MASH, $CLIP, $CONTENT, $CONTAINER, $ASSET
]

export const SIZINGS = [$MASH, $CONTENT, $CONTAINER]
export const TIMINGS = [$CUSTOM, $CONTENT, $CONTAINER]
export const TRANSPARENCIES = [$ALPHA, $LUMINANCE]


export const POINT_ZERO: Point = { x: 0, y: 0 } as const
export const SIZE_ZERO: Size = { width: 0, height: 0 } as const
export const SIZE_OUTPUT: Size = { width: 1920, height: 1080 } as const
export const RECT_ZERO: Rect = { ...POINT_ZERO, ...SIZE_ZERO } as const
export const RECTS_ZERO: RectTuple = [RECT_ZERO, RECT_ZERO] 

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
  [$AUDIO]:  {
    options: {},
    audioBitrate: 160,
    audioCodec: 'libmp3lame',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'mp3',
  }, 
  [$BITMAPS]: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'jpg',
  },
  [$WAVEFORM]: {
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
  [$IMAGE]: {
    options: {},
    width: 320,
    height: 240,
    extension: 'jpg',
  },
  [$VIDEO]: {
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
  [$IMAGE]: {
    options: {},
    width: 320,
    height: 240,
    extension: 'png',
    format: 'image2',
    offset: 0
  },
  [$BITMAPS]: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'png',
  },
  [$VIDEO]: {
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

export const isTuple = <T=unknown>(value: any): value is ArrayOf2<T> => (
  isArray(value) && value.length === 2
)

export function assertTuple<T=unknown>(value: any, name?: string): asserts value is ArrayOf2<T> {
  if (!isTuple<T>(value)) errorThrow(value, 'Tuple', name)
}

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
  return isDecoding(value) && value.type === $PROBE //&& isPopulatedString(value.data.extension)
}


export function assertProbing(value: any): asserts value is Probing {
  if (!isProbing(value)) errorThrow(value, 'Probing') 
}

export const isScanning = (value: any): value is Scanning => {
  return isDecoding(value) && value.type === $SCAN && isPopulatedString(value.data.family)
}

export function assertScanning(value: any): asserts value is Scanning {
  if (!isScanning(value)) errorThrow(value, 'Scanning') 
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

const ID_COUNTS = new Map<string, number> ()

export const idReset = () => ID_COUNTS.clear()

export const idGenerateString = (prefix: string = $TEMPORARY): string => {
  return [
    prefix, Date.now().toString(36), Math.random().toString(36).slice(2)
  ].join(DASH)
}

export const idGenerate = (prefix: string, delimiter: string = DASH): string => {
  const count = ID_COUNTS.get(prefix) || 0
  ID_COUNTS.set(prefix, count + 1)
  return [prefix, String(count)].join(delimiter)
}

export const idTemporary = () => idGenerate($TEMPORARY)

export const idIsTemporary = (id: string) => id.startsWith($TEMPORARY)

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

const isErrorName = (value: any): value is ErrorNameType => (
  (isString(value)) && ERROR_NAMES.includes(value)
)

const errorMessage = (name: ErrorNameType, context?: ErrorContext): string => (
  isString(context) ? context : name
)

export const errorMessageObject = (message: string, name: string = ERROR.Internal, cause?: unknown): ErrorObject => {
  if (cause instanceof Error) return cause

  const error = new Error(message)
  Object.assign(error, { name, cause })
  return error
}
export const isErrorObject = (value: any): value is ErrorObject => (
  isObject(value) && 'name' in value  
  && isPopulatedString(value.name) 
  && 'message' in value
  && isPopulatedString(value.message) 
)
export const errorObjectCaught = (error: any): ErrorObject => {
  console.log('errorObjectCaught', typeof error, error?.constructor.name)
  if (isErrorObject(error)) return error
  
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
  if (isDefiniteError(error)) return error

  console.error('errorCaught', error, typeof error)
  return { error: errorObjectCaught(error) }
}

export const errorPromise = (name: ErrorNameType, context?: ErrorContext): Promise<DefiniteError> => (
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
  throw throwObject
}

export const namedError = (code: ErrorNameType, context?: ErrorContext): DefiniteError => {
  console.trace('namedError', code, context)
  return { error: errorName(code, context) }
}

export const isDefiniteError = (value: any): value is DefiniteError => {
  return isObject(value) && 'error' in value // && isObject(value.error)
}

export const isDecodingType = isPopulatedString

export const isDecoding = (value: any): value is Decoding => (
  isTyped(value) && isDecodingType(value.type) && 'data' in value && isObject(value.data)
)

export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}

export const isRawType = (value?: any): value is RawType => (
  RAW_TYPES.includes(value)
)

export const isAudibleType = (value?: any): value is AudibleType => (
  AUDIBLE_TYPES.includes(value)
)

export const isVisibleType = (value?: any): value is VisibleType => (
  VISIBLE_TYPES.includes(value)
)

export const isAsset = (value: any): value is Asset => (
  isIdentified(value) 
  && isTyped(value) 
  && isRawType(value.type) 
  && 'instanceFromObject' in value
)

export function assertAsset(value: any, name?: string): asserts value is Asset {
  if (!isAsset(value)) errorThrow(value, 'Asset', name)
}


export const isSourceAsset = (value: any): value is SourceAsset => (
  isAsset(value) && isPopulatedString(value.source)
)

export function isAssetObject(value: any, type?: undefined, source?: undefined): value is AssetObject 
export function isAssetObject(value: any, type?: AudioType, source?: MashSource): value is MashAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: MashSource): value is MashImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: MashSource): value is MashVideoAssetObject 
export function isAssetObject(value: any, type?: AudioType, source?: Prompt): value is PromptAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: Prompt): value is PromptImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: Prompt): value is PromptVideoAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: TextSource): value is TextAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: ShapeSource): value is ShapeAssetObject 
export function isAssetObject(value: any, type?: RawType, source?: Source): value is AssetObject 
export function isAssetObject(value: any, type: undefined | RawType = undefined, source: undefined | Source = undefined): value is AssetObject {
  return (
    value && isIdentified(value) 
    && isTyped(value) && isRawType(value.type) 
    && (!type || type === value.type)
    && 'source' in value && isPopulatedString(value.source)
    && (!source || source === value.source)
  )
}

export const arrayLast = <T=unknown>(array: T[]): T => array[array.length - 1]

/**
 * Replaces the contents of an array with the contents of another array.
 * @param array 
 * @param items 
 * @returns 
 */
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


const roundMethod = (rounding?: Rounding): (value: number) => number => {
  switch (rounding) {
    case $CEIL: return Math.ceil
    case $FLOOR: return Math.floor
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

export const pathExtension = (url: string): string => {
  const parts = url.split(DOT)
  return arrayLast(parts)
}

export const pathJoin = (url: string, path: string): string => {
  const urlStripped = url.endsWith(SLASH) ? url.slice(0, -1) : url
  const pathStripped = path.startsWith(SLASH) ? path.slice(1) : path
  return [urlStripped, SLASH, pathStripped].join('')
}

export const pathFilename = (url: string): string => arrayLast(url.split(SLASH))



export const promiseNumbers = (promises: Promise<DataOrError<number>>[]) => {
  const { length } = promises
  const result = { data: 0 }

  switch (length) {
    case 0: return Promise.resolve(result)
    case 1: return promises[0]
  }

  const promise = promises.reduce((promise, next) => promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    result.data += orError.data
    return next
  }), Promise.resolve(result))

  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    return result
  })
}

// const JOB_TYPES = [$DECODE, $ENCODE, $TRANSCODE]

// const isJobType = (value: any): value is JobType => (
//   JOB_TYPES.includes(value)
// )

export const copyEndpointRequest = (request: EndpointRequest): EndpointRequest => {
  const { endpoint, init } = request
  return { endpoint, init }
}

export const copyResource = (resourse: Resource) => {
  return {
    ...resourse,
    request: copyEndpointRequest(resourse.request)
  }
}

export const customEventClass = <T>() => MOVIE_MASHER.window.CustomEvent<T> 


type Ids = Record<string, StringTuple>

class FunctionLoader <RET = any, OPTS extends object = object, ARGS extends Typed = Typed> {
  constructor(private ids: Ids = {}) {}

  getReturningFunction(id: string): ReturningFunction<RET, OPTS> | undefined {
    return this.returningFunctions[id]
  }

  private async promisingFunctionImportPromise(tuple: StringTuple): Promise<DataOrError<PromiseFunction<RET, OPTS, ARGS>>> {
    const [moduleId, exportedAs] = tuple
    const module = await import(moduleId)
    const data = module[exportedAs]
    if (isFunction(data)) return { data }
    
    return namedError(ERROR.Url, moduleId)
  }

  private async returningFunctionImportPromise(tuple: StringTuple): Promise<DataOrError<ReturningFunction<RET, OPTS>>> {
    const [moduleId, exportedAs] = tuple

    // console.log('returningFunctionImportPromise', moduleId, exportedAs)
    const module = await import(moduleId)
    const data = module[exportedAs]
    if (isFunction(data)) return { data }
    
    return namedError(ERROR.Url, moduleId)
  }
  private promisingFunctions: Record<string, PromiseFunction<RET, OPTS, ARGS>>= {}
  private returningFunctions: Record<string, ReturningFunction<RET, OPTS>>= {}

  install(id: string, moduleId: string, exportedAs: string = $DEFAULT): DefiniteError | undefined{
    this.ids[id] = [moduleId, exportedAs]
    return
  }

  async importPromise(): Promise<DataOrError<ImportResult>> {
    const { ids } = this
    const keys = Object.keys(ids)
    for (const id of keys) {
      const orError = await this.returningFunctionPromise(id)
      if (isDefiniteError(orError)) return orError
    }
    return { data: {} }
  }

  private async promiseFunctionPromise(id: string): Promise<DataOrError<PromiseFunction<RET, OPTS, ARGS>>> {
    const { promisingFunctions: functions, ids, promisingFunctionPromises: promises } = this
    const { [id]: loadingPromise } = promises
    if (loadingPromise) return loadingPromise

    const { [id]: tuple } = ids
    if (!tuple) return errorPromise(ERROR.Unimplemented, id)  

    return promises[id] = this.promisingFunctionImportPromise(tuple).then(orError => {
      if (!isDefiniteError(orError)) {
        functions[id] = orError.data
        delete promises[id]
      }
      return orError
    })
  }

  returningFunctionPromise(id: string): Promise<DataOrError<ReturningFunction<RET, OPTS>>>{
    const { [id]: loaded } = this.returningFunctions 
    if (loaded) return Promise.resolve({data: loaded}) 
 
    return this.returnFunctionPromise(id) 
  }

  private async returnFunctionPromise(id: string): Promise<DataOrError<ReturningFunction<RET, OPTS>>> {
    const { returningFunctions: functions, ids, returningFunctionPromises: promises } = this
    const { [id]: loadingPromise } = promises
    if (loadingPromise) return loadingPromise

    const { [id]: tuple } = ids
    if (!tuple) return errorPromise(ERROR.Unimplemented, id)  

    return promises[id] = this.returningFunctionImportPromise(tuple).then(orError => {
      if (!isDefiniteError(orError)) {
        functions[id] = orError.data
        delete promises[id]
      }
      return orError
    })
  }

  promisingFunctionPromise(id: string): Promise<DataOrError<PromiseFunction<RET, OPTS, ARGS>>>{
    const { [id]: loaded } = this.promisingFunctions 
    if (loaded) return Promise.resolve({data: loaded}) 
 
    return this.promiseFunctionPromise(id) 
  }

  
  promise(args: ARGS, options: OPTS): Promise<DataOrError<RET>>{
    const { type: id } = args
    const { [id]: loaded } = this.promisingFunctions 
    if (loaded) return loaded(args, options)
 
    return this.promiseFunctionPromise(id).then(functionOrError => {
      if (isDefiniteError(functionOrError)) return functionOrError

      return functionOrError.data(args, options)
    })
  }
  private returningFunctionPromises: Record<string, Promise<DataOrError<ReturningFunction<RET, OPTS>>>> = {}

  private promisingFunctionPromises: Record<string, Promise<DataOrError<PromiseFunction<RET, OPTS, ARGS>>>> = {}
}


class MovieMasherClass implements MovieMasherInstance {
  constructor() {
    this.loaders = {
      [$AUDIO]: new FunctionLoader({  
        [$RAW]: ['@moviemasher/client-lib/module/raw.js', 'audioRawAssetFunction'],
      }),
      [$DECODE]: new FunctionLoader({
        [$PROBE]: ['@moviemasher/client-lib/module/decode.js', 'decodeFunction'],
        [$SCAN]: ['@moviemasher/client-lib/module/decode.js', 'decodeFunction'],
      }),
      [$ENCODE]: new FunctionLoader({
        [$AUDIO]: ['@moviemasher/client-lib/module/encode.js', 'encodeFunction'],
        [$IMAGE]: ['@moviemasher/client-lib/module/encode.js', 'encodeFunction'],
        [$VIDEO]: ['@moviemasher/client-lib/module/encode.js', 'encodeFunction'],
      }),
      [$IMAGE]: new FunctionLoader({
        [$RAW]: ['@moviemasher/client-lib/module/raw.js', 'imageRawAssetFunction'],
        [$SHAPE]: ['@moviemasher/shared-lib/module/image-shape.js', 'imageShapeAssetFunction'],
        [$TEXT]: ['@moviemasher/shared-lib/module/image-text.js', 'imageTextAssetFunction'],
        [$COLOR]: ['@moviemasher/shared-lib/module/image-color.js', 'imageColorAssetFunction'],
      }),
      [$RETRIEVE]: new FunctionLoader({
        [$AUDIO]: ['@moviemasher/client-lib/module/retrieve.js', 'audioRetrieveFunction'],
        [$CSS]: ['@moviemasher/shared-lib/module/retrieve.js', 'cssRetrieveFunction'],
        [$TTF]: ['@moviemasher/shared-lib/module/retrieve.js', 'fontRetrieveFunction'],
        [$WOFF2]: ['@moviemasher/shared-lib/module/retrieve.js', 'fontRetrieveFunction'],
        [$IMAGE]: ['@moviemasher/client-lib/module/retrieve.js', 'imageRetrieveFunction'],
        [$URL]: ['@moviemasher/client-lib/module/retrieve.js', 'urlRetrieveFunction'],
        [$VIDEO]: ['@moviemasher/client-lib/module/retrieve.js', 'videoRetrieveFunction'],
      }),
      [$TRANSCODE]: new FunctionLoader({  
        [$BITMAPS]: ['@moviemasher/client-lib/module/transcode.js', 'transcodeFunction'],
        [$WAVEFORM]: ['@moviemasher/client-lib/module/transcode.js', 'transcodeFunction'],
        [$AUDIO]: ['@moviemasher/client-lib/module/transcode.js', 'transcodeFunction'],
        [$IMAGE]: ['@moviemasher/client-lib/module/transcode.js', 'transcodeFunction'],
        [$VIDEO]: ['@moviemasher/client-lib/module/transcode.js', 'transcodeFunction'],
      }),
      [$SAVE]: new FunctionLoader({
        [$AUDIO]: ['@moviemasher/client-lib/module/save.js', 'audioSaveFunction'],
        [$IMAGE]: ['@moviemasher/client-lib/module/save.js', 'imageSaveFunction'],
        [$VIDEO]: ['@moviemasher/client-lib/module/save.js', 'videoSaveFunction'],
      }),
      [$VIDEO]: new FunctionLoader({
        [$RAW]: ['@moviemasher/client-lib/module/raw.js', 'videoRawAssetFunction'],
        [$MASH]: ['@moviemasher/client-lib/module/video-mash.js', 'videoMashAssetFunction'],
      }),
      [$FILE]: new FunctionLoader({
        [$UPLOAD]: ['@moviemasher/client-lib/module/file-upload.js', 'fileUploadFunction'],
        [$WRITE]: ['@moviemasher/server-lib/module/file-write.js', 'fileWriteFunction'],
      }),
    }
  }

  dispatch<T = any>(typeOrEvent: Event | CustomEvent<T>): boolean {
    return MOVIE_MASHER_INSTANCE.eventDispatcher.dispatch(typeOrEvent)
  }

  listenersAdd(record: EventDispatcherListeners): void {
    MOVIE_MASHER_INSTANCE.eventDispatcher.listenersAdd(record)
  }

  listenersRemove(record: EventDispatcherListeners): void {
    MOVIE_MASHER_INSTANCE.eventDispatcher.listenersRemove(record)
  }

  call<RET = any, OPTS extends object = object>(id: string, moduleType: ModuleType = $CALL, args?: OPTS): DataOrError<RET> {
    const { [moduleType]: loader} = this.loaders
    if (!loader) return namedError(ERROR.Unimplemented, moduleType)

    const returningFunction = loader.getReturningFunction(id)
    if (!returningFunction) return namedError(ERROR.Unimplemented, [moduleType, id].join(SLASH))

    return returningFunction(args)    
  }

  // TODO: remove $TEXT
  callable: ModuleType[] = [...RAW_TYPES]

  private _context?: ClientOrServer

  get context(): ClientOrServer {
    return this._context ||= globalThis.Window ? $CLIENT : $SERVER
  }

  private _eventDispatcher?: EventDispatcher

  get eventDispatcher() {
    return this._eventDispatcher ||= this.eventDispatcherInitialize
  }

  private get eventDispatcherInitialize(): EventDispatcher {
    class DefaultEventDispatcher extends MOVIE_MASHER.window.EventTarget implements EventDispatcher {
      private addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): EventDispatcher {
        this.addEventListener(type, listener as EventListener, options)
        return this
      }
  
      dispatch<T>(event: CustomEvent<T> | Event): boolean {
        return this.dispatchEvent(event)
      }
  
      listenersAdd(record: EventDispatcherListeners) {
        Object.entries(record).forEach(([type, listener]) => {
          this.addDispatchListener(type, listener)
        })
      }
  
      listenersRemove(record: EventDispatcherListeners) {
        Object.entries(record).forEach(([type, listener]) => {
          this.removeDispatchListener(type, listener)
        })
      }
  
      private removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): EventDispatcher {
        this.removeEventListener(type, listener as EventListener, options)
        return this
      }
    }
    return new DefaultEventDispatcher()
  } 


  async importPromise(): Promise<DataOrError<ImportResult>> { 
    const { imports, context, loaders } = this
    const { callable } = this
    for (const key of callable) {
      const { [key]: loader } = loaders
      if (!loader) return namedError(ERROR.Unimplemented, key)
      const orError = await loader.importPromise()
      if (isDefiniteError(orError)) return orError
    }
    const suffix = context[0].toUpperCase() + context.slice(1)
    const functions = Object.keys(imports).sort((a, b) => b.length - a.length)
    const moduleIds = [...new Set(Object.values(imports).filter(isPopulatedString))].sort()
    // console.log('importPromise', moduleIds)
    const byId: StringsRecord = Object.fromEntries(moduleIds.map(id => (
      [id, functions.filter(key => imports[key] === id)]
    )))
    for (const moduleId of moduleIds) {
      const module = await import(moduleId)
      const importers = byId[moduleId]
      for (const importer of importers) {
        const regex = /^[a-z]+$/
        const key = importer.match(regex) ? `${importer}${suffix}Listeners` : importer
        const { [key]: funktion } = module
        if (!isFunction(funktion)) return namedError(ERROR.Url, importer)
        
        const listeners = funktion()
        if (!isListenerRecord(listeners)) return namedError(ERROR.Type, importer)
        
        // console.log('importPromise', moduleId, key, Object.keys(listeners))
        this.listenersAdd(listeners)
      }
    }
    return { data: {} }
  }

  imports: StringRecord = {}

  install(moduleType: ModuleType, id: string, moduleId: string, exportedAs: string = $DEFAULT): DefiniteError | undefined {
    this.loaders[moduleType] ||= new FunctionLoader()
    return this.loaders[moduleType].install(id, moduleId, exportedAs)
  }

  load<RET = any>(moduleType: ModuleType, id: string, moduleId: string, exported?: string | undefined): Promise<DataOrError<ReturningFunction<RET>>> {
    const error = this.install(moduleType, id, moduleId, exported)
    if (error) return Promise.resolve(error)

    return this.loaders[moduleType].returningFunctionPromise(id)
  }

  private loaders: Record<ModuleType, FunctionLoader>

  options: MovieMasherOptions = {
    transcode: {
      [$IMAGE]: [$IMAGE],
      [$VIDEO]: [$BITMAPS, $AUDIO, $WAVEFORM],
      [$AUDIO]: [$AUDIO, $WAVEFORM],
    }
  }

  promise<RET = any, OPTS extends object = object, ARGS extends Typed = Typed>(args: ARGS, moduleType: ModuleType = $PROMISE, opts?: OPTS): Promise<DataOrError<RET>> {
    const { [moduleType]: loader} = this.loaders
    if (!loader) return Promise.resolve(namedError(ERROR.Unimplemented, moduleType))

    // console.log('promise', moduleType, args, opts)
    return loader.promise(args, opts || {})
  }
  
  private _window?: DocumentWindow
  get window(): DocumentWindow {
    const { _window } = this
    if (_window) return _window

    const orError = this.call<DocumentWindow>($WINDOW, $DOM)
    const window = isDefiniteError(orError) ? globalThis.window : orError.data
    return this._window = window
  }
}

const MOVIE_MASHER_INSTANCE: MovieMasherInstance = new MovieMasherClass()

export const MOVIE_MASHER: MovieMasherRuntime = MOVIE_MASHER_INSTANCE

