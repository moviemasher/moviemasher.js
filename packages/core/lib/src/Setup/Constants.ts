export const LastIndex = -1
export const CurrentIndex = -2
export const FirstIndex = 0
export const NextIndex = -3

export const AsteriskChar = '*'
export const ColonChar = ':'
export const CommaChar = ','
export const DashChar = '-'
export const DotChar = '.'
export const EqualsChar = '='
export const NewlineChar = "\n"
export const QuestionChar = '?'
export const SemicolonChar = ';'
export const SlashChar = '/'

export const ColonRegex = /:/g
export const CommaRegex = /,/g
export const ReplaceRegex = /{{([a-z0-9_]*)}}/

export const AscendingOrder = 'ascending'
export const DescendingOrder = 'descending'

export const JpegExtension = 'jpg'
export const JsonExtension = 'json'
export const TextExtension = 'txt'
export const CssExtension = 'css'
export const Mp4Extension = 'mp4'
export const PngExtension = 'png'

export const JsonMimetype = `application/${JsonExtension}`
export const CssMimetype = `text/${CssExtension}`
export const FormDataMimetype = 'multipart/form-data'
export const ContentTypeHeader = 'Content-Type'

export const EmptyFunction = () => {}
export type UnknownFunction = { (...args: unknown[]): unknown }

// xmlns
export const NamespaceSvg = 'http://www.w3.org/2000/svg'
// xmlns:xhtml
export const NamespaceXhtml = 'http://www.w3.org/1999/xhtml'
// xmlns:xlink
export const NamespaceLink = 'http://www.w3.org/1999/xlink'

export const IdPrefix = 'com.moviemasher.'
export const IdSuffix = '.default'

export const ClassDisabled = 'disabled'
export const ClassItem = 'item'
export const ClassButton = 'button'
export const ClassCollapsed = 'collapsed'
export const ClassSelected = 'selected'
export const ClassDropping = 'dropping'
export const ClassDroppingBefore = 'dropping-before'
export const ClassDroppingAfter = 'dropping-after'