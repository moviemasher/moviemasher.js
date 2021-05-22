/* eslint-disable no-undef */
import { TrackType, TrackTypes, Module } from "../Setup"
import { ClipFactory } from "../Factory/ClipFactory"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { Track } from "../Track"
import { Mash } from "./Mash"

describe("Mash", () => {
  const mediaConfig = Module.themeById('com.moviemasher.theme.color')
  const media = MediaFactory.create(mediaConfig)

  describe("constructor", () => {
    test("returns Mash instance", () => {
      const mash = new Mash()
      expect(mash).toBeInstanceOf(Mash)
    })
  })
  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = new Mash()
      expect(mash.frames).toEqual(0)
    })
  })

  describe("tracks", () => {
    test("returns 2 for empty mash", () => {
      const mash = new Mash()

      const { tracks } = mash
      expect(tracks.length).toEqual(2)
      TrackTypes.forEach((type, index) => {
        const track = tracks[index]
        expect(track).toBeInstanceOf(Track)
        expect(track.type).toEqual(type)
      })
    })
  })
  describe("addClipsToTrack", () => {
    const addNewClip = (mash, mediaInstance, track = 0) => {
      const clip = ClipFactory.createFromMedia(mediaInstance, mash)
      mash.addClipsToTrack([clip], track)
      return clip
    }

    test("correctly moves to new position on main track", () => {
      const mash = new Mash()
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
    })

    test("correctly moves to new track and removes from old", () => {
      const mash = new Mash()
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
      const mash = new Mash()
      const clip = addNewClip(mash, media)

      expect(mash.video.length).toEqual(1)
      const track = mash.video[0]

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = new Mash()

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
      const mash = new Mash()
      const clip = ClipFactory.createFromMedia(media, mash)
      mash.addClipsToTrack([clip], 0)
      // console.log("mash.media", mash.media)
      expect(mash.media.includes(media)).toBeTruthy()
    })
  })
  describe("addTrack", () => {
    const mash = new Mash()

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
      const mash = new Mash()
      const clip1 = ClipFactory.createFromMedia(media, mash)
      clip1.object.label = "CLIP 1"
      const clip2 = ClipFactory.createFromMedia(media, mash)
      clip2.object.label = "CLIP 2"

      mash.addClipsToTrack([clip1], 0)
      mash.addClipsToTrack([clip2], 0, 1)
      const options = { frame: 0, fps: 30, frames: 1 }
      const range = TimeRangeFactory.createFromOptions(options)
      const clipsAtStart = mash.clipsVisibleInTimeRange(range)
      expect(clipsAtStart[0]).toStrictEqual(clip1)
      expect(clipsAtStart.length).toEqual(1)
    })
  })

  describe("removeTrack", () => {
    const mash = new Mash()
    test.each(TrackTypes)("returns removed %s track", (type) => {
      mash.removeTrack(type)
      expect(mash[type].length).toEqual(0)
      expect(mash.tracks.length).toBeLessThan(2)
    })
  })
})
