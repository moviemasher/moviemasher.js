import { Action } from "./Action"

class AddTrackAction extends Action {
  redoAction(){
    this.mash.addTrack(this.trackType)
  }

  undoAction() {
    this.mash.removeTrack(this.trackType)
  }
}

export { AddTrackAction }
