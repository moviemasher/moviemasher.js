import { 
  AVType, CommandFilters, CommandInputs, errorThrow, GraphFiles, MashMedia, 
  EncodeOutput, MashMediaObject, MediaArray, EncodingType, Time, RenderingCommandOutput, 
  VideoEncoderOptions, DefiniteError, Identified 
} from "@moviemasher/moviemasher.js"
import { Input } from "../../Types/Core"
import { isMediaRequest, MediaRequest } from "../../Media/Media"


export interface EncodeInput extends Input {
  mash?: MashMediaObject
  media?: MediaArray
}

export interface EncodeRequest extends MediaRequest {
  input: EncodeInput
  output: EncodeOutput
}
export const isEncodeRequest = (value: any): value is EncodeRequest => {
  return isMediaRequest(value) 
} 
export function assertEncodeRequest(value: any): asserts value is EncodeRequest {
  if (!isEncodeRequest(value)) errorThrow(value, 'EncodeRequest')
}

export type EncodeResponse = DefiniteError | Identified

export interface CommandOptions extends CommandDescription {
  output: VideoEncoderOptions
}

export interface CommandDescription {
  duration?: number
  inputs?: CommandInputs
  commandFilters?: CommandFilters
  avType: AVType
}

export type CommandDescriptions = CommandDescription[]




export interface RenderingResult {
  error?: string
  warning?: string
  outputType: EncodingType
  destination?: string
}

export interface RenderingDescription {
  audibleCommandDescription?: CommandDescription
  visibleCommandDescriptions?: CommandDescriptions
  commandOutput: RenderingCommandOutput
}




export interface OutputConstructorArgs {
  cacheDirectory: string
}


export interface RenderingOutputArgs extends OutputConstructorArgs {
  commandOutput: RenderingCommandOutput
  mash: MashMedia
  startTime?: Time
  endTime?: Time
}

export interface RenderingOutput {
  renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription>
  /** seconds between startTime and endTime, but zero for image outputs */
  duration: number
  outputType: EncodingType
  avType: AVType
  /** supplied time, or mash.time */
  startTime: Time
  /** supplied time or mash.endTime, but undefined for image outputs  */
  endTime?: Time
  /** files needed to determine mash duration */
  durationGraphFiles: GraphFiles 
}



