import { expectContext } from "../../../test/expectContext"
import { ThemeClass } from "../../Mash/Theme/ThemeInstance"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Time } from "../../Utilities"

import themeTextJson from "../../Mash/Theme/DefinitionObjects/text.json"
import { MasherClass } from "./Masher"

describe("MasherClass", () => {
  describe("constructor", () => {
    test("returns MasherClass instance", () => {
      expect(new MasherClass()).toBeInstanceOf(MasherClass)
    })
  })
  const values = Object.entries({
    loop: false,
    fps: 10,
    precision: 4,
    autoplay: true,
    volume: 0.4,
    buffer: 3,
  })
  const defaults = Object.entries(Default)

  describe.each(defaults)("%s getter", (key, value) => {
    if (["mash", "media", "clip"].includes(key)) return

    const masher = new MasherClass()
    test("returns default", () => {
      expect(masher[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    const masher = new MasherClass()
    test("updates value", () => {
      expect(masher[key]).not.toEqual(value)
      masher[key] = value
      if (masher[key] !== value) throw new Error(`${key} ${value} ${masher[key]}`)
      expect(masher[key]).toEqual(value)
    })
  })
  describe("canvas", () => {
    test("returns HTMLCanvasElement instance", () => {
      const masher = new MasherClass()
      const canvas = masher.canvas
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    })
  })
  describe("change", () => {
    test("throws when property blank", () => {
      const masher = new MasherClass()
      expect(() => masher.change("")).toThrowError(Errors.unknownMash)
    })
  })
  describe("changeEffect", () => {
    test("throws when there's no selected effect", () => {
      const masher = new MasherClass()
      expect(() => masher.changeEffect("a")).toThrowError(Errors.selection)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const masher = new MasherClass({})
      const clip = await masher.add(themeTextJson)
      expect(clip).toBeInstanceOf(ThemeClass)
      masher.draw()
      expectContext(masher.visibleContext)
    })
  })
  describe("currentTime", () => {
    test("returns", () => {
      const masher = new MasherClass()
      masher.add(themeTextJson)
      expect(masher.currentTime).toEqual(0)
      masher.frame = 3
      expect(masher.frame).toEqual(3)
      expect(masher.currentTime).toEqual(0.1)

    })
  })
  describe("frame", () => {
    test("returns what is set", () => {
      const masher = new MasherClass()
      masher.add(themeTextJson)
      expect(masher.currentTime).toEqual(0)
      masher.frame = 3
      expect(masher.frame).toEqual(3)
    })
  })
  describe("time", () => {
    test("returns what is set", () => {
      const masher = new MasherClass()
      masher.add(themeTextJson)
      expect(masher.currentTime).toEqual(0)
      const time = Time.fromArgs(3, 30)
      masher.time = time
      expect(masher.time.equalsTime(time)).toBeTruthy()
    })
  })
})
