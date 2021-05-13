import { Base } from "../Base";
import { TrackType } from "../Types";
import { ClipFactory } from "../Factory/ClipFactory";
import { Sort } from "../Sort";
import { Errors } from "../Errors";

class Track extends Base {
    constructor(object, mash) {
      super(object)
      this.mash = mash
      
      this.object.index ||= 0
      this.object.type ||= TrackType.video
    }

    get clips() { return this.__clips ||= this.initializeClips }
    get initializeClips() { 
      const array = this.object.clips || []
      return array.map(object => {
        const media = this.mash.searchMedia(object.id)
        const clip = ClipFactory.create({ track: this.index, ...object }, media)
        
        return clip
      })
    }

    get frames() { 
      if (!this.clips.length) return 0

      const clip = this.clips[this.clips.length - 1]
      return clip.frame + clip.frames
    }

    get index() { return this.object.index }

    get isMainVideo() { return !this.index && this.type == TrackType.video }

    get type() { return this.object.type }
    
    addClips(clips, insertIndex = 0) {
      insertIndex ||= 0
      if (!this.isMainVideo) insertIndex = 0 // ordered by clip.frame values 

      const clipIndex = insertIndex // note original, since it may decrease...
      const movingClips = [] // build array of clips already in this.clips
      // build array of my clips excluding the clips we're inserting
      const spliceClips = this.clips.filter((clip, index) => {
        const moving = clips.includes(clip)
        if (moving) movingClips.push(clip)
        // insert index should be decreased when clip is moving and comes before
        if (clipIndex && moving && index < clipIndex) insertIndex--
        return !moving
      })
      // insert the clips we're adding at the correct index, then sort properly
      spliceClips.splice(insertIndex, 0, ...clips)
      this.sortClips(spliceClips)

      // set the track of clips we aren't moving 
      const newClips = clips.filter(clip => !movingClips.includes(clip))
      newClips.forEach(clip => clip.track = this.index)

      // remove all my current clips and replace with new ones in one step
      this.clips.splice(0, this.clips.length, ...spliceClips)
    }

    frameForClipsNearFrame(clips, frame = 0) {
      // TODO: make range that includes all clips

      // find next stretch after frame that fits range

      const others = this.clips.filter(clip => !clips.includes(clip))

      return frame
    }

    removeClips(clips) {
      const spliceClips = this.clips.filter(clip => !clips.includes(clip))
      if (spliceClips.length === this.clips.length) {
        console.log("removeClips", this.type, this.index, this.clips)
        throw Errors.internal + JSON.stringify(clips)
      }
      clips.forEach(clip => clip.track = -1)
      this.sortClips(spliceClips)
      this.clips.splice(0, this.clips.length, ...spliceClips)
    }

    sortClips(clips) { 
      clips ||= this.clips
      if (this.isMainVideo) {
        let frame = 0
        clips.forEach((clip, i) => {
          const is_transition = clip.type === TrackType.transition
          if (i && is_transition) frame -= clip.frames
          clip.frame = frame
          if (!is_transition) frame += clip.frames
        })
      }
      clips.sort(Sort.byFrame) 
    }

    toJSON() {
      return { type: this.type, index: this.index, clips: this.clips }
    }
}

export { Track }