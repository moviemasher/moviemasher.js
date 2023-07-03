import type { Clip, Clips, MashAsset, TimeRange, Track, TrackArgs, UnknownRecord } from '@moviemasher/runtime-shared'
import { isDefined } from '@moviemasher/runtime-shared'
import { PropertiedClass } from "../../../Base/PropertiedClass.js"
import { Default } from '../../../Setup/Default.js'
import { DurationNone, DurationUnknown, DurationUnlimited } from '../../../Setup/DurationConstants.js'
import { propertyInstance } from "../../../Setup/PropertyFunctions.js"
import { arrayLast } from '../../../Utility/ArrayFunctions.js'
import { idGenerate } from '../../../Utility/IdFunctions.js'
import { sortByFrame } from '../../../Utility/SortFunctions.js'
import { isAboveZero, isPositive } from '../../SharedGuards.js'

export class TrackClass extends PropertiedClass implements Track {
  constructor(args: TrackArgs) {
    super(args)

    const { clips, index, dense, mashAsset } =  args
    this.mash = mashAsset

    if (isPositive(index)) this.index = index

    this.dense = isDefined(dense) ? !!dense : !this.index  

    this.properties.push(propertyInstance({ name: 'dense', defaultValue: false }))
    this.propertiesInitialize(args)
    
    if (clips) {
      this.clips.push(...clips.map(clip => {
        const instance = this.mash.clipInstance(clip) 
        instance.track = this
        return instance
      }))
    }
  }

  private assureFrame(clips?: Clips): boolean {
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
      if (!dense) ranges.push(clip.timeRange)
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

  mash: MashAsset 
  
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
