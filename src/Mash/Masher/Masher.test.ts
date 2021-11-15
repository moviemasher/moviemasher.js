import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Time } from "../../Utilities/Time"
import { MasherClass } from "./MasherInstance"
import { Factory } from "../../Factory"
import { ThemeClass } from "../Theme/ThemeInstance"
import { expectCanvas } from "../../Test/expectCanvas"
import { createId } from "../../Test/createId"
import themeTextJson from "../../DefinitionObjects/theme/text.json"

describe("MasherFactory", () => {
  describe("instance", () => {
    test("returns MasherClass instance", () => {
      expect(Factory.masher.instance({})).toBeInstanceOf(MasherClass)
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
      const masher = Factory.masher.instance()
      if (key === 'fps') expect(masher[key]).toEqual(Default.mash.quantize)
      else expect(masher[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    test("updates value", () => {
      const masher = Factory.masher.instance()
      expect(masher[key]).not.toEqual(value)
      masher[key] = value
      if (masher[key] !== value) throw new Error(`${key} ${value} ${masher[key]}`)
      expect(masher[key]).toEqual(value)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const masher = Factory.masher.instance()
      const clip = await masher.add(themeTextJson)
      expect(clip).toBeInstanceOf(ThemeClass)
      expectCanvas()
    })
  })

  describe("eventTarget", () => {
    test("returns AudioContext instance", () => {
      const masher = Factory.masher.instance()
      const canvas = masher.eventTarget
      expect(canvas).toBeInstanceOf(AudioContext)
    })
  })
  describe("change", () => {
    test("throws when property blank", () => {
      const masher = Factory.masher.instance()
      expect(() => masher.change("")).toThrowError(Errors.unknownMash)
    })
  })
  describe("changeEffect", () => {
    test("throws when there's no selected effect", () => {
      const masher = Factory.masher.instance()
      expect(() => masher.changeEffect("a")).toThrowError(Errors.selection)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = createId()
      const masher = Factory.masher.instance({ id })
      expect(masher.id).toEqual(id)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const masher = Factory.masher.instance()
      await masher.add(themeTextJson)
      const time = Time.fromSeconds(2, masher.fps)
      await masher.goToTime(time)
      expect(masher.time).toEqual(time)
    })
  })
})
