import { AudibleSource, VisibleSource, Any, UnknownObject, LoadPromise, LoadVideoResult, FilesArgs, GraphFile, GraphFiles } from "../../declarations"
import { DefinitionType, TrackType, DataType, LoadType, AVType, GraphType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { Time } from "../../Helpers/Time"
import { VideoClass } from "./VideoInstance"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { Preloader } from "../../Preloader/Preloader"
import { AudibleContextInstance } from "../../Context/AudibleContext"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

const WithClip = ClipDefinitionMixin(PreloadableDefinition)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithAudibleFile = AudibleFileDefinitionMixin(WithAudible)
const WithVisible = VisibleDefinitionMixin(WithAudibleFile)
const WithTransformable = TransformableDefinitionMixin(WithVisible)
class VideoDefinitionClass extends WithTransformable implements VideoDefinition {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { url, fps } = <VideoDefinitionObject>object
    if (url) {
      this.url = url
      this.source ||= url
    }
    if (fps) this.fps = fps

    this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  file(args: FilesArgs): GraphFile | undefined {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return

    return {
      type: LoadType.Video,
      file: graphType === GraphType.Canvas ? this.url : this.source,
      definition: this
    }
  }

  files(args: FilesArgs): GraphFiles {
    const files = super.files(args)
    const file = this.file(args)
    if (file) files.push(file)

    return files
  }

  fps = Default.definition.video.fps

  get instance(): Video { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object: VideoObject): Video {
    return new VideoClass({ ...this.instanceObject, ...object })
  }

  audibleSource(preloader: Preloader): AudibleSource | undefined {
    const graphFile: GraphFile = {
      type: LoadType.Video, file: this.url
    }
    const cached: LoadVideoResult | undefined = preloader.getFile(graphFile)
    if (!cached) return

    const { audio } = cached
    return AudibleContextInstance.createBufferSource(audio)
  }

  loadedVisible(preloader: Preloader, quantize: number, startTime: Time): VisibleSource | undefined {
    const rate = this.fps || quantize
    const time = startTime.scale(rate)

    const cached: LoadVideoResult | undefined = preloader.getFile({ type: LoadType.Video, file: this.url })
    if (!cached) return

    const { sequence } = cached
    const source = sequence[time.frame]
    if (!source || source instanceof Promise) {
      // console.debug(this.constructor.name, "loadedVisible source issue", source)
      return
    }

    return source
  }

  pattern = '%.jpg'

  private seek(definitionTime: Time, video:HTMLVideoElement): void {
    if (!video) throw Errors.internal + 'seek'

    video.currentTime = definitionTime.seconds
  }

  private seekNeeded(definitionTime: Time, video:HTMLVideoElement): boolean {
    const { currentTime } = video
    const videoTime = Time.fromSeconds(currentTime, definitionTime.fps)
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


  source = ''

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    if (this.fps !== Default.definition.video.fps) object.fps = this.fps
    return object
  }

  trackType = TrackType.Video

  type = DefinitionType.Video

  url = ''
}

export { VideoDefinitionClass }
