import type { ChangeAction, ChangeActionObject } from '@moviemasher/runtime-client'
import type { Propertied } from '@moviemasher/runtime-shared'

import { EventChangeAssetId, EventChangeClipId, EventChangedScalars, MovieMasher } from '@moviemasher/runtime-client'
import { ErrorName, errorThrow, isAsset } from '@moviemasher/runtime-shared'
import { isClientInstance } from '../../../ClientGuards.js'
import { isClientClip } from '../../../Mash/ClientMashGuards.js'
import { ActionClass } from './ActionClass.js'

export class ChangeActionClass extends ActionClass implements ChangeAction {
  constructor(object: ChangeActionObject) {
    const { target } = object
    super(object)
    this.target = target
  }

  target: Propertied
  
  updateAction(_object: ChangeActionObject): void {
    return errorThrow(ErrorName.Unimplemented)
  }

  override updateSelection(): void {
    const { target } = this
    if (isClientClip(target)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(target.id))
    } else if (isClientInstance(target)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(target.clip.id))
    } else if (isAsset(target)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangeAssetId(target.id))
    }
    MovieMasher.eventDispatcher.dispatch(new EventChangedScalars(this.affects))
  }
}