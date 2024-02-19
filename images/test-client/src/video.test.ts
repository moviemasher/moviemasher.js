import assert from 'assert'
import { describe, test } from 'node:test'

import { VIDEO, VideoClass, idGenerateString, timeRangeFromArgs, videoDefinition, videoInstance } from '../../../packages/@moviemasher/shared-lib/src/runtime.js'

describe('Video', () => {
  describe('startOptions', () => {
    test('returns expected options', () => {
      const clipObject = object => {
        object ||= {}
        return {
        id: idGenerateString(),
        url: 'file.mp4',
        duration: 30,
        frame: 0,
        frames: 300,
        trim: 0,
        ...object
      }}
      const quantize = 30
      const timeRange = timeRangeFromArgs(0, quantize)
      const zeroClip = videoInstance(clipObject())
      const zeroZeroTiming = zeroClip.startOptions(0, timeRange)
      assert.equal(zeroZeroTiming.start, 0)
      assert.equal(zeroZeroTiming.offset, 0)

      const zeroOneTiming = zeroClip.startOptions(1, timeRange)
      assert.equal(zeroOneTiming.start, 0)
      assert.equal(zeroOneTiming.offset, 1)

      const trimClip = videoInstance(clipObject({ startTrim: 30 }))
      const trimZeroTiming = trimClip.startOptions(0, timeRange)
      assert.equal(trimZeroTiming.start, 0)
      assert.equal(trimZeroTiming.offset, 1)

      const trimOneTiming = trimClip.startOptions(1, timeRange)
      assert.equal(trimOneTiming.start, 0)
      assert.equal(trimOneTiming.offset, 2)
    })

    const definitionObject = {
      id: idGenerateString(),
      url: 'file.mp4',
      type: VIDEO,
      fps: 30, duration: 10
    }
    const definition = () => videoDefinition(definitionObject)

    test('returns VideoClass instance', () => {
      assert(definition().instanceFromObject() instanceof VideoClass)
    })
  })
})

