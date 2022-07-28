import { Scalar, UnknownObject } from "../../../declarations"
import { ActionType, SelectType, TrackType } from "../../../Setup/Enums"
import { Errors } from "../../../Setup/Errors"
import { propertyInstance } from "../../../Setup/Property"
import { sortByFrame } from "../../../Utility/Sort"
import { assertClip, Clip, Clips } from "../../../Media/Clip/Clip"
import { PropertiedClass } from "../../../Base/Propertied"
import { Track, TrackArgs } from "./Track"
import { assertPopulatedString, isPositive, isUndefined } from "../../../Utility/Is"
import { TimeRange } from "../../../Helpers/Time/Time"
import { idGenerate } from "../../../Utility/Id"
import { Defined } from "../../../Base/Defined"
import { isUpdatableDurationDefinition } from "../../../Mixin/UpdatableDuration/UpdatableDuration"
import { Default } from "../../../Setup/Default"
import { Mash } from "../Mash"
import { SelectedProperties } from "../../../Utility/SelectedProperty"
import { Actions } from "../../../Editor/Actions/Actions"
import { clipInstance } from "../../../Media/Clip/ClipFactory"

export class TrackClass extends PropertiedClass implements Track {
  constructor(args: TrackArgs) {
    super()

    const { clips, layer, trackType, dense } =  args
    if (layer) this.layer = layer
    if (trackType) this.trackType = trackType


    if (typeof dense === 'undefined') {
      this.dense = !this.layer && this.trackType === TrackType.Video
    } else this.dense = !!dense

    this.properties.push(propertyInstance({ name: "dense", defaultValue: false }))
    this.propertiesInitialize(args)
    
    if (clips) {
      this.clips.push(...clips.map(clip => {
        // const { definitionId } = clip
        // if (!definitionId) throw Errors.id + JSON.stringify(clip)
        // const definition = Defined.fromId(definitionId)
        const instance = clipInstance(clip) //definition.instanceFromObject(clip) as Clip
        instance.track = this
        return instance
      }))
    }
  }

  addClip(clip : Clip, insertIndex = 0) : void {
    let clipIndex = insertIndex || 0
    if (!this.dense) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips : Clips = [] // build array of clips already in this.clips
    // build array of my clips excluding the clips we're inserting
    const spliceClips = this.clips.filter((other, index) => {
      const moving = other === clip
      if (moving) movingClips.push(other)
      // insert index should be decreased when clip is moving and comes before
      if (origIndex && moving && index < origIndex) clipIndex -= 1
      return !moving
    })
    // insert the clips we're adding at the correct index, then sort properly
    spliceClips.splice(clipIndex, 0, clip)
    this.sortClips(spliceClips)

    clip.track = this

    // remove all my current clips and replace with new ones in one step
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }


  assureFrame(clips?: Clips): boolean {
    const clipsArray = clips || this.clips
    let changed = false
    let endFrame = 0
    const ranges: TimeRange[] = []
    const { dense } = this
    clipsArray.forEach(clip => {
      const { frame } = clip
      if (dense ? frame !== endFrame : ranges.some(range => range.includes(frame))) {
        changed = true
        clip.frame = endFrame
      }
      endFrame = clip.frame + clip.frames
      if (!dense) ranges.push(clip.timeRange(1))
    })
    return changed
  }

  assureFrames(quantize: number, clips?: Clips): void {
    const clipsArray = clips || this.clips
    clipsArray.forEach(clip => {
      if (isPositive(clip.frames)) return

      assertClip(clip)
      const { definition } = clip.content
      if (isUpdatableDurationDefinition(definition)) {
        clip.frames = definition.frames(quantize)
      }
      if (isPositive(clip.frames)) return

      clip.frames = Default.frames
    })
  }



  clips: Clips = []

  dense = false

  frameForClipNearFrame(clip : Clip, frame = 0) : number {
    if (this.dense) return frame

    const others = this.clips.filter(other => clip !== other && other.endFrame > frame)
    if (!others.length) return frame

    const startFrame = clip.frame
    const endFrame = clip.endFrame
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
    const { frame, frames } = clip
    if (frames < 1) return -1

    return frame + frames
  }

  private _identifier?: string
  get identifier(): string { return this._identifier ||= idGenerate()}

  layer = 0

  _mash?: Mash 
  get mash(): Mash { return this._mash! }
  set mash(value: Mash) { this._mash = value }
  
  removeClip(clip : Clip) : void {
    const spliceClips = this.clips.filter(other => clip !== other)
    if (spliceClips.length === this.clips.length) {
      // console.trace("removeClip", this.trackType, this.layer, this.clips)
      throw Errors.internal + 'removeClip'
    }
    clip.trackNumber = -1
    this.sortClips(spliceClips)
    this.clips.splice(0, this.clips.length, ...spliceClips)
  }

  
  selectedProperties(actions: Actions): SelectedProperties {
    return this.properties.map(property => ({
      property, selectType: SelectType.Track, 
      changeHandler: (property: string, value: Scalar) => {
        assertPopulatedString(property)
    
        const redoValue = isUndefined(value) ? this.value(property) : value
        const undoValue = this.value(property)
        const options = {
          type: ActionType.Change, target: this, property, redoValue, undoValue
        }
        actions.create(options)
      },
      value: this.value(property.name)
    }))
  }
  sortClips(clips?: Clips): boolean {
    const sortClips = clips || this.clips
    const changed = this.assureFrame(sortClips)
    sortClips.sort(sortByFrame)
    return changed
  }

  toJSON() : UnknownObject {
    return {
      dense: this.dense,
      trackType: this.trackType,
      layer: this.layer,
      clips: this.clips,
    }
  }

  trackType = TrackType.Video


}
