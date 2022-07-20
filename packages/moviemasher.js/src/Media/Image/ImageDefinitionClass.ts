import { CanvasVisibleSource } from "../../declarations"
import { GraphFile, GraphFiles, GraphFileArgs } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { Time } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { Errors } from "../../Setup/Errors"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../../Container/ContainerDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { assertPopulatedString } from "../../Utility/Is"

const ImageDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const ImageDefinitionWithContainer = ContainerDefinitionMixin(ImageDefinitionWithTweenable)
const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer)
const ImageDefinitionWithPreloadable = PreloadableDefinitionMixin(ImageDefinitionWithContent)
const ImageDefinitionWithUpdatable = UpdatableSizeDefinitionMixin(ImageDefinitionWithPreloadable)
export class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
  instanceFromObject(object: ImageObject = {}) : Image {
    return new ImageClass(this.instanceArgs(object))
  }

  loadType = LoadType.Image

  type = DefinitionType.Image
}
