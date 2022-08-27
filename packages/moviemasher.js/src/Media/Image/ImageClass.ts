import { LoadedImage, SvgItem, ValueObject } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { CommandFile, CommandFileArgs, CommandFiles, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ImageDefinition, Image } from "./Image"
import { assertDefined, assertPopulatedString, assertTrue, isDefined, isTimeRange, isUndefined } from "../../Utility/Is"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { NamespaceSvg, NamespaceXhtml } from "../../Setup/Constants"
import { svgImageElement, svgPolygonElement } from "../../Utility/Svg"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"


const ImageWithTweenable = TweenableMixin(InstanceBase)
const ImageWithContainer = ContainerMixin(ImageWithTweenable)
const ImageWithContent = ContentMixin(ImageWithContainer)
const ImageWithPreloadable = PreloadableMixin(ImageWithContent)
const ImageWithUpdatableSize = UpdatableSizeMixin(ImageWithPreloadable)
export class ImageClass extends ImageWithUpdatableSize implements Image {
  declare definition: ImageDefinition

  commandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, time, videoRate } = args
    
    // console.log(this.constructor.name, "commandFiles", visible)
    if (!visible) return commandFiles
    
    const graphFiles = this.graphFiles(args)
    const [graphFile] = graphFiles
    
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const options: ValueObject = { loop: 1, framerate: videoRate }
    if (duration) options.t = duration
    const commandFile: CommandFile = {
      ...graphFile, inputId: this.id, options
    }
    // console.log(this.constructor.name, "commandFiles", commandFile)
    commandFiles.push(commandFile)
    return commandFiles
  }

  graphFiles(args: GraphFileArgs): GraphFiles { 
    const { visible, editing } = args
    const graphFiles: GraphFiles = []
    if (!visible) return graphFiles
    
    const { definition } = this
    const { url, source } = definition
    const file = editing ? url : source
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      input: true, type: LoadType.Image, file, definition
    }
    graphFiles.push(graphFile)
    return graphFiles
  }

  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): SvgItem {
    const { loadedHtmlImage } = this
    const { x, y, width, height } = rect
    loadedHtmlImage.setAttribute('x', String(x))
    loadedHtmlImage.setAttribute('y', String(y))
    loadedHtmlImage.setAttribute('width', String(width))
    if (stretch) {
      loadedHtmlImage.setAttribute('height', String(height))
      loadedHtmlImage.setAttribute('preserveAspectRatio', 'none')
    }
    return loadedHtmlImage
  }

  // protected _loadedHtmlImage?: SvgItem

  private get loadedHtmlImage() {
    // if (this._loadedHtmlImage) return this._loadedHtmlImage
    
    const { loadedImage } = this
    const { src } = loadedImage // this._loadedHtmlImage =
    return svgImageElement(src)
  }

  private get loadedImage(): LoadedImage {
    const { clip, definition } = this
    const { loadedImage } = definition
    if (loadedImage) return loadedImage

    const clipTime = timeRangeFromArgs()
    const args: GraphFileArgs = {
      time: clipTime, clipTime, 
      visible: true, quantize: 0, editing: true
    }
    const [graphFile] = this.graphFiles(args)
    const { preloader } = clip.track.mash
    const image: LoadedImage = preloader.getFile(graphFile)
    assertTrue(image, "image")

    definition.loadedImage = image
    return image
  }
}
