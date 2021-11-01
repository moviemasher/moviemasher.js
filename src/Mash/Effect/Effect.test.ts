import { TrackType } from "../../Setup/Enums"
import { ContextFactory } from "../../Playing/ContextFactory"
import { MovieMasher } from "../../MovieMasher"
import { createId } from "../../Test/createId"
import { expectCanvas } from "../../Test/expectCanvas"

describe("Effect", () => {
  describe("ChromaKey", () => {
    test("returns expected context", async () => {
      const effectObject = { id : "com.moviemasher.effect.chromakey", type: "effect" }
      const matteObject =  { id: createId(), url: 'assets/green-text-on-white.png' }
      const imageObject = { id: createId(), url: 'assets/cable.jpg' }
      const context = ContextFactory.toSize({ width: 640, height: 480 })
      const masher = MovieMasher.masher.instance({ canvas: context.canvas })
      masher.addTrack(TrackType.Video)
      const matteImage = MovieMasher.image.instance(matteObject)
      await masher.addClip(MovieMasher.image.instance(imageObject))
      await masher.addClip(matteImage, 0, 1)
      masher.select(matteImage)
      await masher.add(effectObject)
      expectCanvas(masher.canvas)
    })
  })

})
