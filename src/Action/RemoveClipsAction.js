import { track } from "../Clip/with/track";
import { Action } from "./Action";

class RemoveClipsAction extends Action {
  get trackIndex() { return track.index }

  redoAction() {
    this.mash.removeClipsFromTrack(this.clips)
  }

  undoAction() {
    this.mash.addClipsToTrack(this.clips, this.trackIndex, this.index)
  }
}

export { RemoveClipsAction }
 