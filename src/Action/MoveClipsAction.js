import { Action } from "./Action"

class MoveClipsAction extends Action {
  addClips(trackIndex, insertIndex) {
    this.mash.addClipsToTrack(this.clips, trackIndex, insertIndex)
  }

  redoAction() {
    if (this.redoFrames) {
      this.clips.forEach((clip, index) => clip.frame = this.redoFrames[index])
    }
    this.addClips(this.trackIndex, this.insertIndex)
  }

  undoAction() {
    if (this.undoFrames) {
      this.clips.forEach((clip, index) => clip.frame = this.undoFrames[index])
    }
    this.addClips(this.undoTrackIndex, this.undoInsertIndex)
  }
}
export { MoveClipsAction }
