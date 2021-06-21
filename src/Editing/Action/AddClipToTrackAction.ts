
import { Track } from "../../Mash"
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { AddTrackAction, AddTrackActionObject } from "./AddTrackAction"

interface AddClipToTrackActionObject extends AddTrackActionObject {
  clip : Clip
  createTracks : number
  insertIndex : number
  trackIndex : number
}

class AddClipToTrackAction extends AddTrackAction {
  constructor(object : AddClipToTrackActionObject) {
    super(object)
    const { clip, createTracks, insertIndex, trackIndex } = object
    this.clip = clip
    this.createTracks = createTracks
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
  }

  clip : Clip

  createTracks : number

  insertIndex : number

  trackIndex : number

  get clips() : Clip[] { return this.track.clips }

  get track() : Track { return this.mash[this.trackType][this.trackIndex] }

  redoAction() : void {
    for (let i = 0; i < this.createTracks; i += 1) { super.redoAction() }
    this.mash.addClipsToTrack([this.clip], this.trackIndex, this.insertIndex)
  }

  undoAction() : void {
    this.mash.removeClipsFromTrack([this.clip])
    for (let i = 0; i < this.createTracks; i += 1) { super.undoAction() }
  }
}

export { AddClipToTrackAction }
