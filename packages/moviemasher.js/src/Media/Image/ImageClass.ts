import { Rect, SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ImageDefinition, Image } from "./Image"
import { assertPopulatedString } from "../../Utility/Is"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDimensionsMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { NamespaceSvg } from "../../Setup/Constants"
import { svgPolygonElement } from "../../Utility/Svg"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"


const ImageWithTweenable = TweenableMixin(InstanceBase)
const ImageWithContainer = ContainerMixin(ImageWithTweenable)
const ImageWithContent = ContentMixin(ImageWithContainer)
const ImageWithPreloadable = PreloadableMixin(ImageWithContent)
const ImageWithUpdatable = UpdatableDimensionsMixin(ImageWithPreloadable)
export class ImageClass extends ImageWithUpdatable implements Image {
  declare definition: ImageDefinition

  private graphFile(editing?: boolean): GraphFile {
    const { definition } = this
    const file = definition.preloadableSource(editing)
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      input: true, options: { loop: 1, framerate: 30 }, type: LoadType.Image, file, definition
    }
    return graphFile
  }

  graphFiles(args: GraphFileArgs): GraphFiles { 
    const { visible, editing } = args
    const graphFiles: GraphFiles = []
    if (visible) graphFiles.push(this.graphFile(editing))
    return graphFiles
  }

  svgContent(rect: Rect, stretch?: boolean): SvgContent {
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

  pathElement(previewDimensions: Dimensions, forecolor = 'transparent'): SvgContent {
    return svgPolygonElement(this.intrinsicDimensions(), 'shape', forecolor)
  }

}
