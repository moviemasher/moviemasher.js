import React from 'react'
import { DefinitionType, EventType, SelectedProperties, TrackType } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import {
  InspectorContext, InspectorContextDefault, InspectorContextInterface
} from '../../Contexts/InspectorContext'
import { useEditor } from '../../Hooks/useEditor'

export interface InspectorProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Masher
 * @children InspectorContent
 */
export function Inspector(props: InspectorProps): ReactResult {
  const editor = useEditor()

  useListeners({
    [EventType.Action]: () => {
      setActionCount(value => value + 1)
    },
    [EventType.Selection]: () => {
      const { selection } = editor
      const { clip, effect, track } = selection
      setClip(clip)
      setEffect(effect)
      setDefinitionType(clip ? clip.type : '')
      setTrackType(track ? track.trackType : '')
      setSelectedProperties(editor.selectedProperties())
    },
  })

  const [definitionType, setDefinitionType] = React.useState<DefinitionType | ''>('')
  const [trackType, setTrackType] = React.useState<TrackType|''>('')
  const [actionCount, setActionCount] = React.useState(() => 0)
  const [clip, setClip] = React.useState(() => editor.selection.clip)
  const [effect, setEffect] = React.useState(() => editor.selection.effect)
  const [selectedProperties, setSelectedProperties] = React.useState<SelectedProperties>(() => editor.selectedProperties())

  const inspectorContext: InspectorContextInterface = {
    ...InspectorContextDefault,
    actionCount, clip, effect, definitionType, trackType, selectedProperties
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}
