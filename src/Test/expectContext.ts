import { VisibleContext } from "../Playing/VisibleContext"

export const expectContext = (context : VisibleContext) : void => {
  const { dataUrl } = context
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}
