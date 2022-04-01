import React from 'react'
import { Editor } from '@moviemasher/moviemasher.js'
import { EditorInputs } from '../Components/Editor/EditorInputs/EditorInputs'

interface EditorContextInterface {
  editor?: Editor
  inputs?: EditorInputs
}

const EditorContextDefault: EditorContextInterface = {}

const EditorContext = React.createContext(EditorContextDefault)

export { EditorContext, EditorContextInterface, EditorContextDefault }
