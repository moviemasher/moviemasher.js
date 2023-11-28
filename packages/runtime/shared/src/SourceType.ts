export type Source = string | ColorSource | MashSource | RawSource | ShapeSource | TextSource | PromptSource

export interface Sources extends Array<Source>{}

export type ColorSource = 'color'
export type MashSource = 'mash'
export type RawSource = 'raw'
export type ShapeSource = 'shape'
export type TextSource = 'text'
export type PromptSource = 'prompt'

export interface Sourced {
  source: Source
}

export interface SourceRecord<T = string> extends Record<Source, T | undefined> {}