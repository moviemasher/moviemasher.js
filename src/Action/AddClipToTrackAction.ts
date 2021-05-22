import { Clip } from "../Clip"
import { Track } from "../Track"
import { AddTrackAction } from "./AddTrackAction"

class AddClipToTrackAction extends AddTrackAction {
  clip : Clip

  createTracks : number

  insertIndex : number

  trackIndex : number

  get clips() { return this.track.clips }

  get track() : Track { return this.mash[this.trackType][this.trackIndex] }

  redoAction() {
    for (let i = 0; i < this.createTracks; i += 1) { super.redoAction() }
    this.mash.addClipsToTrack([this.clip], this.trackIndex, this.insertIndex)
  }

  undoAction() {
    this.mash.removeClipsFromTrack([this.clip])
    for (let i = 0; i < this.createTracks; i += 1) { super.undoAction() }
  }
}

export { AddClipToTrackAction }
