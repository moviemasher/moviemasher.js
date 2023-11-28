import type { Value, ValueRecord } from './Core.js'
import type { Size } from './Size.js'

export interface OutputOptions {
  [_: string]: string | Value | ValueRecord | undefined
  extension?: string
  format?: string
  options?: ValueRecord
}

export interface AudioOutputOptions extends OutputOptions {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
}

export interface ImageOutputOptions extends Partial<Size>, OutputOptions {
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
}

export interface VideoOutputOptions extends ImageOutputOptions, AudioOutputOptions { }

export interface SequenceOutputOptions extends ImageOutputOptions {}

export interface FontOutputOptions extends OutputOptions {}

export interface WaveformOutputOptions extends OutputOptions {}

export type EncodeOptions = AudioOutputOptions | VideoOutputOptions | ImageOutputOptions

export type TranscodeOptions = EncodeOptions | FontOutputOptions | WaveformOutputOptions | SequenceOutputOptions
