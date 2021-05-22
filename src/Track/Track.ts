import { Base } from "../Base"
import { TrackType, Errors } from "../Setup"
import { ClipFactory } from "../Factory/ClipFactory"
import { byFrame, Is } from "../Utilities"

class Track extends Base {
  constructor(object, mash) {
    super(object)
    this.mash = mash

    this.object.index ||= 0
    this.object.type ||= TrackType.video
  }

  get clips() {
    if (Is.undefined(this.__clips)) this.__clips = this.initializeClips
    return this.__clips
  }

  get initializeClips() {
    const array = this.object.clips || []
    return array.map(object => {
      const media = this.mash.searchMedia(object.id)
      const clip = ClipFactory.createFromObjectMedia({ track: this.index, ...object }, media)

      return clip
    })
  }

  get frames() {
    if (!this.clips.length) return 0

    const clip = this.clips[this.clips.length - 1]
    return clip.frame + clip.frames
  }

  get index() { return this.object.index }

  get isMainVideo() { return !this.index && this.type === TrackType.video }

  get type() { return this.object.type }

  addClips(clips, insertIndex = 0) {
    let clipIndex = insertIndex || 0
    if (!this.isMainVideo) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips = [] // build array of clips already in this.clips
    // build array of my clips excluding the clips we're inserting
    const spliceClips = this.clips.filter((clip, index) => {
      const moving = clips.includes(clip)
      if (moving) movingClips.push(clip)
      // insert index should be decreased when clip is moving and comes before
      if (origIndex && moving && index < origIndex) clipIndex -= 1
      return !moving
    })
    // insert the clips we're adding at the correct index, then sort properly
    spliceClips.splice(clipIndex, 0, ...clips)
    this.sortClips(spliceClips)

    // set the track of clips we aren't moving
    const newClips = clips.filter(clip => !movingClips.includes(clip))
    newClips.forEach(clip => { clip.set("track", this.index) })

    // remove all my current clips and replace with new ones in one step
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  frameForClipsNearFrame(clips, frame = 0) {
    // TODO: make range that includes all clips

    // find next stretch after frame that fits range

    // const others = this.clips.filter(clip => !clips.includes(clip))

    return frame
  }

  removeClips(clips) {
    const spliceClips = this.clips.filter(clip => !clips.includes(clip))
    if (spliceClips.length === this.clips.length) {
      console.error("removeClips", this.type, this.index, this.clips)
      throw Errors.internal
    }
    clips.forEach(clip => clip.set("track", -1))
    this.sortClips(spliceClips)
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  sortClips(clips) {
    if (this.isMainVideo) {
      let frame = 0
      clips.forEach((clip, i) => {
        const isTransition = clip.type === TrackType.transition
        if (i && isTransition) frame -= clip.frames
        clip.set("frame", frame)
        if (!isTransition) frame += clip.frames
      })
    }
    clips.sort(byFrame)
  }

  toJSON() {
    return { type: this.type, index: this.index, clips: this.clips }
  }
}

export { Track }
