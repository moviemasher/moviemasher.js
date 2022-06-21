import {
  LoadedVideo} from "../../declarations"
import { GraphFile } from "../../MoveMe"
import { LoadType, Phase } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString, isAboveZero } from "../../Utility/Is"
import { UpdatableDimensionsMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsMixin"
import { ChainLinks, Filter, FilterChainPhase } from "../../Filter/Filter"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"

const VideoWithContent = ContentMixin(InstanceBase)
const VideoWithContainer = ContainerMixin(VideoWithContent)
const VideoWithPreloadable = PreloadableMixin(VideoWithContainer)
const VideoWithUpdatableDimensions = UpdatableDimensionsMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableDimensions)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  constructor(...args: any[]) {
    super(...args)
    this.setsarFilter = this.definition.setsarFilterDefinition.instanceFromObject({
      sar: 1, max: 1
    })
    this.fpsFilter = this.definition.fpsFilterDefinition.instanceFromObject()
  }
  copy() : Video { return super.copy() as Video }

  declare definition : VideoDefinition

  chainLinks(): ChainLinks {
    const links: ChainLinks = []
    links.push(this)
    links.push(...super.chainLinks())
    links.push(this.setsarFilter, this.fpsFilter)
    return links
  }

  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    if (phase !== Phase.Initialize) return

    const { filterGraph } = filterChain
    const { streaming, editing, preloader } = filterGraph

    const graphFile = this.graphFile(editing)

    let { width, height } = this.definition
    if (!(isAboveZero(width) && isAboveZero(height))) {
      const graphFile = this.graphFile(editing)
      const loaded: LoadedVideo = preloader.getFile(graphFile)
      width = loaded.width
      height = loaded.width
    }
    filterChain.size = { width, height }

    if (streaming) graphFile.options!.re = ''

    return { graphFiles: [graphFile], link: this }
  }

  graphFile(editing: boolean): GraphFile {
    const { definition } = this
    const file = definition.preloadableSource(editing)
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      localId: 'video',
      input: true, options: {}, type: LoadType.Video, file, definition
    }
    return graphFile
  }

  private fpsFilter: Filter

  mutable = true

  private setsarFilter: Filter
}
