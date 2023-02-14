import { AVType } from "../Setup/Enums"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { EmptyMethod } from "../Setup/Constants"
import { Filter, FilterArgs } from "../Filter/Filter"
import { ValueRecord } from "../declarations"
import { Size } from "../Utility/Size"
import { RectTuple } from "../Utility/Rect"
import { LoaderType } from "../ClientMedia/ClientMediaFunctions"
import { Media } from "../Media/Media"
import { Request } from "../Helpers/Request/Request"
import { isObject } from "../Utility/Is"

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

export interface FilterValueObject {
  filter: Filter
  valueObject: ValueRecord
}
export type FilterValueObjects = FilterValueObject[]

export interface PreloadOptionsBase {
  audible?: boolean
  editing?: boolean
  visible?: boolean
  icon?: boolean
  streaming?: boolean
  time: Time
}

export interface ServerPromiseArgs {
  streaming?: boolean
  visible?: boolean
  audible?: boolean
  time: Time
}

export interface PreloadArgs extends PreloadOptionsBase {
  quantize: number
  clipTime: TimeRange
}

export interface PreloadOptions extends Partial<PreloadOptionsBase> {
  quantize?: number
  clipTime?: TimeRange
}

export type ColorTuple = [string, string]

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

export interface GraphFile {
  type: LoaderType
  file: string
  content?: string
  input?: boolean
  definition: Media
  resolved?: string
}
export type GraphFiles = GraphFile[]

export interface CommandFile extends GraphFile {
  options?: ValueRecord
  inputId: string
}

export type CommandFiles = CommandFile[]

export type VoidMethod = typeof EmptyMethod


export enum Component {
  Browser = 'browser',
  Player = 'player',
  Inspector = 'inspector',
  Timeline = 'timeline',
}

export interface Output {
  request?: Request
}
export const isOutput = (value: any): value is Output => {
  return isObject(value) //&& isRequest(value.request)
}

