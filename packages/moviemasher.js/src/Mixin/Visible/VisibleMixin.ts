import { SvgContent, SvgFilters, UnknownObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { TrackType } from "../../Setup/Enums"
import { ClipClass } from "../Clip/Clip"
import { Visible, VisibleClass, VisibleDefinition, VisibleObject } from "./Visible"
import { ChainLinks, Filter } from "../../Filter/Filter"
import { Effects } from "../../Media/Effect/Effect"
import { effectInstance } from "../../Media/Effect/EffectFactory"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { ChainArgs, Chain } from "../../MoveMe"
import { chainAppend } from "../../Utility/Chain"
import { isAboveZero, isBelowOne } from "../../Utility/Is"


export function VisibleMixin<T extends ClipClass>(Base: T) : VisibleClass & T {
  return class extends Base implements Visible {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { effects } = object as VisibleObject

      if (effects) this.effects.push(...effects.map(effect => effectInstance(effect)))

    }

  

    chainLinks(): ChainLinks {
      const links: ChainLinks = []
      // links.push(...super.chainLinks())
      // links.push(this.opacityFilter, this.blendFilter)
      // links.push(...this.effects.flatMap(effect => effect.chainLinks()))
      return links
    }

    declare definition: VisibleDefinition

    definitionIds(): string[] {
      const ids = [...super.definitionIds()]
      ids.push(...this.effects.flatMap(effect => effect.definitionIds()))
      return ids
    }

 


    effects: Effects = []

    svgFilters(filterChain: TrackPreview): SvgFilters {

      return []
    }

    trackType = TrackType.Video

    toJSON(): UnknownObject {
      const json = super.toJSON()
      json.effects = this.effects
      return json
    }
    visible = true

    visibleContent(): SvgContent {
      throw new Error(Errors.unimplemented + 'visibleContent')
    }
  }
}
