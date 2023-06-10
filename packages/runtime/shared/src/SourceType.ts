export type Source = string | KnownSource

export type KnownSource = ColorSource | MashSource | RawSource | ShapeSource | TextSource | PromptSource

export type ColorSource = 'color'
export type MashSource = 'mash'
export type RawSource = 'raw'
export type ShapeSource = 'shape'
export type TextSource = 'text'
export type PromptSource = 'prompt'
