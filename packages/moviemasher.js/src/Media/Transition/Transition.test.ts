import { Time } from "../../Helpers/Time"
import { TimeRange } from "../../Helpers/TimeRange"
import { Factory } from "../../Definitions/Factory"
import { idGenerate } from "../../Utility/Id"

import { expectCanvas } from "../../../../../dev/test/Utilities/expectCanvas"
import { TrackType } from "../../Setup/Enums"
import { Mash } from "../../Edited/Mash/Mash"
import { MashFactory } from "../../Edited/Mash/MashFactory"
import { JestPreloader } from '../../../../../dev/test/JestPreloader'

const expectMashTimeContext = async (mash: Mash, time: Time): Promise<void> => {
  mash.imageSize = { width: 640, height: 480 }
  const promise = mash.seekToTime(time)
  if (promise) await promise
  mash.draw()
  expectCanvas(mash.composition.visibleContext.canvas)
}

describe("Transition", () => {
  describe("CrossFade", () => {
    const backcolors = ['rgba(255, 255, 255, 0)', 'rgb(0, 0, 0)']
    test.each(backcolors)("draws expected context atop %s", async (backcolor) => {
      // const [] = backcolors
      const mashObject = { backcolor }
      const mash = MashFactory.instance(mashObject, [], new JestPreloader())
      const { quantize } = mash
      const globeDefinition = Factory.image.definition({ id: idGenerate(), url: 'globe.jpg' })
      const globeImage = globeDefinition.instance
      const cableDefinition = Factory.image.definition({ id: idGenerate(), url: 'cable.jpg' })
      const cableImage = cableDefinition.instance
      const transitionDefinition = Factory.transition.definitionFromId("com.moviemasher.transition.crossfade")
      const transition = transitionDefinition.instance
      mash.addTrack(TrackType.Transition)
      mash.addClipToTrack(cableImage)
      mash.addClipToTrack(transition, 0, 0, 10)
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      await expectMashTimeContext(mash, Time.fromArgs(3, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(7, quantize))

      mash.addTrack(TrackType.Video)
      mash.addClipToTrack(globeImage, 1)
      cableImage.frame = 10
      transition.frame = 10
      expect(globeImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 20))
      await expectMashTimeContext(mash, Time.fromArgs(13, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(17, quantize))

      mash.removeClipFromTrack(cableImage)
      expect(globeImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 10))
      await expectMashTimeContext(mash, Time.fromArgs(13, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(17, quantize))
    })
  })
})
