import { Any, VisibleSource, UnknownObject, GraphFile, FilesArgs, GraphFiles } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { AVType, DefinitionType, GraphType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { Time } from "../../Helpers/Time"
import {
  TransformableDefinitionMixin
} from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"


const ImageDefinitionWithClip = ClipDefinitionMixin(PreloadableDefinition)
const ImageDefinitionWithVisible = VisibleDefinitionMixin(ImageDefinitionWithClip)
const ImageDefinitionWithTransformable = TransformableDefinitionMixin(ImageDefinitionWithVisible)

class ImageDefinitionClass extends ImageDefinitionWithTransformable implements ImageDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    if (!object) throw Errors.unknown.definition

    // console.log("ImageDefinition", object)
    const { url } = <ImageDefinitionObject> object
    if (url) {
      this.url = url
      this.source ||= url
    }
  }

  private file(args: FilesArgs): GraphFile | undefined {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return

    return {
      type: LoadType.Image,
      file: this.preloadableSource(graphType),
      definition: this
    }
  }

  files(args: FilesArgs): GraphFiles {
    const graphFiles: GraphFiles = []
    const graphFile = this.file(args)
    if (graphFile) graphFiles.push(graphFile)
    return graphFiles
  }

  get instance() : Image {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ImageObject) : Image {
    const instance = new ImageClass({ ...this.instanceObject, ...object })
    return instance
  }

  loadedVisible(preloader: Preloader, quantize: number, time: Time): VisibleSource | undefined {
    const filesArgs: FilesArgs = {
      avType: AVType.Video, graphType: GraphType.Canvas,
      start: time, quantize
    }
    const file = this.file(filesArgs)
    if (!file || !preloader.loadedFile(file)) return

    return preloader.getFile(file)
  }

  preloadableSource(graphType: GraphType): string {
    return graphType === GraphType.Canvas ? this.url : this.source
  }

  source = ''

  type = DefinitionType.Image

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  url = ''
}

export { ImageDefinitionClass }
