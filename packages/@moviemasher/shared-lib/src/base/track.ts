import type { Clip, Clips, MashAsset, TimeRange, Track, TrackArgs, TrackIndex, TrackObject, UnknownRecord } from '../types.js'

import { ASSET_DURATION, $BOOLEAN, DURATION_NONE, DURATION_UNKNOWN, DURATION_UNLIMITED, $MASH, sortByFrame } from '../runtime.js'
import { isDefined } from '../utility/guard.js'
import { arrayLast } from '../runtime.js'
import { isAboveZero, isPositive } from '../utility/guard.js'
import { idGenerate } from '../runtime.js'
import { PropertiedClass } from './propertied.js'

export class TrackClass extends PropertiedClass implements Track {
  constructor(args: TrackArgs) {
    super(args)
    this.initializeProperties(args)
  }

  private assureFrame(clips?: Clips) {
    const clipsArray = clips || this.clips
    let endFrame = 0
    const ranges: TimeRange[] = []
    const { dense } = this
    clipsArray.forEach(clip => {
      const { frame } = clip
      if (dense ? frame !== endFrame : ranges.some(range => range.includes(frame))) {
        clip.frame = endFrame
      }
      endFrame = clip.frame + clip.frames      
      if (!dense) ranges.push(clip.timeRange)
    })
  }

  assureFrames(quantize: number, clips?: Clips): void {
    const suppliedClips = isDefined(clips)
    const clipsArray = clips || this.clips
    // console.log(this.constructor.name, 'assureFrames', clipsArray.length, 'clip(s)')
    clipsArray.forEach(clip => {
      const { frames } = clip
      if (isAboveZero(frames)) return
      
      // console.log(this.constructor.name, 'assureFrames', 'resetting clip', {quantize})
      clip.resetTiming(undefined, quantize)
      if (isAboveZero(clip.frames) || !suppliedClips) return

      clip.frames = Math.floor(ASSET_DURATION * quantize)
    })
  }

  clips: Clips = []

  dense = false

  get frames(): number {
    const { clips } = this
    const { length } = clips
    if (!length) return DURATION_NONE

    for (const clip of clips) {
      const { frames: clipFrames } = clip
      switch(clipFrames) {
        case DURATION_UNKNOWN:
        case DURATION_UNLIMITED: return clipFrames
      }
    }
    const clip: Clip = arrayLast(clips)
    const { frame, frames } = clip
    return frame + frames
  }

  private _identifier?: string
  get identifier(): string { return this._identifier ||= idGenerate('track')}

  index = 0

  override initializeProperties(args: TrackArgs): void {
    const { clips, index, dense, mashAsset } =  args
    this.mash = mashAsset

    if (isPositive(index)) this.index = index

    this.dense = isDefined(dense) ? !!dense : !this.index  

    this.properties.push(this.propertyInstance({ 
      targetId: $MASH, name: 'dense', type: $BOOLEAN, 
    }))
    this.propertiesInitialize(args)
    
    if (clips) {
      this.clips.push(...clips.map(clip => {
        const instance = this.mash.clipInstance(clip) 
        instance.track = this
        return instance
      }))
    }

    super.initializeProperties(args)
  }

  declare mash: MashAsset 
  
  sortClips(clips?: Clips): void {
    const sortClips = clips || this.clips
    this.assureFrame(sortClips)
    sortClips.sort(sortByFrame)
  }

  toJSON(): UnknownRecord {
    const json = super.toJSON()
    json.clips = this.clips
    return json
  }

  get trackIndex(): TrackIndex {
    const { mash, index } = this
    const [mashIndex] = mash.mashIndex
    return [mashIndex, index]
  }

  get trackObject(): TrackObject {
    const { clips: clipInstances, index, scalarRecord } = this
    const clips = clipInstances.map(clip => clip.clipObject)
    const trackObject: TrackObject = { ...scalarRecord, clips, index }
    return trackObject
  }
}
