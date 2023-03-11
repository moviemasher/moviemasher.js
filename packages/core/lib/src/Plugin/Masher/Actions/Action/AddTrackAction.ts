import { arrayOfNumbers } from "../../../../Utility/Array"
import { Action, ActionObject } from "./Action"

export interface AddTrackActionObject extends ActionObject {
  createTracks: number
}

/**
 * @category Action
 */
export class AddTrackAction extends Action {

  constructor(object: AddTrackActionObject) {
    super(object)
    const { createTracks } = object
    this.createTracks = createTracks
  }

  createTracks: number

  redoAction() : void { 
    arrayOfNumbers(this.createTracks).forEach(() => this.mash.addTrack())
  }

  undoAction() : void { 
    arrayOfNumbers(this.createTracks).forEach(() => this.mash.removeTrack())
  }
}
