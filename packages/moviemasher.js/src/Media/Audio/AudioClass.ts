import { Phase, TrackType } from "../../Setup/Enums"
import { AudioDefinition, Audio } from "./Audio"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { SvgContent, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { FilterChainPhase, ServerFilters, ChainLinks } from "../../Filter"
import { ContentMixin } from "../../Content/ContentMixin"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"


const AudioWithContent = ContentMixin(InstanceBase)
const AudioWithPreloadable = PreloadableMixin(AudioWithContent)
const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithPreloadable)
export class AudioClass extends AudioWithUpdatableDuration implements Audio {

  declare definition : AudioDefinition

  svgContent(filterChain: TrackPreview, dimensions: Dimensions): SvgContent {
    throw new Error("Method not implemented.")
  }
  graphFiles(args: GraphFileArgs): GraphFiles {
    throw new Error("Method not implemented.")
  }
  intrinsicDimensions(): Dimensions {
    throw new Error("Method not implemented.")
  }
  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    throw new Error("Method not implemented.")
  }
  filterChainServerFilters(filterChain: FilterChain, values: ValueObject): ServerFilters {
    throw new Error("Method not implemented.")
  }

  chainLinks(): ChainLinks {
    throw new Error("Method not implemented.")
  }

  mutable = true


  trackType = TrackType.Audio
}
