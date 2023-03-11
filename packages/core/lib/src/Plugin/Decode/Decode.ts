import { Data, StringDataOrError } from "../../Helpers/ClientMedia/ClientMedia"
import { Decoding, DecodingType } from "./Decoding/Decoding"
import { DefiniteError } from "../../Helpers/Error/Error"
import { Output } from "../../Base/Code"
import { DecodeType, Plugin } from "../Plugin"

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



export type DecodeMethod = (localPath: string, options?: DecoderOptions) => Promise<StringDataOrError>


export interface DecodeOutput extends Output {
  type: DecodingType
  options?: DecoderOptions
}

export interface DecoderOptions {}

