import { UnknownObject, Value, ValueObject } from "../declarations"
import { MashAndMediaObject } from "../Edited/Mash/Mash"
import { Output } from "../MoveMe"
import { OutputFormat, OutputType } from "../Setup/Enums"
import { Size } from "../Utility/Size"

export interface EncodeOutput extends Output {
  commandOutput: RenderingCommandOutput
}

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
  optional?: boolean
  cover?: boolean
}
export type RenderingCommandOutputs = RenderingCommandOutput[]

export interface RenderingInput {
  mash: MashAndMediaObject
}
export interface RenderingOptions extends RenderingInput {
  output: RenderingCommandOutput
}
