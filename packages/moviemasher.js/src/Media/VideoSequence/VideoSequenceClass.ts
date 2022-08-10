import { SvgItem, UnknownObject } from "../../declarations"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Default } from "../../Setup/Default"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { VideoSequence, VideoSequenceDefinition } from "./VideoSequence"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { LoadType } from "../../Setup/Enums"
import { Rect } from "../../Utility/Rect"
import { NamespaceSvg } from "../../Setup/Constants"
import { assertTrue } from "../../Utility"

const VideoSequenceWithTweenable = TweenableMixin(InstanceBase)
const VideoSequenceWithContainer = ContainerMixin(VideoSequenceWithTweenable)
const VideoSequenceWithContent = ContentMixin(VideoSequenceWithContainer)
const VideoSequenceWithPreloadable = PreloadableMixin(VideoSequenceWithContent)
const VideoSequenceWithUpdatableSize = UpdatableSizeMixin(VideoSequenceWithPreloadable)
const VideoSequenceWithUpdatableDuration = UpdatableDurationMixin(VideoSequenceWithUpdatableSize)

export class VideoSequenceClass extends VideoSequenceWithUpdatableDuration implements VideoSequence {
  declare definition : VideoSequenceDefinition



  graphFiles(args: GraphFileArgs): GraphFiles {
    const { time, clipTime, editing, streaming, visible } = args
    const definitionTime = this.definitionTime(time, clipTime)

    if (!editing) console.trace(this.constructor.name, "graphFiles", editing, time, clipTime, definitionTime)
    const definitionArgs: GraphFileArgs = { ...args, time: definitionTime }
    const files = super.graphFiles(definitionArgs) 
    
    if (visible) {
      const { definition } = this
      if (editing) {
        const frames = definition.framesArray(definitionTime)
        const graphFiles = frames.map(frame => {
          const graphFile: GraphFile = {
            type: LoadType.Image, file: definition.urlForFrame(frame), 
            input: true, definition
          }
          return graphFile
        })
        files.push(...graphFiles)
      } else {
        const graphFile: GraphFile = {
          type: LoadType.Video, file: definition.source, definition, input: true
        }
        if (streaming) {
          graphFile.options = { loop: 1 }
          graphFile.options.re = ''
        }
        files.push(graphFile)
      }
    }
    return files
  }

  speed = Default.instance.video.speed

  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
    const args: GraphFileArgs = {
      time, clipTime: range, visible: true, quantize: range.fps, editing: true
    }
    const [graphFile] = this.graphFiles(args)
    const { preloader } = this.clip.track.mash
    const element = preloader.getFile(graphFile)?.cloneNode()
    assertTrue(!!element, "image element")

    return this.foreignSvgItem(element, rect, stretch)


    // const { x, y, width, height } = rect
    // const { foreignElement } = this

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

    // // console.log(this.constructor.name, "svgItem", time, range)
    // const definitionTime = this.definitionTime(time, range)
    // const { x, y, width, height } = rect
    // const { definition } = this
   
    // const [frame] = definition.framesArray(definitionTime)
    // const url = definition.urlForFrame(frame)
    // const lastUrl = this.definition.urlAbsolute
    // const urlComponents = url.split('/')
    // const [firstUrlComponent] = urlComponents
    // const lastUrlComponents = lastUrl.split('/')
    // const index = lastUrlComponents.indexOf(firstUrlComponent)
    // const components = [...lastUrlComponents.slice(0, index), ...urlComponents]
    // const href = components.join('/')

    // // console.log(this.constructor.name, "svgItem", href)
    // const imageElement = globalThis.document.createElementNS(NamespaceSvg, 'image')
    // imageElement.setAttribute('id', `image-${this.id}`)
    // imageElement.setAttribute('href', href)
    // imageElement.setAttribute('x', String(x))
    // imageElement.setAttribute('y', String(y))
    // imageElement.setAttribute('width', String(width))
    // if (stretch) {
    //   imageElement.setAttribute('height', String(height))
    //   imageElement.setAttribute('preserveAspectRatio', 'none')
    // }
    // return imageElement
  }

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}
