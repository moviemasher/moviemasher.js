import type { AddTrackActionObject } from './Action.js'

import { ActionClass } from './ActionClass.js'
import { arrayOfNumbers } from '../../../../Utility/Array.js'

/**
 * @category Action
 */
export class AddTrackActionClass extends ActionClass {

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
