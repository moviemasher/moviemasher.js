
import { Is } from "../../Utilities/Is";
import dataTypesJson from "../../Setup/dataTypes.json"
import { ScalarRaw } from "../../declarations"
import { DataType, DataTypes } from "../../Setup/Enums";
import { Errors } from "../../Setup/Errors";
import { Type, TypeObject } from "../Type/Type";

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
    if (!(Is.populatedString(type) && DataTypes.includes(type))) throw Errors.type + 'propertyTypeDefault ' + type

    const propertyType = this.propertyType(type)
    if (!Is.object(propertyType)) return ""

    return propertyType.value
  }

  propertyTypes = new Map<DataType, Type>()
}

const TypesInstance = new TypesClass(dataTypesJson)

export { TypesInstance as Types }
