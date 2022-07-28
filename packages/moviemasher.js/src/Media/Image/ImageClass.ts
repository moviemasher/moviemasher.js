import { SvgItem, ValueObject } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { CommandFile, CommandFileArgs, CommandFiles, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ImageDefinition, Image } from "./Image"
import { assertPopulatedString, isTimeRange } from "../../Utility/Is"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { NamespaceSvg } from "../../Setup/Constants"
import { svgPolygonElement } from "../../Utility/Svg"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"


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
    graphFile.options = options
    const commandFile: CommandFile = {
      ...graphFile, inputId: this.id
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
    // console.log(this.constructor.name, "graphFiles", file)
    graphFiles.push(graphFile)
  
    return graphFiles
  }

  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
    const { x, y, width, height } = rect
    const imageElement = globalThis.document.createElementNS(NamespaceSvg, 'image')
    imageElement.setAttribute('id', `image-${this.id}`)
    imageElement.setAttribute('href', this.definition.urlAbsolute)
    imageElement.setAttribute('x', String(x))
    imageElement.setAttribute('y', String(y))
    imageElement.setAttribute('width', String(width))
    if (stretch) {
      imageElement.setAttribute('height', String(height))
      imageElement.setAttribute('preserveAspectRatio', 'none')
    }
    return imageElement
  }


}
