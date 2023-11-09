import type { AssetType, ImageType, VideoType } from './AssetType.js'

export type EncodingType = AssetType
export interface EncodingTypes extends Array<EncodingType>{}

export type FontType = 'font'
export type ImportType = AssetType | FontType
export interface ImportTypes extends Array<ImportType>{}

export type SequenceType = 'sequence'
export type WaveformType = 'waveform'
export type TranscodingType = ImportType | SequenceType | WaveformType
export interface TranscodingTypes extends Array<TranscodingType>{}

export type AlphaType = ImageType | SequenceType | VideoType
