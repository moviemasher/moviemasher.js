import { Base } from "../Base"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { Track } from "../Track"
import { Media } from "../Media"
import { Events } from "../Events"
import { TrackFactory } from "../Factory/TrackFactory"
import { UrlsByType } from "../Loading"
import { TimeFactory } from "../Factory/TimeFactory"
import { Clip } from "../Clip"
import { Is, byFrame, Time } from "../Utilities"
import {
  Default,
  Module,
  Errors,
  EventType,
  TrackType,
  TrackTypes,
  ModuleTypes
} from "../Setup"

const MashProperty = {
  label: "label",
  backcolor: "backcolor",
}

function Idable(target) {
  Object.defineProperties(target.prototype, {
    id: {
      get() {
        if (Is.undefined(this.__id)) this.__id = this.initializeId
        return this.__id
      }
    },
    initializeId: { get() { return this.object.id } },
  })
  return target
}

@Idable
class Mash extends Base {
  id : string

   __label : string

  __audio : Array<Track>

  __video : Array<Track>

  __backcolor : string

  __events? : Events

  __initialMedia : Array<Media>

  __quantize : number

  object : {
    backcolor? : string
    events? : Events
    audio? : Array<Track>
    video? : Array<Track>
    media? : Array<Media>
    label? : string
    quantize? : number
  }

  get audio() {
    if (Is.undefined(this.__audio)) this.__audio = this.initializeAudio
    return this.__audio
  }

  get backcolor() {
    if (Is.undefined(this.__backcolor)) {
      this.__backcolor = this.object.backcolor || Default.mash.backcolor
    }
    return this.__backcolor
  }

  set backcolor(value) { this.__backcolor = value }

  get clips() { return this.tracks.map(track => track.clips).flat() }

  get clipsAudible() { return this.clips.filter(clip => clip.audible) }

  get clipsAudio() { return this.audio.map(track => track.clips).flat() }

  get clipsVideo() { return this.video.flatMap(track => track.clips) }

  get events() {
    if (Is.undefined(this.__events)) this.__events = this.object.events || null
    return this.__events
  }

  set events(value) { this.__events = value }

  /** mash duration in frames */
  get frames() {
    return Math.max(0, ...this.tracks.map(track => track.frames))
  }

  get initializeAudio() {
    const array = this.object.audio || [{ type: TrackType.audio }]
    return array.map(track => TrackFactory.create(track, this))
  }

  get initializeMedia() {
    const array = this.object.media || []
    return array.map(media => MediaFactory.create(media))
  }

  get initializeVideo() {
    const array = this.object.video || [{ type: TrackType.video }]
    return array.map(track => TrackFactory.create(track, this))
  }

  get initialMedia() {
    if (Is.undefined(this.__initialMedia)) {
      this.__initialMedia = this.initializeMedia
    }
    return this.__initialMedia
  }

  get label() {
    if (Is.undefined(this.__label)) {
      this.__label = this.object.label || Default.mash.label
    }
    return this.__label
  }

  set label(value) { this.__label = value }

  get media() {
    // this.mediaForClipOrEffect(clip)
    return [...new Set(this.clips.flatMap(clip => clip.mediaUtilized))]
  }

  get propertyValues() {
    return Object.fromEntries(Mash.properties.map(key => [key, this[key]]))
  }

  get quantize() {
    if (Is.undefined(this.__quantize)) {
      this.__quantize = this.object.quantize || Default.mash.quantize
    }
    return this.__quantize
  }

  /** combined audio and video tracks */
  get tracks() { return TrackTypes.map(av => this[av]).flat() }

  get type() { return "mash" }

  get video() {
    if (Is.undefined(this.__video)) this.__video = this.initializeVideo
    return this.__video
  }

  addClipsToTrack(clips, trackIndex = 0, insertIndex = 0) {
    // console.log(this.constructor.name, "addClipsToTrack", trackIndex)
    const [clip] = clips
    const newTrack = this.clipTrackAtIndex(clip, trackIndex)
    const oldTrack = Is.positive(clip.track) && this.clipTrack(clip)

    this.emitIfFramesChange(() => {
      if (oldTrack && oldTrack !== newTrack) {
        // console.log("addClipsToTrack", newTrack.index, oldTrack.index)
        oldTrack.removeClips(clips)
      }
      newTrack.addClips(clips, insertIndex || 0)
    })
  }

  addTrack(trackType) {
    const array = this[trackType]
    const options = { type: trackType, index: array.length }
    const track = TrackFactory.create(options, this)
    array.push(track)
    return track
  }

  changeClipFrames(clip, value) {
    let limitedValue = Math.max(1, value) // frames value must be > 0

    if (TrackTypes.includes(clip.type)) {
      const max = Math.floor(clip.media.duration * this.quantize) - clip.trim
      limitedValue = Math.min(max, limitedValue)
    }
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.set("frames", limitedValue)
      track.sortClips()
    })
  }

  changeClipTrim(clip, value, frames) {
    let limitedValue = Math.max(0, value)

    if (TrackTypes.includes(clip.type)) { // trim not remove last frame
      const max = Math.floor(clip.media.duration * this.quantize) - 1
      limitedValue = Math.min(max, limitedValue)
    }
    const newFrames = frames - limitedValue
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.set("trim", limitedValue)
      clip.set("frames", newFrames)
      track.sortClips()
    })
  }

  clipIntersects(clip, range) {
    return clip.timeRange(this.quantize).intersects(range)
  }

  clipTrack(clip) {
    return this.clipTrackAtIndex(clip, clip.track)
  }

  clipTrackAtIndex(clip, index = 0) {
    return this.trackOfTypeAtIndex(clip.trackType, index)
  }

  clipsAudibleAtTime(time) { return this.clipsWithin(time, true, false) }

  clipsAudibleInTimeRange(timeRange) {
    const range = timeRange.scale(this.quantize)
    return this.clips.filter(clip => (
      clip.audible && this.clipIntersects(clip, range)
    ))
  }

  clipsVisibleAtTime(time) { return this.clipsWithin(time, false) }

  clipsVisibleInTimeRange(timeRange) {
    const range = timeRange.scale(this.quantize)
    return this.clipsVideo.filter(clip => this.clipIntersects(clip, range))
  }

  clipsWithin(time : Time, includeAudible = true, includeVisible = true) {
    const range = TimeRangeFactory.createFromTime(time)
    if (!includeAudible) return this.clipsVisibleInTimeRange(range)
    if (!includeVisible) return this.clipsAudibleInTimeRange(range)

    return this.clips.filter(clip => this.clipIntersects(clip, range))
  }

  emitDuration() {
    const info = {
      value: TimeFactory.createFromFrame(this.frames, this.quantize).seconds
    }
    // console.log(this.constructor.name, "emitDuration", info)
    this.events.emit(EventType.duration, info)
  }

  emitIfFramesChange(method : Function) {
    const frames = this.events ? this.frames : null
    method()
    if (this.events && frames !== this.frames) this.emitDuration()
  }

  findInitialMedia(mediaId : string) : Media | boolean {
    const media = this.initialMedia.find(object => object.id === mediaId)
    if (!media) return false

    return media
  }

  findClipMedia(mediaId : string) : Media | boolean {
    return this.media.find((media : Media) => media.id === mediaId)
  }

  findMedia(mediaId : string) : Media | boolean {
    if (!(Is.string(mediaId) && mediaId.length)) return false
    const found = this.findInitialMedia(mediaId)
    if (found) return found

    return this.findClipMedia(mediaId)
  }

  filterClipSelection(value) {
    const array = Is.array(value) ? value : [value]
    const clips = array.filter(clip => Is.instanceOf(clip, Clip))
    const [firstClip] = clips
    // console.log("filterClipSelection", clips)
    if (!firstClip) return []

    const { trackType, track } = firstClip

    // selected clips must all be on same track
    const trackClips = clips.filter(clip => (
      clip.track === track && clip.trackType === trackType
    )).sort(byFrame)

    if (track || trackType === TrackType.audio) return trackClips

    // selected clips on main track must be abutting each other
    let abutting = true
    return trackClips.filter((clip : Clip, index : number) => {
      if (!abutting) return false

      if (index === trackClips.length - 1) return true

      abutting = clip.frame + clip.frames === trackClips[index + 1].frame
      return true
    })
  }

  // mediaForClipOrEffect(clip : Clip | Effect) {
  //   const medias = []
  //   const { media } = clip
  //   if (!Is.object(media)) throw Errors.internal

  //   medias.push(media)
  //   if (clip.scaler) medias.push(clip.scaler.media)
  //   if (clip.merger) medias.push(clip.merger.media)

  //   if (media.modular) {
  //     const propertiesByType = media.modularPropertiesByType
  //     Object.keys(propertiesByType).forEach(type => {
  //       const modularProperties = propertiesByType[type]
  //       modularProperties.forEach(key => {
  //         const found = this.searchMedia(clip[key], type)
  //         if (found) medias.push(found)
  //       })
  //     })
  //   }
  //   switch (media.type) {
  //     case MediaType.transition: {
  //       medias.push(...this.mediaForClipTransforms(clip.to))
  //       medias.push(...this.mediaForClipTransforms(clip.from))
  //       break
  //     }
  //     case MediaType.effect:
  //     case MediaType.audio: break
  //     default: {
  //       medias.push(...this.mediaForClipTransforms(clip))
  //       const { effects } = clip
  //       if (!effects) break
  //       effects.forEach(effect => {
  //         medias.push(...this.mediaForClipOrEffect(effect))
  //       })
  //     }
  //   }
  //   return medias
  // }

  // mediaForClipTransforms(clip : Clip) {
  //   const medias = []
  //   if (Is.object(clip)) {
  //     [MediaType.merger, MediaType.scaler].forEach(key => {
  //       const mergerOrScaler = clip[key]
  //       if (Is.object(mergerOrScaler)) {
  //         const found = this.searchMedia(mergerOrScaler.id, key)
  //         if (found) medias.push(found)
  //       }
  //     })
  //   }
  //   return medias
  // }

  removeClipsFromTrack(clips : Clip[]) {
    const [clip] = clips
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => track.removeClips(clips))
  }

  removeTrack(trackType : string) {
    const array = this[trackType]
    this.emitIfFramesChange(() => array.pop())
  }

  // find media for clips, effects, mergers, scalers or fonts)
  searchMedia(id : string, type : string) : Media | boolean {
    const found = this.findInitialMedia(id)
    if (found) return found

    if (ModuleTypes.includes(type)) return <Media><unknown>Module.ofType(id, type)

    return this.findClipMedia(id)
  }

  toJSON() {
    return {
      label: this.label,
      quantize: this.quantize,
      backcolor: this.backcolor,
      id: this.id,
      media: this.media,
      audio: this.audio,
      video: this.video,
    }
  }

  trackOfTypeAtIndex(type : string, index = 0) {
    if (!Is.positive(index)) {
      console.error(Errors.invalid.track, index, index?.constructor.name)
      throw Errors.invalid.track
    }
    if (!TrackTypes.includes(type)) throw Errors.invalid.trackType

    return this[type][index]
  }

  urlsAudibleInTimeRangeForClipsByType(timeRange, clips) {
    const range = timeRange.scale(this.quantize)
    const urls = new UrlsByType()
    clips.forEach(clip => urls.concat(clip.urlsAudibleInTimeRangeByType(range)))
    return urls
  }

  urlsForClipsWithin(clips, time, includeAudible = true, includeVisible = true) {
    const range = TimeRangeFactory.createFromTime(time)
    const urls = new UrlsByType()

    if (!includeAudible) urls.concat(this.urlsVisibleInTimeRangeForClipsByType(range, clips))
    if (!includeVisible) urls.concat(this.urlsAudibleInTimeRangeForClipsByType(range, clips))

    return urls
  }

  urlsVisibleInTimeRangeForClipsByType(timeRange, clips) {
    const range = timeRange.scale(this.quantize)
    const urls = new UrlsByType()
    clips.forEach(clip => urls.concat(clip.urlsVisibleInTimeRangeByType(range)))
    return urls
  }

  urlsWithin(time, includeAudible = true, includeVisible = true) {
    const clips = this.clipsWithin(time, includeAudible, includeVisible)
    return this.urlsForClipsWithin(clips, time, includeAudible, includeVisible)
  }

  static get properties() { return Object.values(MashProperty) }
}

export { Mash }
