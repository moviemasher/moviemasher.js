import { Scalar, UnknownObject } from "../../../declarations"
import { ActionType, Duration, SelectType, Timing } from "../../../Setup/Enums"
import { Errors } from "../../../Setup/Errors"
import { propertyInstance } from "../../../Setup/Property"
import { sortByFrame } from "../../../Utility/Sort"
import { Clip, Clips } from "./Clip/Clip"
import { PropertiedClass } from "../../../Base/Propertied"
import { Track, TrackArgs } from "./Track"
import { assertPopulatedString, assertTrue, isAboveZero, isDefined, isPositive, isUndefined } from "../../../Utility/Is"
import { TimeRange } from "../../../Helpers/Time/Time"
import { idGenerate } from "../../../Utility/Id"
import { isUpdatableDurationDefinition } from "../../../Mixin/UpdatableDuration/UpdatableDuration"
import { Default } from "../../../Setup/Default"
import { assertMash, Mash } from "../Mash"
import { SelectedItems } from "../../../Utility/SelectedProperty"
import { Actions } from "../../../Editor/Actions/Actions"
import { clipInstance } from "../../../Edited/Mash/Track/Clip/ClipFactory"
import { Selectables } from "../../../Editor/Selectable"
import { arrayLast, arraySet } from "../../../Utility/Array"
import { isContainer } from "../../../Container"
import { Tweenable } from "../../../Mixin/Tweenable/Tweenable"

export class TrackClass extends PropertiedClass implements Track {
  constructor(args: TrackArgs) {
    super()

    const { clips, index: layer, dense } =  args
    if (isPositive(layer)) this.index = layer

    this.dense = isDefined(dense) ? !!dense : !this.index  
  
    this.properties.push(propertyInstance({ name: "dense", defaultValue: false }))
    this.propertiesInitialize(args)
    
    if (clips) {
      this.clips.push(...clips.map(clip => {
        const instance = clipInstance(clip) 
        instance.track = this
        return instance
      }))
    }
  }

  addClips(clips : Clips, insertIndex = 0) : void {
    let clipIndex = insertIndex || 0
    if (!this.dense) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips : Clips = [] // build array of clips already in this.clips
    // build array of my clips excluding the clips we're inserting
    const spliceClips = this.clips.filter((other, index) => {
      const moving = clips.includes(other)
      if (moving) movingClips.push(other)
      // insert index should be decreased when clip is moving and comes before
      if (origIndex && moving && index < origIndex) clipIndex -= 1
      return !moving
    })
    // insert the clips we're adding at the correct index, then sort properly
    spliceClips.splice(clipIndex, 0, ...clips)
    this.sortClips(spliceClips)

    
    arraySet(this.clips, spliceClips)
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

  // private assureTarget(clip: Clip): Tweenable | undefined {
  //   const { timing } = clip
  //   switch(timing) {
  //     case Timing.Custom: return
  //     case Timing.Container: return clip.container
  //     case Timing.Content: return clip.content
  //   }
  // }

  assureFrames(quantize: number, clips?: Clips): void {
    const clipsArray = clips || this.clips
    // console.log(this.constructor.name, "assureFrames", clipsArray.length, "clip(s)")
    clipsArray.forEach(clip => {
      const { frames } = clip
      if (isAboveZero(frames)) return
      
      clip.resetDuration(undefined, quantize)
      if (isAboveZero(clip.frames)) return

      clip.frames = Math.floor(Default.duration * quantize)
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
    const { clips } = this
    const { length } = clips
    if (!length) return Duration.None

    for (const clip of clips) {
      const { frames: clipFrames } = clip
      switch(clipFrames) {
        case Duration.Unknown:
        case Duration.Unlimited: return clipFrames
      }
    }
    const clip: Clip = arrayLast(clips)
    const { frame, frames } = clip
    return frame + frames
  }

  private _identifier?: string
  get identifier(): string { return this._identifier ||= idGenerate()}

  index = 0

  _mash?: Mash 
  get mash(): Mash { 
    const { _mash } = this
    assertMash(_mash)
    return _mash
  }
  set mash(value: Mash) { this._mash = value }
  
  removeClips(clips : Clips) : void {
    const newClips = this.clips.filter(other => !clips.includes(other))
    assertTrue(newClips.length !== this.clips.length)
    clips.forEach(clip => clip.trackNumber = -1)
    this.sortClips(newClips)
    arraySet(this.clips, newClips)
  }

  selectType = SelectType.Track
  
  selectables(): Selectables { return [this, ...this.mash.selectables()] }
    
  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => {
      const undoValue = this.value(property.name)
      const target = this
      return {
        value: undoValue,
        property, selectType: SelectType.Track, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options = { target, property, redoValue, undoValue }
          actions.create(options)
        }
      }
    })
  }

  sortClips(clips?: Clips): boolean {
    const sortClips = clips || this.clips
    const changed = this.assureFrame(sortClips)
    sortClips.sort(sortByFrame)
    return changed
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.clips = this.clips
    return json
  }
}
