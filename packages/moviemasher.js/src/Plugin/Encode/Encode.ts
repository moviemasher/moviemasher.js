import { Value, ValueRecord } from "../../Types/Core"
import { MashAndMediaObject } from "../../Media/Mash/Mash"
import { Output } from "../../Base/Code"
import { OutputFormat } from "../../Setup/Enums"
import { Size } from "../../Utility/Size"
import { EncodingType } from "./Encoding"
import { EncodeType, Plugin } from "../Plugin"
import { PathDataOrError } from "../../Helpers/ClientMedia/ClientMedia"

export interface EncodeOutput extends Output {
  commandOutput: RenderingCommandOutput
}

export interface RenderingCommandOutput extends VideoEncoderOptions {
  outputType: EncodingType
  basename?: string
}
export type RenderingCommandOutputs = RenderingCommandOutput[]

export interface RenderingInput {
  mash: MashAndMediaObject
}
export interface RenderingOptions extends RenderingInput {
  output: RenderingCommandOutput
}

export interface EncoderOptions extends Output {}

export interface RawEncoderOptions extends EncoderOptions {
  extension?: string
  format?: OutputFormat
  options?: ValueRecord
}

export interface AudioEncoderOptions extends RawEncoderOptions {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
}

export interface ImageEncoderOptions extends Partial<Size>, RawEncoderOptions {
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
}

export interface VideoEncoderOptions extends ImageEncoderOptions, AudioEncoderOptions {}

export type EncoderOptionsBy = {
  [index in EncodingType]?: EncoderOptions
}


export type EncodePluginsByType = {
  [index in EncodingType]?: EncodePlugin
}


export type EncodeMethod = (localPath: string, options?: EncoderOptions) => Promise<PathDataOrError>


/**
 * @category Plugin
 */
export interface EncodePlugin extends Plugin {
  type: EncodeType
  encodingType: EncodingType
  encode: EncodeMethod
}


