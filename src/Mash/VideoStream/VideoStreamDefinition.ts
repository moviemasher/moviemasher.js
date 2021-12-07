import { DefinitionType, TrackType } from "../../Setup/Enums"
import { Time, Times} from "../../Utilities/Time"
import { urlAbsolute} from "../../Utilities/Url"
import { Cache } from "../../Loading/Cache"
import { DefinitionBase } from "../../Base/Definition"
import { VideoStreamClass } from "./VideoStreamInstance"
import { VideoStream, VideoStreamDefinitionObject, VideoStreamObject } from "./VideoStream"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { Any, JsonObject, LoadPromise } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../../Definitions/Definitions"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { LoaderFactory } from "../../Loading/LoaderFactory"
import { StreamableDefinitionMixin } from "../../Mixin/Streamable/StreamableDefinitionMixin"
import { Default } from "../../Setup/Default"

const WithClip = ClipDefinitionMixin(DefinitionBase)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithVisible = VisibleDefinitionMixin(WithAudible)
const WithStreamable = StreamableDefinitionMixin(WithVisible)
class VideoStreamDefinitionClass extends WithStreamable {
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
    if (Cache.cached(url)) return

    if (Cache.caching(url)) return Cache.get(url)

    return LoaderFactory.video().loadUrl(url)
  }

  definitionUrls(_start: Time, _end?: Time): string[] { return [this.absoluteUrl] }

  loadedVisible() : HTMLVideoElement | undefined { return Cache.get(this.absoluteUrl) }

  source = ''

  trackType = TrackType.Video

  type = DefinitionType.VideoStream

  toJSON() : JsonObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  unload(times?: Times[]): void {
    if (!times && Cache.cached(this.url)) Cache.remove(this.url)
  }

  url : string
}

export { VideoStreamDefinitionClass }
