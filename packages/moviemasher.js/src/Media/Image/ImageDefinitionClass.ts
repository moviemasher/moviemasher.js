import { VisibleSource, GraphFile, FilesArgs, GraphFiles, CanvasVisibleSource } from "../../declarations"
import { AVType, DefinitionType, GraphType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { Time } from "../../Helpers/Time/Time"
import {
  TransformableDefinitionMixin
} from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"
import { Errors } from "../../Setup/Errors"


const ImageDefinitionWithClip = ClipDefinitionMixin(PreloadableDefinition)
const ImageDefinitionWithVisible = VisibleDefinitionMixin(ImageDefinitionWithClip)
const ImageDefinitionWithTransformable = TransformableDefinitionMixin(ImageDefinitionWithVisible)

export class ImageDefinitionClass extends ImageDefinitionWithTransformable implements ImageDefinition {
  private preloadableFile(args: FilesArgs): GraphFile | undefined {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return

    const file = this.preloadableSource(graphType)
    if (!file) throw Errors.invalid.url + this.id + ' preloadableFile'

    const graphFile: GraphFile = {
      type: this.loadType, file, definition: this, input: true
    }
    return graphFile
  }

  definitionFiles(args: FilesArgs): GraphFiles {
    const graphFiles: GraphFiles = []
    const graphFile = this.preloadableFile(args)
    if (graphFile) graphFiles.push(graphFile)
    return graphFiles
  }

  get instance() : Image { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : ImageObject) : Image {
    const instance = new ImageClass({ ...this.instanceObject, ...object })
    return instance
  }

  loadedVisible(preloader: Preloader, quantize: number, time: Time): CanvasVisibleSource | undefined {
    const filesArgs: FilesArgs = {
      avType: AVType.Video, graphType: GraphType.Canvas,
      time: time, quantize
    }
    const file = this.preloadableFile(filesArgs)
    if (!file || !preloader.loadedFile(file)) return

    return preloader.getFile(file)
  }

  loadType = LoadType.Image

  type = DefinitionType.Image
}
