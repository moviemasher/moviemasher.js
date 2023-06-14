import type { AudioType, FontType, ImageType, VideoType } from '@moviemasher/runtime-shared'

export type JsonType = 'json'

export type SizingMediaType = FontType | ImageType | VideoType

export type TimingMediaType = AudioType | VideoType 

export type ContainingType = FontType | ImageType 
export type ContentingType = ImageType | VideoType | AudioType
