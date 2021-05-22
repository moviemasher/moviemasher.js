import { Base } from "../Base"
import { Cache } from "../Loading"
import { contexts } from "../Base/with/contexts"
import { Default, Errors, ClipType } from "../Setup"
import { Pixel, byTrack, Is, Time } from "../Utilities"
import { TimeFactory } from "../Factory/TimeFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"

const throwUnlessClipsDrawable = (clips) => {
  clips.forEach(clip => { if (!clip.frames) throw Errors.frames })
}

class Composition extends Base {
  constructor(object) {
    // console.log("Composition", object)
    super(object)
    this.object.bufferSeconds ||= Default.buffer
    this.paused = true
    this.playing = false
    this.sourcesByClip = new Map()
    this.__mashSeconds = 0
    this.__contextSeconds = 0
  }

  get audible() { return !this.paused && !!this.audioContext }

  get bufferedTime() { return this.urlsAtTime.loaded }

  get bufferedTimeRange() {
    return this.urlsInTimeRange.loaded
  }

  get bufferSeconds() { return this.object.bufferSeconds }

  set bufferSeconds(value) { this.object.bufferSeconds = value }

  get clipsAtTime() {
    return this.mash.clipsWithin(this.time, this.audible, this.visible)
  }

  get clipsInTimeRange() {
    return this.mash.clipsWithin(this.timeRange, this.audible, this.visible)
  }

  get configured() { return this.time && this.mash && (this.videoContext || this.audioContext) }

  get gain() {
    if (Is.undefined(this.__gain)) this.__gain = this.__gainInitialize
    return this.__gain
  }

  get __gainInitialize() {
    return Is.defined(this.object.gain) ? this.object.gain : Default.volume
  }

  set gain(value) {
    if (this.__gain !== value) {
      this.__gain = value
      if (!this.playing) return

      this.clipsAtTime.forEach(this.adjustSourceGain)
    }
  }

  get mash() { return this.object.mash }

  set mash(value) { this.object.mash = value }

  get quantize() { return this.mash ? this.mash.quantize : 1 }

  get seconds() {
    const ellapsed = this.audioContext.currentTime - this.__contextSeconds
    return ellapsed + this.__mashSeconds
  }

  get time() { return this.__time }

  set time(value) {
    if (!Is.instanceOf(value, Time)) throw Errors.time

    this.__time = value
  }

  get timeRange() {
    const bufferTime = TimeFactory.createFromSeconds(this.bufferSeconds)
    const endTime = this.time.add(bufferTime)
    return TimeRangeFactory.createFromTimes(this.time, endTime)
  }

  get timeRangeAtTime() { return TimeRangeFactory.createFromTime(this.time) }

  get urlsAtTime() {
    return this.urlsInTimeRangeByType(this.timeRangeAtTime)
  }

  get urlsInTimeRange() {
    return this.urlsInTimeRangeByType(this.timeRange)
  }

  get visible() { return !!this.videoContext }

  adjustSourceGain(clip) {
    const source = this.sourcesByClip.get(clip)
    if (Is.undefined(source)) return

    const { gainNode } = source
    if (this.gain === 0.0) {
      gainNode.gain.value = 0.0
      return
    }

    const { gain } = clip
    if (!Is.array(gain)) {
      gainNode.gain.value = gain * this.gain
      return
    }

    // time/gain pairs...
    const times = this.clipTiming(clip)
    const { start, duration } = times
    gainNode.cancelScheduledValues(0)
    const gains = gain.split(',')
    const z = gains.length / 2
    for (let i = 0; i < z; i += 1) {
      const position = gains[i * 2]
      const value = this.gain * gains[i * 2 + 1]
      const seconds = start + position * duration
      gainNode.gain.linearRampToValueAtTime(value, seconds)
    }
  }

  clipsToDraw(throwIfUncached) {
    const clips = this.clipsAtTime
    throwUnlessClipsDrawable(clips)
    const urls = this.urlsInTimeRangeByType(this.timeRangeAtTime)
    if (!urls.loaded) {
      if (!throwIfUncached) return []

      throw Errors.uncached
    }
    return clips
  }

  clipTiming(clip) {
    const result = { offset: 0 }
    const range = clip.timeRange(this.quantize)
    const zero_seconds = this.__contextSeconds - this.__mashSeconds
    result.start = zero_seconds + range.seconds

    result.duration = range.lengthSeconds
    if (clip.trim) {
      range.frame = clip.trim
      result.offset = range.seconds
    }
    const now = this.audioContext.currentTime
    if (now > result.start) {
      const dif = now - result.start
      result.start = now
      result.offset += dif
      result.duration -= dif
    }
    return result
  }

  createSources() {
    const clips = this.clipsInTimeRange
    const filtered = clips.filter(clip => !this.sourcesByClip.has(clip))
    filtered.forEach(clip => {
      const { media } = clip
      const url = media.urlAudible
      if (url && Cache.cached(url)) {
        const times = this.clipTiming(clip)
        const { start, duration, offset } = times
        if (Is.positive(start) && Is.positive(duration) && duration > 0) {
          const gainSource = this.audioContext.createBufferSource()
          gainSource.buffer = Cache.get(url)

          const gainNode = this.audioContext.createGain()
          gainSource.connect(gainNode)
          gainNode.connect(this.audioContext.destination)
          gainSource.start(start, offset, duration)

          this.sourcesByClip.set(clip, { gainSource, gainNode })

          this.adjustSourceGain(clip)

        }
      }
    })
  }

  destroySources(clipsToKeep = []) {
    this.sourcesByClip.forEach((source, clip) => {
      if (clipsToKeep.includes(clip)) return

      const { gainSource, gainNode } = source
      gainNode.disconnect(this.audioContext.destination)
      gainSource.disconnect(gainNode)
      this.sourcesByClip.delete(clip)
    })
  }

  draw() {
    // console.log(this.constructor.name, "draw")
    if (!this.configured) return

    this.drawClips(this.time, this.clipsToDraw(true))
  }

  drawBackground(context) {
    if (!Is.objectStrict(context)) throw Errors.internal

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = Pixel.color(this.mash.backcolor)
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }

  drawClips(time, clips) {
    // console.log(this.constructor.name, "drawClips", time, clips)
    const main = clips.filter(clip => clip.visible && clip.track === 0)
    this.drawBackground(this.videoContext) // fill canvas with mash background color
    if (main.length > 1) {
      const transition = main.find(clip => clip.type === ClipType.transition)
      if (!transition) throw Errors.mainTrackOverlap

      const transitioned = main.filter(clip => clip.type !== ClipType.transition)
      transition.mergeContextAtTime(time, this.videoContext, this.mash.backcolor, transitioned)
    } else {
      const [mainClip] = main
      if (mainClip) mainClip.mergeContextAtTime(time, this.videoContext)
    }
    const tracked = clips.filter(clip => !main.includes(clip)).sort(byTrack)
    tracked.forEach(clip => {
      clip.mergeContextAtTime(time, this.videoContext)
    })
  }

  drawFrame() {
    // console.log(this.constructor.name, "drawFrame")
    if (!this.configured) return

    const clips = this.clipsToDraw()
    if (Is.undefined(clips)) {
      this.loadTimeRange()
      return
    }

    requestAnimationFrame(() => this.drawClips(this.time, clips))
    return true
  }

  loadTimeRange() {
    if (this.audible) {
      this.createSources()
      this.destroySources(this.clipsInTimeRange)
    }
    const urls = this.urlsInTimeRangeByType(this.timeRange)
    return urls.load(this.audioContext)
  }

  urlsInTimeRangeByType(timeRange) {
    return this.mash.urlsWithin(timeRange, this.audible, this.visible)
  }

  loadTime() {
    const urls = this.urlsInTimeRangeByType(this.time)
    return urls.load(this.audioContext)
  }

  startPlaying() {
    console.log(this.constructor.name, "startPlaying")
    if (this.__bufferSource) throw Errors.internal
    if (this.playing) throw Errors.internal
    this.playing = true

    this.__bufferSource = this.audioContext.createBufferSource()
    this.__bufferSource.loop = true
    this.__bufferSource.buffer = this.audioContext.createBuffer(2, 44100, 44100)
    this.__bufferSource.connect(this.audioContext.destination)

    this.__mashSeconds = this.time.seconds
    this.__contextSeconds = this.audioContext.currentTime

    console.log("__mashSeconds", this.__mashSeconds)
    console.log("__contextSeconds", this.__contextSeconds)

    this.createSources()

    this.__bufferSource.start(0)
  }

  stopPlaying() {
    console.log(this.constructor.name, "stopPlaying")

    if (!this.playing) return

    this.playing = false
    if (this.__bufferSource) this.__bufferSource.stop()

    this.destroySources()
    this.__mashSeconds = 0
    this.__contextSeconds = 0

    if (!this.__bufferSource) return

    this.__bufferSource.disconnect(this.audioContext.destination)
    this.__bufferSource = null
  }
}

Object.defineProperties(Composition.prototype, {
  ...contexts,
})

export { Composition }
