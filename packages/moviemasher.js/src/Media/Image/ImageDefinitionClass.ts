import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../../Container/ContainerDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { LoadedImage } from "../../declarations"
import { Loader } from "../../Loader/Loader"
import { Size } from "../../Utility/Size"

const ImageDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const ImageDefinitionWithContainer = ContainerDefinitionMixin(ImageDefinitionWithTweenable)
const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer)
const ImageDefinitionWithPreloadable = PreloadableDefinitionMixin(ImageDefinitionWithContent)
const ImageDefinitionWithUpdatable = UpdatableSizeDefinitionMixin(ImageDefinitionWithPreloadable)
export class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    // console.log(this.constructor.name, object)

    const { loadedImage } = object as ImageDefinitionObject
    if (loadedImage) this.loadedImage = loadedImage
  }

  definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined {
    const superElement = super.definitionIcon(loader, size)
    if (superElement) return superElement

    const { url } = this
    return this.urlIcon(url, loader, size)
  }

  instanceFromObject(object: ImageObject = {}) : Image {
    return new ImageClass(this.instanceArgs(object))
  }

  loadType = LoadType.Image

  loadedImage?: LoadedImage 
  
  type = DefinitionType.Image
}
