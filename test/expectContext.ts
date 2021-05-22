/* eslint-disable dot-notation */
export const expectContext = context => {
  const { canvas } = context
  const dataUrl = canvas.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image)['toMatchImageSnapshot']()
};
