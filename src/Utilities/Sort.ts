import { WithFrame, WithLabel, WithTrack } from "../declarations"

const byFrame = (a : WithFrame, b : WithFrame) : number => a.frame - b.frame
const byTrack = (a : WithTrack, b : WithTrack) : number => a.track - b.track
const byLabel = (a : WithLabel, b : WithLabel) : number => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}

const Sort = { byFrame, byLabel, byTrack }

export { Sort, byFrame, byLabel, byTrack }
