export type Source = string | ColorSource | MashSource | RawSource | ShapeSource | TextSource | PromptSource

export type Sources = Source[]

export type ColorSource = 'color'
export type MashSource = 'mash'
export type RawSource = 'raw'
export type ShapeSource = 'shape'
export type TextSource = 'text'
export type PromptSource = 'prompt'

export interface Sourced {
  source: Source
}

export type SourceRecord<T = string> = Record<Source, T | undefined>