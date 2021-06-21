import { InstanceClass } from "../Instance/Instance"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../Mixin/Transformable/TransformableMixin"
import { VisibleMixin } from "../Mixin/Visible/VisibleMixin"
import { ImageDefinition } from "./Image"

const ImageWithClip = ClipMixin(InstanceClass)
const ImageWithVisible = VisibleMixin(ImageWithClip)
const ImageWithTransformable = TransformableMixin(ImageWithVisible)
class ImageClass extends ImageWithTransformable {
  definition! : ImageDefinition
}

export { ImageClass }
