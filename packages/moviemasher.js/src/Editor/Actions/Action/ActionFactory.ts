import { Errors } from "../../../Setup/Errors"
import { ActionType } from "../../../Setup/Enums"
import { isPopulatedString } from "../../../Utility/Is"
import { Action, ActionOptions } from "./Action"
import { AddClipToTrackAction, AddClipToTrackActionObject } from "./AddClipToTrackAction"
import { AddEffectAction, AddEffectActionObject } from "./AddEffectAction"
import { AddTrackAction } from "./AddTrackAction"
import { AddTrackActionObject } from "./AddTrackAction"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"
import { ChangeFramesAction } from "./ChangeFramesAction"
import { ChangeTrimAction, ChangeTrimActionObject } from "./ChangeTrimAction"
import { MoveClipAction, MoveClipActionObject } from "./MoveClipAction"
import { MoveEffectAction, MoveEffectActionObject } from "./MoveEffectAction"
import { RemoveClipAction, RemoveClipActionObject } from "./RemoveClipAction"
import { AddLayerAction, AddLayerActionObject } from "./AddLayerAction"
import { RemoveLayerAction } from "./RemoveLayerAction"
import { MoveLayerAction } from "./MoveLayerAction"


export const actionInstance = (object : ActionOptions) : Action => {
    const { type } = object
    if (!isPopulatedString(type)) throw Errors.type + JSON.stringify(object)
    switch (type) {
      case ActionType.AddClipToTrack: return new AddClipToTrackAction(<AddClipToTrackActionObject> object)
      case ActionType.AddEffect: return new AddEffectAction(<AddEffectActionObject> object)
      case ActionType.AddLayer: return new AddLayerAction(<AddLayerActionObject> object)
      case ActionType.AddTrack: return new AddTrackAction(<AddTrackActionObject> object)
      case ActionType.Change: return new ChangeAction(<ChangeActionObject> object)
      case ActionType.ChangeFrames: return new ChangeFramesAction(<ChangeActionObject> object)
      case ActionType.ChangeTrim: return new ChangeTrimAction(<ChangeTrimActionObject> object)
      case ActionType.MoveClip: return new MoveClipAction(<MoveClipActionObject> object)
      case ActionType.MoveEffect: return new MoveEffectAction(<MoveEffectActionObject> object)
      case ActionType.MoveLayer: return new MoveLayerAction(<AddLayerActionObject>object)
      case ActionType.RemoveClip: return new RemoveClipAction(<RemoveClipActionObject>object)
      case ActionType.RemoveLayer: return new RemoveLayerAction(<ActionOptions>object)
      default: throw Errors.type + type
    }
  }
export const ActionFactory = {
  createFromObject: actionInstance

}
