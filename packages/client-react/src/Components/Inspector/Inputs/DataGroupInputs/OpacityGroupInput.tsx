import React from "react"
import { 
  assertSelectType, assertTime, ClassButton, ClassSelected, DataGroup, 
  selectedPropertyObject, PropertyTweenSuffix, assertTimeRange,
  tweenInputTime
} from "@moviemasher/moviemasher.js"
import { DefaultIcons } from "@moviemasher/icons-default"

import { PropsAndChild, ReactResult } from "../../../../declarations"
import { InspectorContext } from "../../../Inspector/InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useEditor } from "../../../../Hooks/useEditor"


export function OpacityGroupInput(props: DataGroupProps): ReactResult {
  const editor = useEditor()
  const { selectType, ...rest } = props
  assertSelectType(selectType)
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties, changeTweening, selectedInfo } = inspectorContext
  const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo
  assertTimeRange(timeRange)
  assertTime(time)
  
  const endDefined = tweenDefined[DataGroup.Opacity]
  const endSelected = tweenSelected[DataGroup.Opacity]

  const byName = selectedPropertyObject(properties, DataGroup.Opacity, selectType)
  const { opacity, [`opacity${PropertyTweenSuffix}`]: opacityEnd } = byName 
  const opacityProperty = endSelected ? opacityEnd : opacity

  const { property, changeHandler, value, name: nameOveride } = opacityProperty

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
    inputContext.defaultValue = opacity.value
  }

  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const startProps: PropsAndChild = {
    children: DefaultIcons.start,
    className: endSelected ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      editor.goToTime(timeRange.startTime)
      changeTweening(DataGroup.Opacity, false)
    }
  }

  const endProps: PropsAndChild = {
    key: 'end',
    className: endSelected ? selectedButton : ClassButton,
    children: endDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroup.Opacity, true)
    }
  }

  const providerProps = { key: 'context', value: inputContext, children: input }

  const viewProps = {
    ...rest,
    key: `inspector-${selectType}-${name}`, 
    children: [
      DefaultIcons.opacity, 
      <InputContext.Provider { ...providerProps } />, 
      <View className="start-end" key='start-end'>
        <View { ...startProps } />
        <View { ...endProps } />
      </View>
    ]
  }
  return <View { ...viewProps } />
}

DataGroupInputs[DataGroup.Opacity] = <OpacityGroupInput className="opacity tween row" key="opacity-group-input" />
