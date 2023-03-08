import { 
  AudioType, EffectType, FontType, ImageType, MashType, SequenceType, 
  VideoType 
} from "../Setup/Enums"
import { MediaType } from "../Setup/MediaType"
import { MediaArray } from "./Media"

export const MediaDefaults: Record<MediaType, MediaArray> = {
  [AudioType]: [],
  [EffectType]: [],
  [FontType]: [],
  [ImageType]: [],
  [MashType]: [],
  [SequenceType]: [],
  [VideoType]: [],
}
