import type { Framed, Tracked, Indexed } from '@moviemasher/runtime-shared'

export const sortByFrame = (a : Framed, b : Framed) : number => (
  a.frame - b.frame
)
export const sortByIndex = (a : Indexed, b : Indexed) : number => (
  a.index - b.index
)
export const sortByTrack = (a : Tracked, b : Tracked) : number => (
  a.trackNumber - b.trackNumber
)
