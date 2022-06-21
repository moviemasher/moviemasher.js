import { CanvasVisibleSource, SvgContent, LoadedImage } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFile, GraphFiles, GraphFileArgs } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinition, ImageObject } from "./Image"
import { ImageClass } from "./ImageClass"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { Time } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { Errors } from "../../Setup/Errors"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableDimensionsDefinitionMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsDefinitionMixin"
import { FilterDefinition } from "../../Filter/Filter"
import { filterDefinitionFromId } from "../../Filter/FilterFactory"
import { NamespaceSvg } from "../../Setup/Constants"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { ContainerDefinitionMixin } from "../../Container/ContainerDefinitionMixin"
import { assertTrue } from "../../Utility/Is"

const ImageDefinitionWithContainer = ContainerDefinitionMixin(DefinitionBase)
const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer)
const ImageDefinitionWithPreloadable = PreloadableDefinitionMixin(ImageDefinitionWithContent)
const ImageDefinitionWithUpdatable = UpdatableDimensionsDefinitionMixin(ImageDefinitionWithPreloadable)
export class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
  constructor(...args: any[]) {
    super(...args)
    this.setptsFilterDefinition = filterDefinitionFromId('setpts')
  }

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
      type: this.loadType, file, definition: this, input: true, localId: LoadType.Image,
    }
    return graphFile
  }

  svgContent(filterChain: TrackPreview, dimensions?: Dimensions): SvgContent {
    const { filterGraph } = filterChain
    const { preloader, size } = filterGraph
    const file = this.preloadableFile(filterGraph)!

    const loaded: LoadedImage = preloader.getFile(file)
    assertTrue(loaded, 'LoadedImage')

    const { src: href, width: loadedWidth, height: loadedHeight } = loaded
    const imageElement = globalThis.document.createElementNS(NamespaceSvg, 'image')
    imageElement.setAttribute('id', `image-${this.id}`)
    imageElement.setAttribute('href', href)

    const { width, height } = dimensions || size
    const scaleWidth = width / loadedWidth
    const scaleHeight = height / loadedHeight
    if (scaleWidth > scaleHeight) imageElement.setAttribute('width', String(width))
    else imageElement.setAttribute('height', String(height))

    return imageElement
  }

  setptsFilterDefinition: FilterDefinition

  type = DefinitionType.Image
}
