import { DefinitionType, TrackType } from "../../Setup/Enums"
import { Time, Times} from "../../Helpers/Time"
import { urlAbsolute} from "../../Utilities/Url"
import { cacheCached, cacheCaching, cacheGet, cacheRemove } from "../../Loader/Cache"
import { DefinitionBase } from "../../Base/Definition"
import { VideoStreamClass } from "./VideoStreamInstance"
import { VideoStream, VideoStreamDefinition, VideoStreamDefinitionObject, VideoStreamObject } from "./VideoStream"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { Any, UnknownObject, LoadPromise } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../../Definitions/Definitions"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { LoaderFactory } from "../../Loader/LoaderFactory"
import { StreamableDefinitionMixin } from "../../Mixin/Streamable/StreamableDefinitionMixin"
import { Default } from "../../Setup/Default"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"

const WithClip = ClipDefinitionMixin(DefinitionBase)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithVisible = VisibleDefinitionMixin(WithAudible)
const WithStreamable = StreamableDefinitionMixin(WithVisible)
const WithTransformable = TransformableDefinitionMixin(WithStreamable)
class VideoStreamDefinitionClass extends WithTransformable implements VideoStreamDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { url, source } = <VideoStreamDefinitionObject> object
    if (!url) throw Errors.invalid.definition.url

    this.url = url
    this.source = source || url

    // this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))
    Definitions.install(this)
  }

  get absoluteUrl(): string { return urlAbsolute(this.url) }

  frames(quantize: number): number {
    return Time.fromSeconds(Default.definition.videostream.duration, quantize, 'floor').frame
  }

  get inputSource(): string { return urlAbsolute(this.source) }

  get instance() : VideoStream { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoStreamObject) : VideoStream {
    return new VideoStreamClass({ ...this.instanceObject, ...object })
  }

  loadDefinition(): LoadPromise | void {
    const url = this.absoluteUrl
    if (cacheCached(url)) return

    if (cacheCaching(url)) return cacheGet(url)

    return LoaderFactory.video().loadUrl(url)
  }

  definitionUrls(_start: Time, _end?: Time): string[] { return [this.absoluteUrl] }

  loadedVisible() : HTMLVideoElement | undefined { return cacheGet(this.absoluteUrl) }

  source = ''

  trackType = TrackType.Video

  type = DefinitionType.VideoStream

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  unload(times?: Times[]): void {
    if (!times && cacheCached(this.url)) cacheRemove(this.url)
  }

  url : string
}

export { VideoStreamDefinitionClass }
