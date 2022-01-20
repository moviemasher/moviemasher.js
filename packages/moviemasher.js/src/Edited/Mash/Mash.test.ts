import { RenderType, TrackType, TrackTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Definition } from "../../Base/Definition"
import { Factory } from "../../Definitions/Factory/Factory"
import { Clip, ClipObject } from "../../Mixin/Clip/Clip"
import { idGenerate } from "../../Utilities/Id"
import { Mash } from "./Mash"
import { MashClass } from "./MashClass"
import { expectEmptyArray } from "../../../dev/test/Utilities/expectEmptyArray"
import { expectArrayOf } from "../../../dev/test/Utilities/expectArrayOf"
import { expectRender } from "../../../dev/test/Utilities/expectRender"

import themeColorJson from "../..//Definitions/DefinitionObjects/theme/color.json"
import { MashFactory } from "./MashFactory"
import { TrackClass } from "../../Media/Track/TrackClass"
import { TrackObject } from "../../Media/Track/Track"
import { CommandArgs, CommandDestination, CommandInput, CommandOptions } from "../../../../server-node/src/Command/Command"
import { segmentToCommandOptions } from "../../../../server-node/src/Utilities/Segment"
import { Default } from "../../Setup/Default"
import { OutputObject } from "../../Output/Output"
import { SegmentArgs } from "../../declarations"
import { outputMp4 } from "../../Utilities/Ouput"

describe("MashFactory", () => {
  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = MashFactory.instance()
      expect(mash).toBeInstanceOf(MashClass)
    })
  })
})
describe("Mash", () => {
  const colorDefinition = () => Factory.theme.definition(themeColorJson)

  describe("renders", () => {
    test("video", () => {
      const output: OutputObject = outputMp4()
      const trackType = TrackType.Video
      const clips: ClipObject[] = [{definitionId: 'com.moviemasher.theme.color'}]
      const mash = MashFactory.instance({tracks: [{trackType, clips}]})
      // console.log(JSON.stringify(mash))
      const timeRange = mash.timeRange
      const args: SegmentArgs = {
        type: RenderType.File, size: { width: output.width, height: output.height },
        rate: output.fps, timeRange
      }
      const segments = mash.segments(args)
      segments.forEach(segment => {
        const id = idGenerate()
        const commandOptions = segmentToCommandOptions(segment)
        console.log(commandOptions)
        const destination = `../../temporary/${id}.mp4`
        commandOptions.output = output
        const commandArgs: CommandArgs = {
          inputs: commandOptions.inputs!,
          complexFilter: commandOptions.complexFilter!,
          destination, output
        }
        expectRender(id, commandArgs)
      })

    })
  })
  describe("addTrack", () => {
    test.each(TrackTypes)("returns new %s track", (trackType) => {
      const mash = MashFactory.instance()
      const addedTrack = mash.addTrack(trackType)
      expect(addedTrack.dense).toBe(false)
      expect(addedTrack).toBeInstanceOf(TrackClass)
      expect(addedTrack.trackType).toEqual(trackType)
      expect(mash.trackCount(trackType)).toEqual(trackType === TrackType.Transition ? 1 : 2)
      expect(mash.tracks.length).toBeGreaterThan(2)
      const track = mash.trackOfTypeAtIndex(trackType, mash.trackCount(trackType) - 1)
      expect(track).toBeInstanceOf(TrackClass)
      expect(track.trackType).toEqual(trackType)
      expect(addedTrack).toStrictEqual(track)
    })
  })

  describe("addClipToTrack", () => {
    const addNewClip = (mash : Mash, definition : Definition, track = 0) : Clip => {
      const clip = <Clip> definition.instance
      expect(clip).toBeTruthy()
      mash.addClipToTrack(clip, track)
      return clip
    }

    test("correctly moves to new track and removes from old", () => {
      const mash = MashFactory.instance()
      const firstTrack = mash.addTrack(TrackType.Video)
      expect(firstTrack.layer).toEqual(1)
      const secondTrack = mash.addTrack(TrackType.Video)
      expect(secondTrack.layer).toEqual(2)
      const clip = addNewClip(mash, colorDefinition(), 1)
      expect(firstTrack.clips.includes(clip)).toBeTruthy()
      expect(secondTrack.clips.includes(clip)).toBeFalsy()
      const clipTrack = mash.clipTrack(clip)

      expect(clipTrack).toEqual(firstTrack)

      mash.addClipToTrack(clip, 2)
      expect(mash.clipTrack(clip)).toStrictEqual(secondTrack)
      expect(secondTrack.clips.includes(clip)).toBeTruthy()
      expect(firstTrack.clips.includes(clip)).toBeFalsy()
    })

    test("correctly places clip in track clips", () => {
      const mash = MashFactory.instance()
      const clip = addNewClip(mash, colorDefinition())

      expect(mash.trackCount(TrackType.Video)).toEqual(1)
      const track = mash.trackOfTypeAtIndex(TrackType.Video, 0)

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = MashFactory.instance()
      expect(mash.quantize).toEqual(10)
      const clip1 = colorDefinition().instance
      const clip2 = colorDefinition().instance
      mash.addClipToTrack(clip1, 0)
      mash.addClipToTrack(clip2, 0, 1)
      const track = mash.trackOfTypeAtIndex(TrackType.Video, 0)

      expect(track.dense).toBeTruthy()

      expect(clip1.frame).not.toEqual(clip2.frame)

      expect(mash.frames).toEqual(60)

      expect(track.clips.length).toEqual(2)
      expect(track.clips[0]).toStrictEqual(clip1)
      expect(track.clips[1]).toStrictEqual(clip2)
    })

    test("updates definition", () => {
      const mash = MashFactory.instance()
      const clip = colorDefinition().instance
      mash.addClipToTrack(clip, 0)
      // console.log("mash.definition", mash.definition)
      expect(mash.definitions.includes(colorDefinition())).toBeTruthy()
    })
  })

  describe("clips", () => {
    test("returns proper clips", () => {
      const clips = [
        { label: 'A', definitionId: "com.moviemasher.theme.text", frame: 0, frames: 100, string: "A" },
        { label: 'B', definitionId: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue"},
        { label: 'C', definitionId: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "C" },
      ]
      const mash = MashFactory.instance({ tracks: [{ clips }, { clips }, { clips }] })
      expect(mash.clips.length).toEqual(clips.length * 3)
    })
  })
  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = MashFactory.instance()
      expect(mash.frames).toEqual(0)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = idGenerate()
      const mash = MashFactory.instance({ id })
      expect(mash.id).toEqual(id)
    })

  })

  describe("removeTrack", () => {
    test.each(TrackTypes)("correctly removes just %s track", (type) => {
      if (type === TrackType.Transition) return
      const mash = MashFactory.instance()

      mash.removeTrack(type)
      expect(mash.trackCount(type)).toEqual(0)
      expect(mash.tracks.length).toBe(1)
    })
  })

  describe("trackOfTypeAtIndex", () => {
    test("returns expected track", () => {
      const mash = MashFactory.instance()
      TrackTypes.forEach((type) => {
        const track = mash.trackOfTypeAtIndex(type, 0)
        if (type === TrackType.Transition) expect(track).toBeUndefined()
        else expect(track.trackType).toEqual(type)
      })
    })
  })

  describe("tracks", () => {
    test("returns two tracks", () => {
      const mash = MashFactory.instance()
      const { tracks } = mash
      expect(tracks.length).toBe(2)
      tracks.forEach(track => expect(track).toBeInstanceOf(TrackClass))
    })
  })

  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = idGenerate()
      const mash = MashFactory.instance({ id })
      const clip = colorDefinition().instance
      mash.addTrack(TrackType.Video)
      mash.addClipToTrack(clip, 1)

      const mashString = JSON.stringify(mash)
      // console.log(mashString)
      const mashObject = JSON.parse(mashString)
      expect(mashObject.id).toEqual(id)
      const { tracks } = mashObject
      const audio = tracks.filter((track:TrackObject) => track.trackType === TrackType.Audio)
      const video = tracks.filter((track:TrackObject) => track.trackType === TrackType.Video)

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

  describe("segmentPromise", () => {
    test("returns expected promise", async () => {
      const mash = MashFactory.instance({
        tracks: [{ clips: [{ definitionId: 'com.moviemasher.theme.text' }] }]
      })
      const { output } = Default.mash
      // const time = Time.fromArgs(0, 10)
      const size = { width: output.width, height: output.height }
      const rate = output.fps
      const type = RenderType.Stream
      const result = await mash.segmentPromise({ type, size, rate })
      // result.layers.forEach((segment, index) => {
      //   console.log("segmentPromise segment", index, segment.filters)
      // })

      expect(result).toBeInstanceOf(Object)
    })
  })

})
