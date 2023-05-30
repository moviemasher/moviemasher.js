import React from 'react'
import { 
  arraySet, assertSelectorType, SelectedItems, SelectorType, 
  assertPositive, assertTrue, timeFromArgs, timeEqualizeRates, assertDataGroup,
  isSelectedProperty, isDefined, PropertyTweenSuffix, DataGroup, 
  SelectedProperties, 
  EventTypeAction,
  EventTypeSelection,
  TypeNone,
  TypesSelector
} from '@moviemasher/lib-core'


import { PropsWithChildren } from "../../Types/Props"
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import {
  DataGroupBooleans,
  InspectorContext, InspectorContextDefault, InspectorContextInterface, 
  SelectedInfo
} from './InspectorContext'
import { useMasher } from '../../Hooks/useMasher'

export interface InspectorProps extends PropsWithChildren {}

/**
 * @parents MasherApp
 * @children InspectorContent
 */
export function Inspector(props: InspectorProps) {
  const editor = useMasher()
  const [actionCount, setActionCount] = React.useState(() => 0)
  const info = React.useRef<SelectedInfo>({ 
    tweenDefined: {}, tweenSelected: {}, 
    selectedType: TypeNone, selectTypes: []
  })
  const [orderedTypes, setOrderedTypes] = React.useState<SelectorType[]>(() => TypesSelector)
  const [selectedItems, setSelectedItems] = React.useState<SelectedItems>(() => [])
  const handleAction = () => { setActionCount(value => value + 1) }
  const handleSelection = React.useCallback(() => {
    const { selection } = editor
    const { selectTypes: types, clip, mash } = selection
    const { current } = info
    const { selectedType, selectTypes } = current
    const bestType = orderedTypes.find(type => types.includes(type))
    assertSelectorType(bestType)

    if (bestType !== selectedType) {
      // console.log("setInfo selectedType", selectedType, "=>", bestType, types)
      current.selectedType = bestType
    }
    arraySet(selectTypes, types)
    
    const items = editor.selection.selectedItems([bestType])
    const tweening: DataGroupBooleans = {}
    if (clip && mash) {
      const tweenItems = items.filter(item => {
        if (!isSelectedProperty(item)) return false

        const { property, name } = item
        const { tweenable, group } = property
        if (!(tweenable && group && name)) return false

        return name.endsWith(PropertyTweenSuffix)
      }) as SelectedProperties
      // console.log("Inspector handleSelection", tweenItems.length, "tweenItem(s)")
      tweenItems.forEach(item => {
        const { property, value } = item
        const { group } = property
        assertDataGroup(group)
        tweening[group] = isDefined(value) 
      })  

      if (tweenItems.length) {
        const { time, quantize } = mash
        const timeRange = clip.timeRange
        current.time = time
        current.timeRange = timeRange
        // console.log("Inspector tweening", time, timeRange)
        const frame = timeRange.frame + Math.round(timeRange.frames / 2)
        const halfTime = timeFromArgs(frame, quantize)
        const [midTime, timeScaled] = timeEqualizeRates(halfTime, time)
        
        current.nearStart = midTime.frame > timeScaled.frame
        const edge = current.nearStart ? timeRange.startTime : timeRange.lastTime

        current.onEdge = time.equalsTime(edge)
      }
    }
    
    current.tweenDefined = tweening

    setSelectedItems(items)
    handleAction()
  }, [editor, orderedTypes])
  
  useListeners({
    [EventTypeAction]: handleAction,
    [EventTypeSelection]: handleSelection,
  })

  const changeSelected = React.useCallback((type: string) => {
    assertSelectorType(type)
    setOrderedTypes(original => {
      const index = original.indexOf(type) 
      assertPositive(index) 
      const types = [type]
      if (index) types.push(...original.slice(0, index))
      if (index < original.length - 1) types.push(...original.slice(index + 1))
      assertTrue(types.length === original.length, 'type lengths match')
      // console.log("setOrderedTypes", original, "=>", types)
      arraySet(original, types)
      handleSelection()
      return original
    })
    info.current.selectedType = type
    
    setSelectedItems(editor.selection.selectedItems([type]))
  }, [editor.selection, handleSelection])

  const changeTweening = (group: DataGroup, tweening: boolean): void => {
    info.current.tweenSelected[group] = tweening
    handleSelection()
  }
  const inspectorContext: InspectorContextInterface = {
    ...InspectorContextDefault,
    actionCount, selectedItems,
    changeSelected, 
    changeTweening, selectedInfo: info.current,
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}
