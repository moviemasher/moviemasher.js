import { Id } from "../Utilities"
import { ClipType, MediaType, ModuleType } from "../Setup"
import { ImageClip } from "./ImageClip"
import { Scaler } from "../Transform"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { TimeFactory } from "../Factory/TimeFactory"

describe("ImageClip", () => {
  const media_configuration = {
    id: Id(), url: "../examples/javascript/media/img/globe.jpg", type: MediaType.image,
  }
  const media = MediaFactory.create(media_configuration)
  const clip = new ImageClip({ media })

  test("constructor", () => {
    expect(clip).toBeInstanceOf(ImageClip)
    expect(clip.type).toEqual(ClipType.image)
  })

  describe("copy", () => {
    test("returns expected clip", () => {
      const expected = {}
      expect(clip.copy).not.toEqual(expected)
    })
  })

  describe("contextAtTimeForDimensions", () => {
    test("returns expected context", async () => {
      const time = TimeFactory.createFromFrame()
      await clip.load(TimeRangeFactory.createFromTime(time))
      const dimensions = { width: 640, height: 480 }
      const context = clip.contextAtTimeForDimensions(time, dimensions)
      const dataUrl = context.canvas.toDataURL()
      const image = dataUrl.substring('data:image/png;base64,'.length)
      expect(image).toMatchImageSnapshot()
    })
  })

  describe("toJSON", () => {
    test("returns expected clip", () => {
      const expected = {}
      expect(clip.toJSON()).not.toEqual(expected)
    })
  })

  test("scaler", () => {
    const scaler = clip.scaler
    expect(scaler).toBeInstanceOf(Scaler)
    expect(scaler.type).toEqual(ModuleType.scaler)
    expect(scaler.id).toEqual("com.moviemasher.scaler.default")
    // console.log("scaler.media", scaler.media)
    // expect(scaler.media).toBeInstanceOf(ScalerMedia)
  })
  test("coreFilters", () => {
    const filters = clip.coreFilters
    // console.log("coreFilters", filters)
    expect(filters).toBeInstanceOf(Array)
  })
})
