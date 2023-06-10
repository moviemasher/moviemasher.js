import type { RectTuple, Size, Time, TimeRange, ValueRecord } from '@moviemasher/runtime-shared'

import type { Filter, FilterArgs } from '../Plugin/Filter/Filter.js'
import type { AVType } from "../Setup/AVType.js"
import type { ServerAsset } from './Asset/ServerAsset.js'
import type { GraphFileType } from '../Setup/GraphFileType.js'
import type { LoadType } from '../Setup/LoadType.js'
import type { ColorTuple } from './ServerTypes.js'
import { CacheOptions } from '../Base/CacheTypes.js'


export interface GraphFile {
  type: GraphFileType | LoadType
  file: string
  content?: string
  input?: boolean
  definition: ServerAsset
  resolved?: string
}
export type GraphFiles = GraphFile[]

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


export interface GraphFilter extends CommandFilter {
  filter: Filter
}

export type GraphFilters = GraphFilter[]


export interface CommandFileOptions {
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  outputSize?: Size
  containerRects?: RectTuple
  contentColors?: ColorTuple
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
  contentColors?: ColorTuple
  videoRate: number
  duration: number
}

export interface FilterDefinitionArgs extends FilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFilterArgs extends FilterCommandFilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFileArgs extends FilterCommandFileArgs {
  filter: Filter
}


export interface ServerPromiseArgs extends CacheOptions {}




