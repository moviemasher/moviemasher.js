import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { AudioType, EffectType, FontType, ImageType, MashType, SequenceType, VideoType } from "./Enums"


export type MediaType = AudioType | EffectType | FontType | ImageType | MashType | SequenceType | VideoType 
export type MediaTypes = MediaType[]
export const MediaTypes: MediaTypes = [AudioType, EffectType, FontType, ImageType, MashType, SequenceType, VideoType]
export type MediaTypesRecord = Record<string, MediaTypes>
export const isMediaType = (value: any): value is MediaType => {
  return MediaTypes.includes(value)
}
export function assertMediaType(value?: any, name?: string): asserts value is MediaType {
  if (!isMediaType(value)) errorThrow(value, 'MediaType', name)
}
