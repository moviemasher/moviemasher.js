import { Errors } from "../../../Setup/Errors"
import { ActionType } from "../../../Setup/Enums"
import { isPopulatedString } from "../../../Utility/Is"
import { Action, ActionObject } from "./Action"
import { AddClipToTrackAction, AddClipToTrackActionObject } from "./AddClipToTrackAction"
import { AddTrackAction } from "./AddTrackAction"
import { AddTrackActionObject } from "./AddTrackAction"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"
import { ChangeFramesAction } from "./ChangeFramesAction"
import { MoveClipAction, MoveClipActionObject } from "./MoveClipAction"
import { MoveEffectAction, MoveEffectActionObject } from "./MoveEffectAction"
import { RemoveClipAction, RemoveClipActionObject } from "./RemoveClipAction"
import { AddLayerAction, AddLayerActionObject } from "./AddLayerAction"
import { RemoveLayerAction } from "./RemoveLayerAction"
import { MoveLayerAction } from "./MoveLayerAction"
import { ChangeMultipleAction, ChangeMultipleActionObject } from "./ChangeMultipleAction"
import { MoveAction, MoveActionObject } from "./MoveAction"


export const actionInstance = (object : ActionObject) : Action => {
    const { type } = object
    if (!isPopulatedString(type)) throw Errors.type + JSON.stringify(object)
    switch (type) {
      case ActionType.AddClipToTrack: return new AddClipToTrackAction(<AddClipToTrackActionObject> object)
      case ActionType.AddLayer: return new AddLayerAction(<AddLayerActionObject> object)
      case ActionType.AddTrack: return new AddTrackAction(<AddTrackActionObject> object)
      case ActionType.Change: return new ChangeAction(<ChangeActionObject> object)
      case ActionType.ChangeFrame: return new ChangeFramesAction(<ChangeActionObject> object)
      case ActionType.ChangeMultiple: return new ChangeMultipleAction(<ChangeMultipleActionObject> object)
      case ActionType.MoveClip: return new MoveClipAction(<MoveClipActionObject> object)
      case ActionType.MoveEffect: return new MoveEffectAction(<MoveEffectActionObject> object)
      case ActionType.Move: return new MoveAction(<MoveActionObject> object)
      case ActionType.MoveLayer: return new MoveLayerAction(<AddLayerActionObject>object)
      case ActionType.RemoveClip: return new RemoveClipAction(<RemoveClipActionObject>object)
      case ActionType.RemoveLayer: return new RemoveLayerAction(<ActionObject>object)
      default: throw Errors.type + type
    }
  }
export const ActionFactory = {
  createFromObject: actionInstance

}
