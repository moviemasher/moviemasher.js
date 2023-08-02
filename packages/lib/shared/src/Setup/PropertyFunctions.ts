import type { Scalar } from '@moviemasher/runtime-shared'
import type { DataType } from "@moviemasher/runtime-shared"
import { DataTypePercent } from "./DataTypeConstants.js"
import { propertyTypeDefault } from '../Base/PropertyTypeFunctions.js'
import { isDefined, isUndefined } from "@moviemasher/runtime-shared"
import { Property } from '@moviemasher/runtime-shared'


const propertyValue = (type: DataType, value?: Scalar, undefinedAllowed?: boolean): Scalar | undefined => {
  if (isDefined(value)) return value 
  if (undefinedAllowed) return undefined

  return propertyTypeDefault(type) 
}

export const propertyInstance = (object: Property): Property => {
  const { defaultValue, ...rest } = object
  const { type, undefinedAllowed } = rest
  
  const dataValue = propertyValue(type, defaultValue, undefinedAllowed)
  const property: Property = { defaultValue: dataValue, ...rest }
  switch (type) {
    case DataTypePercent: {
      if (isUndefined(property.max)) property.max = 1.0
      if (isUndefined(property.min)) property.min = 0.0
      if (isUndefined(property.step)) property.step = 0.01
      break
    }
  }
  return property
}
