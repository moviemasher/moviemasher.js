import {
  AudibleSource, VisibleSource, Any, UnknownObject, LoadPromise, LoadVideoResult,
  FilesArgs, GraphFile, GraphFiles
} from "../../declarations"
import { DefinitionType, TrackType, DataType, LoadType, AVType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { Time } from "../../Helpers/Time/Time"
import { VideoClass } from "./VideoClass"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { Preloader } from "../../Preloader/Preloader"
import { AudibleContextInstance } from "../../Context/AudibleContext"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"

const VideoDefinitionWithClip = ClipDefinitionMixin(PreloadableDefinition)
const VideoDefinitionWithAudible = AudibleDefinitionMixin(VideoDefinitionWithClip)
const VideoDefinitionWithAudibleFile = AudibleFileDefinitionMixin(VideoDefinitionWithAudible)
const VideoDefinitionWithVisible = VisibleDefinitionMixin(VideoDefinitionWithAudibleFile)
const VideoDefinitionWithTransformable = TransformableDefinitionMixin(VideoDefinitionWithVisible)
class VideoDefinitionClass extends VideoDefinitionWithTransformable implements VideoDefinition {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { fps } = object as VideoDefinitionObject
    if (fps) this.fps = fps
    // TODO: support speed
    // this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  audibleSource(preloader: Preloader): AudibleSource | undefined {
    const graphFile: GraphFile = {
      type: LoadType.Video, file: this.url, definition: this, input: true
    }
    const cached: LoadVideoResult | undefined = preloader.getFile(graphFile)
    if (!cached) return

    const { audio } = cached
    return AudibleContextInstance.createBufferSource(audio)
  }

  definitionFiles(args: FilesArgs): GraphFiles {
    const files = super.definitionFiles(args)
    const file = this.file(args)
    if (file) files.push(file)
    return files
  }

  private file(args: FilesArgs): GraphFile | undefined {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return

    return {
      definition: this, file: this.preloadableSource(graphType), type: this.loadType
    }
  }

  fps = Default.definition.video.fps

  get instance(): Video { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object: VideoObject): Video {
    return new VideoClass({ ...this.instanceObject, ...object })
  }

  loadType = LoadType.Video

  loadedVisible(preloader: Preloader, quantize: number, startTime: Time): VisibleSource | undefined {
    const rate = this.fps || quantize
    const time = startTime.scale(rate)

    const graphFile: GraphFile = {
      type: LoadType.Video, file: this.url, input: true, definition: this
    }
    const cached: LoadVideoResult | undefined = preloader.getFile(graphFile)
    if (!cached) return

    const { sequence } = cached
    const source = sequence[time.frame]
    if (!source || source instanceof Promise) return

    return source
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

  private seekPromise(definitionTime: Time, video:HTMLVideoElement): LoadPromise {
    const promise:LoadPromise = new Promise(resolve => {
      if (!this.seekNeeded(definitionTime, video)) return resolve()

      video.onseeked = () => {
        video.onseeked = null
        resolve()
      }
      this.seek(definitionTime, video)
    })
    return promise
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

export { VideoDefinitionClass }
