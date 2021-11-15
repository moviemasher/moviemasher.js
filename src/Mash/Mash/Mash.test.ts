import { DefinitionType, TrackType } from "../../Setup/Enums"
import { Definition } from "../Definition/Definition"
import themeColorJson from "../..//DefinitionObjects/theme/color.json"
import { Factory } from "../../Factory/Factory"
import { MashClass } from "./MashInstance"
import { Clip } from "../Mixin/Clip/Clip"
import { TrackClass, TrackObject } from "../Track"
import { InstanceBase } from "../Instance"
import { ThemeDefinition } from "../Theme/Theme"
import { createId } from "../../Test/createId"
import { Mash } from "./Mash"
import { expectEmptyArray } from "../../Test/expectEmptyArray"
import { expectArrayOf } from "../../Test/expectArrayOf"
import { Errors } from "../../Setup/Errors"

describe("MashFactory", () => {
  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = Factory.mash.instance({ id: createId() })
      expect(mash).toBeInstanceOf(MashClass)
    })
  })
})
describe("Mash", () => {
  const definition = () => <ThemeDefinition> Factory.theme.definition(themeColorJson)
  describe("addClipsToTrack", () => {
    const addNewClip = (mash : Mash, definition : Definition, track = 0) : Clip => {
      const clip = <Clip> definition.instance
      expect(clip).toBeTruthy()
      mash.addClipsToTrack([clip], track)
      expect(clip.track).toEqual(track)
      return clip
    }

    test("correctly moves to new track and removes from old", () => {
      const mash = Factory.mash.instance({ id: createId() })
      const firstTrack = mash.addTrack(TrackType.Video)
      const secondTrack = mash.addTrack(TrackType.Video)
      const clip = addNewClip(mash, definition(), 1)
      expect(firstTrack.clips.includes(clip)).toBeTruthy()
      expect(secondTrack.clips.includes(clip)).toBeFalsy()
      const clipTrack = mash.clipTrack(clip)
      if (clipTrack !== firstTrack) console.log("clip.track", clip.track)
      expect(clipTrack).toEqual(firstTrack)

      mash.addClipsToTrack([clip], 2)
      expect(mash.clipTrack(clip)).toStrictEqual(secondTrack)
      expect(secondTrack.clips.includes(clip)).toBeTruthy()
      expect(firstTrack.clips.includes(clip)).toBeFalsy()
    })

    test("correctly moves to new position on main track", () => {
      const mash = Factory.mash.instance({ id: createId() })
      const trackClips = mash.video[0].clips
      const array = new Array(4).fill(null)
      const objects = array.map(() => {
        const clip = addNewClip(mash, definition())
        expect(clip).toBeTruthy()
        expect(clip).toBeInstanceOf(InstanceBase)
        return clip
      }).reverse()
      expect(mash.clips).toEqual(objects)
      expect(trackClips).toEqual(objects)

      const a2z = "abcdefg" // efghijklmnopqrstuvwxyz"
      const clips = Object.fromEntries(objects.map((clip, i) => [a2z[i], clip]))

      const moveClips = objects.slice(2)
      mash.addClipsToTrack(moveClips, 0, 1)
      // logOrder()


      expect(mash.video[0].clips).toEqual([clips.a, clips.c, clips.d, clips.b])

      mash.addClipsToTrack(moveClips, 0, 2)
      expect(mash.clips).toEqual([clips.a, clips.c, clips.d, clips.b])
    })

    test("correctly places clip in track clips", () => {
      const mash = Factory.mash.instance({ id: createId() })
      const clip = addNewClip(mash, definition())

      expect(mash.video.length).toEqual(1)
      const track = mash.video[0]

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = Factory.mash.instance({ id: createId() })
      expect(mash.quantize).toEqual(10)
      const clip1 = definition().instance
      const clip2 = definition().instance
      mash.addClipsToTrack([clip1], 0)
      mash.addClipsToTrack([clip2], 0, 1)

      expect(clip1.frame).not.toEqual(clip2.frame)

      expect(mash.frames).toEqual(60)

      const track = mash.video[0]
      expect(track.clips.length).toEqual(2)
      expect(track.clips[0]).toStrictEqual(clip1)
      expect(track.clips[1]).toStrictEqual(clip2)
    })

    test("updates definition", () => {
      const mash = Factory.mash.instance({ id: createId() })
      const clip = definition().instance
      mash.addClipsToTrack([clip], 0)
      // console.log("mash.definition", mash.definition)
      expect(mash.media.includes(definition())).toBeTruthy()
    })
  })

  describe("addTrack", () => {
    test.each(Object.values(TrackType))("returns new %s track", (type) => {
      const mash = Factory.mash.instance({ id: createId() })
      const addedTrack = mash.addTrack(type)
      expect(addedTrack).toBeInstanceOf(TrackClass)
      expect(addedTrack.type).toEqual(type)
      expect(mash[type].length).toEqual(2)
      expect(mash.tracks.length).toBeGreaterThan(2) // with audio track
      const track = mash[type][1]
      expect(track).toBeInstanceOf(TrackClass)
      expect(track.type).toEqual(type)
      expect(addedTrack).toStrictEqual(track)
    })
  })

  describe("clips", () => {
    test("returns proper clips", () => {
      const clips = [
        { label: 'A', id: "com.moviemasher.theme.text", frame: 0, frames: 100, string: "Fuck yeah!" },
        { label: 'B', id: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue"},
        { label: 'C', id: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "Woot woot!" },
      ]
      const mash = Factory.mash.instance({ id: createId(), video: [{ clips }, { clips }, { clips }] })
      expect(mash.clips.length).toEqual(clips.length * 3)
    })
  })
  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = Factory.mash.instance({ id: createId() })
      expect(mash.frames).toEqual(0)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = createId()
      const mash = Factory.mash.instance({ id })
      expect(mash.id).toEqual(id)
    })

  })

  describe("removeTrack", () => {
    test.each(Object.values(TrackType))("correctly removes just %s track", (type) => {
      const mash = Factory.mash.instance({ id: createId() })
      mash.removeTrack(type)
      expect(mash[type].length).toEqual(0)
      expect(mash.tracks.length).toBe(1)
    })
  })

  describe("tracks", () => {
    test("returns 2 for empty mash", () => {
      const mash = Factory.mash.instance({ id: createId() })
      const { tracks } = mash
      expect(tracks.length).toEqual(2)
      Object.values(TrackType).forEach((type, index) => {
        const track = tracks[index]
        expect(track).toBeInstanceOf(TrackClass)
        expect(track.type).toEqual(type)
      })
    })
  })
  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = createId()
      const mash = Factory.mash.instance({ id })
      const clip = definition().instance
      mash.addTrack(TrackType.Video)
      mash.addClipsToTrack([clip], 1)
      expect(clip.track).toEqual(1)

      const mashString = JSON.stringify(mash.toJSON())
      // console.log(mashString)
      const mashObject = JSON.parse(mashString)
      expect(mashObject.id).toEqual(id)
      const { audio, video, media } = mashObject
      const array = expectArrayOf(media, Object, 3)
      const object = array[0]
      expect(object.type).toBeDefined()

      const themeDefinition = array.find(media => media.type === DefinitionType.Theme)
      expect(themeDefinition).toBeInstanceOf(Object)
      expect(themeDefinition.id).toEqual(definition().id)

      // console.log("themeDefinition", themeDefinition)
      // console.log("themeColorJson", themeColorJson)
      // expect(themeDefinition).toEqual(themeColorJson)

      expectArrayOf(audio, Object, 1)
      let track = <TrackObject> audio[0]

      expectEmptyArray(track.clips)

      expectArrayOf(video, Object, 2)

      track = video[0]
      expectEmptyArray(track.clips)

      track = video[1]
      expectArrayOf(track.clips, Object, 1)
      if (!track.clips) throw Errors.internal

      const clipObject = track.clips[0]
      if (!clipObject) throw Errors.internal

      expect(clipObject).toBeInstanceOf(Object)
      // expect(clipObject.type).toEqual(clip.type)
      expect(clipObject.id).toEqual(clip.id)
      expect(clipObject.color).toEqual(clip.color)
    })
  })
})
