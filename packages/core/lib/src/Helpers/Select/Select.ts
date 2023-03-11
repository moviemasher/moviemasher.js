import { SelectorType } from "../../Setup/Enums"

export interface Selector {
  type: SelectorType
}
export interface TrackSelector extends Selector {
  trackId: string
}


export interface MediaSelector extends Selector {
  mediaId: string
}

export interface ClipSelector extends TrackSelector {
  clipId: string
}

export interface EffectSelector extends ClipSelector {
  effectId: string
}

export interface ContainerSelector extends ClipSelector {
  containerId: string
}

export interface EffectSelector extends ClipSelector {
  effectId: string
}

export type IndexHandler<OBJECT = any, INDEX = number> = (effect: OBJECT, insertIndex?: INDEX) => void
