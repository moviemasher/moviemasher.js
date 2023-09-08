import type { GraphFile } from '@moviemasher/runtime-server'
import type { AVType, Propertied, Rects, Size, Strings, Time, TimeRange, ValueRecord } from '@moviemasher/runtime-shared'

export interface FilterArgs {
  propertied?: Propertied
}

export interface CommandFile extends GraphFile {
  options?: ValueRecord
  inputId: string
}

export type CommandFiles = CommandFile[]

export interface CommandInput {
  source: string
  options?: ValueRecord
}

export type CommandInputs = CommandInput[]

export interface CommandFilter {
  avType?: AVType
  ffmpegFilter: string
  inputs: string[]
  outputs: string[]
  options: ValueRecord
}

export type CommandFilters = CommandFilter[]

export interface CommandFileOptions {
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  outputSize?: Size
  containerRects?: Rects
  contentColors?: Strings
  videoRate: number
  clipTime?: TimeRange
}

export interface CommandFileArgs extends CommandFileOptions {
  clipTime: TimeRange
}

export interface VisibleCommandFileArgs extends CommandFileArgs {
  outputSize: Size
  containerRects: Rects
}

export interface CommandFilterArgs extends CommandFileArgs {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
}

export interface VisibleCommandFilterArgs extends CommandFilterArgs {
  outputSize: Size
  containerRects: Rects
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
  containerRects: Rects
  clipTime: TimeRange
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  contentColors?: Strings
  videoRate: number
  duration: number
}
