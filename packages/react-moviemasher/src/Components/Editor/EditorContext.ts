import React from 'react'
import { Masher, Factory } from '@moviemasher/moviemasher.js'

interface EditorContextInterface { masher : Masher }

const EditorContextDefault: EditorContextInterface = {
  masher: Factory.masher.instance({fps: 24})
}

const EditorContext = React.createContext(EditorContextDefault)

export { EditorContext, EditorContextInterface, EditorContextDefault }
