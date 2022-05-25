import { Factory } from "../../Definitions/Factory"
import { TrackType } from "../../Setup/Enums"
import { mashInstance } from "../../Edited/Mash/MashFactory"
import { JestPreloader } from '../../../../../dev/test/Utilities/JestPreloader'
import { expectCanvasAtTime } from "../../../../../dev/test/Utilities/expectCanvas"
import { timeFromArgs, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { EditorDefinitionsClass } from "../../Editor"

describe("Transition", () => {
  describe("CrossFade", () => {
    const backcolors = ['rgb(0, 0, 0)', 'rgba(255, 255, 255, 0)']//
    test.each(backcolors)("draws expected context atop %s", async (backcolor) => {
      // const [] = backcolors
      const mashObject = { backcolor }
      const mash = mashInstance({ ...mashObject, preloader: new JestPreloader() })
      const { quantize } = mash
      const globeDefinition = Factory.image.definition({ id: 'globe-from', url: '../shared/image/globe.jpg' })
      const globeImage = globeDefinition.instance
      const cableDefinition = Factory.image.definition({ id: 'cable-to', url: '../shared/image/cable.jpg' })
      const cableImage = cableDefinition.instance
      const transitionDefinition = Factory.transition.definitionFromId("com.moviemasher.transition.crossfade")
      const transition = transitionDefinition.instance
      mash.addTrack(TrackType.Transition)
      mash.addClipToTrack(cableImage)
      mash.addClipToTrack(transition, 0, 0, 10)
      expect(transition.timeRange(quantize)).toEqual(timeRangeFromArgs(10, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(timeRangeFromArgs(0, quantize, 20))
      await expectCanvasAtTime(mash, timeFromArgs(3, quantize))
      await expectCanvasAtTime(mash, timeFromArgs(7, quantize))

      mash.addTrack(TrackType.Video)
      mash.addClipToTrack(globeImage, 1)
      cableImage.frame = 10
      transition.frame = 10
      expect(mash.frames).toEqual(30)
      expect(globeImage.timeRange(quantize)).toEqual(timeRangeFromArgs(0, quantize, 20))
      expect(transition.timeRange(quantize)).toEqual(timeRangeFromArgs(10, quantize, 10))
      expect(cableImage.timeRange(quantize)).toEqual(timeRangeFromArgs(10, quantize, 20))
      await expectCanvasAtTime(mash, timeFromArgs(13, quantize))
      await expectCanvasAtTime(mash, timeFromArgs(17, quantize))

      mash.removeClipFromTrack(cableImage)
      expect(globeImage.timeRange(quantize)).toEqual(timeRangeFromArgs(0, quantize, 20))
      expect(transition.timeRange(quantize)).toEqual(timeRangeFromArgs(10, quantize, 10))
      await expectCanvasAtTime(mash, timeFromArgs(13, quantize))
      await expectCanvasAtTime(mash, timeFromArgs(17, quantize))
    })
  })
})
