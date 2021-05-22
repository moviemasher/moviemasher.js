import { expectContext } from "../../test/expectContext"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeFactory } from "../Factory/TimeFactory"
import { ClipType, MediaType } from "../Setup"
import { TransitionClip } from "./TransitionClip"

describe("TransitionClip", () => {
  const mediaConfiguration = { id: 'id', type: MediaType.transition }
  const media = MediaFactory.createFromObject(mediaConfiguration)
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
    const time = TimeFactory.createFromFrame(0)

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
