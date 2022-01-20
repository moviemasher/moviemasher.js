import { DataType, DataTypes } from "./Enums"
import { Errors } from "./Errors"
import { Type } from "./Type"

import dataTypesJson from "./dataTypes.json"

const propertyTypes = new Map<DataType, Type>(Object.entries(dataTypesJson).map(entry => {
  const [key, value] = entry
  const dataType = <DataType> key
  if (!DataTypes.includes(dataType)) throw Errors.type + key

  return [dataType, new Type({...value, id: dataType })]
}))

const Types = {
  propertyType: (type : DataType) : Type => {
    const instance = propertyTypes.get(type)
    if (!instance) throw Errors.type + 'propertyType ' + type

    return instance
  }
}

export { Types }
