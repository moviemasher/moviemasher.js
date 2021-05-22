import { Errors, ClipType } from "../Setup"
import { ClipFactory } from "./ClipFactory"
import { AudioClip, VideoClip } from "../Clip"
import { AudioMedia, VideoMedia } from "../Media"
import { MediaFactory } from "./MediaFactory"
import { Mash } from "../Mash"

describe("ClipFactory", () => {
  const videoMediaObject = { id: 'videoid', type: ClipType.video, duration: 1 }
  const audioMediaObject = { id: 'audioid', type: ClipType.audio, duration: 1 }
  const invalidMediaObject = { id: 'invalid', type: "unknown" }
  const mash = new Mash()
  const videoMedia = MediaFactory.createFromObject(videoMediaObject)
  const audioMedia = MediaFactory.createFromObject(audioMediaObject)
  const videoClipObject = { frame: 1, frames: 2 }
  const audioClipObject = { frame: 1, frames: 2 }
  const invalidClipObject = "invalid"

  describe("createFromMedia", () => {
    const clip = ClipFactory.createFromMedia(videoMedia, new Mash())
    expect(clip).toBeInstanceOf(VideoClip)
  })
  describe("create", () => {
    test("throws for invalid arguments", () => {
      expect(() => ClipFactory.createFromObjectMedia()).toThrow(Errors.unknown.type)
      expect(() => ClipFactory.createFromObjectMedia(invalidClipObject)).toThrow(Errors.object)
      expect(() => ClipFactory.createFromObjectMedia({}, invalidClipObject)).toThrow(Errors.media)
      expect(() => ClipFactory.createFromObjectMedia({})).toThrow(Errors.unknown.type)
      expect(() => ClipFactory.createFromObjectMedia({}, {})).toThrow(Errors.unknown.type)
      expect(() => ClipFactory.createFromObjectMedia({}, invalidMediaObject)).toThrow(Errors.unknown.type)
    })
    test("returns video clip for valid configuration", () => {
      const clip = ClipFactory.createFromObjectMedia(videoClipObject, videoMedia, mash)
      expect(clip).toBeInstanceOf(VideoClip)
      expect(clip.media).toBeInstanceOf(VideoMedia)
      // console.log(clip.object)
    })
    test("returns audio clip for valid configuration", () => {
      const clip = ClipFactory.createFromObjectMedia(audioClipObject, audioMedia, mash)
      expect(clip).toBeInstanceOf(AudioClip)
      expect(clip.media).toBeInstanceOf(AudioMedia)
    })
  })
})
