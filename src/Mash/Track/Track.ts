import { JsonObject } from "../../Setup/declarations"
import { TrackType, DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { byFrame, TimeRange } from "../../Utilities"
import { Definitions } from "../Definitions"
import { Clip, ClipObject } from "../Mixin/Clip/Clip"

interface TrackObject {
  clips? : ClipObject[]
  type? : TrackType
  index? : number
}
class TrackClass {
  constructor(object : TrackObject) {
    const { clips, index, type } = object
    if (index) this.index = index
    if (type) this.type = type
    if (clips) this.clips.push(...clips.map(clip => {
      const { id } = clip
      if (!id) throw Errors.id

      const definition = Definitions.fromId(id)
      const clipWithTrack = { track: this.index, ...clip }
      const instance = <Clip> definition.instanceFromObject(clipWithTrack)

      return instance
    }))
  }

  clips : Clip[] = []

  get frames() : number {
    if (!this.clips.length) return 0

    const clip = this.clips[this.clips.length - 1]
    return clip.frame + clip.frames
  }

  index = 0

  get isMainVideo() : boolean { return !this.index && this.type === TrackType.Video }

  type = TrackType.Video

  addClips(clips : Clip[], insertIndex = 0) : void {
    // console.log("addClips", clips.length, insertIndex, this.index)
    let clipIndex = insertIndex || 0
    if (!this.isMainVideo) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips : Clip[] = [] // build array of clips already in this.clips
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
    newClips.forEach(clip => { clip.track = this.index })

    // remove all my current clips and replace with new ones in one step
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  frameForClipsNearFrame(clips : Clip[], frame = 0) : number {
    if (this.isMainVideo) return frame

    const others = this.clips.filter(clip => !clips.includes(clip) && clip.endFrame > frame)
    if (!others.length) return frame

    const startFrame = Math.min(...clips.map(clip => clip.frame))
    const endFrame = Math.max(...clips.map(clip => clip.endFrame))
    const frames = endFrame - startFrame

    let lastFrame = frame
    others.find(clip => {
      if (clip.frame >= lastFrame + frames) return true

      lastFrame = clip.endFrame
    })
    return lastFrame
  }

  removeClips(clips : Clip[]) : void {
    const spliceClips = this.clips.filter(clip => !clips.includes(clip))
    if (spliceClips.length === this.clips.length) {
      // console.trace("removeClips", this.type, this.index, this.clips)
      throw Errors.internal + 'removeClips'
    }
    clips.forEach(clip => { clip.track = -1 })
    this.sortClips(spliceClips)
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  sortClips(clips : Clip[]) : void {
    if (this.isMainVideo) {
      let frame = 0
      clips.forEach((clip, i) => {
        const isTransition = clip.type === DefinitionType.Transition
        if (i && isTransition) frame -= clip.frames
        clip.frame = frame
        if (!isTransition) frame += clip.frames
      })
    }
    clips.sort(byFrame)
  }

  toJSON() : JsonObject {
    return { type: this.type, index: this.index, clips: this.clips }
  }
}

interface Track extends TrackClass {}

export { Track, TrackClass, TrackObject }
