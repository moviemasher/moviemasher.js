import { UnknownObject } from "../declarations"
import { Default } from "../Setup/Default"
import { EditorClass } from "./EditorClass"
import { expectCanvasAtTime } from "../../../../dev/test/Utilities/expectMashSvg"
import { Emitter } from "../Helpers/Emitter"
import { editorInstance } from "./EditorFactory"
import { JestPreloader } from "../../../../dev/test/Utilities/JestPreloader"
import { Editor } from "./Editor"

import { timeFromSeconds } from "../Helpers/Time/TimeUtilities"
import { assertMash } from "../Edited/Mash/Mash"
import { EditType } from "../Setup/Enums"
import { ClipClass } from "../Edited/Mash/Track/Clip/ClipClass"

import visibleDefaultJson from "../Definitions/DefinitionObjects/content/default.json"

const createEditor = (): Editor => {
  return editorInstance({ editType: EditType.Mash, preloader: new JestPreloader()})
}
describe("EditorFactory", () => {

  describe("editorInstance", () => {
    test("returns EditorClass instance", () => {
      expect(createEditor()).toBeInstanceOf(EditorClass)
    })
  })
})

describe("Editor", () => {
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
      const editor = createEditor() as unknown as UnknownObject
      if (key === 'fps') expect(editor[key]).toEqual(Default.masher.fps)
      else expect(editor[key]).toEqual(value)
    })
  })

  describe.each(values)("%s setter", (key, value) => {
    test("updates value", () => {
      const editor = createEditor() as unknown as UnknownObject
      expect(editor[key]).not.toEqual(value)
      editor[key] = value
      if (editor[key] !== value) throw new Error(`${key} ${value} ${editor[key]}`)
      expect(editor[key]).toEqual(value)
    })
  })

  describe("add", () => {
    test("returns promise that loads clip", async () => {
      const editor = createEditor()
      editor.load({ mash: {} })

      const clip = await editor.add(visibleDefaultJson)
      expect(clip).toBeInstanceOf(ClipClass)
      const { edited } = editor
      assertMash(edited)
      expectCanvasAtTime(editor)
    })
  })

  describe("eventTarget", () => {
    test("returns Emitter instance", () => {
      const editor = createEditor()
      const canvas = editor.eventTarget
      expect(canvas).toBeInstanceOf(Emitter)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const editor = createEditor()
      expect(editor.edited).toBeUndefined()
      editor.load({ mash: {} })
      const { edited } = editor
      assertMash(edited)

      await editor.add(visibleDefaultJson)
      expect(edited.frames).toEqual(30)
      const time = timeFromSeconds(2, editor.fps)
      await editor.goToTime(time)
      expect(editor.time).toEqual(time)
    })
  })


  describe("selectedItems", () => {
    test("returns expected properties", () => {
      const editor = createEditor()
      editor.load({ mash: {}, definitions: []})
      // masher.add(themeTextJson)
      const selectedItems = editor.selection.selectedItems()
      // console.log('selectedItems', selectedItems)
      expect(selectedItems.length).toEqual(2)
    })
  })

})
