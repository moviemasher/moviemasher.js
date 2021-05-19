import { Errors } from "../Setup"
import { ClipType } from "../Setup"
import { Id } from "../Utilities"
import { ClipFactory } from "./ClipFactory"
import { AudioClip, VideoClip } from "../Clip"
import { AudioMedia, VideoMedia } from "../Media"
import { MediaFactory } from "./MediaFactory"
import { Mash } from "../Mash"

describe("ClipFactory", () => {
  const video_config = { id: Id(), type: ClipType.video, duration: 1 }
  const audio_config = { id: Id(), type: ClipType.audio, duration: 1 }
  const invalid_config = { id: Id(), type: "unknown" }
  const mash = new Mash()
  const video_media = MediaFactory.create(video_config)
  const audio_media = MediaFactory.create(audio_config)
  const video_clip = { frame: 1, frames: 2 }
  const audio_clip = { frame: 1, frames: 2 }
  const nonobject = "nonobject"

  describe("createFromMedia", () => {
    const clip = ClipFactory.createFromMedia(video_media, new Mash)
    expect(clip).toBeInstanceOf(VideoClip)
  })
  describe("create", () => {
    test("throws for invalid arguments", () => {
      expect(() => ClipFactory.createFromObjectMedia()).toThrow(Errors.unknown.type)
      expect(() => ClipFactory.createFromObjectMedia(nonobject)).toThrow(Errors.object)
      expect(() => ClipFactory.createFromObjectMedia({}, nonobject)).toThrow(Errors.media)
      expect(() => ClipFactory.createFromObjectMedia({})).toThrow(Errors.unknown.type)
      expect(() => ClipFactory.createFromObjectMedia({}, {})).toThrow(Errors.unknown.type)
      expect(() => ClipFactory.createFromObjectMedia({}, invalid_config)).toThrow(Errors.unknown.type)
    })
    test("returns video clip for valid configuration", () => {
      const clip = ClipFactory.createFromObjectMedia(video_clip, video_media, mash)
      expect(clip).toBeInstanceOf(VideoClip)
      expect(clip.media).toBeInstanceOf(VideoMedia)
      // console.log(clip.object)
    })
    test("returns audio clip for valid configuration", () => {
      const clip = ClipFactory.createFromObjectMedia(audio_clip, audio_media, mash)
      expect(clip).toBeInstanceOf(AudioClip)
      expect(clip.media).toBeInstanceOf(AudioMedia)
    })
  })
})
