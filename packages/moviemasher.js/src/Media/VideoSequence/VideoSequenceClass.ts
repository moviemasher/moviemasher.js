import { LoadedImage, UnknownObject, ValueObject } from "../../declarations"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Default } from "../../Setup/Default"
import { Time } from "../../Helpers/Time/Time"
import { VideoSequence, VideoSequenceDefinition } from "./VideoSequence"
import { InstanceBase } from "../../Instance/InstanceBase"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"

import { ChainLinks, FilterChainPhase } from "../../Filter/Filter"
import { Phase } from "../../Setup"
import { isAboveZero } from "../../Utility/Is"
import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDimensionsMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"

const VideoSequenceWithContent = ContentMixin(InstanceBase)
const VideoSequenceWithPreloadable = PreloadableMixin(VideoSequenceWithContent)
const VideoSequenceWithUpdatableDimensions = UpdatableDimensionsMixin(VideoSequenceWithPreloadable)
const VideoSequenceWithUpdatableDuration = UpdatableDurationMixin(VideoSequenceWithUpdatableDimensions)

export class VideoSequenceClass extends VideoSequenceWithUpdatableDuration implements VideoSequence {

  chainLinks(): ChainLinks {
    const links: ChainLinks = [this]
    links.push(...super.chainLinks())
    return links
  }

  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    if (phase !== Phase.Initialize) return

    const { filterGraph } = filterChain
    const { preloader, editing, visible, quantize, time } = filterGraph
    const graphFileArgs: GraphFileArgs = { editing, visible, quantize, time }
    const files = this.graphFiles(graphFileArgs)
    const graphFiles = files.map((file, index) => {
      const graphFile: GraphFile = { ...file, localId: `file-${index}` }
      return graphFile
    })

    const values: ValueObject = {}
    const [graphFile] = graphFiles

    let { width, height } = this.definition
    if (!(isAboveZero(width) && isAboveZero(height))) {
      const loaded: LoadedImage = preloader.getFile(graphFile)

      width = loaded.width
      height = loaded.width
    }
    values.width = width
    values.height = height
    values.href = preloader.key(graphFile)
    filterChain.size = { width, height }

    return { graphFiles, link: this, values }
  }

  // svgContent(filterChain: ClientFilterChain, dimensions?: Dimensions): SvgContent {
  //   const { filterGraph } = filterChain
  //   const { preloader, size } = filterGraph
  //   const files = this.graphFiles(filterGraph)
  //   const [file] = files

  //   const loaded: LoadedImage = preloader.getFile(file)

  //   const { src: href, width: loadedWidth, height: loadedHeight } = loaded
  //   const imageElement = globalThis.document.createElementNS(NamespaceSvg, 'image')
  //   imageElement.setAttribute('id', `image-${this.id}`)
  //   imageElement.setAttribute('href', href)

  //   const { width, height } = dimensions || size
  //   const scaleWidth = width / loadedWidth
  //   const scaleHeight = height / loadedHeight
  //   if (scaleWidth > scaleHeight) imageElement.setAttribute('width', String(width))
  //   else imageElement.setAttribute('height', String(height))

  //   return imageElement
  // }



  copy(): VideoSequence { return super.copy() as VideoSequence }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { quantize, time } = args
    const definitionTime = this.definitionTime(quantize, time)
    const definitionArgs: GraphFileArgs = { ...args, time: definitionTime }
    return this.definition.graphFiles(definitionArgs)
  }

  declare definition : VideoSequenceDefinition

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    if (this.speed === Default.instance.video.speed) return scaledTime

    return scaledTime.divide(this.speed) //, 'ceil')
  }

  speed = Default.instance.video.speed


  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}
