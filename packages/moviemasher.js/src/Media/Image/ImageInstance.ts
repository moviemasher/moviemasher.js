import { InstanceBase } from "../../Base/Instance"
import { Layer, LayerArgs, Size } from "../../declarations"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ImageDefinition, Image } from "./Image"

const ImageWithClip = ClipMixin(InstanceBase)
const ImageWithVisible = VisibleMixin(ImageWithClip)
const ImageWithTransformable = TransformableMixin(ImageWithVisible)
class ImageClass extends ImageWithTransformable implements Image {
  declare definition: ImageDefinition

  override layerBase(args: LayerArgs): Layer | undefined {
    const layer = super.layerBase(args)
    if (!layer) return

    const { inputs } = layer
    if (inputs) {
      const [input] = inputs
      input.options ||= {}
      input.options.loop = 1
    }
    return layer
  }
}

export { ImageClass }
