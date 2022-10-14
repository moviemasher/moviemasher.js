import {
  UnknownObject, LoadedVideo} from "../../declarations"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { VideoClass } from "./VideoClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContainerDefinitionMixin } from "../../Container/ContainerDefinitionMixin"

const VideoDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const VideoDefinitionWithContainer = ContainerDefinitionMixin(VideoDefinitionWithTweenable)
const VideoDefinitionWithContent = ContentDefinitionMixin(VideoDefinitionWithContainer)
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


  instanceFromObject(object: VideoObject = {}): Video {
    return new VideoClass(this.instanceArgs(object))
  }

  loadType = LoadType.Video

  loadedVideo?: LoadedVideo
  
  pattern = '%.jpg'


  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  type = DefinitionType.Video
}
