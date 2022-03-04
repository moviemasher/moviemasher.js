import { InstanceBase } from "../../Base/Instance"
import { FilterChain, FilterChainArgs, GraphFile, ValueObject } from "../../declarations"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { GraphType, LoadType } from "../../Setup/Enums"
import { ImageDefinition, Image } from "./Image"

const ImageWithClip = ClipMixin(InstanceBase)
const ImageWithVisible = VisibleMixin(ImageWithClip)
const ImageWithTransformable = TransformableMixin(ImageWithVisible)
class ImageClass extends ImageWithTransformable implements Image {
  declare definition: ImageDefinition

  override filterChainBase(args: FilterChainArgs): FilterChain  {
    const filterChain = super.filterChainBase(args)
    const { graphType } = args

    const { graphFiles } = filterChain
    const source = this.definition.preloadableSource(graphType)
    if (source) {
      const options: ValueObject = { loop: 1 }
      if (graphType === GraphType.Cast) options.re = ''

      const graphFile: GraphFile = {
        type: LoadType.Image, file: source, options,
        input: true,
        definition: this.definition
      }
      graphFiles.push(graphFile)
    }

    return filterChain
  }
}

export { ImageClass }
