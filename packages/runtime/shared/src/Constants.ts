import { Lock } from './Lock.js'

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
export const MIME_CSS = `text/css`
export const MIME_MULTI = 'multipart/form-data'
export const CONTENT_TYPE = 'Content-Type'

export const NAMESPACE_SVG = 'http://www.w3.org/2000/svg'

export const VOID_FUNCTION = () => {}

const IdPrefix = 'com.moviemasher.'
const IdSuffix = '.default'
export const DEFAULT_CONTENT_ID = `${IdPrefix}content.image${IdSuffix}`
export const DEFAULT_CONTAINER_ID = `${IdPrefix}container.image${IdSuffix}`

export const FLIP = 'flip'
export const MAINTAIN = 'maintain'

export const ASPECTS = [FLIP, MAINTAIN] 

export const HEIGHT = 'height'
export const LONGEST = 'longest'
export const NONE = 'none'
export const SHORTEST = 'shortest'
export const WIDTH = 'width'

export const LOCKS: Lock[] = [HEIGHT, LONGEST, NONE, SHORTEST, WIDTH]

export const TEMPORARY = 'temporary'
export const TEXT_HEIGHT = 1000

