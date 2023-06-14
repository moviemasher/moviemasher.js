import { errorThrow } from '@moviemasher/runtime-shared';
import { isObject } from "@moviemasher/runtime-shared";
import { Clip } from '@moviemasher/runtime-shared';
import { ClipObject } from "@moviemasher/runtime-shared";




export const isClip = (value: any): value is Clip => {
  return isObject(value) && 'contentId' in value;
};

export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value))
    errorThrow(value, 'Clip', name);
}

export const isClipObject = (value: any): value is ClipObject => {
  return isObject(value);
};

