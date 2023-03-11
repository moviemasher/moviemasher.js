import React from "react"
import { 
  assertSelectorType, assertTime, ClassButton, ClassSelected, 
  DataGroup, selectedPropertyObject, PropertyTweenSuffix,
  assertTimeRange, tweenInputTime
} from "@moviemasher/moviemasher.js"


import { InspectorContext } from "../../InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useMasher } from "../../../../Hooks/useMasher"
import MasherContext from "../../../Masher/MasherContext"

export function ColorGroupInput(props: DataGroupProps) {  
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  
  const editor = useMasher()

  const { selectType, selectedItems: propsItems, ...rest } = props
  assertSelectorType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const selectedItems = propsItems || inspectorContext.selectedItems
  
  const { changeTweening, selectedInfo } = inspectorContext

  const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo
  assertTimeRange(timeRange)
  assertTime(time)
  
  const endDefined = tweenDefined[DataGroup.Color]
  const endSelected = tweenSelected[DataGroup.Color]

  const byName = selectedPropertyObject(selectedItems, DataGroup.Color, selectType)
  const { color, [`color${PropertyTweenSuffix}`]: colorEnd } = byName 
  const colorProperty = endSelected ? colorEnd : color


  const { property, changeHandler, value, name: nameOveride } = colorProperty
  const { type, name: propertyName } = property
  const name = nameOveride || propertyName
  const input = DataTypeInputs[type] 
  const inputContext: InputContextInterface = { 
    property, value, name, changeHandler
  }

  // go to first/last frame if needed and tween value defined...
  inputContext.time = tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected)

  // if we're editing tween value, but it's not defined yet...
  if (endSelected) {
    // tell input to use start value as default, rather than the property's...
    inputContext.defaultValue = color.value
  }

  const selectedButton = [ClassSelected, ClassButton].join(' ')

  const startProps = {
    children: icons.start,
    className: endSelected ? ClassButton : selectedButton,
 
    onClick: () => {
      editor.goToTime(timeRange.startTime)
      changeTweening(DataGroup.Color, false)
    }
  }

  const endProps = {
    className: endSelected ? selectedButton : ClassButton,
    children: endDefined ? icons.end : icons.endUndefined,
    onClick: () => {      
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroup.Color, true)
    }
  }
  
  const providerProps = { key: 'context', value: inputContext, children: input }

  const viewProps = {
    ...rest,
    key: `inspector-${selectType}-${name}`,
    children: [
      icons.color, 
      <InputContext.Provider { ...providerProps } />, 
      <View className="start-end" key='start-end'>
        <View key='start' { ...startProps } />
        <View key='end' { ...endProps } />
      </View>
    ]
  }
  return <View { ...viewProps } />
}

DataGroupInputs[DataGroup.Color] = <ColorGroupInput className="color tween row" key="color-group-input" />
