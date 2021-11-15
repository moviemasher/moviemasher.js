import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { Factory } from "../../Factory"
import { Mash } from "../Mash/Mash"
import { createId } from "../../Test/createId"
import { expectCanvas } from "../../Test/expectCanvas"
import { Cache } from "../../Loading/Cache"

const expectMashTimeContext = async (mash: Mash, time: Time): Promise<void> => {
  const promise = mash.seekToTime(time)
  if (promise) await promise
  mash.compositeVisible()
  expectCanvas()
}

describe("Transition", () => {
  Cache.visibleContext.size = { width: 640, height: 480 }
  describe("CrossFade", () => {
    const backcolors = ['rgba(255, 255, 255, 0)', 'rgb(0, 0, 0)']
    test.each(backcolors)("draws expected context atop %s", async (backcolor) => {
      const id = createId()
      const mashObject = { id, backcolor }
      const mash = Factory.mash.instance(mashObject)
      const { quantize } = mash
      const globeImage = Factory.image.instance({ id: createId(), url: 'assets/globe.jpg' })
      const cableImage = Factory.image.instance({ id: createId(), url: 'assets/cable.jpg' })
      const transition = Factory.transition.fromId("com.moviemasher.transition.crossfade")

      mash.addClipsToTrack([transition, cableImage])
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      await expectMashTimeContext(mash, Time.fromArgs(3, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(7, quantize))

      mash.addClipsToTrack([globeImage])
      expect(globeImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 20))
      await expectMashTimeContext(mash, Time.fromArgs(13, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(17, quantize))

      mash.removeClipsFromTrack([cableImage])
      expect(globeImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 10))
      await expectMashTimeContext(mash, Time.fromArgs(13, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(17, quantize))
    })
  })
})
