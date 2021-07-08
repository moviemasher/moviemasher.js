import { ClipType, DefinitionType, ModuleType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { TimeRange } from "../Utilities/TimeRange"
import { Time } from "../Utilities/Time"
import { AudioDefinition } from "../Mash/Audio/Audio"
import { AudioClass } from "../Mash/Audio/AudioInstance"
import { ImageDefinition } from "../Mash/Image"
import { ImageClass } from "../Mash/Image/ImageInstance"
import { ScalerClass } from "../Mash/Scaler/ScalerInstance"
import { ThemeDefinition } from "../Mash/Theme"
import { TransitionClass } from "../Mash/Transition/TransitionInstance"
import { VideoClass } from "../Mash/Video/VideoInstance"
import { MovieMasher } from "./MovieMasher"
import { expectContext } from "../Test/expectContext"
import { expectFactory } from "../Test/expectFactory"
import { createId } from "../Test/createId"

describe("MovieMasher", () => {
  test.each(Object.values(DefinitionType))(".%s", (type : DefinitionType) => {
    expectFactory(MovieMasher[type])
  })
  describe("video", () => {
    test("returns factory", () => expectFactory(MovieMasher.video) )

    const videoDefinitionObject = {
      id: createId(),
      url: "frames/",
      type: ClipType.Video,
      fps: 30, duration: 10
    }

    const videoDefinition = () => MovieMasher.video.definition(videoDefinitionObject)

    describe("instance", () => {
      test("returns VideoClass instance", () => {
        expect(videoDefinition().instance).toBeInstanceOf(VideoClass)
      })
    })
    describe("definition", () => {
      test("returns instance whose urls reflect duration", () => {
        const definition = videoDefinition()
        const instance = definition.instanceFromObject({ frames: 300 })
        const time = Time.fromArgs(0, videoDefinitionObject.fps)
        const definitionTime = instance.definitionTime(time.fps, time)
        const urls = definition.urls(definitionTime)
        expect(urls.length).toBe(1)
        const url = urls[0]
        expect(url).toEqual(`${videoDefinitionObject.url}001.jpg`)
        const outer = Time.fromArgs(100000, videoDefinitionObject.fps)
        const outputTime = instance.definitionTime(outer.fps, outer)
        const outerUrl = definition.urls(outputTime)[0]
        expect(outerUrl).toEqual(`${videoDefinitionObject.url}299.jpg`)
      })
    })
  })

  describe("audio", () => {
    const quantize = 10
    const duration = 10 // frames
    const seconds = duration * quantize
    const mediaObject = { id: 'audio-blah', url: "audio.mp3", duration: seconds, type: DefinitionType.Audio }
    // const audioDefinitionObject = { id: 'audio-id-1', url: "audio.mp3", duration: 1 , type: DefinitionType.Audio}
    const audioDefinition = () => <AudioDefinition> MovieMasher.audio.definition(mediaObject)
    const defaults = { frame: 0, frames: -1, trim: 0, gain: 1.0 }

    describe("instance", () => {
      test("returns audio clip for valid clipObject", () => {
        expect(audioDefinition().instance).toBeInstanceOf(AudioClass)
      })
    })

    describe.each(Object.entries(defaults))("%s", (key, value) => {
      test(`returns ${value} by default`, () => {
        expect(audioDefinition().instance[key]).toEqual(value)
      })
    })
  })

  describe("image", () => {
    const mediaObject = {
      id: 'image-id',
      url: "Assets/globe.jpg",
      type: DefinitionType.Image,
    }
    const imageDefinition = () => <ImageDefinition> MovieMasher.image.definition(mediaObject)

    describe("instance", () => {
      test("return ImageClass instance", () => {
        expect(imageDefinition().instance).toBeInstanceOf(ImageClass)
      })
    })

    describe("copy", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(imageDefinition().instance.copy).not.toEqual(expected)
      })
    })

    describe("contextAtTimeToSize", () => {
      test("returns expected context", async () => {
        const time = Time.fromArgs(0, 1)
        const clip = imageDefinition().instanceFromObject({ frames: 1 })
        await clip.load(time.fps, time)
        const dimensions = { width: 640, height: 480 }
        const context = clip.contextAtTimeToSize(time, time.fps, dimensions)
        expect(context).toBeDefined()
        if (!context) throw Errors.internal

        expectContext(context)
      })
    })

    describe("toJSON", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(imageDefinition().instance.toJSON()).not.toEqual(expected)
      })
    })

    test("scaler", () => {
      const { scaler } = imageDefinition().instance
      expect(scaler).toBeInstanceOf(ScalerClass)
      expect(scaler.type).toEqual(ModuleType.Scaler)
      expect(scaler.id).toEqual("com.moviemasher.scaler.default")
    })
  })

  describe("theme", () => {
    const themeDefinition = () => <ThemeDefinition> MovieMasher.theme.definitionFromId("com.moviemasher.theme.text")

    test("constructor", () => {
      expect(themeDefinition().instance.type).toEqual(ClipType.Theme)
    })

    describe("copy", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(themeDefinition().instance.copy).not.toEqual(expected)
      })
    })

    describe("timeRangeRelative", () => {
      test("returns expected range", () => {
        const time = Time.fromArgs()
        const clip = themeDefinition().instanceFromObject({ frames: 1 })
        const range = TimeRange.fromTime(time, clip.frames)
        expect(clip.timeRangeRelative(time, time.fps)).toEqual(range)
      })
    })

    describe("contextAtTimeToSize", () => {
      const dimensions = { width: 640, height: 480 }
      const time = Time.fromArgs()

      test("returns expected context after proper evaluation", async () => {
        const clip = themeDefinition().instanceFromObject({ frames: 1 })
        await clip.load(time.fps, time)

        const context = clip.contextAtTimeToSize(time, time.fps, dimensions)
        expect(context).toBeDefined()
        if (!context) throw Errors.internal

        expectContext(context)
      })
    })

    test("toJSON", () => {
      const clip = themeDefinition().instance
      expect(() => JSON.stringify(clip)).not.toThrow()
      const json = JSON.stringify(clip)
      expect(json).not.toEqual("{}")
    })

    test("effects", () => {
      const { effects } = themeDefinition().instance
      // console.log("effects", effects)
      expect(effects).toBeInstanceOf(Array)
    })
  })


  describe("transition", () => {
    const mediaConfiguration = { id: 'transition-id', type: DefinitionType.Transition }
    const transitionDefinition = () => MovieMasher.transition.definition(mediaConfiguration)

    test("instance", () => {
      expect(transitionDefinition().instance).toBeInstanceOf(TransitionClass)
    })

    describe("copy", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(transitionDefinition().instance.copy).not.toEqual(expected)
      })
    })

    describe("contextAtTimeToSize", () => {
      const dimensions = { width: 640, height: 480 }
      const time = Time.fromArgs(0)
      test("returns undefined for transitions", () => {
        const context = transitionDefinition().instance.contextAtTimeToSize(time, time.fps, dimensions) //, color)
        expect(context).toBeUndefined()

      })
    })
  })
})
