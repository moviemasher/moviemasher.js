import { ContextElement } from "../declarations";

export const expectCanvas = (canvas: ContextElement): void => {
  const dataUrl = canvas.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
