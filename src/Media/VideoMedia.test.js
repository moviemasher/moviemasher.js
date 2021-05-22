import { MediaType } from "../Setup"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { VideoMedia } from "./VideoMedia"

describe("VideoMedia", () => {
  const mediaObject = {
    id: 'id',
    type: MediaType.video,
    duration: 3,
    url: '/media/',
  }
  const media = new VideoMedia(mediaObject)

  test("constructor", () => {
    expect(media.type).toEqual(MediaType.video)
    expect(media.id).toEqual(mediaObject.id)
  })

  test("duration", () => {
    expect(media.duration).toEqual(mediaObject.duration)
  })

  test("fps", () => { expect(media.fps).toEqual(10) })

  test("framesMax", () => { expect(media.framesMax).toEqual(30) })
  test("begin", () => { expect(media.begin).toEqual(1) })
  test("increment", () => { expect(media.increment).toEqual(1) })
  test("pattern", () => { expect(media.pattern).toEqual('%.jpg') })
  test("zeropadding", () => { expect(media.zeropadding).toEqual(2) })
  test("url", () => { expect(media.url).toEqual(mediaObject.url) })
  test("limitedTimeRange", () => {
    const range = TimeRangeFactory.createFromSeconds(0, 4)
    const options = { frame: 0, fps: 10, frames: 30 }
    const expected = TimeRangeFactory.createFromOptions(options)
    expect(media.limitedTimeRange(range)).toEqual(expected)
  })
  test("urlsVisibleInTimeRange", () => {
    const options = { frame: 0, fps: 10, frames: 1 }
    const range = TimeRangeFactory.createFromOptions(options)
    const url = media.urlsVisibleInTimeRangeForClipByType(range).image[0]
    expect(url).toEqual(`${mediaObject.url}01.jpg`)
  })
})
