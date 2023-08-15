import type { AssetType, EncodeType, MashAssetObject, Plugin, StringDataOrError } from '@moviemasher/runtime-shared'
import type { Output } from "../../Base/Output.js"
import type { OutputOptions } from '../../Helpers/Output/Output.js'

/**
 * @category Plugin
 */
export interface EncodePlugin extends Plugin {
  type: EncodeType
  encodingType: AssetType
  encode: EncodeMethod
}
export type EncodePluginsByType = Record<AssetType | string, EncodePlugin>



export interface EncodeOutput extends Output {
  type: AssetType
  options: OutputOptions
}



export interface RenderingInput {
  mash: MashAssetObject
}
export interface RenderingOptions extends RenderingInput {
  outputOptions: OutputOptions
  encodingType: AssetType
  basename?: string
}

export interface EncoderOptions extends Output {}

export type EncodeMethod = (localPath: string, options: OutputOptions) => Promise<StringDataOrError>


