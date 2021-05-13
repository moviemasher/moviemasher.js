import { TrackType, TrackTypes } from "../Types"
import { ClipFactory } from "../Factory/ClipFactory"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { Module } from "../Module"
import { Track } from "../Track"
import { Mash } from "./Mash"

describe("Mash", () => {
  const media_config = Module.themeById('com.moviemasher.theme.color')
  const media = MediaFactory.create(media_config)
  const mash = new Mash
  
  describe("constructor", () => {
    test("returns Mash instance", () => {
      expect(mash).toBeInstanceOf(Mash)
    })
  })
  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      expect(mash.frames).toEqual(0)
    })
  })

  describe("tracks", () => {
    test("returns 2 for empty mash", () => {
      const tracks = mash.tracks
      expect(tracks.length).toEqual(2)
      TrackTypes.forEach((type, index) => {
        const track = tracks[index]
        expect(track).toBeInstanceOf(Track)
        expect(track.type).toEqual(type)
      })
    })
  })
  describe("addClipsToTrack", () => {
    const addNewClip = (mash, media, track = 0) => {
      const clip = ClipFactory.createFromMedia(media, mash)
      mash.addClipsToTrack([clip], track)
      return clip
    }
    
    test("correctly moves to new position on main track", () => {
      const mash = new Mash
      const array = new Array(4).fill()
      const objects = array.map(() => addNewClip(mash, media)).reverse()
      expect(mash.clips).toEqual(objects)
      
      const a2z = "abcdefghijklmnopqrstuvwxyz"
      const clips = Object.fromEntries(objects.map((clip, i) => [a2z[i], clip]))
      
      const moveClips = objects.slice(2)
      mash.addClipsToTrack(moveClips, 0, 1)
      expect(mash.clips).toEqual([clips.a, clips.c, clips.d, clips.b])
      
      mash.addClipsToTrack(moveClips, 0, 2)
      expect(mash.clips).toEqual([clips.a, clips.c, clips.d, clips.b])
      
      // expect(mash.clipTrack(clip)).toStrictEqual(firstTrack)
      // expect(firstTrack.clips.includes(clip)).toBeTruthy()
      // expect(secondTrack.clips.includes(clip)).toBeFalsy()
      
      // 
      // expect(mash.clipTrack(clip)).toStrictEqual(secondTrack)
      // expect(secondTrack.clips.includes(clip)).toBeTruthy()
      // expect(firstTrack.clips.includes(clip)).toBeFalsy()
    })

    test("correctly moves to new track and removes from old", () => {
      const mash = new Mash
      const firstTrack = mash.addTrack(TrackType.video)
      const secondTrack = mash.addTrack(TrackType.video)
      const clip = addNewClip(mash, media, 1)
      expect(mash.clipTrack(clip)).toStrictEqual(firstTrack)
      expect(firstTrack.clips.includes(clip)).toBeTruthy()
      expect(secondTrack.clips.includes(clip)).toBeFalsy()
      
      mash.addClipsToTrack([clip], 2)
      expect(mash.clipTrack(clip)).toStrictEqual(secondTrack)
      expect(secondTrack.clips.includes(clip)).toBeTruthy()
      expect(firstTrack.clips.includes(clip)).toBeFalsy()
    })

    test("correctly places clip in track clips", () => {
      const mash = new Mash
      const clip = addNewClip(mash, media)
      
      expect(mash.video.length).toEqual(1)
      const track = mash.video[0]

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })
    
    test("correctly sorts clips", () => {
      const mash = new Mash
  
      const clip1 = ClipFactory.createFromMedia(media, mash)
      const clip2 = ClipFactory.createFromMedia(media, mash)
      mash.addClipsToTrack([clip1], 0)
      mash.addClipsToTrack([clip2], 0, 1)
      
      expect(clip1.frame).not.toEqual(clip2.frame)
      
      expect(mash.frames).toEqual(60)
      
      const track = mash.video[0]
      expect(track.clips.length).toEqual(2)
      expect(track.clips[0]).toStrictEqual(clip1)
      expect(track.clips[1]).toStrictEqual(clip2)
    })
    test("updates media", () => {
      const mash = new Mash
      const clip = ClipFactory.createFromMedia(media, mash)
      mash.addClipsToTrack([clip], 0)
      
      expect(mash.media.includes(media)).toBeTruthy()
    })
    
  })
  describe("addTrack", () => {
    const mash = new Mash
   
    test.each(TrackTypes)("returns new %s track", (type) => {
      const addedTrack = mash.addTrack(type)
      expect(addedTrack).toBeInstanceOf(Track)
      expect(addedTrack.type).toEqual(type)
      expect(mash[type].length).toEqual(2)
      expect(mash.tracks.length).toBeGreaterThan(2) // with audio track
      const track = mash[type][1]
      expect(track).toBeInstanceOf(Track)
      expect(track.type).toEqual(type)
      expect(addedTrack).toStrictEqual(track)
    })
  })

  describe("clipsVisibleInTimeRange", () => {
    test("returns expected clip", () => {
      const mash = new Mash
      const clip1 = ClipFactory.createFromMedia(media, mash)
      clip1.object.label = "CLIP 1"
      const clip2 = ClipFactory.createFromMedia(media, mash)
      clip2.object.label = "CLIP 2"

      mash.addClipsToTrack([clip1], 0)
      mash.addClipsToTrack([clip2], 0, 1)
      const range = TimeRangeFactory.create({ frame: 0, fps: 30, frames: 1 })
      const clips_at_start = mash.clipsVisibleInTimeRange(range)
      expect(clips_at_start[0]).toStrictEqual(clip1)
      expect(clips_at_start.length).toEqual(1)
    })
  })

  describe("removeTrack", () => {
    const mash = new Mash
    test.each(TrackTypes)("returns removed %s track", (type) => {
      mash.removeTrack(type)
      expect(mash[type].length).toEqual(0)
      expect(mash.tracks.length).toBeLessThan(2)
    })
  })
})

// const mediaTimes = [
//   [
//       new AudioClip({ frame: 0, frames: duration, trim: 0 }, media_config, mash), 
//       [
//           [times[0], times[0]],
//           [times[1], times[1]],
//           [times[duration], times[duration]],
//           [times[duration + 1], times[duration]],
//           [times[duration + 2], times[duration]],

//       ],
//   ],
//   [
//       new AudioClip({ frame: 10, frames: duration, trim: 0 }, media_config, mash), 
//       [
//           [times[0], times[0]],
//           [times[1], times[0]],
//           [times[duration], times[0]],
//           [times[duration + 1], times[1]],
//           [times[duration + 10], times[duration]],
//           [times[duration + 11], times[duration]],
//           [times[duration + 12], times[duration]],

//       ],
//   ],
// ]
// describe.each(mediaTimes)("%s", (clip, tests) => {
//   test.each(tests)("mediaTime(%s) returns %s", (time, expected) => {
//       expect(clip.mediaTime(time)).toEqual(expected)
//   })
// })


// const endTimes = [
//   [{ frame: 0, frames: 10 }, 10],
//   [{ frame: 1, frames: 10 }, 11],
//   [{ frame: 20, frames: 10 }, 30],
// ]
// test.each(endTimes)("endTime %o %i", (clip_config, expected) => {
//   const clip = new VideoClip(clip_config, media_configuration, mash)
//   expect(clip.endTime).toEqual(TimeFactory.create(expected, mash.quantize))
// })
// const startTimes = [
//   [{ frame: 0, frames: 10 }, 0],
//   [{ frame: 1, frames: 10 }, 1],
//   [{ frame: 20, frames: 10 }, 20],
// ]
// test.each(startTimes)("startTime %o %i", (clip_config, expected) => {
//   const clip = new VideoClip(clip_config, media_configuration, mash)
//   expect(clip.startTime).toEqual(TimeFactory.create(expected, mash.quantize))
// })