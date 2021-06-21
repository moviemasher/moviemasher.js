import { VisibleContext } from "../src/Playing"

export const expectContext = (context : VisibleContext) => {
  const { dataUrl } = context
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
