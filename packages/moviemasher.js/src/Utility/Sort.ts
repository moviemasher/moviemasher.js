import { WithFrame, WithLabel, WithTrack, WithIndex } from "../declarations"

export const sortByFrame = (a : WithFrame, b : WithFrame) : number => (
  a.frame - b.frame
)
export const sortByIndex = (a : WithIndex, b : WithIndex) : number => (
  a.index - b.index
)
export const sortByTrack = (a : WithTrack, b : WithTrack) : number => (
  a.trackNumber - b.trackNumber
)
export const sortByLabel = (a : WithLabel, b : WithLabel) : number => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}
