import { Factory } from "./Factory";
import { ActionType } from "../Types";
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
} from "../Action"
import { Is } from "../Is";

class ActionFactory extends Factory {
  constructor() {
    super()
    this.classesByType[ActionType.addTrack] = AddTrackAction
    this.classesByType[ActionType.addClipsToTrack] = AddClipToTrackAction
    this.classesByType[ActionType.moveClips] = MoveClipsAction
    this.classesByType[ActionType.addEffect] = AddEffectAction
    this.classesByType[ActionType.change] = ChangeAction
    this.classesByType[ActionType.changeFrames] = ChangeFramesAction
    this.classesByType[ActionType.changeTrim] = ChangeTrimAction
    this.classesByType[ActionType.split] = SplitAction
    this.classesByType[ActionType.freeze] = FreezeAction
    this.classesByType[ActionType.moveEffects] = MoveEffectsAction
    this.classesByType[ActionType.removeClips] = RemoveClipsAction
  }
  
  create(object, masher) {
    const defaults = {
      mash: "",
      undoSelectedClips: "selectedClips",
      undoSelectedEffects: "selectedEffects",
      redoSelectedClips: "selectedClips",
      redoSelectedEffects: "selectedEffects",
    }
    Object.entries(defaults).forEach(entry => {
      const [key, value] = entry
      if (Is.defined(object[key])) return

      if (Is.emptystring(value)) return object[key] = masher[key]
      
      object[key] = [...masher[value]]
    }) 
    return super.create(object)
  }
}
const ActionFactoryInstance = new ActionFactory
export { ActionFactoryInstance as ActionFactory }
