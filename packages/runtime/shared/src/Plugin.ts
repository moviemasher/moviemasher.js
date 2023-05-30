import type { Data } from "./DataOrError.js"
import type { DefiniteError } from './Error.js'

/**
 * @category Plugin
 */
export type Plugin<T = unknown> = T &{
  type: PluginType
}

export interface PluginRecord extends Record<string, Plugin | undefined | false> {}


export type ImporterType = 'importer'
export type DecodeType = 'decode'
export type EncodeType = 'encode'
export type FilterType = 'filter'
export type MasherType = 'masher'
export type ProtocolType = 'protocol'
export type TranscodeType = 'transcode'

export type PluginType = DecodeType | EncodeType | FilterType | MasherType | ProtocolType | TranscodeType

export interface PluginData<T = Plugin> {
  data: T
}

export type PluginDataOrError<T = Plugin> = DefiniteError | Data<Plugin<T>>
