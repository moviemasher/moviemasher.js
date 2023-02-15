import { Output } from "../../Base/Code"
import { MediaResponse } from "../../Media/Media"
import { Plugin } from "../Plugin"

export type ProbeType = 'probe'

export const ProbeType: ProbeType = 'probe'

export type Decoder = string | ProbeType
export const Decoders: Decoder[] = [ProbeType]
export const isDecoder = (value: any): value is Decoder => {
  return Decoders.includes(value)
}

export interface DecoderOptions {}

export type DecoderMethod = (localPath: string, options?: DecoderOptions) => Promise<DecodeResponse>


/**
 * @category Plugin
 */
export interface DecoderPlugin extends Plugin {
  type: Decoder
  decode: DecoderMethod
}

/**
 * @category Plugin
 */
export interface PluginsByDecoder extends Record<Decoder, DecoderPlugin> {}


export interface DecodeResponse extends MediaResponse {
  info?: any
  width?: number
  height?: number
  duration?: number
  alpha?: boolean
  audio?: boolean
}

export interface DecodeOutput extends Output {
  type: Decoder
  options?: DecoderOptions
}
