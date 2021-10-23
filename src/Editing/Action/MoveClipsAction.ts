
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { Action, ActionObject } from "./Action"

interface MoveClipsActionObject extends ActionObject {
  clips : Clip[]
  insertIndex : number
  redoFrames? : number[]
  trackIndex : number
  undoFrames? : number[]
  undoInsertIndex : number
  undoTrackIndex : number
}
class MoveClipsAction extends Action {
  constructor(object : MoveClipsActionObject) {
    super(object)
    const {
      clips,
      insertIndex,
      redoFrames,
      trackIndex,
      undoFrames,
      undoInsertIndex,
      undoTrackIndex
    } = object
    this.clips = clips
    this.insertIndex = insertIndex
    this.redoFrames = redoFrames
    this.trackIndex = trackIndex
    this.undoFrames = undoFrames
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  clips : Clip[]

  insertIndex : number

  trackIndex : number

  undoTrackIndex : number

  undoInsertIndex : number

  undoFrames? : number[]

  redoFrames? : number[]

  addClips(trackIndex : number, insertIndex : number, frames?: number[]) : void {
    this.mash.addClipsToTrack(this.clips, trackIndex, insertIndex, frames)
  }

  // setFrames(frames : number[]) : void {
  //   this.clips.forEach((clip, index) => { clip.frame = frames[index] })
  // }

  redoAction() : void {
    // if (this.redoFrames) this.setFrames(this.redoFrames)
    this.addClips(this.trackIndex, this.insertIndex, this.redoFrames)
  }

  undoAction() : void {
    // if (this.undoFrames) this.setFrames(this.undoFrames)
    this.addClips(this.undoTrackIndex, this.undoInsertIndex, this.undoFrames)
  }
}
export { MoveClipsAction }
