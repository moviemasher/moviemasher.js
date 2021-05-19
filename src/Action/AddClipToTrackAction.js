import { AddTrackAction } from "./AddTrackAction"

class AddClipToTrackAction extends AddTrackAction {
  get clips() { return this.track.clips }

  get track() { return this.mash[this.trackType][this.trackIndex] }

  redoAction() {
    // create track if needed
    for (let i = 0; i < this.createTracks; i++) { super.redoAction() } 
    this.mash.addClipsToTrack([this.clip], this.trackIndex, this.insertIndex)
  }

  undoAction() {
    this.mash.removeClipsFromTrack([this.clip])
    for (let i = 0; i < this.createTracks; i++) { super.undoAction() } 
  }
}

export { AddClipToTrackAction }
 