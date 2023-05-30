import type {StringDataOrError} from '../../Helpers/ClientMedia/ClientMedia.js'
import type { Data } from "@moviemasher/runtime-shared"
import type {Decoding, DecodingType} from './Decoding/Decoding.js'
import type {DefiniteError} from '@moviemasher/runtime-shared'
import type {Output} from '../../Base/Code.js'
import type {DecodeType, Plugin} from '@moviemasher/runtime-shared'

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

