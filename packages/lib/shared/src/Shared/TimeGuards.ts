import type { Time, TimeRange } from '@moviemasher/runtime-shared';
import { errorThrow } from '@moviemasher/runtime-shared';
import { isObject } from "@moviemasher/runtime-shared";


export const isTime = (value: any): value is Time => {
  return isObject(value) && 'isRange' in value;
};
export function assertTime(value: any, name?: string): asserts value is Time {
  if (!isTime(value))
    errorThrow(value, 'Time', name);
}

export const isTimeRange = (value: any): value is TimeRange => {
  return isTime(value) && value.isRange;
};
export function assertTimeRange(value: any, name?: string): asserts value is TimeRange {
  if (!isTimeRange(value))
    errorThrow(value, 'TimeRange', name);
}
