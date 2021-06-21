import { TrackType } from "../../Setup/Enums"
import { Action, ActionObject } from "./Action"

interface AddTrackActionObject extends ActionObject {
  trackType : TrackType
}
class AddTrackAction extends Action {
  constructor(object : AddTrackActionObject) {
    super(object)
    const { trackType } = object
    this.trackType = trackType
  }

  trackType : TrackType

  redoAction() : void { this.mash.addTrack(this.trackType) }

  undoAction() : void { this.mash.removeTrack(this.trackType) }
}

export { AddTrackAction, AddTrackActionObject }
