import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { Factory } from "../../Definitions/Factory"
import { Mash } from "../Mash/Mash"
import { idGenerate } from "../../Utilities/Id"

import { expectCanvas } from "../../../dev/test/Utilities/expectCanvas"
import { Cache } from "../../Loading/Cache"
import { MashFactory } from "../Mash/MashFactory"
import { TrackType } from "../../Setup/Enums"

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
      // const [] = backcolors
      const mashObject = { backcolor }
      const mash = MashFactory.instance(mashObject)
      const { quantize } = mash
      const globeDefinition = Factory.image.definition({ id: idGenerate(), url: 'assets/globe.jpg' })
      const globeImage = globeDefinition.instance
      const cableDefinition = Factory.image.definition({ id: idGenerate(), url: 'assets/cable.jpg' })
      const cableImage = cableDefinition.instance
      const transitionDefinition = Factory.transition.definitionFromId("com.moviemasher.transition.crossfade")
      const transition = transitionDefinition.instance
      mash.addTrack(TrackType.Transition)
      mash.addClipsToTrack([cableImage])
      mash.addClipsToTrack([transition], 0, 0, [10])
      expect(transition.timeRange(quantize)).toEqual(TimeRange.fromArgs(10, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(TimeRange.fromArgs(0, quantize, 20))
      await expectMashTimeContext(mash, Time.fromArgs(3, quantize))
      await expectMashTimeContext(mash, Time.fromArgs(7, quantize))

      mash.addTrack(TrackType.Video)
      mash.addClipsToTrack([globeImage], 1)
      cableImage.frame = 10
      transition.frame = 10
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
