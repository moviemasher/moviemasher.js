import { Framed, Labeled, Tracked, Indexed } from "../Base/Base"

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
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}
