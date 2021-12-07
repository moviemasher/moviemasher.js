import { UnknownObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Capitalize } from "../../Utilities/Capitalize"
import { Action, ActionObject } from "./Action"
import { AddTrackAction } from "./AddTrackAction"
import { AddClipToTrackAction } from "./AddClipToTrackAction"
import { MoveClipsAction } from "./MoveClipsAction"
import { AddEffectAction } from "./AddEffectAction"
import { ChangeAction } from "./ChangeAction"
import { ChangeFramesAction } from "./ChangeFramesAction"
import { ChangeTrimAction } from "./ChangeTrimAction"
import { SplitAction } from "./SplitAction"
import { FreezeAction } from "./FreezeAction"
import { MoveEffectsAction } from "./MoveEffectsAction"
import { RemoveClipsAction } from "./RemoveClipsAction"


const classes : { [index: string] : typeof Action}= {
  AddTrack: AddTrackAction,
  AddClipsToTrack: AddClipToTrackAction,
  MoveClips: MoveClipsAction,
  AddEffect: AddEffectAction,
  Change: ChangeAction,
  ChangeFrames: ChangeFramesAction,
  ChangeTrim: ChangeTrimAction,
  Split: SplitAction,
  Freeze: FreezeAction,
  MoveEffects: MoveEffectsAction,
  RemoveClips: RemoveClipsAction,
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
