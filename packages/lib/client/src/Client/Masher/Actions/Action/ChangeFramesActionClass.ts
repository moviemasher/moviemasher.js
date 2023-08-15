import type { ChangePropertyActionObject, ClientClip, ClientMashAsset } from '@moviemasher/runtime-client'

import { assertClientInstance } from '../../../ClientGuards.js'
import { isClientClip } from '../../../Mash/ClientMashGuards.js'
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
    if (isClientClip(target)) return target

    assertClientInstance(target)
    return target.clip
  }
  
  private get mash(): ClientMashAsset { return this.clip.track.mash }

  override redoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.redoValueNumber)
  }

  override undoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.undoValueNumber)
  }
}
