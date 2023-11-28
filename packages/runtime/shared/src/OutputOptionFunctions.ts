import type { AudioType, ImageType, VideoType } from './AssetType.js'
import type { AlphaType, FontType, SequenceType, TranscodingType, WaveformType } from './ImportType.js'
import type { AudioOutputOptions, FontOutputOptions, ImageOutputOptions, OutputOptions, SequenceOutputOptions, VideoOutputOptions, WaveformOutputOptions } from './OutputOptions.js'

import { ALPHA_OUTPUT_DEFAULTS, OUTPUT_DEFAULTS } from './OutputDefaults.js'

export function typeOutputOptions(type: AudioType, overrides?: OutputOptions): AudioOutputOptions
export function typeOutputOptions(type: FontType, overrides?: OutputOptions): FontOutputOptions
export function typeOutputOptions(type: ImageType, overrides?: OutputOptions): ImageOutputOptions
export function typeOutputOptions(type: SequenceType, overrides?: OutputOptions): SequenceOutputOptions
export function typeOutputOptions(type: VideoType, overrides?: OutputOptions): VideoOutputOptions
export function typeOutputOptions(type: WaveformType, overrides?: OutputOptions): WaveformOutputOptions
export function typeOutputOptions(type: TranscodingType, overrides?: OutputOptions): OutputOptions 
export function typeOutputOptions(type: TranscodingType, overrides?: OutputOptions): OutputOptions {
  return { ...OUTPUT_DEFAULTS[type], ...overrides }
}

export function typeOutputAlphaOptions(type: ImageType, overrides?: OutputOptions): ImageOutputOptions
export function typeOutputAlphaOptions(type: SequenceType, overrides?: OutputOptions): SequenceOutputOptions
export function typeOutputAlphaOptions(type: VideoType, overrides?: OutputOptions): VideoOutputOptions
export function typeOutputAlphaOptions(type: AlphaType, overrides?: OutputOptions): OutputOptions 
export function typeOutputAlphaOptions(type: AlphaType, overrides?: OutputOptions): OutputOptions {
  return { ...ALPHA_OUTPUT_DEFAULTS[type], ...overrides }
}
