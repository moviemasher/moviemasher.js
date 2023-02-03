import { ValueObject, Value, UnknownObject } from "../declarations"
import { AVType, OutputFormat, OutputType } from "../Setup/Enums"
import { RenderingDescription, RenderingResult } from "../Api/Rendering"
import { Mash } from "../Edited/Mash/Mash"
import { Time } from "../Helpers/Time/Time"
import { Size } from "../Utility/Size"
import { GraphFiles } from "../MoveMe"

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

export type CommandOutputs = RenderingCommandOutput[]


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

