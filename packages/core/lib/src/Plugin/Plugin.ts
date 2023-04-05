import type { Data } from '../Helpers/ClientMedia/ClientMedia.js'
import type { DefiniteError } from '../Helpers/Error/Error.js'

/**
 * @category Plugin
 */
export type Plugin<T = unknown> = T &{
  type: PluginType
}

export interface PluginRecord extends Record<string, Plugin | undefined | false> {}


export type DecodeType = 'decode'
export type EncodeType = 'encode'
export type FilterType = 'filter'
export type MasherType = 'masher'
export type ProtocolType = 'protocol'
export type ProtocolTypes = ProtocolType[]
export type ResolveType = 'resolve'
export type ThemeType = 'theme'
export type TranscodeType = 'transcode'

export const TypeDecode: DecodeType = 'decode'
export const TypeEncode: EncodeType = 'encode'
export const TypeFilter: FilterType = 'filter'
export const TypeMasher: MasherType = 'masher'
export const TypeProtocol: ProtocolType = 'protocol'
export const TypeResolve: ResolveType = 'resolve'
export const TypeTheme: ThemeType = 'theme'
export const TypeTranscode: TranscodeType = 'transcode'


export type PluginType = DecodeType | EncodeType | FilterType | MasherType | ProtocolType | ResolveType | ThemeType | TranscodeType

export interface PluginData<T = Plugin> {
  data: T
}

export type PluginDataOrError<T = Plugin> = DefiniteError | Data<Plugin<T>>