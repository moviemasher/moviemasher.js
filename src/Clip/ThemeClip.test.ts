import { ClipType, Module } from "../Setup"
import { ThemeClip } from "./ThemeClip"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { ThemeMedia } from "../Media"
import { UrlsByType } from "../Loading"
import { FilterMedia } from "../Media/FilterMedia"
import { TimeFactory } from "../Factory/TimeFactory"
import { expectContext } from "../../test/expectContext"

describe("ThemeClip", () => {
  const media = new ThemeMedia(Module.themeById("com.moviemasher.theme.text"))
  const object = { media }
  const clip = new ThemeClip(object)

  test("constructor", () => {
    expect(clip.type).toEqual(ClipType.theme)
  })

  describe("copy", () => {
    test("returns expected clip", () => {
      const expected = {}
      expect(clip.copy).not.toEqual(expected)
    })
  })

  describe("timeRangeRelative", () => {
    test("returns expected range", () => {
      const time = TimeFactory.createFromFrame()
      const range = TimeRangeFactory.createFromTime(time, clip.frames)
      expect(clip.timeRangeRelative(time)).toEqual(range)
    })
  })

  describe("contextAtTimeForDimensions", () => {
    const dimensions = { width: 640, height: 480 }
    const time = TimeFactory.createFromFrame()

    test("returns expected context", async () => {
      await clip.load(TimeRangeFactory.createFromTime(time))

      const context = clip.contextAtTimeForDimensions(time, dimensions)
      expectContext(context)
    })
  })

  test("toJSON", () => {
    expect(() => JSON.stringify(clip)).not.toThrow()
    const json = JSON.stringify(clip)
    expect(json).not.toEqual("{}")
  })

  test("urlsFromFilters", () => {
    const range = TimeRangeFactory.create
    const urls = media.urlsVisibleInTimeRangeForClipByType(range, clip)
    expect(urls).toBeInstanceOf(UrlsByType)
    expect(urls.font.length).toEqual(1)
  })

  test("coreFilters", () => {
    const filters = clip.coreFilters
    expect(filters).toBeInstanceOf(Array)
    expect(filters.length).toEqual(5)
    filters.forEach(filter => {
      expect(filter).toBeInstanceOf(FilterMedia)
    })
  })

  test("effects", () => {
    const { effects } = clip
    // console.log("effects", effects)
    expect(effects).toBeInstanceOf(Array)
  })
})
