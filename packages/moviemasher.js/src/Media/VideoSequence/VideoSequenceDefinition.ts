import { DefinitionType, TrackType, DataType } from "../../Setup/Enums"
import { Any, VisibleSource, UnknownObject, LoadPromise } from "../../declarations"
import { Time, Times } from "../../Helpers/Time"
import { urlAbsolute} from "../../Utilities/Url"
import { cacheCached, cacheCaching, cacheGet, cacheRemove } from "../../Loader/Cache"
import { DefinitionBase } from "../../Base/Definition"
import { VideoSequenceClass } from "./VideoSequenceInstance"
import { VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject, VideoSequenceObject } from "./VideoSequence"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../../Definitions/Definitions"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { LoaderFactory } from "../../Loader/LoaderFactory"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"

const WithClip = ClipDefinitionMixin(DefinitionBase)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithAudibleFile = AudibleFileDefinitionMixin(WithAudible)
const WithVisible = VisibleDefinitionMixin(WithAudibleFile)
const WithTransformable = TransformableDefinitionMixin(WithVisible)
class VideoSequenceDefinitionClass extends WithTransformable implements VideoSequenceDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const {
      padding, url, begin, fps, increment, pattern, source
    } = <VideoSequenceDefinitionObject>object
    if (!url) throw Errors.invalid.definition.url
    this.url = url

    if (source) this.source = source
    if (typeof begin !== "undefined") this.begin = begin
    if (fps) this.fps = fps
    if (increment) this.increment = increment
    if (pattern) this.pattern = pattern
    if (padding) this.padding = padding
    else {
      const lastFrame = this.begin + (this.increment * this.framesMax - this.begin)
      this.padding = String(lastFrame).length
    }
    this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))
    Definitions.install(this)
  }

  begin = Default.definition.videosequence.begin

  definitionUrls(start: Time, end?: Time): string[] {
    return this.framesArray(start, end).map(frame => this.urlForFrame(frame))
  }

  fps = Default.definition.videosequence.fps

  private framesArray(start : Time, end? : Time) : number[] {
    const frames : number[] = []
    const startFrame = Math.min(this.framesMax, start.scale(this.fps, "floor").frame)
    if (end) {
      const endFrame = Math.min(this.framesMax, end.scale(this.fps, "ceil").frame)
      for (let frame = startFrame; frame <= endFrame; frame += 1) {
        frames.push(frame)
      }
    } else frames.push(startFrame)
    return frames
  }

  private get framesMax() : number { return Math.floor(this.fps * this.duration) - 2 }

  increment = Default.definition.videosequence.increment

  get inputSource(): string { return urlAbsolute(this.source) }

  get instance() : VideoSequence { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoSequenceObject) : VideoSequence {
    return new VideoSequenceClass({ ...this.instanceObject, ...object })
  }

  loadDefinition(quantize:number, start: Time, end?: Time): LoadPromise | void {
    const promises: LoadPromise[] = []
    const clipDefinitionPromise = end ? super.loadDefinition(quantize, start, end) : null
    if (clipDefinitionPromise) promises.push(clipDefinitionPromise)
    const urls = this.definitionUrls(start, end)
    const uncachedUrls = urls.filter(url => !cacheCached(url))
    uncachedUrls.forEach(url => {
      if (cacheCaching(url)) promises.push(cacheGet(url))
      else promises.push(LoaderFactory.image().loadUrl(url))
    })
    switch (promises.length) {
      case 0: return
      case 1: return promises[0]
      default: return Promise.all(promises).then()
    }
  }

  loadedVisible(_quantize: number, time : Time) : VisibleSource | undefined {
    const [url] = this.urls(time)
    return cacheGet(url)
  }

  pattern = '%.jpg'

  source = ''

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    if (this.pattern !== Default.definition.videosequence.pattern) object.pattern = this.pattern
    if (this.increment !== Default.definition.videosequence.increment) object.increment = this.increment
    if (this.begin !== Default.definition.videosequence.begin) object.begin = this.begin
    if (this.fps !== Default.definition.videosequence.fps) object.fps = this.fps
    if (this.padding !== Default.definition.videosequence.padding) object.padding = this.padding
    return object
  }

  trackType = TrackType.Video

  type = DefinitionType.VideoSequence

  unload(times?: Times[]): void {
    const zeroTime = Time.fromArgs(0, this.fps)
    const allUrls = this.urls(zeroTime, zeroTime.withFrame(this.framesMax))
    const deleting = new Set(allUrls.filter(url => cacheCached(url)))
    if (times) {
      times.forEach(maybePair => {
        const [start, end] = maybePair
        const frames = this.framesArray(start, end)
        const urls = frames.map(frame => this.urlForFrame(frame))
        const needed = urls.filter(url => deleting.has(url))
        needed.forEach(url => { deleting.delete(url) })
      })
    }
    deleting.forEach(url => { cacheRemove(url) })
  }

  url : string

  private urlForFrame(frame : number) : string {
    let s = String((frame * this.increment) + this.begin)
    if (this.padding) s = s.padStart(this.padding, '0')
    return urlAbsolute((this.url + this.pattern).replaceAll('%', s))
  }

  private urls(start : Time, end? : Time) : string[] {
    return this.framesArray(start, end).map(frame => this.urlForFrame(frame))
  }

  padding : number
}

export { VideoSequenceDefinitionClass }
