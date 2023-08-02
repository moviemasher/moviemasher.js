import type { Action, ActionArgs } from "@moviemasher/runtime-client"
import type {
  AddClipActionObject, AddTrackActionObject,
  ChangePropertiesActionObject,
  ChangePropertyActionObject,
  MoveClipActionObject,
  RemoveClipActionObject
} from './ActionTypes.js'

import {
  ActionTypeAddClip, ActionTypeAddTrack, ActionTypeChange, ActionTypeChangeFrame,
  ActionTypeChangeMultiple, ActionTypeMoveClip,
  ActionTypeRemoveClip
} from '../../../../Setup/ActionTypeConstants.js'
import { AddClipActionClass } from './AddClipActionClass.js'
import { AddTrackActionClass } from './AddTrackActionClass.js'
import { ChangeFramesActionClass } from './ChangeFramesActionClass.js'
import { ChangePropertiesActionClass } from './ChangePropertiesActionClass.js'
import { ChangePropertyActionClass } from './ChangePropertyActionClass.js'
import { MoveClipActionClass } from './MoveClipActionClass.js'
import { RemoveClipActionClass } from './RemoveClipActionClass.js'

export const actionInstance = (object: ActionArgs): Action => {
  const { type } = object
  switch (type) {
    case ActionTypeAddClip: return new AddClipActionClass(<AddClipActionObject> object)
    case ActionTypeAddTrack: return new AddTrackActionClass(<AddTrackActionObject> object)
    case ActionTypeChange: return new ChangePropertyActionClass(<ChangePropertyActionObject> object)
    case ActionTypeChangeFrame: return new ChangeFramesActionClass(<ChangePropertyActionObject> object)
    case ActionTypeChangeMultiple: return new ChangePropertiesActionClass(<ChangePropertiesActionObject> object)
    case ActionTypeMoveClip: return new MoveClipActionClass(<MoveClipActionObject> object)
    case ActionTypeRemoveClip: return new RemoveClipActionClass(<RemoveClipActionObject>object)
    default: throw('unknown action type')
  }
}
