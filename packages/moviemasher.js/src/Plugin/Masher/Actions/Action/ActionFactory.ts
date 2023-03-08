import { ActionType } from "../../../../Setup/Enums"
import { Action, ActionObject } from "./Action"
import { AddClipToTrackAction, AddClipToTrackActionObject } from "./AddClipToTrackAction"
import { AddTrackAction } from "./AddTrackAction"
import { AddTrackActionObject } from "./AddTrackAction"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"
import { ChangeFramesAction } from "./ChangeFramesAction"
import { MoveClipAction, MoveClipActionObject } from "./MoveClipAction"
import { RemoveClipAction, RemoveClipActionObject } from "./RemoveClipAction"
import { ChangeMultipleAction, ChangeMultipleActionObject } from "./ChangeMultipleAction"
import { MoveAction, MoveActionObject } from "./MoveAction"


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
