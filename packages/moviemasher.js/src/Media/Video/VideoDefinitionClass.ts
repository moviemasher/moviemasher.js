import {
  AudibleSource, UnknownObject, LoadVideoResult,
  CanvasVisibleSource, SvgContent} from "../../declarations"
import { GraphFile, GraphFiles, GraphFileArgs } from "../../MoveMe"
import { DefinitionType, TrackType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Time } from "../../Helpers/Time/Time"
import { VideoClass } from "./VideoClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { Loader } from "../../Loader/Loader"
import { AudibleContextInstance } from "../../Context/AudibleContext"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableDimensionsDefinitionMixin } from "../../Mixin/UpdatableDimensions/UpdatableDimensionsDefinitionMixin"
import { FilterDefinition } from "../../Filter/Filter"
import { filterDefinitionFromId } from "../../Filter/FilterFactory"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { NamespaceSvg } from "../../Setup/Constants"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { ContainerDefinitionMixin } from "../../Container/ContainerDefinitionMixin"

const VideoDefinitionWithContent = ContentDefinitionMixin(DefinitionBase)
const VideoDefinitionWithContainer = ContainerDefinitionMixin(VideoDefinitionWithContent)
const VideoDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoDefinitionWithContainer)
const VideoDefinitionWithUpdatableDimensions = UpdatableDimensionsDefinitionMixin(VideoDefinitionWithPreloadable)
const VideoDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoDefinitionWithUpdatableDimensions)
export class VideoDefinitionClass extends VideoDefinitionWithUpdatableDuration implements VideoDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { fps } = object as VideoDefinitionObject
    if (fps) this.fps = fps

    this.fpsFilterDefinition = filterDefinitionFromId('fps')

    this.setsarFilterDefinition = filterDefinitionFromId('setsar')

    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  audibleSource(preloader: Loader): AudibleSource | undefined {
    const graphFile: GraphFile = {
      type: LoadType.Video, file: this.url, definition: this, input: true
    }
    const cached: LoadVideoResult | undefined = preloader.getFile(graphFile)
    if (!cached) return

    const { audio } = cached
    return AudibleContextInstance.createBufferSource(audio)
  }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const files = super.graphFiles(args)
    const file = this.file(args)
    if (file) files.push(file)
    return files
  }

  private file(args: GraphFileArgs): GraphFile | undefined {
    const { editing, visible } = args
    if (!visible) return

    return {
      definition: this,
      file: this.preloadableSource(editing), type: this.loadType
    }
  }

  fps = Default.definition.video.fps

  fpsFilterDefinition: FilterDefinition

  instanceFromObject(object: VideoObject = {}): Video {
    return new VideoClass(this.instanceArgs(object))
  }

  loadType = LoadType.Video

  loadedVisible(preloader: Loader, quantize: number, startTime: Time): CanvasVisibleSource | undefined {
    const rate = this.fps || quantize
    const time = startTime.scale(rate)

    const graphFile: GraphFile = {
      type: LoadType.Video, file: this.url, input: true, definition: this
    }
    const cached: LoadVideoResult | undefined = preloader.getFile(graphFile)
    if (!cached) return

    const { video } = cached
    return video
  }

  pattern = '%.jpg'

  private seek(definitionTime: Time, video:HTMLVideoElement): void {
    if (!video) throw Errors.internal + 'seek'

    video.currentTime = definitionTime.seconds
  }

  private seekNeeded(definitionTime: Time, video:HTMLVideoElement): boolean {
    const { currentTime } = video
    const videoTime = timeFromSeconds(currentTime, definitionTime.fps)
    return !videoTime.equalsTime(definitionTime)
  }

  private seekPromise(definitionTime: Time, video:HTMLVideoElement): Promise<void> {
    const promise:Promise<void> = new Promise(resolve => {
      if (!this.seekNeeded(definitionTime, video)) return resolve()

      video.onseeked = () => {
        video.onseeked = null
        resolve()
      }
      this.seek(definitionTime, video)
    })
    return promise
  }

  setsarFilterDefinition: FilterDefinition

  svgContent(filterChain: TrackPreview): SvgContent {
    const { filterGraph } = filterChain
    const { preloader, size } = filterGraph
    const { width, height } = size
    const graphFile = this.file(filterGraph)!
    const foreignElement = globalThis.document.createElementNS(NamespaceSvg, 'foreignObject')
    foreignElement.setAttribute('id', `video-${this.id}`)
    foreignElement.setAttribute('width', String(width))
    foreignElement.setAttribute('height', String(height))
    foreignElement.append(preloader.getFile(graphFile))
    return foreignElement
  }

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    if (this.fps !== Default.definition.video.fps) object.fps = this.fps
    return object
  }

  trackType = TrackType.Video

  type = DefinitionType.Video
}
