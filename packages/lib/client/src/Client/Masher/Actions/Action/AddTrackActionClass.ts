import type { AddTrackActionObject } from '@moviemasher/runtime-client'

import { ActionClass } from './ActionClass.js'
import { ClientMashAsset } from '@moviemasher/runtime-client'
import { arrayOfNumbers } from '@moviemasher/lib-shared'

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

  override redoAction() : void { 
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.addTrack())
  }

  override undoAction() : void { 
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.removeTrack())
  }
}
