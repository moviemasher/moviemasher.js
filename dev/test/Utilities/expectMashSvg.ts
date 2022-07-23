import { assertMash, Mash } from "../../../packages/moviemasher.js/src/Edited/Mash/Mash"
import { Editor } from "../../../packages/moviemasher.js/src/Editor/Editor"
import { Time } from "../../../packages/moviemasher.js/src/Helpers/Time/Time"


export const expectCanvasAtTime = async (editor: Editor, time?: Time): Promise<void> => {

  const mash = editor.edited//: Mash
  assertMash(mash)
  const seekTime = time || mash.time
  mash.imageSize = { width: 640, height: 480 }
  const promise = mash.seekToTime(seekTime)
  if (promise) await promise
  expect(mash.svg({ editor, time: seekTime }).element.outerHTML).toMatchSnapshot(mash.label)
}
