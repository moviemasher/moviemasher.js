import { ActionType } from '../../../../Setup/Enums.js'
import { Action, ActionObject } from './Action.js'
import { AddClipToTrackAction, AddClipToTrackActionObject } from './AddClipToTrackAction.js'
import { AddTrackAction } from './AddTrackAction.js'
import { AddTrackActionObject } from './AddTrackAction.js'
import { ChangeAction, ChangeActionObject } from './ChangeAction.js'
import { ChangeFramesAction } from './ChangeFramesAction.js'
import { MoveClipAction, MoveClipActionObject } from './MoveClipAction.js'
import { RemoveClipAction, RemoveClipActionObject } from './RemoveClipAction.js'
import { ChangeMultipleAction, ChangeMultipleActionObject } from './ChangeMultipleAction.js'
import { MoveAction, MoveActionObject } from './MoveAction.js'


export const actionInstance = (object: ActionObject): Action => {
  const { type } = object
  switch (type) {
    case ActionType.AddClipToTrack: return new AddClipToTrackAction(<AddClipToTrackActionObject> object)
    case ActionType.AddTrack: return new AddTrackAction(<AddTrackActionObject> object)
    case ActionType.Change: return new ChangeAction(<ChangeActionObject> object)
    case ActionType.ChangeFrame: return new ChangeFramesAction(<ChangeActionObject> object)
    case ActionType.ChangeMultiple: return new ChangeMultipleAction(<ChangeMultipleActionObject> object)
    case ActionType.MoveClip: return new MoveClipAction(<MoveClipActionObject> object)
    case ActionType.Move: return new MoveAction(<MoveActionObject> object)
    case ActionType.RemoveClip: return new RemoveClipAction(<RemoveClipActionObject>object)
  }
}
