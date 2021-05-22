import { ClipType, MediaType, ModuleType } from "../Setup"
import { ImageClip } from "./ImageClip"
import { Scaler } from "../Transform"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { TimeFactory } from "../Factory/TimeFactory"
import { expectContext } from "../../test/expectContext"

describe("ImageClip", () => {
  const mediaObject = {
    id: 'id',
    url: "../examples/javascript/media/img/globe.jpg",
    type: MediaType.image,
  }
  const media = MediaFactory.createFromObject(mediaObject)
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
      const time = TimeFactory.createFromFrame(0, 1)
      await clip.load(TimeRangeFactory.createFromTime(time))
      const dimensions = { width: 640, height: 480 }
      const context = clip.contextAtTimeForDimensions(time, dimensions)
      expectContext(context)
    })
  })

  describe("toJSON", () => {
    test("returns expected clip", () => {
      const expected = {}
      expect(clip.toJSON()).not.toEqual(expected)
    })
  })

  test("scaler", () => {
    const { scaler } = clip
    expect(scaler).toBeInstanceOf(Scaler)
    expect(scaler.type).toEqual(ModuleType.scaler)
    expect(scaler.id).toEqual("com.moviemasher.scaler.default")
  })
  test("coreFilters", () => {
    const filters = clip.coreFilters
    // console.log("coreFilters", filters)
    expect(filters).toBeInstanceOf(Array)
  })
})
