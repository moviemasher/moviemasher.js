import { Action } from "./Action"

class AddTrackAction extends Action {
  trackType : string

  redoAction() { this.mash.addTrack(this.trackType) }

  undoAction() { this.mash.removeTrack(this.trackType) }
}

export { AddTrackAction }
