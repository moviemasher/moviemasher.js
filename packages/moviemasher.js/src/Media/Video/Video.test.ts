import { UnknownObject } from "../../declarations"
import { idGenerateString } from "../../Utility/Id"
import { timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { videoInstance } from "./VideoFactory"

describe("Video", () => {
  describe("startOptions", () => {
    test("returns expected options", () => {
      const clipObject = (object: UnknownObject = {}) => ({
        id: idGenerateString(),
        url: 'file.mp4',
        duration: 30,
        frame: 0,
        frames: 300,
        trim: 0,
        ...object
      })
      const quantize = 30
      const timeRange = timeRangeFromArgs(0, quantize)
      const zeroClip = videoInstance(clipObject())
      const zeroZeroTiming = zeroClip.startOptions(0, timeRange)
      expect(zeroZeroTiming.start).toEqual(0)
      expect(zeroZeroTiming.offset).toEqual(0)

      const zeroOneTiming = zeroClip.startOptions(1, timeRange)
      expect(zeroOneTiming.start).toEqual(0)
      expect(zeroOneTiming.offset).toEqual(1)

      const trimClip = videoInstance(clipObject({ startTrim: 30 }))
      const trimZeroTiming = trimClip.startOptions(0, timeRange)
      expect(trimZeroTiming.start).toEqual(0)
      expect(trimZeroTiming.offset).toEqual(1)

      const trimOneTiming = trimClip.startOptions(1, timeRange)
      expect(trimOneTiming.start).toEqual(0)
      expect(trimOneTiming.offset).toEqual(2)
    })
  })
})
