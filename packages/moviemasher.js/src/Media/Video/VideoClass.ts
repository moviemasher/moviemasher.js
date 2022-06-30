import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString } from "../../Utility/Is"
import { UpdatableDimensionsMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { Rect, SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { NamespaceSvg } from "../../Setup/Constants"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"

const VideoWithTweenable = TweenableMixin(InstanceBase)
const VideoWithContent = ContentMixin(VideoWithTweenable)
const VideoWithContainer = ContainerMixin(VideoWithContent)
const VideoWithPreloadable = PreloadableMixin(VideoWithContainer)
const VideoWithUpdatableDimensions = UpdatableDimensionsMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableDimensions)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  svgContent(rect: Rect, stretch?: boolean): SvgContent {
    const { height, width, x, y } = rect
    const { foreignElement } = this
    foreignElement.setAttribute('width', String(width))
    foreignElement.setAttribute('x', String(x))
    foreignElement.setAttribute('y', String(y))
    if (stretch) foreignElement.setAttribute('height', String(height))
    return foreignElement
  }
 
  declare definition : VideoDefinition

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { editing } = args
    const { definition } = this
    const file = definition.preloadableSource(editing)
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      input: true, options: {}, type: LoadType.Video, file, definition
    }
    return [graphFile]
  }

  mutable = true

  private _foreignElement?: SVGForeignObjectElement
  private get foreignElement() { return this._foreignElement ||= this.foreignElementInitialize }
  private get foreignElementInitialize(): SVGForeignObjectElement {
    const video = globalThis.document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = this.definition.urlAbsolute
    const foreignElement = globalThis.document.createElementNS(NamespaceSvg, 'foreignObject')
    foreignElement.setAttribute('id', `video-${this.id}`)
    foreignElement.append(video)
    return foreignElement
  }
}
