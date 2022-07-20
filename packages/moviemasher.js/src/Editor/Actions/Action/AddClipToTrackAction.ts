import { Track } from "../../../Edited/Mash/Track/Track"
import { Clip, Clips } from "../../../Mixin/Clip/Clip"
import { AddTrackAction, AddTrackActionObject } from "./AddTrackAction"

export interface AddClipToTrackActionObject extends AddTrackActionObject {
  clip : Clip
  createTracks : number
  insertIndex : number
  trackIndex : number
}

/**
 * @category Action
 */
export class AddClipToTrackAction extends AddTrackAction {
  constructor(object : AddClipToTrackActionObject) {
    super(object)
    const { clip, createTracks, insertIndex, trackIndex } = object
    // console.log(this.constructor.name, createTracks, trackIndex)
    this.clip = clip
    this.createTracks = createTracks
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
  }

  clip : Clip

  createTracks : number

  insertIndex : number

  trackIndex : number

  get clips() : Clips { return this.track.clips }

  get track() : Track { return this.mash.trackOfTypeAtIndex(this.trackType, this.trackIndex) }

  redoAction() : void {
    for (let i = 0; i < this.createTracks; i += 1) { super.redoAction() }
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.insertIndex)
  }

  undoAction() : void {
    this.mash.removeClipFromTrack(this.clip)
    for (let i = 0; i < this.createTracks; i += 1) { super.undoAction() }
  }
}
