import type { AVType, Propertied, RectTuple, Size, Strings, Time, TimeRange, ValueRecord } from '@moviemasher/runtime-shared'
import type { GraphFile } from './GraphFile.js'

export interface FilterArgs {
  propertied?: Propertied
}

export interface CommandFile extends GraphFile {
  options?: ValueRecord
  inputId: string
}

export interface CommandFiles extends Array<CommandFile>{}

export interface CommandInput {
  source: string
  options?: ValueRecord
}

export interface CommandInputs extends Array<CommandInput>{}

export interface CommandFilter {
  avType?: AVType
  ffmpegFilter: string
  inputs: string[]
  outputs: string[]
  options: ValueRecord
}

export interface CommandFilters extends Array<CommandFilter>{}

export interface CommandFileOptions {
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  outputSize?: Size
  containerRects?: RectTuple
  contentColors?: Strings
  videoRate: number
  clipTime?: TimeRange
}

export interface CommandFileArgs extends CommandFileOptions {
  clipTime: TimeRange
}

export interface VisibleCommandFileArgs extends CommandFileArgs {
  outputSize: Size
  containerRects: RectTuple
}

export interface CommandFilterArgs extends CommandFileArgs {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
}

export interface VisibleCommandFilterArgs extends CommandFilterArgs {
  outputSize: Size
  containerRects: RectTuple
  duration: number
}

export interface FilterCommandFilterArgs extends FilterArgs {
  commandFiles?: CommandFiles,
  chainInput?: string, 
  filterInput?: string
  dimensions?: Size
  videoRate: number
  duration: number
}

export interface FilterCommandFileArgs extends FilterArgs {
  outputSize: Size
  containerRects: RectTuple
  clipTime: TimeRange
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  contentColors?: Strings
  videoRate: number
  duration: number
}
