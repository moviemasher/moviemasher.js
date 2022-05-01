import { Errors } from "../../../../Setup/Errors"
import { ActionType } from "../../../../Setup/Enums"
import { isPopulatedString } from "../../../../Utility/Is"
import { Action, ActionOptions } from "./Action"
import { AddClipToTrackAction, AddClipToTrackActionObject } from "./AddClipToTrackAction"
import { AddEffectAction, AddEffectActionObject } from "./AddEffectAction"
import { AddTrackAction } from "./AddTrackAction"
import { AddTrackActionObject } from "./AddTrackAction"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"
import { ChangeFramesAction } from "./ChangeFramesAction"
import { ChangeTrimAction, ChangeTrimActionObject } from "./ChangeTrimAction"
import { FreezeAction, FreezeActionObject } from "./FreezeAction"
import { MoveClipAction, MoveClipActionObject } from "./MoveClipAction"
import { MoveEffectAction, MoveEffectActionObject } from "./MoveEffectAction"
import { RemoveClipAction, RemoveClipActionObject } from "./RemoveClipAction"
import { SplitAction, SplitActionObject } from "./SplitAction"

/**
 * @category Factory
 */
export const ActionFactory = {
  createFromObject: (object : ActionOptions) : Action => {
    const { type } = object
    if (!isPopulatedString(type)) throw Errors.type + JSON.stringify(object)
    switch (type) {
      case ActionType.AddClipToTrack: return new AddClipToTrackAction(<AddClipToTrackActionObject> object)
      case ActionType.AddEffect: return new AddEffectAction(<AddEffectActionObject> object)
      case ActionType.AddTrack: return new AddTrackAction(<AddTrackActionObject> object)
      case ActionType.Change: return new ChangeAction(<ChangeActionObject> object)
      case ActionType.ChangeFrames: return new ChangeFramesAction(<ChangeActionObject> object)
      case ActionType.ChangeTrim: return new ChangeTrimAction(<ChangeTrimActionObject> object)
      case ActionType.Freeze: return new FreezeAction(<FreezeActionObject> object)
      case ActionType.MoveClip: return new MoveClipAction(<MoveClipActionObject> object)
      case ActionType.MoveEffect: return new MoveEffectAction(<MoveEffectActionObject> object)
      case ActionType.RemoveClip: return new RemoveClipAction(<RemoveClipActionObject>object)
      case ActionType.Split: return new SplitAction(<SplitActionObject> object)
      default: throw Errors.type + type
    }
  }
}
