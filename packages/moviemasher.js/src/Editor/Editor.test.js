import { describe, test } from 'node:test'
import assert from 'assert'

import { JestPreloader } from "../../../../images/tester/Utilities/JestPreloader.mjs"

import { 
  Default, EditorClass, Emitter, editorInstance, timeFromSeconds, assertMash,
  EditType, ClipClass 
} from "@moviemasher/moviemasher.js"

import visibleDefaultJson from "../DefinitionObjects/content/default.json" assert { type: "json" }


const createEditor = () => {
  const options = { 
    editType: EditType.Mash, dimensions: { width: 480, height: 270 } 
  }
  return editorInstance(options)
}

describe("Editor", () => {
  describe("editorInstance", () => {
    test("returns EditorClass instance", () => {
      assert(createEditor() instanceof EditorClass)
    })
  })

  Object.entries(Default.editor).forEach(array => {
    const [key, value] = array
    test(`${key} getter retrieves value`, () => {
      const editor = createEditor() 
      if (key === 'fps') assert.equal(editor[key], Default.editor.fps)
      else assert.equal(editor[key], value)
    })
  })

  Object.entries({
    loop: false,
    fps: 25,
    precision: 4,
    autoplay: true,
    volume: 0.4,
    buffer: 3,
  }).forEach(array => {
    const [key, value] = array
     test(`${key} setter updates value`, () => {
      const editor = createEditor() 
      assert.notEqual(editor[key], value)
      editor[key] = value
      if (editor[key] !== value) throw new Error(`${key} ${value} ${editor[key]}`)
      assert.equal(editor[key], value)
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
      assert(clip instanceof ClipClass)
    })
  })

  describe("eventTarget", () => {
    test("returns Emitter instance", () => {
      const editor = createEditor()
      const { eventTarget } = editor
      assert(eventTarget instanceof Emitter)
    })
  })

  describe("goToTime", () => {
    test("returns what is set after resolving promise", async () => {
      const editor = createEditor()
      await editor.load({ mash: {}, definitions: [] })
      const { edited } = editor
      assertMash(edited)

      await editor.add(visibleDefaultJson, {})
      assert.equal(edited.frames, 30)
      const time = timeFromSeconds(2, editor.fps)
      await editor.goToTime(time)
      assert.deepStrictEqual(editor.time, time)
    })
  })

  describe("selectedItems", () => {
    test("returns expected properties", async () => {
      const editor = createEditor()
      await editor.load({ mash: {}, definitions: []})
      // masher.add(themeTextJson)
      const selectedItems = editor.selection.selectedItems()
      // console.log('selectedItems', selectedItems)
      assert.equal(selectedItems.length, 2)
    })
  })
})
