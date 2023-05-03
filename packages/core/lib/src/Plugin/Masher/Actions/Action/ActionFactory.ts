import type { 
  Action, ActionObject, ChangePropertyActionObject, ChangePropertiesActionObject, 
  MoveActionObject, AddClipActionObject, AddTrackActionObject, MoveClipActionObject, 
  RemoveClipActionObject 
} from './Action.js'

import { 
  ActionTypeAddClip, ActionTypeAddTrack, ActionTypeChange, ActionTypeChangeFrame, 
  ActionTypeChangeMultiple, ActionTypeMove, ActionTypeMoveClip, 
  ActionTypeRemoveClip 
} from '../../../../Setup/Enums.js'
import { ErrorName, errorThrow } from '../../../../Helpers/index.js'
import { AddClipActionClass } from './AddClipActionClass.js'
import { AddTrackActionClass } from './AddTrackActionClass.js'
import { ChangeFramesActionClass } from './ChangeFramesActionClass.js'
import { ChangePropertiesActionClass } from './ChangePropertiesActionClass.js'
import { ChangePropertyActionClass } from './ChangePropertyActionClass.js'
import { MoveActionClass } from './MoveActionClass.js'
import { MoveClipActionClass } from './MoveClipActionClass.js'
import { RemoveClipActionClass } from './RemoveClipActionClass.js'


export const actionInstance = (object: ActionObject): Action => {
  const { type } = object
  switch (type) {
    case ActionTypeAddClip: return new AddClipActionClass(<AddClipActionObject> object)
    case ActionTypeAddTrack: return new AddTrackActionClass(<AddTrackActionObject> object)
    case ActionTypeChange: return new ChangePropertyActionClass(<ChangePropertyActionObject> object)
    case ActionTypeChangeFrame: return new ChangeFramesActionClass(<ChangePropertyActionObject> object)
    case ActionTypeChangeMultiple: return new ChangePropertiesActionClass(<ChangePropertiesActionObject> object)
    case ActionTypeMoveClip: return new MoveClipActionClass(<MoveClipActionObject> object)
    case ActionTypeMove: return new MoveActionClass(<MoveActionObject> object)
    case ActionTypeRemoveClip: return new RemoveClipActionClass(<RemoveClipActionObject>object)
  }
  return errorThrow(ErrorName.Internal)
}
