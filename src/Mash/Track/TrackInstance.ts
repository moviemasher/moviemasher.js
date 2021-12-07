import { Any, JsonObject } from "../../declarations"
import { DataType, DefinitionType, TrackType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { PropertiedClass, Property } from "../../Setup/Property"
import { idGenerate } from "../../Utilities/Id"

import { sortByFrame } from "../../Utilities/Sort"
import { Definitions } from "../../Definitions/Definitions"
import { Clip } from "../../Mixin/Clip/Clip"
import { TrackObject } from "./Track"

class TrackClass extends PropertiedClass {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { id, clips, layer, trackType, dense } = <TrackObject> object
    if (id) this._id = id
    if (layer) this.layer = layer
    if (trackType) this.trackType = trackType
    if (clips) this.clips.push(...clips.map(clip => {
      const { definitionId } = clip
      if (!definitionId) throw Errors.id + JSON.stringify(clip)

      const definition = Definitions.fromId(definitionId)
      const clipWithTrack = { track: this.layer, ...clip }
      return <Clip> definition.instanceFromObject(clipWithTrack)
    }))

    if (typeof dense === 'undefined') {
      this.dense = !this.layer && this.trackType === TrackType.Video
      // console.log(this.constructor.name, "dense", this.dense, "=", !this.layer, "&&", this.trackType === TrackType.Video)
    } else {
      this.dense = !!dense
      // console.log(this.constructor.name, "dense", this.dense, "=", dense)
    }

    this.properties.push(
      new Property({ name: "dense", type: DataType.Boolean, value: false })
    )
  }

  addClips(clips : Clip[], insertIndex = 0) : void {
    // console.log("addClips", clips.length, insertIndex, this.layer)
    let clipIndex = insertIndex || 0
    if (!this.dense) clipIndex = 0 // ordered by clip.frame values

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
    newClips.forEach(clip => {
      // console.log(this.constructor.name, "addClips", this.layer)
      clip.track = this.layer
    })

    // remove all my current clips and replace with new ones in one step
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  clips: Clip[] = []

  dense = false

  frameForClipsNearFrame(clips : Clip[], frame = 0) : number {
    if (this.dense) return frame

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

  get frames() : number {
    if (!this.clips.length) return 0

    const clip = this.clips[this.clips.length - 1]
    return clip.frame + clip.frames
  }

  private _id? : string

  get id() : string { return this._id ||= idGenerate() }

  layer = 0

  removeClips(clips : Clip[]) : void {
    const spliceClips = this.clips.filter(clip => !clips.includes(clip))
    if (spliceClips.length === this.clips.length) {
      // console.trace("removeClips", this.trackType, this.layer, this.clips)
      throw Errors.internal + 'removeClips'
    }
    clips.forEach(clip => { clip.track = -1 })
    this.sortClips(spliceClips)
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  sortClips(clips : Clip[]) : void {
    if (this.dense) {
      let frame = 0
      clips.forEach((clip, i) => {
        const isTransition = clip.type === DefinitionType.Transition
        if (i && isTransition) frame -= clip.frames
        clip.frame = frame
        if (!isTransition) frame += clip.frames
      })
    }
    clips.sort(sortByFrame)
  }

  toJSON() : JsonObject {
    return {
      id: this.id,
      dense: this.dense,
      trackType: this.trackType,
      layer: this.layer,
      clips: this.clips,
    }
  }

  trackType = TrackType.Video
}

export { TrackClass }
