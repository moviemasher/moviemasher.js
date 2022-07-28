import { DefinitionType, EditType, TrackType } from "../../Setup/Enums"
import { expectCanvasAtTime } from "../../../../../dev/test/Utilities/expectMashSvg"
import { editorInstance } from "../../Editor/EditorFactory"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { assertMash } from "../../Edited/Mash/Mash"
import { effectDefinitionFromId } from "./EffectFactory"
import { imageDefinition } from "../Image/ImageFactory"
import { ImageDefinitionObject } from "../Image/Image"
import { Defined } from "../../Base/Defined"
import { clipInstance } from "../Clip/ClipFactory"

describe("Effect", () => {
  describe("ChromaKey", () => {
    test("returns expected context", async () => {
      const matteDefinitionObject: ImageDefinitionObject = {
        id: 'text-matte', url: '../shared/image/green-text-on-white.png',
        type: DefinitionType.Image
      }
      const imageDefinitionObject: ImageDefinitionObject = {
        id: 'cable-image', url: '../shared/image/cable.jpg',
        type: DefinitionType.Image
      }
      const editor = editorInstance({ editType: EditType.Mash, preloader: new JestPreloader() })
      editor.load({mash: {}})
      const { edited } = editor
      assertMash(edited)
      Defined.define(matteDefinitionObject, imageDefinitionObject)
      editor.imageSize = { width: 640, height: 480 }
      editor.addTrack(TrackType.Video)
      expect(edited.tracks.length).toBe(3)
      const matteDefinition = imageDefinition(matteDefinitionObject)
      const cableDefinition = imageDefinition(imageDefinitionObject)

      const effectDefinition = effectDefinitionFromId("com.moviemasher.effect.chromakey")

      const clip = clipInstance({ 
        contentId: cableDefinition.id, 
        containerId: matteDefinition.id,
        container: {
          effects: [
            { definitionId: effectDefinition.id }
          ]
        }
      })
      await editor.addClip(clip)
      expectCanvasAtTime(editor)
    })
  })
})
