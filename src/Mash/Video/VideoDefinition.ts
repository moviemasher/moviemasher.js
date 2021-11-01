import { DefinitionType, TrackType, DataType } from "../../Setup/Enums"
import { Time, Times} from "../../Utilities"
import { Cache } from "../../Loading"
import { DefinitionClass } from "../Definition/Definition"
import { VideoClass } from "./VideoInstance"
import { Video, VideoDefinitionObject, VideoObject } from "./Video"
import { ClipDefinitionMixin } from "../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../Mixin/Visible/VisibleDefinitionMixin"
import { Any, DrawingSource, JsonObject, LoadPromise } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../Definitions/Definitions"
import { AudibleDefinitionMixin } from "../Mixin/Audible/AudibleDefinitionMixin"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { LoaderFactory } from "../../Loading/LoaderFactory"

const VideoDefinitionWithClip = ClipDefinitionMixin(DefinitionClass)
const VideoDefinitionWithAudible = AudibleDefinitionMixin(VideoDefinitionWithClip)
const VideoDefinitionWithVisible = VisibleDefinitionMixin(VideoDefinitionWithAudible)
class VideoDefinitionClass extends VideoDefinitionWithVisible {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { url, begin, fps, increment, pattern, video_rate, source } = <VideoDefinitionObject> object
    if (!url) throw Errors.invalid.definition.url
    this.url = url

    if (source) this.source = source

    if (typeof begin !== "undefined") this.begin = begin

    if (fps || video_rate) this.fps = Number(fps || video_rate) // deprecated string

    if (increment) this.increment = increment
    if (pattern) this.pattern = pattern

    this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))

    Definitions.install(this)
  }

  begin = Default.definition.video.begin

  fps = Default.definition.video.fps

  private frames(start : Time, end? : Time) : number[] {
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

  increment = Default.definition.video.increment

  get instance() : Video { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoObject) : Video {
    return new VideoClass({ ...this.instanceObject, ...object })
  }

  load(start: Time, end?: Time): LoadPromise {
    const promises: LoadPromise[] = []
    if (!this.stream) promises.push(super.load(start, end))

    if (this.stream) promises.push(LoaderFactory.video().loadUrl(this.url))
    else {
      this.frames(start, end).map(frame => this.urlForFrame(frame)).forEach(url => {
        if (Cache.cached(url)) {
          const cached = Cache.get(url)
          if (cached instanceof Promise) promises.push(cached)
        } else promises.push(LoaderFactory.image().loadUrl(url))
      })
    }
    return Promise.all(promises).then()
  }

  loaded(start: Time, end?: Time): boolean {
    const checkUrls = []
    if (this.stream) checkUrls.push(this.url)
    else {
      if (!super.loaded(start, end)) return false

      checkUrls.push(...this.frames(start, end).map(frame => this.urlForFrame(frame)))
    }
    return checkUrls.every(url => Cache.cached(url))
  }

  loadedVisible(time? : Time) : DrawingSource | undefined {
    if (!time) throw Errors.internal
    if (this.stream) return Cache.get(this.url)
    const [url] = this.urls(time)
    return Cache.get(url)
  }

  pattern = '%.jpg'

  source = ''


  trackType = TrackType.Video

  type = DefinitionType.Video

  toJSON() : JsonObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    if (this.pattern !== Default.definition.video.pattern) object.pattern = this.pattern
    if (this.increment !== Default.definition.video.increment) object.increment = this.increment
    if (this.begin !== Default.definition.video.begin) object.begin = this.begin
    if (this.fps !== Default.definition.video.fps) object.fps = this.fps
    return object
  }

  unload(times?: Times[]): void {

    // TODO: better handle unloading of single stream file
    if (this.stream) {
      Cache.remove(this.url)
      return
    }
    const zeroTime = Time.fromArgs(0, this.fps)
    const allUrls = this.urls(zeroTime, zeroTime.withFrame(this.framesMax))
    const deleting = new Set(allUrls.filter(url => Cache.cached(url)))
    if (times) {
      times.forEach(maybePair => {
        const [start, end] = maybePair
        const frames = this.frames(start, end)
        const urls = frames.map(frame => this.urlForFrame(frame))
        const needed = urls.filter(url => deleting.has(url))
        needed.forEach(url => { deleting.delete(url) })
      })
    }
    deleting.forEach(url => { Cache.remove(url) })
  }

  url : string

  urlForFrame(frame : number) : string {
    let s = String((frame * this.increment) + this.begin)
    if (this.zeropadding) s = s.padStart(this.zeropadding, '0')
    return (this.url + this.pattern).replaceAll('%', s)
  }

  urls(start : Time, end? : Time) : string[] {
    return this.frames(start, end).map(frame => this.urlForFrame(frame))
  }

  get zeropadding() : number {
    if (!this.__zeropadding) {
      const lastFrame = this.begin + (this.increment * this.framesMax - this.begin)
      this.__zeropadding = String(lastFrame).length

    }
    return this.__zeropadding
  }

  private __zeropadding? : number
}

export { VideoDefinitionClass }
