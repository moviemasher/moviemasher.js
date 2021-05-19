import { Id } from "../Utilities"
import { ClipType, MediaType } from "../Setup"
import { VideoClip } from "./VideoClip"
import { Mash } from "../Mash"
import { Is } from "../Utilities"

describe("VideoClip", () => {
  const media_configuration = { id: Id(), url: "frames/", duration: 100, type: MediaType.video, }
  const mash = new Mash({ media: [media_configuration] })
  const media = mash.findMedia(media_configuration.id)
  const table = [
    [{ id: media_configuration.id }, media, mash],
    [{ id: media_configuration.id }, media_configuration, mash],
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
