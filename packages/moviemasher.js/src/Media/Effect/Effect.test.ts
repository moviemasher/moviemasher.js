import { DefinitionType, EditType, TrackType } from "../../Setup/Enums"
import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { editorInstance } from "../../Editor/EditorFactory"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { Clip } from "../../Mixin/Clip/Clip"
import { Effect } from "./Effect"
import { assertMash } from "../../Edited"

describe("Effect", () => {
  describe("ChromaKey", () => {
    test("returns expected context", async () => {
      const matteObject = {
        id: 'text-matte', url: '../shared/image/green-text-on-white.png',
        type: DefinitionType.Image
      }
      const imageObject = {
        id: 'cable-image', url: '../shared/image/cable.jpg',
        type: DefinitionType.Image
      }
      const editor = editorInstance({ editType: EditType.Mash, preloader: new JestPreloader() })
      editor.load({mash: {}})
      const { definitions, edited } = editor
      assertMash(edited)
      definitions.define([matteObject, imageObject])
      editor.imageSize = { width: 640, height: 480 }
      editor.addTrack(TrackType.Video)
      expect(edited.tracks.length).toBe(3)
      const matteDefinition = definitions.fromId(matteObject.id)
      const imageDefinition = definitions.fromId(imageObject.id)
      const effectDefinition = definitions.fromId("com.moviemasher.effect.chromakey")
      const matteImage = matteDefinition.instanceFromObject({ definition: matteDefinition }) as Clip
      const imageImage = imageDefinition.instanceFromObject({ definition: imageDefinition }) as Clip
      await editor.addClip(imageImage)
      await editor.addClip(matteImage, 0, 1)
      editor.select(matteImage)
      await editor.addEffect(effectDefinition.instance as Effect)
      expect(edited.trackOfTypeAtIndex(TrackType.Video, 0).clips).toEqual([imageImage])
      expect(edited.trackOfTypeAtIndex(TrackType.Video, 1).clips).toEqual([matteImage])
      expectCanvas(edited.visibleContext.canvas)
    })
  })

})
