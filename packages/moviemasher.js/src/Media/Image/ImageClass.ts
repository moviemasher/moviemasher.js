import { GraphFile, GraphFilter } from "../../declarations"
import { AVType, GraphType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { InstanceBase } from "../../Base/Instance"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ImageDefinition, Image } from "./Image"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

const ImageWithClip = ClipMixin(InstanceBase)
const ImageWithVisible = VisibleMixin(ImageWithClip)
const ImageWithTransformable = TransformableMixin(ImageWithVisible)

export class ImageClass extends ImageWithTransformable implements Image {
  declare definition: ImageDefinition

  override initializeFilterChain(filterChain: FilterChain): void  {
    const { filterGraph } = filterChain
    const { graphType, avType, preloading, time: startTime, quantize, preloader } = filterGraph
    // console.log(this.constructor.name, "initializeFilterChain", preloading)
    if (avType === AVType.Audio) throw Errors.internal + 'initializeFilterChain Audio'

    const source = this.definition.preloadableSource(graphType)
    if (!source) throw Errors.invalid.url

    // console.log(this.constructor.name, "initializeFilterChain addGraphFile", source, preloading)
    const graphFile: GraphFile = {
      type: LoadType.Image, file: source,
      input: true,
      definition: this.definition
    }
    const inputId = filterChain.addGraphFile(graphFile)

    if (!preloading) {
      graphFile.options = { loop: 1 }
      switch (graphType) {
        case GraphType.Cast: {
          graphFile.options.re = ''
          break
        }
        case GraphType.Canvas: {
          const definitionTime = this.definitionTime(quantize, startTime)
          const context = this.contextAtTimeToSize(preloader, definitionTime, quantize)
          if (!context) throw Errors.invalid.context + ' ' + this.constructor.name + '.initializeFilterChain'

          filterChain.visibleContext = context
          break
        }
        default: {
          const setptsFilter: GraphFilter = {
            filter: 'setpts', options: { expr: 'PTS-STARTPTS', }, inputs: [inputId]
          }
          filterChain.addGraphFilter(setptsFilter)
        }
      }
    }
  }
}
