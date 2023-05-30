import type { DataType } from '@moviemasher/runtime-shared'

import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { DataTypes } from './DataTypeConstants.js'

export const isDataType = (type?: any): type is DataType => {
  return DataTypes.includes(type as DataType)
}

export function assertDataType(value: any, name?: string): asserts value is DataType {
  if (!isDataType(value))
    errorThrow(value, 'DataType', name)
}
