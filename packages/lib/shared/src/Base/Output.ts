import type { EndpointRequest } from '@moviemasher/runtime-shared';
import { isObject } from "@moviemasher/runtime-shared";
import { isTyped } from "@moviemasher/runtime-shared";



export interface Output {
  request?: EndpointRequest;
  type: string;
}


export const isOutput = (value: any): value is Output => {
  return isObject(value) && isTyped(value);
};
