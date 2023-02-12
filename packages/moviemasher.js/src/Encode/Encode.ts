import { UnknownRecord, Value, ValueRecord } from "../declarations"
import { MashAndMediaObject } from "../Media/Mash/Mash"
import { Output } from "../Base/Code"
import { OutputFormat, EncodeType } from "../Setup/Enums"
import { Size } from "../Utility/Size"

export interface EncodeOutput extends Output {
  commandOutput: RenderingCommandOutput
}

export interface CommandOutput extends UnknownRecord, Partial<Size> {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
  extension?: string
  format?: OutputFormat
  options?: ValueRecord
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
}

export interface RenderingCommandOutput extends CommandOutput {
  outputType: EncodeType
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
