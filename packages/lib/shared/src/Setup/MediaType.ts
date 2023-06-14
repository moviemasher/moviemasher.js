import type { MashType } from "@moviemasher/runtime-client"
import type { FontType } from "@moviemasher/runtime-shared"
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'

import { TypeMash } from "./EnumConstantsAndFunctions.js"
import { TypeFont } from "@moviemasher/runtime-shared"
import { TypeAudio, TypeImage, TypeVideo } from "@moviemasher/runtime-shared"
import { errorThrow } from '@moviemasher/runtime-shared'


export type MediaType = AudioType | FontType | ImageType | MashType | VideoType 
export type MediaTypes = MediaType[]
export const MediaTypes: MediaTypes = [TypeAudio, TypeFont, TypeImage, TypeMash, TypeVideo]
export type MediaTypesRecord = Record<string, MediaTypes>
export const isMediaType = (value: any): value is MediaType => {
  return MediaTypes.includes(value)
}
export function assertMediaType(value?: any, name?: string): asserts value is MediaType {
  if (!isMediaType(value)) errorThrow(value, 'MediaType', name)
}
