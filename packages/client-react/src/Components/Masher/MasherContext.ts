import React from 'react'
import { 
  BooleanSetter,
  Editor, EditorIndex, EmptyMethod, Media, ScalarRecord
} from '@moviemasher/moviemasher.js'

import { Client, Draggable } from '@moviemasher/client-core'
import { ThemeIcons } from '../../declarations'

export interface MasherContextInterface {
  client?: Client
  streaming: boolean
  setStreaming: BooleanSetter
  current: ScalarRecord
  changeDefinition: (definition?: Media) => void
  drop: (draggable: Draggable, editorIndex?: EditorIndex) => Promise<Media[]>
  editor?: Editor
  editorIndex: EditorIndex
  icons: ThemeIcons
}

export const MasherContextDefault: MasherContextInterface = {
  streaming: false,
  setStreaming: EmptyMethod,
  current: {},
  changeDefinition: EmptyMethod,
  drop: () => Promise.resolve([]),
  editorIndex: {},
  icons: {},
}

export const MasherContext = React.createContext(MasherContextDefault)
