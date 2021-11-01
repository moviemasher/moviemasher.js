import React, { useContext } from 'react'
import { DefinitionType, EventType } from '@moviemasher/moviemasher.js'
import { Panel } from '../../declarations'

import { View } from '../../Utilities/View'
import { InspectorContext, InspectorContextInterface } from './InspectorContext'
import { EditorContext } from '../Editor/EditorContext'

const InspectorPanel: Panel = props => {

  const editorContext = useContext(EditorContext)
  const [definitionType, setDefinitionType] = React.useState(DefinitionType.Mash)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)

  const { masher, previewReference } = editorContext
  if (!masher) throw 'No Masher'

  const handleSelection = () => { setDefinitionType(masher.selected.type) }

  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {
      canvas.removeEventListener(EventType.Selection, handleSelection)
    }
    if (value) {
      value.addEventListener(EventType.Selection, handleSelection)
      setCanvas(value)
    }
  }

  React.useEffect(() => {
    const { current: currentPreview } = previewReference || {}
    if (currentPreview) listenCanvas(currentPreview)
    return () => { listenCanvas() }
  }, [])

  const inspectorContext: InspectorContextInterface = {
    definitionType
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}

export { InspectorPanel }
