import type { AlphaType, ArrayOf2, Aspect, Asset, AssetObject, AudibleType, AudioOutputOptions, AudioType, BitmapsType, BooleanDataType, ClientOrServer, ColorSource, CornerDirection, DataOrError, DataType, DecodeType, Decoding, DefiniteError, Directions, DocumentWindow, DropType, DropTypes, EncodeType, EndpointRequest, ErrorObject, CustomEventDispatcher, EventDispatcherListener, EventDispatcherListeners, EventOptions, FontType, Framed, Identified, ImageOutputOptions, ImageType, ImportResult, ImportTypes, Importer, Indexed, Lock, MashAudioAssetObject, MashImageAssetObject, MashSource, MashVideoAssetObject, Mimetype, ModuleType, MovieMasherInstance, MovieMasherOptions, MovieMasherRuntime, NumberDataType, Numbers, Ordered, OutputOptions, Panel, Point, Probing, ProbingTypes, PromptAudioAssetObject, PromptImageAssetObject, Prompt, PromptVideoAssetObject, RawSource, RawType, RawTypes, Rect, RectTuple, Resource, Rounding, Scanning, SequenceOutputOptions, ShapeAssetObject, ShapeSource, SideDirection, Size, Source, SourceAsset, StringDataType, StringRecord, Strings, StringsRecord, TargetIds, TextAssetObject, TextSource, Timing, Tracked, TranscodeType, TranscodingType, Typed, VideoOutputOptions, VideoType, VisibleType, WaveformOutputOptions, WaveformType, ModuleOrAsyncFunction, ModuleOrSyncFunction, SyncFunction, AsyncFunction, ModuleDescription, ManageType } from './types.js'

import { isArray, isFunction, isObject, isPopulatedString, isString, isStringTuple } from './utility/guard.js'

type ErrorNameType = typeof ERROR[keyof typeof ERROR] | string

type ErrorContext = object | string | undefined

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
export const $WINDOW = 'window' as const
export const $BROWSER: Panel = 'browser' as const
export const $PLAYER: Panel = 'player' as const
export const $TIMELINE: Panel = 'timeline' as const
export const $IMPORTER: Panel = 'importer' as const
export const $EXPORTER: Panel = 'exporter' as const
export const $RETRIEVE = 'retrieve' as const
export const $SAVE = 'save' as const
export const $EDIT = 'edit' as const
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

export const $ID = 'id' as const
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
export const $READ = 'read' as const
export const $UPLOAD = 'upload' as const
export const $FILE = 'file' as const

export const $PROBE = 'probe' as const
export const $SCAN = 'scan' as const

export const $CLIENT = 'client' as const
export const $SERVER = 'server' as const

export const $CHANGE = 'change' as const
export const $CHANGES = 'changes' as const
export const $VIEW = 'view'

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
export const $PLAY = 'play'

export const $VARIABLE = 'variable' as const
export const $LOCK = 'lock' as const

export const $CAN = 'can' as const
export const $EVENT = 'event' as const
export const $DESTROY = 'destroy' as const
export const $DID = 'did' as const
export const $ICON = 'icon'
export const $IMPORT: ManageType = 'import'
export const $SCALARS = 'scalars' as const
export const $ENABLED = 'enabled' as const
export const $TRANSLATE = 'translate'

// Note: this matches HTMLMediaElement.
export const $TIMEUPDATE = 'timeupdate' as const

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


export const pathExtension = (url: string): string => {
  const parts = url.split(DOT)
  return arrayLast(parts)
}

export const pathJoin = (...strings: Strings): string => {
  const stripStart = (string: string) => string.startsWith(SLASH) ? string.slice(1) : string
  const stripEnd = (string: string) => string.endsWith(SLASH) ? string.slice(0, -1) : string

  const { length } = strings
  return strings.map((string, index) => {
    if (index === 0) return stripEnd(string)
    if (index === length - 1) return stripStart(string)
    return stripStart(stripEnd(string))
  }).join(SLASH)
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

class FunctionLoader <RET = any, ARGS = any, OPTS = any> {
  constructor(args: Record<string, ModuleDescription | SyncFunction<RET, ARGS, OPTS>> = {}) {
    Object.entries(args).forEach(entry => this.install(...entry))
  }

  install(id: string, module: ModuleDescription | SyncFunction<RET, ARGS, OPTS>): void {
    if (isString(module) || isStringTuple(module)) this.ids[id] = module
    else if (isFunction(module)) this.functions[id] = module
    else errorThrow(ERROR.Unimplemented, id)
  }

  call(id: string, args?: ARGS, opts?: OPTS): RET {
    const { [id]: loaded } = this.functions
    if (!loaded) errorThrow(ERROR.Unimplemented, id)
  
    return loaded(args, opts, id)   
  }

  private async functionImportPromise(id: string, moduleDescription: ModuleDescription): Promise<DataOrError<SyncFunction<RET, ARGS, OPTS>>> {
    const tuple = arrayFromOneOrMore(moduleDescription)
    const [moduleId, exportedAs = $DEFAULT] = tuple
    // console.log(this.constructor.name, 'functionImportPromise', moduleId, exportedAs)
    const module = await import(moduleId)
    const data = module[exportedAs]
    if (!isFunction(data)) return namedError(ERROR.Url, moduleId)
    
    return { data }
  }

  functionPromise(id: string): Promise<DataOrError<SyncFunction<RET, ARGS, OPTS>>> {
    const { functions, ids, functionPromises } = this
    const loaded = functions[id] 
    if (loaded) return Promise.resolve({ data: loaded })

    const { [id]: functionPromise } = functionPromises
    if (functionPromise) return functionPromise 

    const { [id]: description } = ids
    if (!description) return errorPromise(ERROR.Unimplemented, id)  

    return functionPromises[id] = this.functionImportPromise(id, description).then(orError => {
      if (!isDefiniteError(orError)) {
        functions[id] = orError.data 
        delete functionPromises[id]
      }
      return orError
    })
  }

  private functions: Record<string, SyncFunction<RET, ARGS, OPTS>> = {}

  private functionPromises: Record<string, Promise<DataOrError<SyncFunction<RET, ARGS, OPTS>>>> = {}

  private ids: Record<string, ModuleDescription> = {}

  async importPromise(): Promise<DataOrError<ImportResult>> {
    const { ids } = this
    const keys = Object.keys(ids)
    for (const id of keys) {
      // console.log('importPromise', id)
      const orError = await this.functionPromise(id)
      if (isDefiniteError(orError)) return orError
    }
    return { data: {} }
  }

  promise(id: string, args?: ARGS, options?: OPTS): Promise<RET>{
    const loaded = this.functions[id] as AsyncFunction<RET, ARGS, OPTS>
    if (loaded) return loaded(args, options)
 
    return this.functionPromise(id).then(functionOrError => {
      if (isDefiniteError(functionOrError)) return errorThrow(functionOrError)
  
      return functionOrError.data(args, options)
    })
  }
}

class MovieMasherClass implements MovieMasherInstance {
  constructor() {
    this.loaders = {
      [$AUDIO]: new FunctionLoader({  
        [$RAW]: ['@moviemasher/shared-lib/module/audio-raw.js', 'audioRawAssetFunction'],
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
        [$COLOR]: ['@moviemasher/shared-lib/module/image-color.js', 'imageColorAssetFunction'],
        [$RAW]: ['@moviemasher/shared-lib/module/image-raw.js', 'imageRawAssetFunction'],
        [$SHAPE]: ['@moviemasher/shared-lib/module/image-shape.js', 'imageShapeAssetFunction'],
        [$TEXT]: ['@moviemasher/shared-lib/module/image-text.js', 'imageTextAssetFunction'],
      }),
      [$RETRIEVE]: new FunctionLoader({
        [$AUDIO]: ['@moviemasher/client-lib/module/retrieve.js', 'audioRetrieveFunction'],
        [$CSS]: ['@moviemasher/shared-lib/module/retrieve.js', 'cssRetrieveFunction'],
        [$TTF]: ['@moviemasher/shared-lib/module/retrieve.js', 'fontRetrieveFunction'],
        [$WOFF2]: ['@moviemasher/shared-lib/module/retrieve.js', 'fontRetrieveFunction'],
        [$IMAGE]: ['@moviemasher/client-lib/module/retrieve.js', 'imageRetrieveFunction'],
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
        [$MASH]: ['@moviemasher/shared-lib/module/video-mash.js', 'videoMashAssetFunction'],
        [$RAW]: ['@moviemasher/shared-lib/module/video-raw.js', 'videoRawAssetFunction'],
      }),
      [$FILE]: new FunctionLoader({
        [$UPLOAD]: ['@moviemasher/client-lib/module/file-upload.js', 'fileUploadFunction'],
      }),
      [$CALL]: new FunctionLoader({
        [$WINDOW]: () => globalThis.window
      }),
      [$PROMISE]: new FunctionLoader(),
    }
  }

  call<RET = any, ARGS = any, OPTS = any>(id: string, args?: ARGS, moduleType: ModuleType = $CALL, opts?: OPTS): RET {
    // console.log('call', id, moduleType)
    const { [moduleType]: loader} = this.loaders
    if (!loader) return errorThrow(ERROR.Unimplemented, moduleType)

    return loader.call(id, args, opts)
  }

  dispatch<RET = any, ARGS = any, OPTS = any>(id: string, args?: ARGS, opts?: OPTS): RET {
    // console.log('dispatch', id)
    return this.call(id, args, $EVENT, opts)
  }

  dispatchCustom<T = any>(typeOrEvent: Event | CustomEvent<T>): boolean {
    return MOVIE_MASHER_INSTANCE.eventDispatcher.dispatchCustom(typeOrEvent)
  }

  private syncModuleIds: Set<ModuleType> = new Set([...RAW_TYPES, $CALL])

  private _context?: ClientOrServer

  get context(): ClientOrServer {
    return this._context ||= globalThis.Window ? $CLIENT : $SERVER
  }

  private _eventDispatcher?: CustomEventDispatcher

  get eventDispatcher() {
    return this._eventDispatcher ||= this.eventDispatcherInitialize
  }

  private get eventDispatcherInitialize(): CustomEventDispatcher {
    class DefaultEventDispatcher extends MOVIE_MASHER.window.EventTarget implements CustomEventDispatcher {
      private addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): CustomEventDispatcher {
        this.addEventListener(type, listener as EventListener, options)
        return this
      }
  
      dispatchCustom<T>(event: CustomEvent<T> | Event): boolean {
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
  
      private removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): CustomEventDispatcher {
        this.removeEventListener(type, listener as EventListener, options)
        return this
      }
    }
    return new DefaultEventDispatcher()
  } 

  async importPromise(): Promise<DataOrError<ImportResult>> { 
    const { imports, context, loaders, syncModuleIds: callable } = this
    for (const key of callable) {
      // console.log('importPromise callable', key)
      const { [key]: loader } = loaders
      if (!loader) return namedError(ERROR.Unimplemented, key)
      const orError = await loader.importPromise()
      if (isDefiniteError(orError)) return orError
    }
    const suffix = context[0].toUpperCase() + context.slice(1)
    const functions = Object.keys(imports).sort((a, b) => b.length - a.length)
    const moduleIds = [...new Set(Object.values(imports).filter(isPopulatedString))].sort()
    const byId: StringsRecord = Object.fromEntries(moduleIds.map(id => (
      [id, functions.filter(key => imports[key] === id)]
    )))
    // console.log('importPromise imports', moduleIds)
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

  installAsync(id: string, moduleOrFunction: ModuleOrAsyncFunction, moduleType: ModuleType = $PROMISE): void {
    this.installSync(id, moduleOrFunction, moduleType)
  }

  installSync(id: string, moduleOrFunction: ModuleOrSyncFunction, moduleType: ModuleType = $CALL): void {
    this.syncModuleIds.add(moduleType)
    // console.log('installSync', id, moduleOrFunction, moduleType)
    this.loaders[moduleType] ||= new FunctionLoader()
    this.loaders[moduleType].install(id, moduleOrFunction)
  }

  listenersAdd(record: EventDispatcherListeners): void {
    MOVIE_MASHER_INSTANCE.eventDispatcher.listenersAdd(record)
  }

  listenersRemove(record: EventDispatcherListeners): void {
    MOVIE_MASHER_INSTANCE.eventDispatcher.listenersRemove(record)
  }

  load<RET = any>(id: string, moduleOrFunction: ModuleOrSyncFunction, moduleType: ModuleType = $CALL): Promise<DataOrError<SyncFunction<RET>>> {
    this.installSync(id, moduleOrFunction, moduleType)
    const { [moduleType]: loader } = this.loaders
    if (!loader) return errorPromise(ERROR.Unimplemented, moduleType)
    
    return loader.functionPromise(id)
  }

  private loaders: Record<ModuleType, FunctionLoader>

  options: MovieMasherOptions = {
    transcode: {
      [$IMAGE]: [$IMAGE],
      [$VIDEO]: [$BITMAPS, $AUDIO, $WAVEFORM],
      [$AUDIO]: [$AUDIO, $WAVEFORM],
    }
  }

  promise<RET = any, ARGS extends string | Typed = Typed, OPTS extends object = object>(stringOrTyped: ARGS, moduleType: ModuleType = $PROMISE, opts?: OPTS): Promise<RET> {
    const { [moduleType]: loader} = this.loaders
    if (!loader) return errorThrow(ERROR.Unimplemented, moduleType)

    const id = isString(stringOrTyped) ? stringOrTyped : stringOrTyped.type
    const args = isTyped(stringOrTyped) ? stringOrTyped : { type: id } 
    // console.log('promise', id, args, opts)
    return loader.promise(id, args, opts)
  }
  
  private _window?: DocumentWindow
  get window(): DocumentWindow {
    // console.trace(this.constructor.name, $WINDOW)
    const { _window } = this
    if (_window) return _window

    return this._window = this.call<DocumentWindow>($WINDOW)
  }
}

const MOVIE_MASHER_INSTANCE: MovieMasherInstance = new MovieMasherClass()
export const MOVIE_MASHER: MovieMasherRuntime = MOVIE_MASHER_INSTANCE



// ERROR HANDLING
const isErrorName = (value: any): value is ErrorNameType => (
  (isString(value)) && ERROR_NAMES.includes(value)
)

const errorMessage = (name: ErrorNameType, context?: ErrorContext): string => {
  if (!context) return name 
  
  if (isString(context)) return context

  const { message } = context as any
  if (isString(message)) return message

  return name
}

const isErrorObject = (value: any): value is ErrorObject => (
  isObject(value) && 'name' in value  
  && isPopulatedString(value.name) 
  && 'message' in value
  && isPopulatedString(value.message) 
)

const errorExpected = (value: any, expected?: ErrorContext, prop?: string): ErrorObject => {
  const type = typeof value
  const isDefined = type !== 'undefined'
  const isObject = type === 'object'
  const name = prop || (isDefined ? type : 'value')
  const words = [name, 'is']
  words.push(isObject ? value.constructor.name : type)
  if (isDefined) words.push(isObject ? jsonStringify(value) : `'${value}'`)
  if (isPopulatedString(expected)) words.push('instead of', String(expected))
  return errorMessageObject(words.join(' '), ERROR.Type)
}

const errorName = (name: ErrorNameType, context?: ErrorContext): ErrorObject => {
  // console.log('errorName', name, context)
  return { name, message: errorMessage(name, context), cause: context }
}

// TODO: remove export
export const errorMessageObject = (message: string, name: string = ERROR.Internal, cause?: unknown): ErrorObject => {
  if (isError(cause)) return cause

  const error = new Error(message)
  Object.assign(error, { name, cause })
  return error
}

// TODO: remove export
export const errorObjectCaught = (error: any): ErrorObject => {
  // console.log('errorObjectCaught', typeof error, error?.constructor.name)
  if (isErrorObject(error)) return error
  if (isErrorName(error)) return errorName(error) 
  if (isString(error)) return errorMessageObject(error)
  
  const { message: errorMessage = '', name = ERROR.Internal } = error
  const message = errorMessage || String(name)
  return errorMessageObject(message, name, error)
}


export const errorThrow = (value: any, type?: ErrorContext, property?: string): never => {
  console.trace('errorThrow', value, type, property)
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

export const errorPromise = (name: ErrorNameType, context?: ErrorContext): Promise<DefiniteError> => (
  Promise.resolve(namedError(name, context))
)

export const isError = (value: any): value is Error => value instanceof Error

// TODo: rename to isErrored
export const isDefiniteError = (value: any): value is DefiniteError => {
  return isObject(value) && 'error' in value // && isObject(value.error)
}

/** Handles low-level error that's been caught, converting to Errored object. */
export const errorCaught = (error: any): DefiniteError => {
  if (isDefiniteError(error)) return error

  // console.error('errorCaught', typeof error, error)
  return { error: errorObjectCaught(error) }
}


export const createErrored = (hitError: Partial<ErrorObject>): DefiniteError => {
  return { error: errorName(ERROR.Unknown) }
}
