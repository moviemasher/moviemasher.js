import { UnknownObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Capitalize } from "../../Utilities/Capitalize"
import { Action, ActionObject } from "./Action"
import { AddTrackAction } from "./AddTrackAction"
import { AddClipToTrackAction } from "./AddClipToTrackAction"
import { MoveClipAction } from "./MoveClipAction"
import { AddEffectAction } from "./AddEffectAction"
import { ChangeAction } from "./ChangeAction"
import { ChangeFramesAction } from "./ChangeFramesAction"
import { ChangeTrimAction } from "./ChangeTrimAction"
import { SplitAction } from "./SplitAction"
import { FreezeAction } from "./FreezeAction"
import { MoveEffectAction } from "./MoveEffectAction"
import { RemoveClipAction } from "./RemoveClipAction"


const classes : { [index: string] : typeof Action}= {
  AddTrack: AddTrackAction,
  AddClipToTrack: AddClipToTrackAction,
  MoveClip: MoveClipAction,
  AddEffect: AddEffectAction,
  Change: ChangeAction,
  ChangeFrames: ChangeFramesAction,
  ChangeTrim: ChangeTrimAction,
  Split: SplitAction,
  Freeze: FreezeAction,
  MoveEffect: MoveEffectAction,
  RemoveClip: RemoveClipAction,
}

class ActionFactoryClass {
  createFromObject(object : UnknownObject) : Action {
    const { type } = object
    if (typeof type !== "string") throw Errors.type + JSON.stringify(object)

    return new classes[Capitalize(type)](<ActionObject><unknown> object)
  }
}

const ActionFactory = new ActionFactoryClass()

export { ActionFactory }
