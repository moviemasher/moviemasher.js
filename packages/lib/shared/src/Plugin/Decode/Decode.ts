import type { Data, DecodeType, Decoding, DecodingType, DefiniteError, Plugin, StringDataOrError } from '@moviemasher/runtime-shared'
import type { Output } from "../../Base/Output.js"

/**
 * @category Plugin
 */
export interface DecodePlugin extends Plugin {
  type: DecodeType
  decodingType: DecodingType
  decode: DecodeMethod
}
/**
 * @category Plugin
 */

export type DecodePluginsByType = Record<DecodingType, DecodePlugin>

export interface DecodeData extends Data {
  data: Decoding
}
export type DecodeDataOrError = DefiniteError | DecodeData



export type DecodeMethod = (localPath: string, options?: unknown) => Promise<StringDataOrError>

export interface DecodeOutput extends Output {
  type: DecodingType
  options?: unknown
}

