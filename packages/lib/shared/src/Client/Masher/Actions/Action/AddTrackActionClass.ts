import type { AddTrackActionObject } from './ActionTypes.js'

import { ActionClass } from './ActionClass.js'
import { arrayOfNumbers } from '../../../../Utility/ArrayFunctions.js'
import { ClientMashAsset } from '@moviemasher/runtime-client'

/**
 * @category Action
 */
export class AddTrackActionClass extends ActionClass {

  constructor(object: AddTrackActionObject) {
    super(object)
    const { createTracks, mashAsset } = object
    this.createTracks = createTracks
    this.mashAsset = mashAsset
  }

  createTracks: number
  
  mashAsset: ClientMashAsset

  redoAction() : void { 
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.addTrack())
  }

  undoAction() : void { 
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.removeTrack())
  }
}
