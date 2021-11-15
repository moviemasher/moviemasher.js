import { TrackType } from "../../Setup/Enums"
import { ContextFactory } from "../../Playing/ContextFactory"
import { Factory } from "../../Factory"
import { createId } from "../../Test/createId"
import { expectCanvas } from "../../Test/expectCanvas"
import { Cache } from "../../Loading/Cache"


describe("Effect", () => {
  describe("ChromaKey", () => {
    Cache.visibleContext.size = { width: 640, height: 480 }
    test("returns expected context", async () => {
      const effectObject = { id : "com.moviemasher.effect.chromakey", type: "effect" }
      const matteObject =  { id: createId(), url: 'assets/green-text-on-white.png' }
      const imageObject = { id: createId(), url: 'assets/cable.jpg' }
      const context = ContextFactory.toSize({ width: 640, height: 480 })
      const masher = Factory.masher.instance({ canvas: context.canvas })
      masher.addTrack(TrackType.Video)
      const matteImage = Factory.image.instance(matteObject)
      await masher.addClip(Factory.image.instance(imageObject))
      await masher.addClip(matteImage, 0, 1)
      masher.select(matteImage)
      await masher.add(effectObject)
      expectCanvas()
    })
  })

})
