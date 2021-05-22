

const byFrame = (a, b) => a.frame - b.frame
const byTrack = (a, b) => a.track - b.track
const byLabel = (a, b) => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}

const Sort = {
  byFrame,
  byLabel,
  byTrack,
}

export { Sort, byFrame, byLabel, byTrack }
