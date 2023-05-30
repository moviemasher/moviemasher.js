import type { Scalar } from '@moviemasher/runtime-shared';
import type { DataType } from "@moviemasher/runtime-shared";
import { DataTypeBoolean, DataTypeNumber, DataTypePercent, DataTypeString } from "./DataTypeConstants.js";
import { isDataType, assertDataType } from "./DataTypeFunctions.js";
import { propertyTypeDefault } from '../Helpers/PropertyType.js';
import { isBoolean, isNumber, isObject, isPopulatedString, isUndefined } from '../Shared/SharedGuards.js';
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js';
import { Property, PropertyObject } from '@moviemasher/runtime-shared';





export const isProperty = (value: any): value is Property => {
  return isObject(value) && 'type' in value && isDataType(value.type);
};
export function assertProperty(value: any, name?: string): asserts value is Property {
  if (!isProperty(value))
    errorThrow(value, 'Property', name);
}
const propertyType = (type?: DataType | string, value?: Scalar): DataType => {
  if (isUndefined(type)) {
    if (isBoolean(value))
      return DataTypeBoolean;
    if (isNumber(value))
      return DataTypeNumber;
    return DataTypeString;
  }
  assertDataType(type);

  return type;
};
const propertyValue = (type: DataType, value?: Scalar): Scalar => {
  if (isUndefined(value))
    return propertyTypeDefault(type);

  return value!;
};

export const propertyInstance = (object: PropertyObject): Property => {
  const { type, name, defaultValue, ...rest } = object;
  const dataType = propertyType(type, defaultValue);
  const dataValue = propertyValue(dataType, defaultValue);
  const dataName = isPopulatedString(name) ? name : dataType;
  const property: Property = {
    type: dataType, defaultValue: dataValue, name: dataName, ...rest
  };
  switch (type) {
    case DataTypePercent: {
      if (isUndefined(property.max))
        property.max = 1.0;
      if (isUndefined(property.min))
        property.min = 0.0;
      if (isUndefined(property.step))
        property.step = 0.01;
      break;
    }
  }
  return property;
};
