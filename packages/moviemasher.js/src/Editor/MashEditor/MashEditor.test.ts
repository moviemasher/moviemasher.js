import { UnknownObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { Time } from "../../Helpers/Time"
import { MashEditorClass } from "./MashEditorClass"
import { ThemeClass } from "../../Media/Theme/ThemeInstance"
import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { Emitter } from "../../Helpers/Emitter"
import { MashEditorFactory } from "./MashEditorFactory"

import themeTextJson from "../../Definitions/DefinitionObjects/theme/text.json"
describe("MashEditorFactory", () => {
  describe("instance", () => {
    test("returns MashEditorClass instance", () => {
      expect(MashEditorFactory.instance({})).toBeInstanceOf(MashEditorClass)
    })
  })
})
describe("MashEditor", () => {
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
      const masher = <UnknownObject> <unknown> MashEditorFactory.instance()
      if (key === 'fps') expect(masher[key]).toEqual(Default.mash.quantize)
      else expect(masher[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    test("updates value", () => {
      const masher = <UnknownObject> <unknown> MashEditorFactory.instance()
      expect(masher[key]).not.toEqual(value)
      masher[key] = value
      if (masher[key] !== value) throw new Error(`${key} ${value} ${masher[key]}`)
      expect(masher[key]).toEqual(value)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const masher = MashEditorFactory.instance()
      const clip = await masher.add(themeTextJson)
      expect(clip).toBeInstanceOf(ThemeClass)
      expectCanvas(masher.mash.composition.visibleContext.canvas)
    })
  })

  describe("eventTarget", () => {
    test("returns Emitter instance", () => {
      const masher = MashEditorFactory.instance()
      const canvas = masher.eventTarget
      expect(canvas).toBeInstanceOf(Emitter)
    })
  })
  describe("change", () => {
    test("throws when property blank", () => {
      const masher = MashEditorFactory.instance()
      expect(() => masher.change("")).toThrowError(Errors.selection)
    })
    test("throws when there's no selected effect", () => {
      const masher = MashEditorFactory.instance()
      expect(() => masher.change("a")).toThrowError(Errors.selection)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const masher = MashEditorFactory.instance()
      await masher.add(themeTextJson)
      const time = Time.fromSeconds(2, masher.fps)
      await masher.goToTime(time)
      expect(masher.time).toEqual(time)
    })
  })
})