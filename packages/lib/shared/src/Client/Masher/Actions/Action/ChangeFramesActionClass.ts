import type { ClientClip, ClientMashAsset } from '@moviemasher/runtime-client'
import type { ChangePropertyActionObject } from "./ActionTypes.js"

import { assertClientClip } from '../../../Mash/ClientMashGuards.js'
import { ChangePropertyActionClass } from './ChangePropertyActionClass.js'

/**
 * @category Action
 */
export class ChangeFramesActionClass extends ChangePropertyActionClass {
  constructor(object : ChangePropertyActionObject) {
    super(object)
  }

  private get clip(): ClientClip { 
    const { target } = this
    assertClientClip(target)
    
    return target 
  }
  
  private get mash(): ClientMashAsset { return this.clip.track.mash }

  redoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.redoValueNumber)
  }

  undoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.undoValueNumber)
  }
}
