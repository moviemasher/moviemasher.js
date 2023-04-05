import type { Value, ValueRecord } from '../../Types/Core.js'
import type { MashAndMediaObject } from '../../Media/Mash/Mash.js'
import type { Output } from '../../Base/Code.js'
import type { Size } from '../../Utility/Size.js'
import type { EncodingType } from './Encoding/Encoding.js'
import type { Plugin, EncodeType } from '../Plugin.js'
import type { StringDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'

import { OutputFormat } from '../../Setup/Enums.js'

/**
 * @category Plugin
 */
export interface EncodePlugin extends Plugin {
  type: EncodeType
  encodingType: EncodingType
  encode: EncodeMethod
}
export type EncodePluginsByType = Record<EncodingType | string, EncodePlugin>



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


export type EncodeMethod = (localPath: string, options?: EncoderOptions) => Promise<StringDataOrError>

