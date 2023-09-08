import type { Output } from '@moviemasher/lib-shared'
import type { AssetType, OutputOptions, MashAssetObject, StringDataOrError } from '@moviemasher/runtime-shared'


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
