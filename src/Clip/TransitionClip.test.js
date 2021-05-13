import { Id } from "../Utilities/Id"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeFactory } from "../Factory/TimeFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { ClipType, MediaType } from "../Types"
import { TransitionClip } from "./TransitionClip"

const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })
const expectContext = context => {
  const { canvas } = context
  const dataUrl = canvas.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
describe("TransitionClip", () => {
  const media_configuration = { 
    id: Id(), type: MediaType.transition, 
  }
  const media = MediaFactory.create(media_configuration)
  const clip = new TransitionClip({ media })

  test("constructor", () => {
    expect(clip).toBeInstanceOf(TransitionClip)
    expect(clip.type).toEqual(ClipType.transition)
  })

  describe("copy", () => {
    test("returns expected clip", () => {
      const expected = {}
      expect(clip.copy).not.toEqual(expected)
    })
  })
  
  describe("contextAtTimeForDimensions", () => {
    const dimensions = { width: 640, height: 480 }
    const color = "teal"
    const time = TimeFactory.create()
      
    test("returns empty context with no additional parameters", () => {
      const context = clip.contextAtTimeForDimensions(time, dimensions)
      expectContext(context)
    })

    test("returns context filled with supplied color", () => {
      const context = clip.contextAtTimeForDimensions(time, dimensions, color)
      expectContext(context)
    })
    
  })
})
  