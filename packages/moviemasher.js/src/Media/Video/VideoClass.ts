import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString, assertTrue } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { NamespaceSvg } from "../../Setup/Constants"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"

const VideoWithTweenable = TweenableMixin(InstanceBase)
const VideoWithContent = ContentMixin(VideoWithTweenable)
const VideoWithContainer = ContainerMixin(VideoWithContent)
const VideoWithPreloadable = PreloadableMixin(VideoWithContainer)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
    // const { height, width, x, y } = rect
    // const { foreignElement } = this

    const args: GraphFileArgs = {
      time, clipTime: range, visible: true, quantize: range.fps, editing: true
    }
    const [graphFile] = this.graphFiles(args)
    const { preloader } = this.clip.track.mash
    const element = preloader.getFile(graphFile)?.cloneNode()
    assertTrue(!!element, "video element")
    return this.foreignSvgItem(element, rect, stretch)

    // foreignElement.setAttribute('x', String(x))
    // foreignElement.setAttribute('y', String(y))
    // foreignElement.setAttribute('width', String(width))
    // element.setAttribute('width', String(width))
    // if (stretch) {
    //   foreignElement.setAttribute('height', String(height))
    //   foreignElement.setAttribute('preserveAspectRatio', 'none')
    //   element.setAttribute('height', String(height))
    //   element.setAttribute('preserveAspectRatio', 'none')
    // }
    // foreignElement.replaceChildren(element)
    // return foreignElement
  }
 
  declare definition : VideoDefinition

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { editing } = args
    const { definition } = this
    const { url, source } = definition
    const file = editing ? url : source
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      input: true, options: {}, type: LoadType.Video, file, definition
    }
    return [graphFile]
  }
}
