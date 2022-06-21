import { LoadedImage, SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Chain, ContainerChainArgs, ContentChainArgs, GraphFile } from "../../MoveMe"
import { LoadType, Phase } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ImageDefinition, Image } from "./Image"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { assertPopulatedString, isAboveZero } from "../../Utility/Is"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDimensionsMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsMixin"
import { ChainLinks, Filter, FilterChainPhase } from "../../Filter/Filter"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { ContentMixin } from "../../Content/ContentMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"


const ImageWithContainer = ContainerMixin(InstanceBase)
const ImageWithContent = ContentMixin(ImageWithContainer)
const ImageWithPreloadable = PreloadableMixin(ImageWithContent)
const ImageWithUpdatable = UpdatableDimensionsMixin(ImageWithPreloadable)
export class ImageClass extends ImageWithUpdatable implements Image {
  constructor(...args: any[]) {
    super(...args)
    this.setptsFilter = this.definition.setptsFilterDefinition.instanceFromObject()
  }

  contentChain(args: ContentChainArgs): Chain {
    const chain = super.contentChain(args)
    const { commandFiles} = chain
    const graphFile = this.graphFile(args.editing)
    const commandFile = { ...graphFile, inputId: this.id }
    commandFiles.push(commandFile)
    return chain
  }

  containerChain(args: ContainerChainArgs): Chain {
    const chain = super.containerChain(args)
    const { commandFiles} = chain
    const graphFile = this.graphFile(args.editing)
    const commandFile = { ...graphFile, inputId: this.id }
    commandFiles.push(commandFile)
    return chain
  }

  chainLinks(): ChainLinks {
    const links: ChainLinks = []
    links.push(this, this.setptsFilter)
    links.push(...super.chainLinks())
    return links
  }

  declare definition: ImageDefinition

  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    if (phase !== Phase.Initialize) return

    const { filterGraph } = filterChain
    const { streaming, editing, preloader } = filterGraph
    const graphFile = this.graphFile(editing)
    let { width, height } = this.definition
    if (!(isAboveZero(width) && isAboveZero(height))) {
      const loaded: LoadedImage = preloader.getFile(graphFile)
      width = loaded.width
      height = loaded.width
    }
    filterChain.size = { width, height }


    if (streaming) graphFile.options!.re = ''

    return { graphFiles: [graphFile], link: this }
  }

  private graphFile(editing?: boolean): GraphFile {
    const { definition } = this
    const file = definition.preloadableSource(editing)
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      input: true, options: {}, type: LoadType.Image, file, definition
    }
    return graphFile
  }

  intrinsicDimensions(): Dimensions { return this.size }


  private setptsFilter: Filter

  _size?: Dimensions
  get size(): Dimensions { return this._size! }
  set size(value: Dimensions) { this._size = value }

  svgContent(filterChain: TrackPreview, dimensions: Dimensions): SvgContent {

    // TODO: consider removing method from definition
    return this.definition.svgContent(filterChain, dimensions)
  }
}
