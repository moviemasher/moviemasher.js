import { UnknownRecord, Value, ValueRecord } from '@moviemasher/runtime-shared';
import { isNumeric, isUndefined } from '../Shared/SharedGuards.js';
import { DataType } from "@moviemasher/runtime-shared";
import { DataTypeNumber, DataTypeString, DataTypes } from "./DataTypeConstants.js";
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js';
import { ErrorName } from '../Helpers/Error/ErrorName.js';
import { ParameterObject } from '@moviemasher/runtime-shared';



export class ParameterClass {
  constructor({ name, value, dataType, values }: ParameterObject) {
    if (!name)
      return errorThrow(ErrorName.Internal);

    this.values = values;
    this.name = name;
    if (isUndefined(value)) {
      if (this.values?.length)
        this.value = this.values[0];
      else
        return errorThrow(ErrorName.Internal);
    } else
      this.value = value;

    if (dataType && DataTypes.map(String).includes(dataType)) {
      this.dataType = dataType as DataType;
    } else {
      let numeric = false;
      if (Array.isArray(this.value)) {
        numeric = this.value.every(condition => isNumeric(condition.value));
      }
      else
        numeric = isNumeric(this.value);
      if (numeric)
        this.dataType = DataTypeNumber;
    }
  }

  dataType = DataTypeString;

  name = '';
  toJSON(): UnknownRecord {
    return { name: this.name, value: this.value };
  }

  value: Value | ValueRecord[] = '';
  values?: Value[];
}
