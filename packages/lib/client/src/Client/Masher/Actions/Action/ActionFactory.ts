import type { Action, ActionArgs, AddClipsActionObject, AddTrackActionObject, ChangePropertiesActionObject, ChangePropertyActionObject, MoveClipActionObject, RemoveClipActionObject } from "@moviemasher/runtime-client"

import { ActionTypeAddClip, ActionTypeAddTrack, ActionTypeChange, ActionTypeChangeFrame, ActionTypeChangeMultiple, ActionTypeMoveClip, ActionTypeRemoveClip } from '@moviemasher/lib-shared'
import { AddClipsActionClass } from './AddClipsActionClass.js'
import { AddTrackActionClass } from './AddTrackActionClass.js'
import { ChangeFramesActionClass } from './ChangeFramesActionClass.js'
import { ChangePropertiesActionClass } from './ChangePropertiesActionClass.js'
import { ChangePropertyActionClass } from './ChangePropertyActionClass.js'
import { MoveClipActionClass } from './MoveClipActionClass.js'
import { RemoveClipActionClass } from './RemoveClipActionClass.js'

export const actionInstance = (object: ActionArgs): Action => {
  const { type } = object
  switch (type) {
    case ActionTypeAddClip: return new AddClipsActionClass(<AddClipsActionObject> object)
    case ActionTypeAddTrack: return new AddTrackActionClass(<AddTrackActionObject> object)
    case ActionTypeChange: return new ChangePropertyActionClass(<ChangePropertyActionObject> object)
    case ActionTypeChangeFrame: return new ChangeFramesActionClass(<ChangePropertyActionObject> object)
    case ActionTypeChangeMultiple: return new ChangePropertiesActionClass(<ChangePropertiesActionObject> object)
    case ActionTypeMoveClip: return new MoveClipActionClass(<MoveClipActionObject> object)
    case ActionTypeRemoveClip: return new RemoveClipActionClass(<RemoveClipActionObject>object)
    default: throw('unknown action type')
  }
}
