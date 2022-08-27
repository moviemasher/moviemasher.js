import {
  AudibleSource, UnknownObject, LoadedVideo, LoadedAudio} from "../../declarations"
import { GraphFile } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Time } from "../../Helpers/Time/Time"
import { VideoClass } from "./VideoClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { Loader } from "../../Loader/Loader"
import { AudibleContextInstance } from "../../Context/AudibleContext"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"

const VideoDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const VideoDefinitionWithContent = ContentDefinitionMixin(VideoDefinitionWithTweenable)
const VideoDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoDefinitionWithContent)
const VideoDefinitionWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoDefinitionWithPreloadable)
const VideoDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoDefinitionWithUpdatableSize)
export class VideoDefinitionClass extends VideoDefinitionWithUpdatableDuration implements VideoDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { loadedVideo } = object as VideoDefinitionObject
    if (loadedVideo) this.loadedVideo = loadedVideo
  
    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  audibleSource(preloader: Loader): AudibleSource | undefined {
    const graphFile: GraphFile = {
      type: LoadType.Audio, file: this.url, definition: this, input: true
    }
    const audio: LoadedAudio = preloader.getFile(graphFile)
   
    return AudibleContextInstance.createBufferSource(audio)
  }

  instanceFromObject(object: VideoObject = {}): Video {
    return new VideoClass(this.instanceArgs(object))
  }

  loadType = LoadType.Video

  loadedVideo?: LoadedVideo
  
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

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  type = DefinitionType.Video
}
