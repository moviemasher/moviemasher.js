import { UnknownObject } from "../declarations"
import { Default } from "../Setup/Default"
import { EditorClass } from "./EditorClass"
import { Emitter } from "../Helpers/Emitter"
import { editorInstance } from "./EditorFactory"
import { JestPreloader } from "../../../../dev/test/Utilities/JestPreloader"
import { Editor, EditorOptions } from "./Editor"
import { timeFromSeconds } from "../Helpers/Time/TimeUtilities"
import { assertMash } from "../Edited/Mash/Mash"
import { EditType } from "../Setup/Enums"
import { ClipClass } from "../Edited/Mash/Track/Clip/ClipClass"
import visibleDefaultJson from "../Definitions/DefinitionObjects/content/default.json"

const createEditor = (): Editor => {
  const preloader = new JestPreloader()
  const options: EditorOptions = { 
    editType: EditType.Mash, preloader, dimensions: { width: 480, height: 270 } 
  }
  return editorInstance(options)
}
describe("EditorFactory", () => {
  describe("editorInstance", () => {
    test("returns EditorClass instance", () => {
      expect(createEditor()).toBeInstanceOf(EditorClass)
    })
  })
})

describe("Editor", () => {
  const editorTestValues = Object.entries({
    loop: false,
    fps: 25,
    precision: 4,
    autoplay: true,
    volume: 0.4,
    buffer: 3,
  })
  
  const editorTestDefaults = Object.entries(Default.editor)

  describe.each(editorTestDefaults)("%s getter", (key, value) => {
    test("returns default", () => {
      const editor = createEditor() as unknown as UnknownObject
      if (key === 'fps') expect(editor[key]).toEqual(Default.editor.fps)
      else expect(editor[key]).toEqual(value)
    })
  })

  describe.each(editorTestValues)("%s setter", (key, value) => {
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
      await editor.load({ mash: {}, definitions: [] })

      const { edited } = editor
      assertMash(edited)

      await editor.add(visibleDefaultJson, {})
      const [clip] = edited.tracks[0].clips
      expect(clip).toBeInstanceOf(ClipClass)
    })
  })

  describe("eventTarget", () => {
    test("returns Emitter instance", () => {
      const editor = createEditor()
      const { eventTarget } = editor
      expect(eventTarget).toBeInstanceOf(Emitter)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const editor = createEditor()
      // expect(editor.edited).toBeUndefined()
      await editor.load({ mash: {}, definitions: [] })
      const { edited } = editor
      assertMash(edited)

      await editor.add(visibleDefaultJson, {})
      expect(edited.frames).toEqual(30)
      const time = timeFromSeconds(2, editor.fps)
      await editor.goToTime(time)
      expect(editor.time).toEqual(time)
    })
  })

  describe("selectedItems", () => {
    test("returns expected properties", async () => {
      const editor = createEditor()
      await editor.load({ mash: {}, definitions: []})
      // masher.add(themeTextJson)
      const selectedItems = editor.selection.selectedItems()
      // console.log('selectedItems', selectedItems)
      expect(selectedItems.length).toEqual(2)
    })
  })
})
