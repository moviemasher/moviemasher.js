import { VisibleContextElement } from "../../../src/declarations"
import { Cache } from "../../../src/Loading/Cache"

export const expectCanvas = (element?: VisibleContextElement): void => {
  const canvas = element || Cache.visibleContext.canvas
  const dataUrl = canvas.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
