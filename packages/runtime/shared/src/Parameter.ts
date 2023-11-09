import { Value, ValueRecord } from './Core.js'
import { DataType } from "./DataType.js"


export interface ParameterObject {
  name : string
  value: Value | ValueRecord[]
  values?: Value[]
  dataType?: DataType | string
}
export interface ParameterObjects extends Array<ParameterObject>{}

export interface Parameter {

  dataType: DataType
  name: string
  value: Value | ValueRecord[]
  values?: Value[]

}

export interface Parameters extends Array<Parameter>{}



