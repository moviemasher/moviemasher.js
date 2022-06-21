import { DefinitionType, EditType, TrackType } from "../../Setup/Enums"
import { expectCanvasAtTime } from "../../../../../dev/test/Utilities/expectMashSvg"
import { editorInstance } from "../../Editor/EditorFactory"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { assertMash } from "../../Edited/Mash/Mash"
import { effectDefinitionFromId } from "./EffectFactory"
import { imageDefinition } from "../Image/ImageFactory"
import { ImageDefinitionObject } from "../Image/Image"
import { Defined } from "../../Base/Defined"

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

      expect(cableDefinition.preloadableSource(true)).toBe(imageDefinitionObject.url)
      expect(matteDefinition.preloadableSource(true)).toBe(matteDefinitionObject.url)
      const effectDefinition = effectDefinitionFromId("com.moviemasher.effect.chromakey")
      const matteImage = matteDefinition.instanceFromObject()
      const imageImage = cableDefinition.instanceFromObject()
      await editor.addClip(imageImage)
      await editor.addClip(matteImage, 0, 1)
      editor.select(matteImage)
      await editor.addEffect(effectDefinition.instanceFromObject())
      expect(edited.trackOfTypeAtIndex(TrackType.Video, 0).clips).toEqual([imageImage])
      expect(edited.trackOfTypeAtIndex(TrackType.Video, 1).clips).toEqual([matteImage])
      expectCanvasAtTime(editor)
    })
  })
})
