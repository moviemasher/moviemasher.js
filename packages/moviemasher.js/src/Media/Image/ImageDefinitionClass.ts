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
import { UpdatableDimensionsDefinitionMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../../Container/ContainerDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"

const ImageDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const ImageDefinitionWithContainer = ContainerDefinitionMixin(ImageDefinitionWithTweenable)
const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer)
const ImageDefinitionWithPreloadable = PreloadableDefinitionMixin(ImageDefinitionWithContent)
const ImageDefinitionWithUpdatable = UpdatableDimensionsDefinitionMixin(ImageDefinitionWithPreloadable)
export class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
  graphFiles(args: GraphFileArgs): GraphFiles {
    const graphFiles: GraphFiles = []
    const graphFile = this.preloadableFile(args)
    if (graphFile) graphFiles.push(graphFile)
    return graphFiles
  }

  instanceFromObject(object: ImageObject = {}) : Image {
    return new ImageClass(this.instanceArgs(object))
  }

  loadedVisible(preloader: Loader, quantize: number, time: Time): CanvasVisibleSource | undefined {
    const filesArgs: GraphFileArgs = { visible: true, editing: true, time: time, quantize }
    const file = this.preloadableFile(filesArgs)
    if (!file || !preloader.loadedFile(file)) return

    return preloader.getFile(file)
  }

  loadType = LoadType.Image

  private preloadableFile(args: GraphFileArgs): GraphFile | undefined {
    const { editing, visible } = args
    if (!visible) return

    const file = this.preloadableSource(editing)
    if (!file) throw Errors.invalid.url + this.id + ' preloadableFile'

    const graphFile: GraphFile = {
      type: this.loadType, file, definition: this, input: true
    }
    return graphFile
  }

  type = DefinitionType.Image
}
