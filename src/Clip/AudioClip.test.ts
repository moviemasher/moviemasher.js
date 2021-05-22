import { MediaType } from "../Setup"
import { Mash } from "../Mash"
import { AudioClip } from "./AudioClip"
import { Is } from "../Utilities"

describe("AudioClip", () => {
  const quantize = 10
  const duration = 10 // frames
  const seconds = duration * quantize
  const mediaObject = { id: 'id', duration: seconds, type: MediaType.audio }
  const mash = new Mash({ quantize: quantize, media: [mediaObject] })
  const media = mash.findMedia(mediaObject.id)
  const defaults = { frame: 0, frames: 0, trim: 0, gain: 1.0 }
  const clip = new AudioClip({ media })

  describe("constructor", () => {
    test("returns instance of AudioClip", () => {
      expect(Is.instanceOf(clip, AudioClip)).toBeTruthy()
    })
  })
  describe.each(Object.entries(defaults))("%s", (key, value) => {
    test(`returns ${value} by default`, () => {
      expect(clip[key]).toEqual(value)
    })
  })
})
