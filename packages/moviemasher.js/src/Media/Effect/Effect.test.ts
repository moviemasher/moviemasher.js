import { TrackType } from "../../Setup/Enums"
import { Factory } from "../../Definitions/Factory"
import { idGenerate } from "../../Utilities/Id"

import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { MashEditorFactory } from "../../Editor/MashEditor/MashEditorFactory"

describe("Effect", () => {
  describe("ChromaKey", () => {
    test("returns expected context", async () => {
      const effectObject = { id : "com.moviemasher.effect.chromakey", type: "effect" }
      const matteObject =  { id: idGenerate(), url: 'green-text-on-white.png' }
      const imageObject = { id: idGenerate(), url: 'cable.jpg' }
      const masher = MashEditorFactory.instance()
      masher.imageSize = { width: 640, height: 480 }
      masher.addTrack(TrackType.Video)
      expect(masher.mash.tracks.length).toBe(3)

      const matteImage = Factory.image.instance(matteObject)
      const imageImage = Factory.image.instance(imageObject)
      await masher.addClip(imageImage)
      await masher.addClip(matteImage, 0, 1)
      masher.selectClip(matteImage)
      await masher.add(effectObject)
      expect(masher.mash.trackOfTypeAtIndex(TrackType.Video, 0).clips).toEqual([imageImage])
      expect(masher.mash.trackOfTypeAtIndex(TrackType.Video, 1).clips).toEqual([matteImage])
      expectCanvas(masher.mash.composition.visibleContext.canvas)
    })
  })

})
