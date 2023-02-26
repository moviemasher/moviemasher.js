import { UnknownRecord } from "../declarations"

/**
 * @category Plugin
 */
export interface Plugin extends UnknownRecord {
  type: PluginType
}

export interface PluginRecord extends Record<string, Plugin> {}

export type DecodeType = 'decode'
export const DecodeType: DecodeType = 'decode'

export type EncodeType = 'encode'
export const EncodeType: EncodeType = 'encode'

export type TranscodeType = 'transcode'
export const TranscodeType: TranscodeType = 'transcode'

export type ProtocolType = 'protocol'
export const ProtocolType: ProtocolType = 'protocol'

export type LanguageType = 'language'
export const LanguageType: LanguageType = 'language'

export type FilterType = 'filter'
export const FilterType: FilterType = 'filter'

export type ResolveType = 'resolve'
export const ResolveType: ResolveType = 'resolve'

export type ProtocolTypes = ProtocolType[]

export type PluginType = string | ProtocolType | ResolveType | DecodeType | EncodeType | TranscodeType | FilterType | LanguageType
