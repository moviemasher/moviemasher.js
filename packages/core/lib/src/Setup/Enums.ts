import { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'

export type AudioStreamType = 'audiostream'
export type ClipType = 'clip'
export type ContainerType = 'container'
export type ContentType = 'content'
export type EffectType = 'effect'
export type FontType = 'font'
export type JsonType = 'json'
export type MashType = 'mash'
export type NoneType = 'none'
export type RecordsType = 'records'
export type RecordType = 'record'
export type SequenceType = 'sequence'
export type TrackType = 'track'
export type VideoStreamType = 'videostream'
export type WaveformType = 'waveform'

export type SizingMediaType = FontType | ImageType | VideoType

export type TimingMediaType = AudioType | VideoType 

export type ContainingType = FontType | ImageType 
export type ContentingType = ImageType | VideoType | AudioType

export type SelectorType = ClipType | ContainerType | ContentType | MashType | NoneType | TrackType | EffectType
export type SelectorTypes = SelectorType[]


