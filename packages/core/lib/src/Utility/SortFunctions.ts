import type { Framed, Labeled, Tracked, Indexed } from '../Base/Base.js'

export const sortByFrame = (a : Framed, b : Framed) : number => (
  a.frame - b.frame
)
export const sortByIndex = (a : Indexed, b : Indexed) : number => (
  a.index - b.index
)
export const sortByTrack = (a : Tracked, b : Tracked) : number => (
  a.trackNumber - b.trackNumber
)
export const sortByLabel = (a : Labeled, b : Labeled) : number => {
  const { label: aLabel = '' } = a
  const { label: bLabel = '' } = b
  if (aLabel < bLabel) return -1

  if (aLabel > bLabel) return 1
  
  return 0
}
