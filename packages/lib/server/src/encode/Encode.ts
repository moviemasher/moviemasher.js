import type { EncodingType, OutputOptions, } from '@moviemasher/runtime-shared'
import type { GraphFiles } from '@moviemasher/runtime-server'
import type { AVType, AssetType, Assets, DefiniteError, Identified, MashAssetObject, Time } from '@moviemasher/runtime-shared'
import type { IdentifiedRequest } from '../Media/Media.js'
import type { CommandFilters, CommandInputs } from '../Types/CommandTypes.js'
import type { Input } from '../Types/Input.js'
import type { ServerMashAsset } from '../Types/ServerMashTypes.js'
import type { EncodeOutput, EncoderOptions } from './EncodeTypes.js'

export type RenderingProcessConcatFileDuration = [string, number]

export interface EncodeInput extends Input {
  mash?: MashAssetObject
  assets?: Assets
}

export interface EncodeRequest extends IdentifiedRequest {
  input: EncodeInput
  output: EncodeOutput
}

export type EncodeResponse = DefiniteError | Identified

export interface CommandOptions extends CommandDescription {
  output: OutputOptions
}

export interface CommandDescription {
  duration?: number
  inputs?: CommandInputs
  commandFilters?: CommandFilters
  avType: AVType
}

export type CommandDescriptions = CommandDescription[]

export interface RenderingDescription {
  audibleCommandDescription?: CommandDescription
  visibleCommandDescriptions?: CommandDescriptions
  outputOptions: OutputOptions
  encodingType: AssetType
  // commandOutput: RenderingCommandOutput
}

export interface OutputConstructorArgs {
  cacheDirectory: string
}

export interface RenderingOutputArgs extends OutputConstructorArgs {
  outputOptions: OutputOptions
  encodingType: EncodingType
  // commandOutput: RenderingCommandOutput
  mash: ServerMashAsset
  startTime?: Time
  endTime?: Time
}

export interface RenderingOutput {
  renderingDescriptionPromise(): Promise<RenderingDescription>
  /** seconds between startTime and endTime, but zero for image outputs */
  // duration: number
  // encodingType: EncodingType
  // avType: AVType
  /** supplied time, or mash.time */
  // startTime: Time
  /** supplied time or mash.endTime, but undefined for image outputs  */
  // endTime?: Time
  /** files needed to determine mash duration */
  // durationGraphFiles: GraphFiles 
}

export interface RenderingCommandOutput extends EncoderOptions {
  outputType: AssetType
  basename?: string
}
