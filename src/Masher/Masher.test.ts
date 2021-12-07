import { Errors } from "../Setup/Errors"
import { Default } from "../Setup/Default"
import { Time } from "../Utilities/Time"
import { MasherClass } from "./MasherInstance"
import { ThemeClass } from "../Mash/Theme/ThemeInstance"
import { expectCanvas } from "../../dev/test/Utilities/expectCanvas"
import themeTextJson from "../Definitions/DefinitionObjects/theme/text.json"
import { Emitter } from "../Utilities/Emitter"
import { MasherFactory } from "./MasherFactory"

describe("MasherFactory", () => {
  describe("instance", () => {
    test("returns MasherClass instance", () => {
      expect(MasherFactory.instance({})).toBeInstanceOf(MasherClass)
    })
  })
})
describe("Masher", () => {
  const values = Object.entries({
    loop: false,
    fps: 25,
    precision: 4,
    autoplay: true,
    volume: 0.4,
    buffer: 3,
  })
  const defaults = Object.entries(Default.masher)

  describe.each(defaults)("%s getter", (key, value) => {
    test("returns default", () => {
      const masher = MasherFactory.instance()
      if (key === 'fps') expect(masher[key]).toEqual(Default.mash.quantize)
      else expect(masher[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    test("updates value", () => {
      const masher = MasherFactory.instance()
      expect(masher[key]).not.toEqual(value)
      masher[key] = value
      if (masher[key] !== value) throw new Error(`${key} ${value} ${masher[key]}`)
      expect(masher[key]).toEqual(value)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const masher = MasherFactory.instance()
      const clip = await masher.add(themeTextJson)
      expect(clip).toBeInstanceOf(ThemeClass)
      expectCanvas()
    })
  })

  describe("eventTarget", () => {
    test("returns Emitter instance", () => {
      const masher = MasherFactory.instance()
      const canvas = masher.eventTarget
      expect(canvas).toBeInstanceOf(Emitter)
    })
  })
  describe("change", () => {
    test("throws when property blank", () => {
      const masher = MasherFactory.instance()
      expect(() => masher.change("")).toThrowError(Errors.selection)
    })
  })
  describe("changeEffect", () => {
    test("throws when there's no selected effect", () => {
      const masher = MasherFactory.instance()
      expect(() => masher.changeEffect("a")).toThrowError(Errors.selection)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const masher = MasherFactory.instance()
      await masher.add(themeTextJson)
      const time = Time.fromSeconds(2, masher.fps)
      await masher.goToTime(time)
      expect(masher.time).toEqual(time)
    })
  })
})
