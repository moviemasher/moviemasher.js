import { UnknownObject} from "../../declarations"
import { DefinitionType, TrackType, LoadType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { VideoSequenceClass } from "./VideoSequenceClass"
import {
  VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject,
  VideoSequenceObject
} from "./VideoSequence"
import { Default } from "../../Setup/Default"
import {
  PreloadableDefinitionMixin
} from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"

const VideoSequenceDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const VideoSequenceDefinitionWithContent = ContentDefinitionMixin(VideoSequenceDefinitionWithTweenable)
const VideoSequenceDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoSequenceDefinitionWithContent)
const VideoSequenceDefinitionWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoSequenceDefinitionWithPreloadable)
const VideoSequenceDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoSequenceDefinitionWithUpdatableSize)
export class VideoSequenceDefinitionClass extends VideoSequenceDefinitionWithUpdatableDuration implements VideoSequenceDefinition {
  constructor(...args : any[]) {
    super(...args)
    const [object] = args
    const {
      padding, begin, fps, increment, pattern
    } = <VideoSequenceDefinitionObject>object

    if (typeof begin !== "undefined") this.begin = begin
    if (fps) this.fps = fps
    if (increment) this.increment = increment
    if (pattern) this.pattern = pattern
    if (padding) this.padding = padding
    else {
      const lastFrame = this.begin + (this.increment * this.framesMax - this.begin)
      this.padding = String(lastFrame).length
    }
    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  begin = Default.definition.videosequence.begin

  fps = Default.definition.videosequence.fps

  framesArray(start: Time): number[] {
    const frames : number[] = []
    const { fps, framesMax } = this
    const startFrame = Math.min(framesMax, start.scale(fps, "floor").frame)
    if (start.isRange) {
      const endFrame = Math.min(framesMax + 1, start.timeRange.endTime.scale(fps, "ceil").frame)
      for (let frame = startFrame; frame < endFrame; frame += 1) {
        frames.push(frame)
      }
    } else frames.push(startFrame)
    // console.log(this.constructor.name, "framesArray", start, fps, framesMax, frames)
    return frames
  }

  private get framesMax() : number { 
    const { fps, duration } = this
    // console.log(this.constructor.name, "framesMax", fps, duration)
    return Math.floor(fps * duration) - 2 
  }

  increment = Default.definition.videosequence.increment

  instanceFromObject(object: VideoSequenceObject = {}): VideoSequence {
    return new VideoSequenceClass(this.instanceArgs(object))
  }

  loadType = LoadType.Image

  // loadedVisible(preloader: Loader, _quantize: number, time: Time): CanvasVisibleSource | undefined {
  //   const frames = this.framesArray(time)
  //   const [frame] = frames
  //   const url = this.urlForFrame(frame)
  //   const file: GraphFile = {
  //     type: LoadType.Image, file: url, definition: this, input: true
  //   }
  //   if (!preloader.loadedFile(file)) return

  //   return preloader.getFile(file)
  // }

  padding : number

  pattern = '%.jpg'

  // preloadableSvg(trackPreview: TrackPreview): SvgItem {
  //   const { preview: filterGraph } = trackPreview
  //   const { size } = filterGraph
  //   const { preloader, editing, visible, quantize, time } = filterGraph
  //   const graphFileArgs: GraphFileArgs = { editing, visible, quantize, time }

  //   const { width, height } = size
  //   const graphFiles = this.graphFiles(graphFileArgs)
  //   const [graphFile] = graphFiles
  //   const href = preloader.key(graphFile)
  //   const imageElement = globalThis.document.createElementNS(NamespaceSvg, 'image')
  //   imageElement.setAttribute('id', `image-${this.id}`)
  //   imageElement.setAttribute('width', String(width))
  //   imageElement.setAttribute('height', String(height))
  //   imageElement.setAttribute('href', href)
  //   return imageElement
  // }

  toJSON() : UnknownObject {
    const json = super.toJSON()
    const { videosequence } = Default.definition
    const { pattern, increment, begin, fps, padding } = this
    if (pattern !== videosequence.pattern) json.pattern = pattern
    if (increment !== videosequence.increment) json.increment = increment
    if (begin !== videosequence.begin) json.begin = begin
    if (fps !== videosequence.fps) json.fps = fps
    if (padding !== videosequence.padding) json.padding = padding
    return json
  }

  trackType = TrackType.Video

  type = DefinitionType.VideoSequence

  urlForFrame(frame : number): string {
    const { increment, begin, padding, url, pattern } = this
    // console.log(this.constructor.name, "urlForFrame", frame, increment, begin, padding, url, pattern )
    let s = String((frame * increment) + begin)
    if (padding) s = s.padStart(padding, '0')
    
    return (url + pattern).replaceAll('%', s)
  }
}
