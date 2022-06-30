import { AVType, GraphFileType, LoadType, SelectType, TransformType } from "./Setup/Enums"
import { Time, TimeRange } from "./Helpers/Time/Time"
import { Definition } from "./Definition/Definition"
import { Propertied, PropertiedChangeHandler } from "./Base/Propertied"
import { Property } from "./Setup/Property"
import { EmptyMethod } from "./Setup/Constants"
import { Filter } from "./Filter/Filter"
import { Point, Rect, Scalar, ValueObject } from "./declarations"
import { Dimensions } from "./Setup/Dimensions"
import { Evaluator } from "./Helpers/Evaluator"



export interface SelectedProperty {
  selectType: SelectType
  property: Property
  changeHandler: PropertiedChangeHandler
  value: Scalar
}
export type SelectedProperties = SelectedProperty[]


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

export interface AVEditingArgs {
  audible?: boolean
  editing?: boolean
  visible?: boolean
  streaming?: boolean
  time: Time
}

export interface GraphFileOptions extends Partial<AVEditingArgs> {
  quantize?: number
}

export interface GraphFileArgs extends AVEditingArgs {
  quantize: number
}

export interface CommandFileArgs {
  visible?: boolean
  time: Time
  quantize: number
  outputDimensions?: Dimensions
  containerRects?: Rect[]
  colors?: Scalar[]
  videoRate: number
}

export interface ContentCommandFileArgs extends CommandFileArgs {
  clipTime: TimeRange
}

export interface ContainerCommandFileArgs extends CommandFileArgs {
  clipTime: TimeRange
}

export interface CommandFilterArgs extends CommandFileArgs {
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
}

export interface ContentCommandFilterArgs extends CommandFilterArgs {
  clipTime: TimeRange
}


export interface ContainerCommandFilterArgs extends CommandFilterArgs {
  filterInput: string
  clipTime: TimeRange
}

export interface FilterArgs {
  propertied?: Propertied
}

export interface FilterCommandFilterArgs extends FilterArgs {
  chainInput?: string, 
  filterInput?: string
  dimensions?: Dimensions
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
  type: GraphFileType | LoadType
  file: string
  options?: ValueObject
  input?: boolean
  definition: Definition
  resolved?: string
}
export type GraphFiles = GraphFile[]

export interface CommandFile extends GraphFile {
 inputId: string
}

export type CommandFiles = CommandFile[]

export interface DefinitionRecord extends Record<string, Definition> { }


export type VoidMethod = typeof EmptyMethod
