import { Output } from "../../Base/Code"
import { Data } from "../../ClientMedia/ClientMedia"
import { DefiniteError, PathDataOrError } from "../../Helpers/Error/Error"
import { Plugin } from "../Plugin"
import { Decoding } from "./Decoding/Decoding"
import { ProbingData } from "./Probe/Probing/Probing"

export type ProbeType = 'probe'

export const ProbeType: ProbeType = 'probe'

export type DecodingType = string | ProbeType
export type DecodingTypes = DecodingType[]
export const DecodingTypes: DecodingTypes = [ProbeType]
export const isDecodingType = (value: any): value is DecodingType => DecodingTypes.includes(value)

export interface DecoderOptions {}

export interface DecodeData extends Data {
  data: Decoding
}

export type DecodeDataOrError = DefiniteError | DecodeData 

export type DecodeMethod = (localPath: string, options?: DecoderOptions) => Promise<PathDataOrError>


/**
 * @category Plugin
 */
export interface DecodePlugin extends Plugin {
  type: DecodingType
  decode: DecodeMethod
}

/**
 * @category Plugin
 */
export interface PluginsByDecoder extends Record<DecodingType, DecodePlugin> {}

export interface ProbeData extends Data {
  data: ProbingData
}

export interface DecodeOutput extends Output {
  type: DecodingType
  options?: DecoderOptions
}
