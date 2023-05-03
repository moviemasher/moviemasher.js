import {Scalar, UnknownRecord} from '../../../Types/Core.js'
import {ActionTypeChange, DurationNone, DurationUnknown, DurationUnlimited, TypeTrack} from '../../../Setup/Enums.js'
import {propertyInstance} from '../../../Setup/Property.js'
import {sortByFrame} from '../../../Utility/Sort.js'
import {Clip, ClipArgs, Clips} from './Clip/Clip.js'
import {PropertiedClass} from '../../../Base/Propertied.js'
import {Track, TrackArgs} from './Track.js'
import {assertPopulatedString, assertTrue, isAboveZero, isDefined, isPositive} from '../../../Utility/Is.js'
import {TimeRange} from '../../../Helpers/Time/Time.js'
import {idGenerate} from '../../../Utility/Id.js'
import {Default} from '../../../Setup/Default.js'
import {assertMashMedia, MashMedia} from '../Mash.js'
import {SelectedItems} from '../../../Helpers/Select/SelectedProperty.js'
import {Actions} from '../../../Plugin/Masher/Actions/Actions.js'
import {clipInstance} from './Clip/ClipFactory.js'
import {Selectables} from '../../../Plugin/Masher/Selectable.js'
import {arrayLast, arraySet} from '../../../Utility/Array.js'
import { ChangePropertyActionObject } from "../../../Plugin/Masher/Actions/Action/Action.js"

export class TrackClass extends PropertiedClass implements Track {
  constructor(args: TrackArgs) {
    super()

    const { clips, index: layer, dense, mashMedia } =  args
    this.mash = mashMedia

    if (isPositive(layer)) this.index = layer

    this.dense = isDefined(dense) ? !!dense : !this.index  
  
    this.properties.push(propertyInstance({ name: 'dense', defaultValue: false }))
    this.propertiesInitialize(args)
    
    if (clips) {
      this.clips.push(...clips.map(clip => {
        const args: ClipArgs = {
          ...clip, track: this,
        }
        const instance = clipInstance(args) 
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

  assureFrames(quantize: number, clips?: Clips): void {
    const suppliedClips = isDefined(clips)
    const clipsArray = clips || this.clips
    // console.log(this.constructor.name, 'assureFrames', clipsArray.length, 'clip(s)')
    clipsArray.forEach(clip => {
      const { frames } = clip
      if (isAboveZero(frames)) return
      
      clip.resetTiming(undefined, quantize)
      if (isAboveZero(clip.frames) || !suppliedClips) return

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
    if (!length) return DurationNone

    for (const clip of clips) {
      const { frames: clipFrames } = clip
      switch(clipFrames) {
        case DurationUnknown:
        case DurationUnlimited: return clipFrames
      }
    }
    const clip: Clip = arrayLast(clips)
    const { frame, frames } = clip
    return frame + frames
  }

  private _identifier?: string
  get identifier(): string { return this._identifier ||= idGenerate('track')}

  index = 0

  _mash?: MashMedia 
  get mash(): MashMedia { 
    const { _mash } = this
    assertMashMedia(_mash)
    return _mash
  }
  set mash(value: MashMedia) { this._mash = value }
  
  removeClips(clips : Clips) : void {
    const newClips = this.clips.filter(other => !clips.includes(other))
    assertTrue(newClips.length !== this.clips.length)
    clips.forEach(clip => clip.trackNumber = -1)
    this.sortClips(newClips)
    arraySet(this.clips, newClips)
  }

  selectType = TypeTrack
  
  selectables(): Selectables { return [this, ...this.mash.selectables()] }
    
  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => {
      const undoValue = this.value(property.name)
      return {
        value: undoValue,
        property, selectType: TypeTrack, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options: ChangePropertyActionObject = { 
            type: ActionTypeChange,
            target: this, property, redoValue, undoValue,
            redoSelection: { ...actions.selection },
            undoSelection: { ...actions.selection },
          }
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

  toJSON(): UnknownRecord {
    const json = super.toJSON()
    json.clips = this.clips
    return json
  }
}
