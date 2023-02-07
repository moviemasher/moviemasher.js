import { 
  AVType, CommandFilters, CommandInputs, errorsThrow, GraphFiles, Mash, 
  EncodeOutput, MashObject, Medias, OutputType, Time, RenderingCommandOutput, 
  CommandOutput 
} from "@moviemasher/moviemasher.js"
import { Input } from "../declarations"
import { isMediaRequest, MediaRequest, MediaResponse } from "../Media/Media"


export interface EncodeInput extends Input {
  mash?: MashObject
  media?: Medias
}

export interface EncodeRequest extends MediaRequest {
  input: EncodeInput
  output: EncodeOutput
}
export const isEncodeRequest = (value: any): value is EncodeRequest => {
  return isMediaRequest(value) 
} 
export function assertEncodeRequest(value: any): asserts value is EncodeRequest {
  if (!isEncodeRequest(value)) errorsThrow(value, 'EncodeRequest')
}

export interface EncodeResponse extends MediaResponse {}

export interface CommandOptions extends CommandDescription {
  output: CommandOutput
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
  outputType: OutputType
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
  mash: Mash
  startTime?: Time
  endTime?: Time
}

export interface RenderingOutput {
  renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription>
  /** seconds between startTime and endTime, but zero for image outputs */
  duration: number
  outputType: OutputType
  avType: AVType
  /** supplied time, or mash.time */
  startTime: Time
  /** supplied time or mash.endTime, but undefined for image outputs  */
  endTime?: Time
  /** files needed to determine mash duration */
  durationGraphFiles: GraphFiles 
}



