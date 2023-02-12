import { AudioType, EffectType, FontType, ImageType, MashType, MediaType, SequenceType, VideoType } from "../Setup/Enums";
import { MediaArray } from "./Media";

export const MediaDefaults: Record<MediaType, MediaArray> = {
  [AudioType]: [],
  [EffectType]: [],
  [FontType]: [],
  [ImageType]: [],
  [MashType]: [],
  [SequenceType]: [],
  [VideoType]: [],
}
