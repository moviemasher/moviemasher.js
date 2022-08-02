import React from 'react'
import { arraySet, assertPopulatedString, SelectTypesObject, assertSelectType, DefinitionType, EventType, SelectedItems, SelectType, TrackType } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import {
  InspectorContext, InspectorContextDefault, InspectorContextInterface
} from '../../Contexts/InspectorContext'
import { useEditor } from '../../Hooks/useEditor'
import { sessionGet, sessionSet } from '../../Utilities/Session'
import { TweenInputKey } from '../../Setup/Constants'

export interface InspectorProps extends PropsAndChildren, WithClassName {}


/**
 * @parents Masher
 * @children InspectorContent
 */
export function Inspector(props: InspectorProps): ReactResult {
  const editor = useEditor()
  const [definitionType, setDefinitionType] = React.useState<DefinitionType | ''>('')
  const [actionCount, setActionCount] = React.useState(() => 0)
  const [clip, setClip] = React.useState(() => editor.selection.clip)
  const [selectTypesObject] = React.useState<SelectTypesObject>({})
  const [selected, setSelected] = React.useState('')

  const [tweening, setTweening] = React.useState(!!sessionGet(TweenInputKey))
  const [selectTypes, setSelectTypes] = React.useState<SelectType[]>(() => editor.selectTypes)
  const [selectedItems, setSelectedItems] = React.useState<SelectedItems>(() => editor.selectedItems())
  const [selectedTypes, setSelectedTypes] = React.useState<SelectType[]>(() => [])
  const handleSection = React.useCallback(() => {
      const { selection, selectTypes } = editor
      const { clip } = selection
      setClip(clip)
      setDefinitionType(clip ? clip.type : '')
      setSelectTypes(orginal => arraySet(orginal, selectTypes))
      const intersects = selectTypes.some(type => selectedTypes.includes(type))
      const types = intersects ? selectedTypes : selectTypes.slice(0, 1)
      if (!intersects) {
        // console.log("Inspector EventType.Selection", types, "because", selectedTypes, "doesn't include one of", selectTypes)
        setSelectedTypes(orginal => arraySet(orginal, types))
      }
      setSelectedItems(editor.selectedItems(types))
    }, [selectedTypes, selectTypes])
  useListeners({
    [EventType.Action]: () => {
      setActionCount(value => value + 1)
    },
    [EventType.Selection]: handleSection,
  })

  const changeType = React.useCallback((key: string) => {
    assertPopulatedString(key)
    const selectTypes = selectTypesObject[key]
    setSelected(key)
    setSelectedTypes(orginal => arraySet(orginal, selectTypes))
    setSelectedItems(editor.selectedItems(selectTypes))
  }, [])

  const changeTweening = (tweening: boolean): void => {

    // editor.goToTime(timeEnd)
    setTweening(tweening)
    sessionSet(TweenInputKey, tweening ? '1' : '')
  }
  const inspectorContext: InspectorContextInterface = {
    ...InspectorContextDefault,
    actionCount, clip, definitionType, selectedItems, selected,
    selectTypesObject,
    selectedTypes, selectTypes, changeSelected: changeType, 
    changeTweening, tweening,
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}
