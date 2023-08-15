import type { ClientClip, ClientClips, ClientMashAsset, ClientTrack } from '@moviemasher/runtime-client'

import { TrackClass, arraySet, assertTrue, isPositive } from '@moviemasher/lib-shared'

export class ClientTrackClass extends TrackClass implements ClientTrack {

  addClips(clips: ClientClips, insertIndex = 0): void {
    // console.log(this.constructor.name, 'addClips', insertIndex)
    let clipIndex = insertIndex || 0
    if (!this.dense) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips: ClientClips = [] // build array of clips already in this.clips

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

  declare clips: ClientClips

  frameForClipNearFrame(clip: ClientClip, insertFrame = 0): number {
    if (this.dense) {
      return isPositive(insertFrame) ? insertFrame : this.frames
    }
    const { frame, endFrame } = clip
    const durationFrames = endFrame - frame

    const { clips } = this
    const avoidClips = clips.filter(other => 
      clip !== other && other.endFrame > insertFrame
    )
    if (!avoidClips.length) return insertFrame

    let lastFrame = insertFrame
    for (const avoidClip of avoidClips) {
      if (avoidClip.frame >= lastFrame + durationFrames) break
  
      lastFrame = avoidClip.endFrame
    }
    return lastFrame
  }

  declare mash: ClientMashAsset

  removeClips(clips: ClientClips): void {
    const newClips = this.clips.filter(other => !clips.includes(other))
    assertTrue(newClips.length !== this.clips.length)
    
    clips.forEach(clip => clip.trackNumber = -1)
    this.sortClips(newClips)
    arraySet(this.clips, newClips)
  }
}
