import React from 'react'
import { arraySet, assertPopulatedString, assertSelectType, DefinitionType, EventType, SelectedProperties, SelectType, TrackType } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import {
  InspectorContext, InspectorContextDefault, InspectorContextInterface
} from '../../Contexts/InspectorContext'
import { useEditor } from '../../Hooks/useEditor'

export interface InspectorProps extends PropsAndChildren, WithClassName {

}

/**
 * @parents Masher
 * @children InspectorContent
 */
export function Inspector(props: InspectorProps): ReactResult {
  const editor = useEditor()
  const [definitionType, setDefinitionType] = React.useState<DefinitionType | ''>('')
  const [actionCount, setActionCount] = React.useState(() => 0)
  const [clip, setClip] = React.useState(() => editor.selection.clip)
  const [effect, setEffect] = React.useState(() => editor.selection.effect)
  const [selectTypes, setSelectTypes] = React.useState<SelectType[]>(() => editor.selectTypes)
  const [selectedProperties, setSelectedProperties] = React.useState<SelectedProperties>(() => editor.selectedProperties())
  const [selectedTypes, setSelectedTypes] = React.useState<SelectType[]>(() => [])
  const handleSection = React.useCallback(() => {
      const { selection, selectTypes } = editor
      const { clip, effect } = selection
      setClip(clip)
      setEffect(effect)
      setDefinitionType(clip ? clip.type : '')
      setSelectTypes(orginal => arraySet(orginal, selectTypes))
      const intersects = selectTypes.some(type => selectedTypes.includes(type))
      const types = intersects ? selectedTypes : selectTypes.slice(0, 1)
      if (!intersects) {
        // console.log("Inspector EventType.Selection", types, "because", selectedTypes, "doesn't include one of", selectTypes)
        setSelectedTypes(orginal => arraySet(orginal, types))
      }
      setSelectedProperties(editor.selectedProperties(types))
    }, [selectedTypes, selectTypes])
  useListeners({
    [EventType.Action]: () => {
      setActionCount(value => value + 1)
    },
    [EventType.Selection]: handleSection,
  })

  const changeType = React.useCallback((type: string) => {
    assertPopulatedString(type)
    
    const types = type.split(',')
    types.every(type => assertSelectType(type))
    const selectTypes = types as SelectType[]
    setSelectedTypes(orginal => arraySet(orginal, selectTypes))
    setSelectedProperties(editor.selectedProperties(selectTypes))
  }, [])

  const inspectorContext: InspectorContextInterface = {
    ...InspectorContextDefault,
    actionCount, clip, effect, definitionType, selectedProperties,
    selectedTypes, selectTypes, changeType,
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}
