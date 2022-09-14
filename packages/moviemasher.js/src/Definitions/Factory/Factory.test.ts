import { DefinitionType } from "../../Setup/Enums"
import { AudioClass } from "../../Media/Audio/AudioClass"
import { ImageDefinition } from "../../Media/Image"
import { ImageClass } from "../../Media/Image/ImageClass"
import { VideoClass } from "../../Media/Video/VideoClass"
import { Factory } from "./Factory"
import { expectFactory } from "../../../../../dev/test/Utilities/expectFactory"
import { idGenerateString } from "../../Utility/Id"
import { VideoSequenceClass } from "../../Media/VideoSequence/VideoSequenceClass"
import { VideoSequenceDefinitionClass } from "../../Media/VideoSequence/VideoSequenceDefinitionClass"

describe("Factory", () => {
  test.each(Object.values(DefinitionType))(".%s", (type : DefinitionType) => {
    expectFactory(Factory[type])
  })
  describe(DefinitionType.Video, () => {
    test("returns factory", () => expectFactory(Factory.video))
    const definitionObject = {
      id: idGenerateString(),
      url: "file.mp4",
      type: DefinitionType.Video,
      fps: 30, duration: 10
    }

    const videoDefinition = () => Factory.video.definition(definitionObject)

    describe("instance", () => {
      test("returns VideoClass instance", () => {
        expect(videoDefinition().instanceFromObject()).toBeInstanceOf(VideoClass)
      })
    })
  })

  describe(DefinitionType.VideoSequence, () => {
    test("returns factory", () => expectFactory(Factory.videosequence) )

    const definitionObject = {
      id: idGenerateString(),
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
        expect(definition().instanceFromObject()).toBeInstanceOf(VideoSequenceClass)
      })
    })

  })

  describe("audio", () => {
    const quantize = 10
    const duration = 10 // frames
    const seconds = duration * quantize
    const mediaObject = { 
      id: 'audio-blah', 
      url: "audio.mp3", 
      duration: seconds, 
      type: DefinitionType.Audio
    }
    // const audioDefinitionObject = { id: 'audio-id-1', url: "audio.mp3", duration: 1 , type: DefinitionType.Audio}
    const audioDefinition = () => Factory.audio.definition(mediaObject)
    const defaults = { trim: 0, gain: 1.0 } //frame: 0, frames: -1, 

    describe("instance", () => {
      test("returns audio clip for valid clipObject", () => {
        expect(audioDefinition().instanceFromObject()).toBeInstanceOf(AudioClass)
      })
    })

    describe.each(Object.entries(defaults))("%s", (key, value) => {
      const instance = audioDefinition().instanceFromObject()
      test(`returns ${value} by default`, () => {
        expect(instance.value(key)).toEqual(value)
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
        expect(imageDefinition().instanceFromObject()).toBeInstanceOf(ImageClass)

      })
    })

    describe("copy", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(imageDefinition().instanceFromObject().copy()).not.toEqual(expected)
      })
    })

    describe("toJSON", () => {
      test("returns expected clip", () => {
        const expected = {}
        expect(imageDefinition().instanceFromObject().toJSON()).not.toEqual(expected)
      })
    })

  })
})
