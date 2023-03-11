import { Data } from "../Helpers/ClientMedia/ClientMedia"
import { DefiniteError } from "../Helpers/Error/Error"
import { UnknownRecord } from "../Types/Core"
import { PluginsByMashing } from "./Masher/Masher"

/**
 * @category Plugin
 */
export type Plugin<T = unknown> = T &{
  type: PluginType
}

export interface PluginRecord extends Record<string, Plugin | undefined | false> {}

export type DecodeType = 'decode'
export const DecodeType: DecodeType = 'decode'

export type EncodeType = 'encode'
export const EncodeType: EncodeType = 'encode'

export type FilterType = 'filter'
export const FilterType: FilterType = 'filter'

export type MasherType = 'masher'
export const MasherType: MasherType = 'masher'


export type ProtocolType = 'protocol'
export const ProtocolType: ProtocolType = 'protocol'

export type ResolveType = 'resolve'
export const ResolveType: ResolveType = 'resolve'

export type TranscodeType = 'transcode'
export const TranscodeType: TranscodeType = 'transcode'

export type TranslateType = 'translate'
export const TranslateType: TranslateType = 'translate'

export type ProtocolTypes = ProtocolType[]

export type ThemeType = 'theme'
export const ThemeType: ThemeType = 'theme'

export type PluginType = DecodeType | EncodeType | FilterType | MasherType | ProtocolType | ResolveType | ThemeType | TranscodeType | TranslateType 

export interface PluginData<T = Plugin> {
  data: T
}

export type PluginDataOrError<T = Plugin> = DefiniteError | Data<Plugin<T>>