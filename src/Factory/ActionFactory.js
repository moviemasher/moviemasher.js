import { Factory } from "./Factory"

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
} from "../Action"
import { Is } from "../Utilities"

const ActionTypes = [
  'addTrack',
  'addClipsToTrack',
  'moveClips',
  'addEffect',
  'change',
  'changeFrames',
  'changeTrim',
  'changeGain',
  'moveEffects',
  'split',
  'freeze',
  'removeClips',
]
const ActionType = Object.fromEntries(ActionTypes.map(type => [type, type]))

class ActionFactory extends Factory {
  constructor() {
    super(Action)
    this.install(ActionType.addTrack, AddTrackAction)
    this.install(ActionType.addClipsToTrack, AddClipToTrackAction)
    this.install(ActionType.moveClips, MoveClipsAction)
    this.install(ActionType.addEffect, AddEffectAction)
    this.install(ActionType.change, ChangeAction)
    this.install(ActionType.changeFrames, ChangeFramesAction)
    this.install(ActionType.changeTrim, ChangeTrimAction)
    this.install(ActionType.split, SplitAction)
    this.install(ActionType.freeze, FreezeAction)
    this.install(ActionType.moveEffects, MoveEffectsAction)
    this.install(ActionType.removeClips, RemoveClipsAction)
  }

  createFromObjectMasher(object, masher) {
    const defaults = {
      mash: "",
      undoSelectedClips: "selectedClips",
      undoSelectedEffects: "selectedEffects",
      redoSelectedClips: "selectedClips",
      redoSelectedEffects: "selectedEffects",
    }
    const clone = { ...object }
    Object.entries(defaults).forEach(entry => {
      const [key, value] = entry
      if (Is.defined(object[key])) return

      if (Is.emptystring(value)) clone[key] = masher[key]
      else clone[key] = [...masher[value]]
    })

    return this.createFromObject(clone)
  }
}

Object.defineProperties(ActionFactory.prototype, {
  type: { value: ActionType },
  types: { value: ActionTypes },
})

const ActionFactoryInstance = new ActionFactory
export { ActionFactoryInstance as ActionFactory }
