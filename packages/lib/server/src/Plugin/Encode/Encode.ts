import type { 
  AVType, CommandFilters, CommandInputs, GraphFiles, ServerMashAsset, 
  EncodeOutput, MashAssetObject,
  OutputOptions, EncoderOptions, Assets 
} from "@moviemasher/lib-shared"
import type { Input } from "../../Types/Core.js"
import type { MediaRequest } from "../../Media/Media.js"
import { AssetType, DefiniteError, Identified, Time } from "@moviemasher/runtime-shared"


export interface EncodeInput extends Input {
  mash?: MashAssetObject
  media?: Assets
}

export interface EncodeRequest extends MediaRequest {
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
  encodingType: AssetType
  // commandOutput: RenderingCommandOutput
  mash: ServerMashAsset
  startTime?: Time
  endTime?: Time
}

export interface RenderingOutput {
  renderingDescriptionPromise(): Promise<RenderingDescription>
  /** seconds between startTime and endTime, but zero for image outputs */
  duration: number
  encodingType: AssetType
  avType: AVType
  /** supplied time, or mash.time */
  startTime: Time
  /** supplied time or mash.endTime, but undefined for image outputs  */
  endTime?: Time
  /** files needed to determine mash duration */
  durationGraphFiles: GraphFiles 
}



export interface RenderingCommandOutput extends EncoderOptions {
  outputType: AssetType
  basename?: string
}
