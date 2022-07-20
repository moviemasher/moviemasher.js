import { ValueObject, Value, UnknownObject } from "../declarations"
import { AVType, OutputFormat, OutputType, StreamingFormat } from "../Setup/Enums"
import { RenderingDescription, RenderingResult } from "../Api/Rendering"
import { Mash, Mashes } from "../Edited/Mash/Mash"
import { StreamingDescription } from "../Api/Streaming"
import { Time } from "../Helpers/Time/Time"
import { Size } from "../Utility/Size"

export interface CommandOutput extends UnknownObject, Partial<Size> {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
  extension?: string
  format?: OutputFormat
  options?: ValueObject
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
}

export interface RenderingCommandOutput extends CommandOutput {
  outputType: OutputType
  basename?: string
}

export type CommandOutputs = RenderingCommandOutput[]

export interface StreamingCommandOutput extends Required<CommandOutput> { // always singular
  streamingFormat: StreamingFormat
}

export interface OutputConstructorArgs {
  cacheDirectory: string
}

export interface StreamingOutputArgs extends OutputConstructorArgs {
  commandOutput: StreamingCommandOutput
  mashes: Mashes
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
}


export interface StreamingOutput {
  streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription>
}

export interface ImageOutputArgs extends RenderingOutputArgs {
  offset?: number
  cover?: boolean
}

export interface ImageOutput extends RenderingOutput {}

export interface AudioOutputArgs extends RenderingOutputArgs {}

export interface AudioOutput extends RenderingOutput {}

export interface WaveformOutputArgs extends RenderingOutputArgs {
  backcolor?: string
  forecolor?: string
}
export interface WaveformOutput extends RenderingOutput {}

export interface VideoOutputArgs extends RenderingOutputArgs {
  cover?: boolean
  mute?: boolean
}
export interface VideoOutput extends RenderingOutput {}

export interface ImageSequenceOutputArgs extends RenderingOutputArgs {
  cover?: boolean
}
export interface ImageSequenceOutput extends RenderingOutput {}

export interface VideoStreamOutputArgs extends StreamingOutputArgs {}

export interface VideoStreamOutput extends StreamingOutput {}
