import { AVType, GraphFileType, LoadType, SelectType, TransformType } from "./Setup/Enums"
import { Time } from "./Helpers/Time/Time"
import { Definition } from "./Definition/Definition"
import { PropertiedChangeHandler } from "./Base/Propertied"
import { Property } from "./Setup/Property"
import { EmptyMethod } from "./Setup/Constants"
import { Filter } from "./Filter/Filter"
import { Point, Scalar, ValueObject } from "./declarations"
import { Dimensions } from "./Setup/Dimensions"
import { Evaluator } from "./Helpers/Evaluator"

export interface Transform extends Point {
  transformType: TransformType
}

export type Transforms = Transform[]

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
  inputs?: string[]
  outputs?: string[]
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

export interface GraphFileOptions extends Partial<AVEditingArgs> { }

export interface GraphFileArgs extends AVEditingArgs {
  quantize: number
}

export interface GraphState {
  inputCount: number
  previousOutput: string
  outputRequired: boolean
  visible?: boolean
}

export interface ChainArgs extends GraphState, GraphFileArgs {
  outputDimensions: Dimensions
  videoRate: number
}
export interface ContainerChainArgs extends ChainArgs {
  color?: string
}

export interface ContentChainArgs extends ChainArgs {
  containerDimensions: Dimensions
}
export interface Chain {
  commandFilters: CommandFilters
  commandFiles: CommandFiles
}


export interface GraphFile {
  localId?: string
  type: GraphFileType | LoadType
  file: string
  options?: ValueObject
  input?: boolean
  definition: Definition
}
export type GraphFiles = GraphFile[]

export interface CommandFile extends GraphFile {
 inputId: string
}

export type CommandFiles = CommandFile[]

export interface DefinitionRecord extends Record<string, Definition> { }


export type VoidMethod = typeof EmptyMethod


export interface ChainBuilder {
  evaluator: Evaluator
  size: Dimensions
}

