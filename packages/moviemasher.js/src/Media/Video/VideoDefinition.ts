import { AudibleSource, VisibleSource, Any, UnknownObject, LoadPromise, LoadVideoResult, FilesArgs, GraphFile, Size } from "../../declarations"
import { DefinitionType, TrackType, DataType, LoadType, AVType, GraphType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { Time } from "../../Helpers/Time"
import { urlAbsolute } from "../../Utility/Url"
import { DefinitionBase } from "../../Base/Definition"
import { Definitions } from "../../Definitions/Definitions"
import { VideoClass } from "./VideoInstance"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { Preloader } from "../../Preloader/Preloader"
import { AudibleContextInstance } from "../../Context/AudibleContext"

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

  // private get cachedOrThrow(): LoadVideoResult {
  //   const cached = cacheGet(this.absoluteUrl)
  //   if (!cached) throw Errors.internal

  //   return <LoadVideoResult> cached
  // }

  definitionUrls(start: Time, end?: Time): string[] { return [this.absoluteUrl] }

  file(args: FilesArgs): GraphFile | undefined {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return

    return {
      type: LoadType.Video,
      file:  graphType === GraphType.Canvas ? this.url : this.source,
    }
  }

  files(args: FilesArgs): GraphFile[] {
    const files = super.files(args)
    const file = this.file(args)
    if (file) files.push(file)

    return files
  }

  fps = Default.definition.video.fps

  get inputSource(): string { return this.source }

  get instance(): Video { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object: VideoObject): Video {
    return new VideoClass({ ...this.instanceObject, ...object })
  }

  // private framePromise(time: Time, cached: LoadVideoResult): LoadPromise {
  //   const { video, sequence } = cached
  //   const sourceOrPromise = sequence[time.frame]
  //   if (sourceOrPromise instanceof Promise) return sourceOrPromise

  //   if (sourceOrPromise) return Promise.resolve()

  //   // console.debug(this.constructor.name, "framePromise", time)

  //   const promise = this.seekPromise(time, video).then(() => {
  //     // make sure we don't already have this frame
  //     if (sequence[time.frame] && !(sequence[time.frame] instanceof Promise)) {
  //       // console.debug(this.constructor.name, "framePromise already captured", time.toString())
  //       return
  //     }

  //     const context = ContextFactory.toSize(video)
  //     context.draw(video)
  //     sequence[time.frame] = context.canvas
  //     // console.debug(this.constructor.name, "framePromise capturing", time.toString())
  //   })
  //   sequence[time.frame] = promise
  //   return promise
  // }

  // private needTimes(cached: LoadVideoResult, start: Time, end?: Time): Time[] {
  //   const { sequence } = cached
  //   const times = end ? TimeRange.fromTimes(start, end).times : [start]
  //   return times.filter(time =>
  //     !sequence[time.frame] || sequence[time.frame] instanceof Promise
  //   )
  // }

  // private framesPromise(start: Time, end?: Time): LoadPromise {
  //   const cached = this.cachedOrThrow
  //   const timesNeeded = this.needTimes(cached, start, end)
  //   return this.timesPromise(timesNeeded)
  // }

  // private timesPromise(timesNeeded: Time[]): LoadPromise {
  //   if (!timesNeeded.length) return Promise.resolve()

  //   const cached = this.cachedOrThrow
  //   // const promises:LoadPromise[] = timesNeeded.map(time => this.framePromise(time, cached))


  //   // return Promise.all(promises).then(() => {})
  //   const time = timesNeeded.shift()
  //   if (!time) throw Errors.internal

  //   const first = this.framePromise(time, cached)
  //   let framePromise = first

  //   timesNeeded.forEach(time => {
  //     framePromise = framePromise.then(() => this.framePromise(time, cached))
  //   })
  //   return framePromise
  // }

  // loadDefinition(quantize: number, startTime: Time, endTime?: Time): LoadPromise | void {
  //   const rate = this.fps || quantize
  //   const start = startTime.scale(rate)
  //   const end = endTime ? endTime.scale(rate) : endTime

  //   // console.trace(start)
  //   const url = this.absoluteUrl
  //   if (cacheCached(url)) {
  //     const cached = this.cachedOrThrow
  //     const times = this.needTimes(cached, start, end)
  //     if (!times.length) {
  //       // console.debug(this.constructor.name, "loadDefinition cached and no times needed")
  //       return
  //     }
  //     // console.debug(this.constructor.name, "loadDefinition cached and returning promises", times.join(', '))
  //     return this.timesPromise(times)
  //   }

  //   const promise = this.preloader.loadFile()//: LoadPromise = cacheCaching(url) ? cacheGet(url) : LoaderFactory.video().loadUrl(url)
  //   // if (caching(url)) console.debug(this.constructor.name, "loadDefinition caching and returning framesPromise", start, end)
  //   // else console.debug(this.constructor.name, "loadDefinition uncached and returning framesPromise", start, end)

  //   return promise.then(() => this.framesPromise(start, end))
  // }

  loadedAudible(preloader: Preloader): AudibleSource | undefined {
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

    // console.debug(this.constructor.name, "loadedVisible", time.toString(), startTime.toString())

    const cached: LoadVideoResult | undefined = preloader.getFile({ type: LoadType.Video, file: this.url })
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


  size(preloader: Preloader): Size | undefined {
    const file: GraphFile = {
      file: this.source,
      type: LoadType.Video
    }
    if (!preloader.loadedFile(file)) return { width: 0, height: 0 }

    const visibleSource = preloader.getFile(file)
    if (!visibleSource) throw Errors.internal + 'size'

    const { height, width } = visibleSource
    return { height: Number(height), width: Number(width) }
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
