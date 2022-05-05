import { UnknownObject } from "../../declarations"
import { Default } from "../../Setup/Default"
import { MashEditorClass } from "./MashEditorClass"
import { ThemeClass } from "../../Media/Theme/ThemeClass"
import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { Emitter } from "../../Helpers/Emitter"
import { mashEditorInstance } from "./MashEditorFactory"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { MashEditor } from "./MashEditor"

import themeTextJson from "../../Definitions/DefinitionObjects/theme/text.json"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"

const editorInstance = (): MashEditor => {
  return mashEditorInstance({ preloader: new JestPreloader()})
}
describe("MashEditorFactory", () => {

  describe("instance", () => {
    test("returns MashEditorClass instance", () => {
      expect(mashEditorInstance({})).toBeInstanceOf(MashEditorClass)
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
      const masher = <UnknownObject> <unknown> editorInstance()
      if (key === 'fps') expect(masher[key]).toEqual(Default.masher.fps)
      else expect(masher[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    test("updates value", () => {
      const masher = <UnknownObject> <unknown> editorInstance()
      expect(masher[key]).not.toEqual(value)
      masher[key] = value
      if (masher[key] !== value) throw new Error(`${key} ${value} ${masher[key]}`)
      expect(masher[key]).toEqual(value)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const masher = editorInstance()
      const clip = await masher.add(themeTextJson)
      expect(clip).toBeInstanceOf(ThemeClass)
      expectCanvas(masher.edited.composition.visibleContext.canvas)
    })
  })

  describe("eventTarget", () => {
    test("returns Emitter instance", () => {
      const masher = editorInstance()
      const canvas = masher.eventTarget
      expect(canvas).toBeInstanceOf(Emitter)
    })
  })
  // describe("change", () => {
  //   test("throws when property blank", () => {
  //     const masher = editorInstance()
  //     expect(() => masher.change("")).toThrowError(Errors.selection)
  //   })
  //   test("throws when there's no selected effect", () => {
  //     const masher = editorInstance()
  //     expect(() => masher.change("a")).toThrowError(Errors.selection)
  //   })
  // })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const masher = editorInstance()
      await masher.add(themeTextJson)
      const time = timeFromSeconds(2, masher.fps)
      await masher.goToTime(time)
      expect(masher.time).toEqual(time)
    })
  })


  describe("selectedProperties", () => {
    test("returns expected properties", () => {
      const masher = editorInstance()
      // masher.add(themeTextJson)
      const selectedProperties = masher.selectedProperties
      // console.log('selectedProperties', selectedProperties)
      expect(selectedProperties.length).toEqual(2)
    })
  })

})
