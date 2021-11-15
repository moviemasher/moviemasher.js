import { VisibleContextElement } from "../declarations";
import { Cache } from "../Loading/Cache";

export const expectCanvas = (element?: VisibleContextElement): void => {
  const canvas = element || Cache.visibleContext.canvas
  const dataUrl = canvas.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
