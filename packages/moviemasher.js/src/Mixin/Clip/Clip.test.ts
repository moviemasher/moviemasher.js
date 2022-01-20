import { Factory } from "../../Definitions/Factory/Factory"
import { TimeRange } from "../../Helpers/TimeRange"
import { Default } from "../../Setup/Default"
import { RenderType } from "../../Setup/Enums"


describe("Clip", () => {
  describe("layer", () => {

    test("returns Layer", () => {
      const videoObject = {
        id: 'video-id',
        url: 'assets/video.mp4',
        duration: 10
      }
      const instanceObject = {
        frames: 10,
        effects: [{ id: 'com.moviemasher.effects.text', text: 'hehe' }]
      }
      const clip = Factory.video.definition(videoObject).instanceFromObject(instanceObject)
      const timeRange = TimeRange.fromArgs()
      const quantize = 10
      const size = { width: 640, height: 480 }
      const rate = Default.mash.output.fps
      const type = RenderType.Stream
      const layer = clip.layerOrThrow({type, quantize, timeRange, size, rate})
      console.log(layer)

      const { merger, filters, inputs } = layer
      expect(inputs).toBeDefined()
      expect(merger).toBeDefined()
      expect(filters).toBeDefined()
    })
  })
})
