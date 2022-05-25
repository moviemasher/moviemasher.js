import { VisibleContextElement } from "../../../packages/moviemasher.js/src/declarations"
import { Mash } from "../../../packages/moviemasher.js/src/Edited/Mash/Mash"
import { Time } from "@moviemasher/moviemasher.js/src/Helpers/Time/Time"

export const expectCanvas = (element: VisibleContextElement): void => {
  const dataUrl = element.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}

export const expectCanvasAtTime = async (mash: Mash, time?: Time): Promise<void> => {
  const seekTime = time || mash.time
  mash.imageSize = { width: 640, height: 480 }
  const promise = mash.seekToTime(seekTime)
  if (promise) await promise
  mash.draw()
  expectCanvas(mash.visibleContext.canvas)
}
