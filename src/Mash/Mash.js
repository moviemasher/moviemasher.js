import { Base } from "../Base"
import { id } from "../Base/with/id"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { FilterFactory } from "../Factory/FilterFactory"
import { TrackFactory } from "../Factory/TrackFactory"
import { UrlsByType } from "../Loading"
import { TimeFactory } from "../Factory/TimeFactory"
import { Clip } from "../Clip"
import { Is, byFrame } from "../Utilities"
import { Default, Module, Errors } from "../Setup"
import {
  EventType,
  MediaType,
  TrackType,
  TrackTypes
} from "../Setup"

const MashProperty = {
  label: "label",
  backcolor: "backcolor",
}

class Mash extends Base {
  static get properties() { return Object.values(MashProperty) }

  get audio() { return this.__audio ||= this.initializeAudio }

  get backcolor() {
    return this.__backcolor ||= this.object.backcolor || Default.mash.backcolor
  }
  set backcolor(value) { this.__backcolor = value }

  get clips() { return this.tracks.map(track => track.clips).flat() }

  get clipsAudible() { return this.clips.filter(clip => clip.audible) }

  get clipsAudio() { return this.audio.map(track => track.clips).flat() }

  get clipsVideo() { return this.video.flatMap(track => track.clips) }

  get events() { return this.__events ||= this.object.events }
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

  get initialMedia() { return this.__initialMedia ||= this.initializeMedia }

  get label() { return this.__label ||= this.object.label || Default.mash.label }
  set label(value) { this.__label = value }

  get media() {
    return [...new Set(this.clips.flatMap(clip => this.mediaForClip(clip)))]
  }

  get propertyValues() {
    return Object.fromEntries(Mash.properties.map(key => [key, this[key]]))
  }

  get quantize() { return this.__quantize ||= this.object.quantize || Default.mash.quantize }

  /** combined audio and video tracks */
  get tracks() { return TrackTypes.map(av => this[av]).flat() }

  get type() { return "mash" }

  get video() { return this.__video ||= this.initializeVideo }

  addClipsToTrack(clips, trackIndex = 0, insertIndex = 0) {
    trackIndex ||= 0
    insertIndex ||= 0
    const [clip] = clips
    // console.log("addClipsToTrack trackIndex", trackIndex, "insertIndex:", insertIndex)
    const newTrack = this.clipTrackAtIndex(clip, trackIndex)
    const oldTrack = this.clipTrack(clip)

    this.emitIfFramesChange(() => {
      if (oldTrack && oldTrack !== newTrack) {
        // console.log("addClipsToTrack", newTrack.index, oldTrack.index)
        oldTrack.removeClips(clips)
      }
      newTrack.addClips(clips, insertIndex)
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
    let limited_value = Math.max(1, value) // frames value must be > 0

    if (TrackTypes.includes(clip.type)) {
      const max = Math.floor(clip.media.duration * this.quantize) - clip.trim
      limited_value = Math.min(max, limited_value)
    }
    const track = this.clipTrack(clip)
    this.emitIfFramesChange((changeClipFrames) => {
      clip.frames = limited_value
      track.sortClips()
    })
  }

  changeClipTrim(clip, value, frames) {
    let limited_value = Math.max(0, value)

    if (TrackTypes.includes(clip.type)) { // trim not remove last frame
      const max = Math.floor(clip.media.duration * this.quantize) - 1
      limited_value = Math.min(max, limited_value)
    }
    const new_frames = frames - limited_value
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.trim = limited_value
      clip.frames = new_frames
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
    return this.clips.filter(clip =>
      clip.audible && this.clipIntersects(clip, range)
    )
  }

  clipsVisibleAtTime(time) { return this.clipsWithin(time, false) }

  clipsVisibleInTimeRange(timeRange) {
    const range = timeRange.scale(this.quantize)
    return this.clipsVideo.filter(clip => this.clipIntersects(clip, range))
  }

  clipsWithin(time, includeAudible = true, includeVisible = true) {
    const range = TimeRangeFactory.create(time)
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

  emitIfFramesChange(method) {
    const frames = this.events ? this.frames : null
    // console.log(this.constructor.name, "emitIfFramesChange", frames)
    method()
    if (this.events && frames !== this.frames) this.emitDuration()
    // else console.log(this.constructor.name, "emitIfFramesChange", !!this.events, frames, this.frames)
  }

  findInitialMedia(mediaId) {
    return this.initialMedia.find(media => media.id === mediaId)
  }

  findClipMedia(mediaId) {
    return this.media.find(media => media.id === mediaId)
  }

  findMedia(mediaId) {
    if (!(Is.string(mediaId) && mediaId.length)) return
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
    const trackClips = clips.filter(clip =>
      clip.track === track && clip.trackType === trackType
    ).sort(byFrame)

    if (track || trackType === TrackType.audio) return trackClips

    // selected clips on main track must be abutting each other
    let abutting = true
    return trackClips.filter((clip, index) => {
      if (!abutting) return

      if (index === trackClips.length - 1) return true

      abutting = clip.frame + clip.frames === trackClips[index + 1].frame
      if (!abutting) console.log(this.constructor.name, "filterClipSelection", clip.frame + clip.frames, "!==", trackClips[index + 1].frame)
      return true
    })
  }
  mediaForClip(clip) {
    const medias = []
    const media = clip.media
    if (!Is.object(media)) throw "CLIP HAS NO MEDIA " + clip
    medias.push(media)
    if (clip.scaler) medias.push(clip.scaler.media)
    if (clip.merger) medias.push(clip.merger.media)

    if (media.modular) {
      const properties_by_type = media.modularPropertiesByType
      Object.keys(properties_by_type).forEach(type => {
        const modular_properties = properties_by_type[type]
        modular_properties.forEach(key => {
          const found = this.searchMedia(clip[key], type)
          if (found) medias.push(found)
        })
      })
    }
    switch(media.type){
      case MediaType.transition: {
        medias.push(...this.mediaForClipTransform(clip.to))
        medias.push(...this.mediaForClipTransform(clip.from))
        break
      }
      case MediaType.effect:
      case MediaType.audio: break
      default: {
        medias.push(...this.mediaForClipTransform(clip))
        const effects = clip.effects
        if (!effects) break
        effects.forEach(effect => {
          medias.push(...this.mediaForClip(effect))
        })
      }
    }
    return medias
  }

  mediaForClipTransform(object){
    const medias = []
    if (Is.object(object)) {
      [MediaType.merger, MediaType.scaler].forEach(key => {
        const merger_or_scaler = object[key]
        if (Is.object(merger_or_scaler)) {
          const found = this.searchMedia(merger_or_scaler.id, key)
          if (found) medias.push(found)
        }
      })
    }
    return medias
  }

  mediaReferences() {
    const references = {}
    this.clips.forEach(clip => {
      this.mediaForClip(clip).forEach(media => {
        references[media.id] ||= 0
        references[media.id]++
      })
    })
    return references
  }

  removeClipsFromTrack(clips) {
    const [clip] = clips
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => track.removeClips(clips))
  }

  removeTrack(trackType) {
    const array = this[trackType]
    this.emitIfFramesChange(() => array.pop())
  }

  searchMedia(mediaId, moduleType) {
    const found = this.findInitialMedia(mediaId)
    if (found) return found

    switch (moduleType) {
      case MediaType.filter:
        return FilterFactory.created(mediaId) ? FilterFactory.create(mediaId) : Module.defaultOfType(moduleType)
    }
    const module = Module.defaultOfType(moduleType)
    if (module) return module

    return this.findClipMedia(mediaId)
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

  trackOfTypeAtIndex(trackType, index = 0) {
    if (index < 0) return
    // console.log(this.constructor.name, "trackOfTypeAtIndex", trackType, index)
    if (Is.not(trackType)) throw Errors.type

    return this[trackType][index]
  }

  urlsAudibleInTimeRangeForClipsByType(timeRange, clips) {
    const range = timeRange.scale(this.quantize)
    const urls = new UrlsByType
    clips.forEach(clip => urls.concat(clip.urlsAudibleInTimeRangeByType(range)))
    return urls
  }

  urlsForClipsWithin(clips, time, includeAudible = true, includeVisible = true) {
    const range = TimeRangeFactory.create(time)
    const urls = new UrlsByType

    if (!includeAudible) urls.concat(this.urlsVisibleInTimeRangeForClipsByType(range, clips))
    if (!includeVisible) urls.concat(this.urlsAudibleInTimeRangeForClipsByType(range, clips))

    return urls
  }

  urlsVisibleInTimeRangeForClipsByType(timeRange, clips) {
    const range = timeRange.scale(this.quantize)
    const urls = new UrlsByType
    clips.forEach(clip => urls.concat(clip.urlsVisibleInTimeRangeByType(range)))
    return urls
  }

  urlsWithin(time, includeAudible = true, includeVisible = true) {
    const clips = this.clipsWithin(time, includeAudible, includeVisible)
    return this.urlsForClipsWithin(clips, time, includeAudible, includeVisible)
  }
}

Object.defineProperties(Mash.prototype, {
  ...id,
})

export { Mash }
