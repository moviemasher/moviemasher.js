import type { AssetType, ImageType, VideoType } from './AssetType.js'

export type EncodingType = AssetType
export type EncodingTypes = EncodingType[]

export type FontType = 'font'
export type ImportType = AssetType | FontType
export type ImportTypes = ImportType[]

export type SequenceType = 'sequence'
export type WaveformType = 'waveform'
export type TranscodingType = ImportType | SequenceType | WaveformType
export type TranscodingTypes = TranscodingType[]

export type AlphaType = ImageType | SequenceType | VideoType
