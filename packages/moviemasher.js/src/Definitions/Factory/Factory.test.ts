import { ClipType, DefinitionType, ModuleType } from "../../Setup/Enums"
import { AudioDefinition } from "../../Media/Audio/Audio"
import { AudioClass } from "../../Media/Audio/AudioClass"
import { ImageDefinition } from "../../Media/Image"
import { ImageClass } from "../../Media/Image/ImageClass"
import { ScalerClass } from "../../Media/Scaler/ScalerInstance"
import { ThemeDefinition } from "../../Media/Theme"
import { TransitionClass } from "../../Media/Transition/TransitionClass"
import { VideoClass } from "../../Media/Video/VideoClass"
import { Factory } from "./Factory"
import { expectFactory } from "../../../../../dev/test/Utilities/expectFactory"
import { idGenerate } from "../../Utility/Id"
import { VideoSequenceClass } from "../../Media/VideoSequence/VideoSequenceClass"
import { VideoSequenceDefinitionClass } from "../../Media/VideoSequence/VideoSequenceDefinitionClass"
import { timeFromArgs, timeRangeFromTime } from "../../Helpers/Time/TimeUtilities"

describe("Factory", () => {
  test.each(Object.values(DefinitionType))(".%s", (type : DefinitionType) => {
    expectFactory(Factory[type])
  })
  describe(ClipType.Video, () => {
    test("returns factory", () => expectFactory(Factory.video))
    const definitionObject = {
      id: idGenerate(),
      url: "file.mp4",
      type: ClipType.Video,
      fps: 30, duration: 10
    }

    const videoDefinition = () => Factory.video.definition(definitionObject)

    describe("instance", () => {
      test("returns VideoClass instance", () => {
        expect(videoDefinition().instance).toBeInstanceOf(VideoClass)
      })
    })
  })

  describe(DefinitionType.VideoSequence, () => {
    test("returns factory", () => expectFactory(Factory.videosequence) )

    const definitionObject = {
      id: idGenerate(),
      url: "frames/",
      type: DefinitionType.VideoSequence,
      fps: 30, duration: 10
    }

    const definition = () => Factory.videosequence.definition(definitionObject)

    describe("definition", () => {
       test("returns VideoSequenceDefinitionClass instance", () => {
        expect(definition()).toBeInstanceOf(VideoSequenceDefinitionClass)
      })
    })

    describe("instance", () => {
      test("returns VideoClass instance", () => {
        expect(definition().instance).toBeInstanceOf(VideoSequenceClass)
      })
    })

  })

  describe("audio", () => {
    const quantize = 10
    const duration = 10 // frames
    const seconds = duration * quantize
    const mediaObject = { id: 'audio-blah', url: "audio.mp3", duration: seconds, type: DefinitionType.Audio }
    // const audioDefinitionObject = { id: 'audio-id-1', url: "audio.mp3", duration: 1 , type: DefinitionType.Audio}
    const audioDefinition = () => <AudioDefinition> Factory.audio.definition(mediaObject)
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
      url: "../shared/image/globe.jpg",
      type: DefinitionType.Image,
    }
    const imageDefinition = () => <ImageDefinition> Factory.image.definition(mediaObject)

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
      expect(scaler.definitionId).toEqual("com.moviemasher.scaler.default")
    })
  })

  describe("theme", () => {
    const themeDefinition = () => <ThemeDefinition> Factory.theme.definitionFromId("com.moviemasher.theme.text")

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
        const time = timeFromArgs()
        const clip = themeDefinition().instanceFromObject({ frames: 1 })
        const range = timeRangeFromTime(time, clip.frames)
        expect(clip.timeRangeRelative(timeRangeFromTime(time), time.fps)).toEqual(range)
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
    const transitionDefinition = () => Factory.transition.definition(mediaConfiguration)

    test("instance", () => {
      expect(transitionDefinition().instance).toBeInstanceOf(TransitionClass)
    })

    describe("copy", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(transitionDefinition().instance.copy).not.toEqual(expected)
      })
    })
  })
})
