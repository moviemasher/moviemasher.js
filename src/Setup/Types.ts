import { ScalarRaw } from "../declarations"
import { DataType, DataTypes } from "./Enums"
import { Errors } from "./Errors"
import { isObject, isPopulatedString } from "../Utilities/Is"
import { Type, TypeObject } from "./Type"

import dataTypesJson from "./dataTypes.json"

interface TypesJson {
  [index : string] : TypeObject
}

class TypesClass {
  constructor(object : TypesJson) {
    Object.entries(object).forEach(entry => {
      const [key, value] = entry
      const dataType = <DataType> key
      if (!DataTypes.includes(dataType)) throw Errors.type + 'DataTypes ' + key

      this.propertyTypes.set(dataType, new Type({...value, id: dataType }))
    })
  }

  propertyType(type : DataType) : Type {
    const instance = this.propertyTypes.get(type)
    if (!instance) throw Errors.type + 'propertyType ' + type

    return instance
  }

  propertyTypeDefault(type : DataType) : ScalarRaw {
    if (!(isPopulatedString(type) && DataTypes.includes(type))) throw Errors.type + 'propertyTypeDefault ' + type

    const propertyType = this.propertyType(type)
    if (!isObject(propertyType)) return ""

    return propertyType.value
  }

  propertyTypes = new Map<DataType, Type>()
}

const Types = new TypesClass(dataTypesJson)

export { Types }
