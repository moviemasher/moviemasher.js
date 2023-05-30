import type { Output } from '../../Base/Code.js'
import type { EncodingType } from './Encoding/Encoding.js'
import type { Plugin, EncodeType } from '@moviemasher/runtime-shared'
import type { StringDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { OutputOptions } from '../../Helpers/Output/Output.js'
import { MashAssetObject } from '../../Shared/Mash/MashTypes.js'

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
  type: EncodingType
  options: OutputOptions
}



export interface RenderingInput {
  mash: MashAssetObject
}
export interface RenderingOptions extends RenderingInput {
  outputOptions: OutputOptions
  encodingType: EncodingType
  basename?: string
}

export interface EncoderOptions extends Output {}

export type EncodeMethod = (localPath: string, options: OutputOptions) => Promise<StringDataOrError>


