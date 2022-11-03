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
    for (let i = 0; i < this.createTracks; i += 1) { this.mash.addTrack() }
  }

  undoAction() : void { 
    for (let i = 0; i < this.createTracks; i += 1) { this.mash.removeTrack() }
  }
}
