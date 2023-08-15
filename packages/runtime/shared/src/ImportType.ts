import type { AssetType, AudioType, ImageType, VideoType } from './AssetType.js'

export type FontType = 'font'

export type ImportType = AssetType | FontType
export type ImportTypes = ImportType[]

export type SequenceType = 'sequence'
export type WaveformType = 'waveform'
export type TranscodingType = ImportType | SequenceType | WaveformType
export type EncodingType = AudioType | ImageType | VideoType
export type EncodingTypes = EncodingType[]
export type TranscodingTypes = TranscodingType[]
