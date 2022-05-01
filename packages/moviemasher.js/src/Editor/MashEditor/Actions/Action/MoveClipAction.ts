import { Clip } from "../../../../Mixin/Clip/Clip"
import { Action, ActionOptions } from "./Action"

export interface MoveClipActionObject extends ActionOptions {
  clip : Clip
  insertIndex : number
  redoFrame? : number
  trackIndex : number
  undoFrame? : number
  undoInsertIndex : number
  undoTrackIndex : number
}

/**
 * @category Action
 */
export class MoveClipAction extends Action {
  constructor(object : MoveClipActionObject) {
    super(object)
    const {
      clip,
      insertIndex,
      redoFrame,
      trackIndex,
      undoFrame,
      undoInsertIndex,
      undoTrackIndex
    } = object
    this.clip = clip
    this.insertIndex = insertIndex
    this.redoFrame = redoFrame
    this.trackIndex = trackIndex
    this.undoFrame = undoFrame
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  clip: Clip

  insertIndex : number

  trackIndex : number

  undoTrackIndex : number

  undoInsertIndex : number

  undoFrame? : number

  redoFrame? : number

  addClip(trackIndex : number, insertIndex : number, frame?: number) : void {
    this.mash.addClipToTrack(this.clip, trackIndex, insertIndex, frame)
  }

  redoAction() : void {
    this.addClip(this.trackIndex, this.insertIndex, this.redoFrame)
  }

  undoAction() : void {
    this.addClip(this.undoTrackIndex, this.undoInsertIndex, this.undoFrame)
  }
}
