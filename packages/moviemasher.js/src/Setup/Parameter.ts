import { UnknownRecord, Value, ValueRecord } from "../Types/Core"
import { isNumeric, isUndefined } from "../Utility/Is"
import { DataType, DataTypes } from "./Enums"

import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../Helpers/Error/ErrorName"

export interface ParameterObject {
  name : string
  value: Value | ValueRecord[]
  values?: Value[]
  dataType?: DataType | string
}

export class Parameter {
  constructor({ name, value, dataType, values }: ParameterObject) {
    if (!name) return errorThrow(ErrorName.Internal) 

    this.values = values
    this.name = name
    if (isUndefined(value)) {
      if (this.values?.length) this.value = this.values[0]
      else return errorThrow(ErrorName.Internal) 
    } else this.value = value

    if (dataType && DataTypes.map(String).includes(dataType)) {
      this.dataType = dataType as DataType
    } else {
      let numeric = false
      if (Array.isArray(this.value)) {
        numeric = this.value.every(condition => isNumeric(condition.value))
      }
      else numeric = isNumeric(this.value)
      if (numeric) this.dataType = DataType.Number
    }
  }

  dataType = DataType.String

  name = ''

  toJSON() : UnknownRecord {
    return { name: this.name, value: this.value }
  }

  value: Value | ValueRecord[] = ''

  values?: Value[]
}
