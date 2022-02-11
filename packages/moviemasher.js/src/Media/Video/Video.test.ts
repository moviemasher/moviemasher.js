import { UnknownObject } from "../../declarations"
import { idGenerate } from "../../Utility/Id"
import { Factory } from "../../Definitions/Factory/Factory"

describe("Video", () => {
  describe("startOptions", () => {
    const clipObject = (object: UnknownObject = {}) => ({
      id: idGenerate(),
      url: 'file.mp4',
      duration: 30,
      frame: 0,
      frames: 300,
      trim: 0,
      ...object
    })

    test("returns expected timing", () => {
      const quantize = 30
      const zeroClip = Factory.video.instance(clipObject())
      const zeroZeroTiming = zeroClip.startOptions(0, quantize)
      expect(zeroZeroTiming.start).toEqual(0)
      expect(zeroZeroTiming.offset).toEqual(0)

      const zeroOneTiming = zeroClip.startOptions(1, quantize)
      expect(zeroOneTiming.start).toEqual(0)
      expect(zeroOneTiming.offset).toEqual(1)

      const trimClip = Factory.video.instance(clipObject({ trim: 30 }))
      const trimZeroTiming = trimClip.startOptions(0, quantize)
      expect(trimZeroTiming.start).toEqual(0)
      expect(trimZeroTiming.offset).toEqual(1)

      const trimOneTiming = trimClip.startOptions(1, quantize)
      expect(trimOneTiming.start).toEqual(0)
      expect(trimOneTiming.offset).toEqual(2)

      const oneClip = Factory.video.instance(clipObject({ frame: 30 }))

      const oneZeroTiming = oneClip.startOptions(0, quantize)
      expect(oneZeroTiming.start).toEqual(1)
      expect(oneZeroTiming.offset).toEqual(0)

      const oneOneTiming = oneClip.startOptions(1, quantize)
      expect(oneOneTiming.start).toEqual(0)
      expect(oneOneTiming.offset).toEqual(0)

      const bothClip = Factory.video.instance(clipObject({ frame: 30, trim: 30 }))
      const bothZeroTiming = bothClip.startOptions(0, quantize)
      expect(bothZeroTiming.start).toEqual(1)
      expect(bothZeroTiming.offset).toEqual(1)

      const bothOneTiming = bothClip.startOptions(1, quantize)
      expect(bothOneTiming.start).toEqual(0)
      expect(bothOneTiming.offset).toEqual(1)

      const bothTwoTiming = bothClip.startOptions(2, quantize)
      expect(bothTwoTiming.start).toEqual(0)
      expect(bothTwoTiming.offset).toEqual(2)

    })
  })
})
