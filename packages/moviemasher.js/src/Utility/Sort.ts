import { WithFrame, WithLabel, WithTrack, WithLayer } from "../declarations"

export const sortByFrame = (a : WithFrame, b : WithFrame) : number => a.frame - b.frame
export const sortByLayer = (a : WithLayer, b : WithLayer) : number => a.layer - b.layer
export const sortByTrack = (a : WithTrack, b : WithTrack) : number => a.track - b.track
export const sortByLabel = (a : WithLabel, b : WithLabel) : number => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}
