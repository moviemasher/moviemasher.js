import React from 'react'
import { Masher, MasherFactory } from '@moviemasher/moviemasher.js'

interface EditorContextInterface { masher : Masher }

const EditorContextDefault: EditorContextInterface = {
  masher: MasherFactory.instance({ fps: 24 })
}

const EditorContext = React.createContext(EditorContextDefault)

export { EditorContext, EditorContextInterface, EditorContextDefault }
