import { AudibleSource, VisibleSource, Any, UnknownObject, LoadPromise, LoadVideoResult } from "../../declarations"
import { DefinitionType, TrackType, DataType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { Time, Times } from "../../Helpers/Time"
import { TimeRange } from "../../Helpers/TimeRange"
import { urlAbsolute } from "../../Utilities/Url"
import { cacheAudibleContext, cacheCached, cacheCaching, cacheGet } from "../../Loader/Cache"
import { LoaderFactory } from "../../Loader/LoaderFactory"
import { DefinitionBase } from "../../Base/Definition"
import { Definitions } from "../../Definitions/Definitions"
import { VideoClass } from "./VideoInstance"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { ContextFactory } from "../../Context/ContextFactory"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"

const WithClip = ClipDefinitionMixin(DefinitionBase)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithAudibleFile = AudibleFileDefinitionMixin(WithAudible)
const WithVisible = VisibleDefinitionMixin(WithAudibleFile)
const WithTransformable = TransformableDefinitionMixin(WithVisible)
class VideoDefinitionClass extends WithTransformable implements VideoDefinition {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { url, fps, source } = <VideoDefinitionObject>object
    if (!url) throw Errors.invalid.definition.url

    this.url = url

    this.source = source || url
    if (fps) this.fps = fps

    this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))

    Definitions.install(this)
  }

  get absoluteUrl(): string { return urlAbsolute(this.url) }

  get cachedOrThrow(): LoadVideoResult {
    const cached = cacheGet(this.absoluteUrl)
    if (!cached) throw Errors.internal

    return <LoadVideoResult> cached
  }

  definitionUrls(start: Time, end?: Time): string[] { return [this.absoluteUrl] }

  fps = Default.definition.video.fps

  get inputSource(): string { return urlAbsolute(this.source) }

  get instance(): Video { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object: VideoObject): Video {
    return new VideoClass({ ...this.instanceObject, ...object })
  }

  framePromise(time: Time, cached: LoadVideoResult): LoadPromise {
    const { video, sequence } = cached
    const sourceOrPromise = sequence[time.frame]
    if (sourceOrPromise instanceof Promise) return sourceOrPromise

    if (sourceOrPromise) return Promise.resolve()

    // console.debug(this.constructor.name, "framePromise", time)

    const promise = this.seekPromise(time, video).then(() => {
      // make sure we don't already have this frame
      if (sequence[time.frame] && !(sequence[time.frame] instanceof Promise)) {
        // console.debug(this.constructor.name, "framePromise already captured", time.toString())
        return
      }

      const context = ContextFactory.toSize(video)
      context.draw(video)
      sequence[time.frame] = context.canvas
      // console.debug(this.constructor.name, "framePromise capturing", time.toString())
    })
    sequence[time.frame] = promise
    return promise
  }

  needTimes(cached: LoadVideoResult, start: Time, end?: Time): Time[] {
    const { sequence } = cached
    const times = end ? TimeRange.fromTimes(start, end).times : [start]
    return times.filter(time =>
      !sequence[time.frame] || sequence[time.frame] instanceof Promise
    )
  }

  framesPromise(start: Time, end?: Time): LoadPromise {
    const cached = this.cachedOrThrow
    const timesNeeded = this.needTimes(cached, start, end)
    return this.timesPromise(timesNeeded)
  }


  timesPromise(timesNeeded: Time[]): LoadPromise {
    if (!timesNeeded.length) return Promise.resolve()

    const cached = this.cachedOrThrow
    // const promises:LoadPromise[] = timesNeeded.map(time => this.framePromise(time, cached))


    // return Promise.all(promises).then(() => {})
    const time = timesNeeded.shift()
    if (!time) throw Errors.internal

    const first = this.framePromise(time, cached)
    let framePromise = first

    timesNeeded.forEach(time => {
      framePromise = framePromise.then(() => this.framePromise(time, cached))
    })
    return framePromise
  }

  loadDefinition(quantize: number, startTime: Time, endTime?: Time): LoadPromise | void {
    const rate = this.fps || quantize
    const start = startTime.scale(rate)
    const end = endTime ? endTime.scale(rate) : endTime

    // console.trace(start)
    const url = this.absoluteUrl
    if (cacheCached(url)) {
      const cached = this.cachedOrThrow
      const times = this.needTimes(cached, start, end)
      if (!times.length) {
        // console.debug(this.constructor.name, "loadDefinition cached and no times needed")
        return
      }
      // console.debug(this.constructor.name, "loadDefinition cached and returning promises", times.join(', '))
      return this.timesPromise(times)
    }

    const promise: LoadPromise = cacheCaching(url) ? cacheGet(url) : LoaderFactory.video().loadUrl(url)
    // if (caching(url)) console.debug(this.constructor.name, "loadDefinition caching and returning framesPromise", start, end)
    // else console.debug(this.constructor.name, "loadDefinition uncached and returning framesPromise", start, end)

    return promise.then(() => this.framesPromise(start, end))
  }

  loadedAudible(): AudibleSource | undefined {
    const cached: LoadVideoResult | undefined = cacheGet(this.absoluteUrl)
    if (!cached) return

    const { audio } = cached
    return cacheAudibleContext.createBufferSource(audio)
  }

  loadedVisible(quantize: number, startTime: Time): VisibleSource | undefined {
    const rate = this.fps || quantize
    const time = startTime.scale(rate)

    // console.debug(this.constructor.name, "loadedVisible", time.toString(), startTime.toString())

    const cached: LoadVideoResult | undefined = cacheGet(this.absoluteUrl)
    if (!cached) {
      // console.debug(this.constructor.name, "loadedVisible no cached")
      return
    }

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
    if (!video) throw Errors.internal

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

  unload(times?: Times[]): void {
    // const zeroTime = Time.fromArgs(0, this.fps)
    // const allUrls = this.urls(zeroTime, zeroTime.withFrame(this.framesMax))
    // const deleting = new Set(allUrls.filter(url => cached(url)))
    // if (times) {
    //   times.forEach(maybePair => {
    //     const [start, end] = maybePair
    //     const frames = this.framesArray(start, end)
    //     const urls = frames.map(frame => this.urlForFrame(frame))
    //     const needed = urls.filter(url => deleting.has(url))
    //     needed.forEach(url => { deleting.delete(url) })
    //   })
    // }
    // deleting.forEach(url => { remove(url) })
  }

  url : string

  // private urlForFrame(frame : number) : string {
  //   let s = String((frame * this.increment) + this.begin)
  //   if (this.padding) s = s.padStart(this.padding, '0')
  //   return (this.url + this.pattern).replaceAll('%', s)
  // }

  // private urls(start : Time, end? : Time) : string[] {
  //   return this.framesArray(start, end).map(frame => this.urlForFrame(frame))
  // }

}

export { VideoDefinitionClass }
