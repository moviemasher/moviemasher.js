import { Value, ValueRecord } from './Core.js'
import { DataType } from "./DataType.js"


export interface ParameterObject {
  name : string
  value: Value | ValueRecord[]
  values?: Value[]
  dataType?: DataType | string
}
export type ParameterObjects = ParameterObject[]

export interface Parameter {

  dataType: DataType
  name: string
  value: Value | ValueRecord[]
  values?: Value[]

}

export type Parameters = Parameter[]



