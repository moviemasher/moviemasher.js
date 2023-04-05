import type {Data, StringDataOrError} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {Decoding, DecodingType} from './Decoding/Decoding.js'
import type {DefiniteError} from '../../Helpers/Error/Error.js'
import type {Output} from '../../Base/Code.js'
import type {DecodeType, Plugin} from '../Plugin.js'

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

