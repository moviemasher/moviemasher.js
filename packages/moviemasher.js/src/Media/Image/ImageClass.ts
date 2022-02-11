import { InstanceBase } from "../../Base/Instance"
import { FilterChain, FilterChainArgs, GraphFile, GraphInput, ValueObject } from "../../declarations"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { GraphFileType, GraphType, LoadType } from "../../Setup/Enums"
import { ImageDefinition, Image } from "./Image"

const ImageWithClip = ClipMixin(InstanceBase)
const ImageWithVisible = VisibleMixin(ImageWithClip)
const ImageWithTransformable = TransformableMixin(ImageWithVisible)
class ImageClass extends ImageWithTransformable implements Image {
  declare definition: ImageDefinition

  override filterChainBase(args: FilterChainArgs): FilterChain | undefined {
    const { inputCount } = args
    const filterChain = super.filterChainBase(args)
    if (!filterChain) return

    const { files, inputs: inputs } = filterChain
    const source = this.definition.inputSource
    if (source) {
      const options: ValueObject = { loop: 1 }
      if (args.graphType === GraphType.Cast) options.re = ''
      const input: GraphInput = { source, options }
      inputs.push(input)
      const graphFile: GraphFile = { type: LoadType.Image, file: source }
      files.push(graphFile)
    }
    return filterChain
  }
}

export { ImageClass }
