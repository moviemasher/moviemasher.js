import type { 
  AVType, CommandFilters, CommandInputs, GraphFiles, MashServerAsset, 
  EncodeOutput, MashAssetObject, MediaArray, EncodingType, Time, 
  DefiniteError, Identified, OutputOptions, EncoderOptions 
} from "@moviemasher/lib-core"
import type { Input } from "../../Types/Core.js"
import type { MediaRequest } from "../../Media/Media.js"


export interface EncodeInput extends Input {
  mash?: MashAssetObject
  media?: MediaArray
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
  encodingType: EncodingType
  // commandOutput: RenderingCommandOutput
}


export interface OutputConstructorArgs {
  cacheDirectory: string
}

export interface RenderingOutputArgs extends OutputConstructorArgs {
  outputOptions: OutputOptions
  encodingType: EncodingType
  // commandOutput: RenderingCommandOutput
  mash: MashServerAsset
  startTime?: Time
  endTime?: Time
}

export interface RenderingOutput {
  renderingDescriptionPromise(): Promise<RenderingDescription>
  /** seconds between startTime and endTime, but zero for image outputs */
  duration: number
  encodingType: EncodingType
  avType: AVType
  /** supplied time, or mash.time */
  startTime: Time
  /** supplied time or mash.endTime, but undefined for image outputs  */
  endTime?: Time
  /** files needed to determine mash duration */
  durationGraphFiles: GraphFiles 
}



export interface RenderingCommandOutput extends EncoderOptions {
  outputType: EncodingType
  basename?: string
}
