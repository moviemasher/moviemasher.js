import { TrackType } from "../../Setup/Enums"
import { Factory } from "../../Definitions/Factory"

import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { mashEditorInstance } from "../../Editor/MashEditor/MashEditorFactory"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { DefinitionType } from "../../../dist/moviemasher"
import { Clip } from "../../Mixin/Clip/Clip"
import { Effect } from "./Effect"

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
      const masher = mashEditorInstance({ preloader: new JestPreloader() })
      const { definitions } = masher
      definitions.define([matteObject, imageObject])
      masher.imageSize = { width: 640, height: 480 }
      masher.addTrack(TrackType.Video)
      expect(masher.edited.tracks.length).toBe(3)
      const matteDefinition = definitions.fromId(matteObject.id)
      const imageDefinition = definitions.fromId(imageObject.id)
      const effectDefinition = definitions.fromId("com.moviemasher.effect.chromakey")
      const matteImage = matteDefinition.instanceFromObject({ definition: matteDefinition }) as Clip
      const imageImage = imageDefinition.instanceFromObject({ definition: imageDefinition }) as Clip
      await masher.addClip(imageImage)
      await masher.addClip(matteImage, 0, 1)
      masher.selectClip(matteImage)
      await masher.addEffect(effectDefinition.instance as Effect)
      expect(masher.edited.trackOfTypeAtIndex(TrackType.Video, 0).clips).toEqual([imageImage])
      expect(masher.edited.trackOfTypeAtIndex(TrackType.Video, 1).clips).toEqual([matteImage])
      expectCanvas(masher.edited.composition.visibleContext.canvas)
    })
  })

})
