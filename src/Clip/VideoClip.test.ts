import { ClipType, MediaType } from "../Setup"
import { VideoClip } from "./VideoClip"
import { Mash } from "../Mash"
import { Is } from "../Utilities"

describe("VideoClip", () => {
  const mediaObject = { id: 'id', url: "frames/", duration: 100, type: MediaType.video, }
  const mash = new Mash({ media: [mediaObject] })
  const media = mash.findMedia(mediaObject.id)
  const table = [
    [{ id: mediaObject.id }, media, mash],
    [{ id: mediaObject.id }, mediaObject, mash],
  ]

  test.each(table)("constructor", (configuration, media) => {
    const clip = new VideoClip(configuration, media, mash)
    expect(clip.id).toEqual(configuration.id)
    if (configuration.media) {
      expect(clip.type).toEqual(ClipType.video)
      if (Is.string(configuration.media)) {
        expect(clip.media.id).toStrictEqual(configuration.media)
      } else {
        expect(clip.media).toStrictEqual(configuration.media)
      }
    }
  })
})
