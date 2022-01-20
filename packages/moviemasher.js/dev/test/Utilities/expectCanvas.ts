import { VisibleContextElement } from "../../../src/declarations"

export const expectCanvas = (element: VisibleContextElement): void => {
  const dataUrl = element.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
