import { describe, test } from 'node:test'
import assert from 'assert'

import { timeFromArgs, timeFromSeconds } from '@moviemasher/lib-core'

describe('Time', () => {
  describe('create', () => {
    test('returns supplied frame and fps', () => {
      const time = timeFromArgs(1, 30)
      assert.equal(time.frame, 1)
      assert.equal(time.fps, 30)
    })
  })
  describe('createFromSeconds', () => {
    test('throws when seconds is invalid', () => {
      const frameString = '0'
      assert.throws(() => timeFromSeconds(frameString, 1))
      assert.throws(() => timeFromSeconds(-1, 1))
    })
    test('throws when fps is invalid', () => {
      const framesString = '1'
      assert.throws(() => timeFromSeconds(0, framesString))
      assert.throws(() => timeFromSeconds(0, 0))
      assert.throws(() => timeFromSeconds(0, 1.1))
    })
    test('returns zero frame and one fps for no arguments', () => {
      const time = timeFromSeconds()
      assert.equal(time.frame, 0)
      assert.equal(time.fps, 1)
    })
    test('returns supplied frame and fps', () => {
      const seconds = 4
      const fps = 20
      const time = timeFromSeconds(seconds, fps)
      assert.equal(time.frame, seconds * fps)
      assert.equal(time.fps, fps)
    })
    test('returns proper frame for float', () => {
      const seconds = 4.55
      const fps = 10
      const time = timeFromSeconds(seconds, fps, 'floor')
      assert.equal(time.frame, 45)
    })
  })
})

describe('Time', () => {
  const makeTimes = (quantize = 1, count = 100) => (
    (new Array(count).fill(true)).map((_, i) => (
      timeFromArgs(i, quantize)
    ))
  )

  const times1 = makeTimes()
  const times10 = makeTimes(10)
  const times30 = makeTimes(30)
  describe('constructor', () => {
    test('throws when frame is invalid', () => {
      const frameString = '0' // so we can actually call it
      assert.throws(() => timeFromArgs(frameString, 1))
      assert.throws(() => timeFromArgs(-1, 1))
      assert.throws(() => timeFromArgs(0.1, 1))
    })
    test('throws when fps is invalid', () => {
      const fpsString = '1' // so we can actually call it
      assert.throws(() => timeFromArgs(0, fpsString))
      assert.throws(() => timeFromArgs(0, 0))
      assert.throws(() => timeFromArgs(0, 1.1))
    })
    test('returns zero frame and one fps for no arguments', () => {
      const time = timeFromArgs()
      assert.equal(time.frame, 0)
      assert.equal(time.fps, 1)
    })
    test('supplied frame and fps', () => {
      const frame = 4
      const fps = 20
      const time = timeFromArgs(frame, fps)
      assert.equal(time.frame, frame)
      assert.equal(time.fps, fps)
    })
  })
  describe('equalsTime', () => {
    const mins = [
      ['equal', [times1[0], times10[0], times30[0]]],
      ['equal', [times1[1], times10[10], times30[30]]],
      ['callee is earlier', [times10[0], times10[1], times10[0]]],
      ['callee is earlier', [times10[1], times1[1], times10[1]]],
      ['callee is later', [times10[1], times10[0], times10[0]]],
      ['callee is later', [times1[1], times10[1], times10[1]]],
    ]
    mins.forEach(array => {
      const [name, examples] = array
      const [time1, time2, expected] = examples 
        test(`${time1}.min(${time2}) returns ${expected} when ${name}`, () => {
          assert(time1.min(time2).equalsTime(expected))
        })

    })
    describe.each(mins)('when %s', () => {
      
    })
  })
  describe('scale', () => {
    test('returns scaled time', () => {
      const time = timeFromArgs(1, 30)
      const scaled = time.scale(10)
      assert.equal(scaled.frame, 0)
    })
  })
})
