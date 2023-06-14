import { errorThrow } from '@moviemasher/runtime-shared'
import { DataGroup } from '@moviemasher/runtime-shared'
import { DataGroups } from './DataGroupConstants.js'

export const isDataGroup = (value?: any): value is DataGroup => {
  return DataGroups.includes(value as DataGroup)
}
export function assertDataGroup(value: any, name?: string): asserts value is DataGroup {
  if (!isDataGroup(value))
    errorThrow(value, 'DataGroup', name)
}
