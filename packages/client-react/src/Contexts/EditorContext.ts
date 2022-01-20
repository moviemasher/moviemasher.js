import React from 'react'
import { Editor } from '@moviemasher/moviemasher.js'
import { EditorInputs } from '../declarations'

interface EditorContextInterface {
  editor?: Editor
  inputs?: EditorInputs
}

const EditorContextDefault: EditorContextInterface = {}

const EditorContext = React.createContext(EditorContextDefault)

export { EditorContext, EditorContextInterface, EditorContextDefault }
