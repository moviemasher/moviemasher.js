import { WithFrame, WithLabel, WithTrack, WithLayer } from "../declarations"

const sortByFrame = (a : WithFrame, b : WithFrame) : number => a.frame - b.frame
const sortByLayer = (a : WithLayer, b : WithLayer) : number => a.layer - b.layer
const sortByTrack = (a : WithTrack, b : WithTrack) : number => a.track - b.track
const sortByLabel = (a : WithLabel, b : WithLabel) : number => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}

/**
 * @category Utility
 */
const Sort = {
  byFrame: sortByFrame, byLabel: sortByLabel, byTrack: sortByTrack, byLayer: sortByLayer
}

export { Sort, sortByFrame, sortByLabel, sortByTrack, sortByLayer }
