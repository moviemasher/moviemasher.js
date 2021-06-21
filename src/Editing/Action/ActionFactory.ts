import {
  AddTrackAction,
  MoveClipsAction,
  AddClipToTrackAction,
  AddEffectAction,
  ChangeAction,
  ChangeFramesAction,
  ChangeTrimAction,
  SplitAction,
  FreezeAction,
  MoveEffectsAction,
  RemoveClipsAction,
  Action,
  ActionObject,
} from "../Action"
import { Capitalize } from "../../Utilities"
import { Errors } from "../../Setup/Errors"
import { UnknownObject } from "../../Setup/declarations"


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
    if (typeof type !== "string") throw Errors.type

    return new classes[Capitalize(type)](<ActionObject><unknown> object)
  }
}

const ActionFactory = new ActionFactoryClass()

export { ActionFactory }
