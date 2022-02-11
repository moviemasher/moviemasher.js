import { DefinitionBase } from "../../Base/Definition"
import { Any, VisibleSource, UnknownObject, Size, GraphFile, FilesArgs } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { AVType, DefinitionType, GraphType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { Definitions } from "../../Definitions/Definitions"
import { Time, Times } from "../../Helpers/Time"
import { urlAbsolute } from "../../Utility/Url"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"


const ImageDefinitionWithClip = ClipDefinitionMixin(DefinitionBase)
const ImageDefinitionWithVisible = VisibleDefinitionMixin(ImageDefinitionWithClip)
const ImageDefinitionWithTransformable = TransformableDefinitionMixin(ImageDefinitionWithVisible)

class ImageDefinitionClass extends ImageDefinitionWithTransformable implements ImageDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    if (!object) throw Errors.unknown.definition

    // console.log("ImageDefinition", object)
    const { url, source } = <ImageDefinitionObject> object
    if (!url) throw Errors.invalid.definition.url

    this.urlVisible = url
    this.source = source || url

    Definitions.install(this)
  }

  get absoluteUrl(): string { return urlAbsolute(this.urlVisible) }

  get inputSource(): string { return this.source }

  get instance() : Image {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ImageObject) : Image {
    const instance = new ImageClass({ ...this.instanceObject, ...object })
    return instance
  }

  definitionUrls(_start : Time, _end? : Time) : string[] { return [this.absoluteUrl] }

  file(graphType = GraphType.Canvas): GraphFile {
    return {
      type: LoadType.Image,
      file: graphType === GraphType.Canvas ? this.urlVisible : this.source
    }
  }

  files(args: FilesArgs): GraphFile[] {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return []

    return [this.file(graphType)]
  }

  loadedVisible(preloader: Preloader): VisibleSource | undefined {
    const file = this.file(preloader.graphType)
    if (!preloader.loadedFile(file)) return

    return preloader.getFile(file)
  }

  size(preloader: Preloader): Size | undefined {
    if (!preloader.loadedFile(this.file(preloader.graphType))) return { width: 0, height: 0 }

    const visibleSource = this.loadedVisible(preloader)
    if (!visibleSource) throw Errors.internal + 'loadedVisible'

    const { height, width } = visibleSource
    return { height: Number(height), width: Number(width) }
  }

  source = ''

  type = DefinitionType.Image

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.urlVisible
    if (this.source) object.source = this.source
    return object
  }

  urlVisible : string
}

export { ImageDefinitionClass }
