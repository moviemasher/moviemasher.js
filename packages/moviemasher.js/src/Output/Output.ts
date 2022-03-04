import { CommandArgs, RenderingResult } from "../Api/Rendering"
import { ValueObject, Value, UnknownObject } from "../declarations"
import { Mash } from "../Edited/Mash/Mash"
import { OutputFormat, OutputType, StreamingFormat } from "../Setup/Enums"


export interface CommandOutput extends UnknownObject {
  extension?: string
  format?: OutputFormat
  options?: ValueObject
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
  width?: number
  height?: number
}

export interface RenderingCommandOutput extends CommandOutput {
  outputType: OutputType
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
  mashes: Mash[]
}

export interface RenderingOutputArgs extends OutputConstructorArgs {
  commandOutput: RenderingCommandOutput
  mash: Mash
}

export interface RenderingOutput {
  commandArgsPromise: (renderingResults?: RenderingResult[]) => Promise<CommandArgs[]>
  duration: number
  outputType: OutputType
}
export interface StreamingOutput {
  commandArgPromise: (renderingResults?: RenderingResult[]) => Promise<CommandArgs>
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
}
export interface VideoOutput extends RenderingOutput {}


export interface VideoSequenceOutputArgs extends RenderingOutputArgs {
  cover?: boolean
}
export interface VideoSequenceOutput extends RenderingOutput {}


export interface VideoStreamOutputArgs extends StreamingOutputArgs {}

export interface VideoStreamOutput extends StreamingOutput {}
