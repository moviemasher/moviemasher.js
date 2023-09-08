import { AudioType, OutputOptions, AudioOutputOptions, FontType, FontOutputOptions, ImageType, ImageOutputOptions, SequenceType, SequenceOutputOptions, VideoType, VideoOutputOptions, WaveformType, WaveformOutputOptions, TranscodingType, OutputEncodeDefaults, AlphaType, OutputAlphaDefaults } from '@moviemasher/runtime-shared'

export function outputOptions(type: AudioType, overrides?: OutputOptions): AudioOutputOptions
export function outputOptions(type: FontType, overrides?: OutputOptions): FontOutputOptions
export function outputOptions(type: ImageType, overrides?: OutputOptions): ImageOutputOptions
export function outputOptions(type: SequenceType, overrides?: OutputOptions): SequenceOutputOptions
export function outputOptions(type: VideoType, overrides?: OutputOptions): VideoOutputOptions
export function outputOptions(type: WaveformType, overrides?: OutputOptions): WaveformOutputOptions
export function outputOptions(type: TranscodingType, overrides?: OutputOptions): OutputOptions 
export function outputOptions(type: TranscodingType, overrides?: OutputOptions): OutputOptions {
  return { ...OutputEncodeDefaults[type], ...overrides }
}

export function outputAlphaOptions(type: ImageType, overrides?: OutputOptions): ImageOutputOptions
export function outputAlphaOptions(type: SequenceType, overrides?: OutputOptions): SequenceOutputOptions
export function outputAlphaOptions(type: VideoType, overrides?: OutputOptions): VideoOutputOptions
export function outputAlphaOptions(type: AlphaType, overrides?: OutputOptions): OutputOptions 
export function outputAlphaOptions(type: AlphaType, overrides?: OutputOptions): OutputOptions {
  return { ...OutputAlphaDefaults[type], ...overrides }
}
