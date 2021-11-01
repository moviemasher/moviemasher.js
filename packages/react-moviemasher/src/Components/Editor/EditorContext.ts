import { MutableRefObject, createContext } from 'react'
import { Masher, NumberSetter } from '@moviemasher/moviemasher.js'

interface EditorContextInterface {
  actionNonce: number
  audioTracks: number
  frame: number
  frames: number
  masher? : Masher
  previewReference?: MutableRefObject<HTMLCanvasElement | undefined>
  quantize: number
  selectedClipIdentifier: string
  selectedEffectIdentifier: string
  setFrame: NumberSetter
  videoTracks: number
}
const EditorContextDefault: EditorContextInterface = {
  actionNonce: 0,
  audioTracks: 0,
  frame: 0,
  frames: 0,
  quantize: 0,
  selectedClipIdentifier: '',
  selectedEffectIdentifier: '',
  setFrame: () => {},
  videoTracks: 0,
}

const EditorContext = createContext(EditorContextDefault)

export { EditorContext, EditorContextInterface, EditorContextDefault }
