import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Time } from "../../Utilities/Time"
import { MasherClass } from "./MasherInstance"
import { MovieMasher } from "../../MovieMasher"
import { ThemeClass } from "../Theme/ThemeInstance"
import { expectContext } from "../../Test/expectContext"
import { createId } from "../../Test/createId"
import themeTextJson from "../Theme/DefinitionObjects/text.json"

describe("MasherFactory", () => {
  describe("instance", () => {
    test("returns MasherClass instance", () => {
      expect(MovieMasher.masher.instance({})).toBeInstanceOf(MasherClass)
    })
  })
})
describe("Masher", () => {
  const values = Object.entries({
    loop: false,
    fps: 10,
    precision: 4,
    autoplay: true,
    volume: 0.4,
    buffer: 3,
  })
  const defaults = Object.entries(Default.masher)

  describe.each(defaults)("%s getter", (key, value) => {
    test("returns default", () => {
      const masher = MovieMasher.masher.instance()
      expect(masher[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    test("updates value", () => {
      const masher = MovieMasher.masher.instance()
      expect(masher[key]).not.toEqual(value)
      masher[key] = value
      if (masher[key] !== value) throw new Error(`${key} ${value} ${masher[key]}`)
      expect(masher[key]).toEqual(value)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const masher = MovieMasher.masher.instance()
      const clip = await masher.add(themeTextJson)
      expect(clip).toBeInstanceOf(ThemeClass)
      masher.draw()
      expectContext(masher.visibleContext)
    })
  })

  describe("canvas", () => {
    test("returns HTMLCanvasElement instance", () => {
      const masher = MovieMasher.masher.instance()
      const canvas = masher.canvas
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    })
  })
  describe("change", () => {
    test("throws when property blank", () => {
      const masher = MovieMasher.masher.instance()
      expect(() => masher.change("")).toThrowError(Errors.unknownMash)
    })
  })
  describe("changeEffect", () => {
    test("throws when there's no selected effect", () => {
      const masher = MovieMasher.masher.instance()
      expect(() => masher.changeEffect("a")).toThrowError(Errors.selection)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = createId()
      const masher = MovieMasher.masher.instance({ id })
      expect(masher.id).toEqual(id)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const masher = MovieMasher.masher.instance()
      await masher.add(themeTextJson)
      const time = Time.fromSeconds(2, masher.fps)
      await masher.goToTime(time)
      expect(masher.time).toEqual(time)
    })
  })
})
