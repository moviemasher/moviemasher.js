import { Id } from "../Utilities"
import { MediaType } from "../Setup"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { VideoMedia } from "./VideoMedia"

  
describe("VideoMedia", () => {
  const media_config = { 
    id: Id(), 
    type: MediaType.video,
    duration: 3,
    url: '/media/',
  }
  const media = new VideoMedia(media_config)
      
  test("constructor", () => {
    expect(media.type).toEqual(MediaType.video)
    expect(media.id).toEqual(media_config.id)
  })

  test("duration", () => {
    expect(media.duration).toEqual(media_config.duration)
  })

  test("fps", () => { expect(media.fps).toEqual(10) })

  test("framesMax", () => { expect(media.framesMax).toEqual(30) })
  test("begin", () => { expect(media.begin).toEqual(1) })
  test("increment", () => { expect(media.increment).toEqual(1) })
  test("pattern", () => { expect(media.pattern).toEqual('%.jpg') })
  test("zeropadding", () => { expect(media.zeropadding).toEqual(2) })
  test("url", () => { expect(media.url).toEqual(media_config.url) })
  test("limitedTimeRange", () => {
    const range = TimeRangeFactory.createFromSeconds(0, 4)
    const expected = TimeRangeFactory.create({ frame: 0, fps: 10, frames: 30 })
    expect(media.limitedTimeRange(range)).toEqual(expected)
  })
  test("urlsVisibleInTimeRange", () => { 
    const range = TimeRangeFactory.create({ frame: 0, fps: 10, frames: 1 })
    const url = media.urlsVisibleInTimeRangeForClipByType(range).image[0]
    expect(url).toEqual(`${media_config.url}01.jpg`) 
  })
})
