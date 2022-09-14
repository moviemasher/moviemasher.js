import { AVType, GraphFileType, LoadType } from "./Setup/Enums"
import { Time, TimeRange } from "./Helpers/Time/Time"
import { Definition } from "./Definition/Definition"
import { Propertied } from "./Base/Propertied"
import { EmptyMethod } from "./Setup/Constants"
import { Filter } from "./Filter/Filter"
import { ValueObject } from "./declarations"
import { Size } from "./Utility/Size"
import { RectTuple } from "./Utility/Rect"
import { LoaderType } from "./Loader/Loader"

export interface CommandFilter {
  avType?: AVType
  ffmpegFilter: string
  inputs: string[]
  outputs: string[]
  options: ValueObject
}

export type CommandFilters = CommandFilter[]

export interface GraphFilter extends CommandFilter {
  filter: Filter
}
export type GraphFilters = GraphFilter[]

export interface FilterValueObject {
  filter: Filter
  valueObject: ValueObject
}
export type FilterValueObjects = FilterValueObject[]

export interface GraphFileBase {
  audible?: boolean
  editing?: boolean
  visible?: boolean
  icon?: boolean
  streaming?: boolean
  time: Time
}

export interface GraphFileOptions extends Partial<GraphFileBase> {
  quantize?: number
  clipTime?: TimeRange
}

export interface GraphFileArgs extends GraphFileBase {
  quantize: number
  clipTime: TimeRange
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

export interface FilterArgs {
  propertied?: Propertied
}

export interface FilterCommandFilterArgs extends FilterArgs {
  chainInput?: string, 
  filterInput?: string
  dimensions?: Size
  videoRate: number
  duration: number
}

export interface FilterDefinitionArgs extends FilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFilterArgs extends FilterCommandFilterArgs {
  filter: Filter
}

export interface GraphFile {
  type: LoaderType
  file: string
  content?: string
  input?: boolean
  definition?: Definition
  resolved?: string
}
export type GraphFiles = GraphFile[]

export interface CommandFile extends GraphFile {
  options?: ValueObject
  inputId: string
}

export type CommandFiles = CommandFile[]

export interface DefinitionRecord extends Record<string, Definition> { }


export type VoidMethod = typeof EmptyMethod
