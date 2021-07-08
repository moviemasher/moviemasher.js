import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { ContextFactory } from "../../Playing/ContextFactory"
import { MovieMasher } from "../../MovieMasher"
import { Mash } from "../Mash/Mash"
import { createId } from "../../Test/createId"
import { expectContext } from "../../Test/expectContext"

const expectMashTimeContext = async (mash : Mash, time : Time) : Promise<void> => {
  await mash.seekToTime(time)
  mash.compositeVisible()
  expectContext(mash.visibleContext)
}
describe("Transition", () => {
  describe("CrossFade", () => {
    const backcolors = ['rgba(255, 255, 255, 0)', 'rgb(0, 0, 0)']
    test.each(backcolors)("draws expected context atop %s", async (backcolor) => {
      const id = createId()
      const visibleContext = ContextFactory.toSize({ width: 640, height: 480 })
      const mashObject = { id, visibleContext, backcolor }
      const mash = MovieMasher.mash.instance(mashObject)
      const { quantize } = mash
      const globeImage = MovieMasher.image.instance({ id: createId(), url: 'Assets/globe.jpg' })
      const cableImage = MovieMasher.image.instance({ id: createId(), url: 'Assets/cable.jpg' })
      const transition = MovieMasher.transition.fromId("com.moviemasher.transition.crossfade")

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
