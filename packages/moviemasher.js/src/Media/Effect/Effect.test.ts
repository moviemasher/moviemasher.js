import { TrackType } from "../../Setup/Enums"
import { Factory } from "../../Definitions/Factory"

import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { mashEditorInstance } from "../../Editor/MashEditor/MashEditorFactory"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"

describe("Effect", () => {
  describe("ChromaKey", () => {
    test("returns expected context", async () => {
      const effectObject = { id : "com.moviemasher.effect.chromakey", type: "effect" }
      const matteObject =  { id: 'text-matte', url: '../shared/image/green-text-on-white.png' }
      const imageObject = { id: 'cable-image', url: '../shared/image/cable.jpg' }
      const masher = mashEditorInstance({ preloader: new JestPreloader()})
      masher.imageSize = { width: 640, height: 480 }
      masher.addTrack(TrackType.Video)
      expect(masher.edited.tracks.length).toBe(3)

      const matteImage = Factory.image.instance(matteObject)
      const imageImage = Factory.image.instance(imageObject)
      await masher.addClip(imageImage)
      await masher.addClip(matteImage, 0, 1)
      masher.selectClip(matteImage)
      await masher.add(effectObject)
      expect(masher.edited.trackOfTypeAtIndex(TrackType.Video, 0).clips).toEqual([imageImage])
      expect(masher.edited.trackOfTypeAtIndex(TrackType.Video, 1).clips).toEqual([matteImage])
      expectCanvas(masher.edited.composition.visibleContext.canvas)
    })
  })

})
